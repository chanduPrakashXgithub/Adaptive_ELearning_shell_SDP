import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ModuleRecord {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
}

export interface ProgressRecord {
  user_id: string;
  module_id: string;
  theory_completed: boolean;
  quizzes_attempted: number;
  tests_attempted: number;
  time_spent_seconds: number;
  percent_complete: number;
}

export function useModuleProgress(slugOrId: string) {
  const [module, setModule] = useState<ModuleRecord | null>(null);
  const [progress, setProgress] = useState<ProgressRecord | null>(null);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [testCount, setTestCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Compute percent complete with more granular weights based on available quiz/test counts
  const computePercent = useCallback((p: {
    theory_completed: boolean;
    quizzes_attempted: number;
    tests_attempted: number;
  }) => {
    const totalAssessments = (quizCount || 0) + (testCount || 0);
    // If there are no quizzes/tests, theory represents full progress
    if (totalAssessments === 0) {
      return p.theory_completed ? 100 : 0;
    }

    // If user has completed theory and attempted all available quizzes/tests, ensure 100%
    const quizzesDone = (p.quizzes_attempted || 0) >= (quizCount || 0);
    const testsDone = (p.tests_attempted || 0) >= (testCount || 0);
    if (p.theory_completed && quizzesDone && testsDone) return 100;

    const theoryWeight = 40; // default weight for theory
    const remaining = 100 - theoryWeight;

    // Distribute remaining weight proportionally between quizzes and tests
    const quizzesWeight = Math.round(remaining * ((quizCount || 0) / totalAssessments));
    const testsWeight = remaining - quizzesWeight;

    const theoryScore = p.theory_completed ? theoryWeight : 0;
    const quizzesScore = quizCount > 0 ? Math.min(p.quizzes_attempted / quizCount, 1) * quizzesWeight : 0;
    const testsScore = testCount > 0 ? Math.min(p.tests_attempted / testCount, 1) * testsWeight : 0;

    // Round but cap at 100. If floating point sums cause 99 on full completion, the
    // early completion check above handles exact completion to return 100.
    return Math.min(100, Math.round(theoryScore + quizzesScore + testsScore));
  }, [quizCount, testCount]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Resolve module by slug or id
      let mod: ModuleRecord | null = null;
      if (slugOrId.includes("-")) {
        const { data } = await supabase
          .from("modules")
          .select("id, slug, title, description")
          .eq("slug", slugOrId)
          .single();
        mod = (data as any) || null;
      } else {
        const { data } = await supabase
          .from("modules")
          .select("id, slug, title, description")
          .eq("id", slugOrId)
          .single();
        mod = (data as any) || null;
      }

      if (!mod) {
        setLoading(false);
        return;
      }

      if (!isMounted) return;
      setModule(mod);

      // Fetch counts for quizzes/tests for this module to allow granular percent computation
      try {
        const { data: qData } = await supabase
          .from('quizzes')
          .select('id')
          .eq('module_id', mod.id)
          .eq('published', true);
        const { data: tData } = await supabase
          .from('tests')
          .select('id')
          .eq('module_id', mod.id)
          .eq('published', true);
        const qCount = qData ? qData.length : 0;
        const tCount = tData ? tData.length : 0;
        setQuizCount(qCount);
        setTestCount(tCount);
        // debug
        try { console.debug('[useModuleProgress] fetched counts', { moduleId: mod.id, qCount, tCount }); } catch (e) { }
      } catch (e) {
        // ignore count errors, defaults remain 0
      }

      // Upsert progress row
      const { data: upserted } = await supabase
        .from("user_module_progress")
        .upsert({
          user_id: user.id,
          module_id: mod.id,
        }, { onConflict: "user_id,module_id" })
        .select()
        .single();

      const p = upserted as any as ProgressRecord;
      if (p && isMounted) setProgress(p);
      setLoading(false);
    })();
    return () => { isMounted = false };
  }, [slugOrId]);

  const status = useMemo(() => {
    const percent = progress?.percent_complete || 0;
    if (percent >= 100) return "Completed";
    if (percent <= 0.1) return "Not Started";
    return "In Progress";
  }, [progress?.percent_complete]);

  const setTheoryCompleted = useCallback(async (completed: boolean) => {
    if (!module) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Optimistic update: apply locally first so UI reflects change immediately
    const prev = progress;
    const optimistic = {
      ...(progress || {} as ProgressRecord),
      theory_completed: completed,
      quizzes_attempted: progress?.quizzes_attempted || 0,
      tests_attempted: progress?.tests_attempted || 0,
      percent_complete: computePercent({
        theory_completed: completed,
        quizzes_attempted: progress?.quizzes_attempted || 0,
        tests_attempted: progress?.tests_attempted || 0,
      }),
    } as ProgressRecord;

    setProgress(optimistic);
    try { console.debug('[useModuleProgress] optimistic setTheoryCompleted', { moduleId: module.id, optimistic }); } catch (e) { }
    try {
      try {
        window.dispatchEvent(new CustomEvent('moduleProgressUpdated', { detail: { moduleId: module.id } }));
      } catch (e) { /* ignore in non-browser env */ }

      const { data } = await supabase
        .from("user_module_progress")
        .update({
          theory_completed: completed,
          percent_complete: optimistic.percent_complete,
          last_activity_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("module_id", module.id)
        .select()
        .single();

      if (data) {
        setProgress(data as any);
        try { console.debug('[useModuleProgress] setTheoryCompleted DB result', { moduleId: module.id, data }); } catch (e) { }
      }
    } catch (err) {
      // rollback optimistic update on failure
      if (prev) setProgress(prev);
    }
  }, [module, progress, computePercent]);

  const increment = useCallback(async (field: "quizzes_attempted" | "tests_attempted") => {
    if (!module) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const prev = progress;
    const current = (progress?.[field] || 0) + 1;
    const optimisticPercent = computePercent({
      theory_completed: progress?.theory_completed || false,
      quizzes_attempted: field === "quizzes_attempted" ? current : (progress?.quizzes_attempted || 0),
      tests_attempted: field === "tests_attempted" ? current : (progress?.tests_attempted || 0),
    });

    const optimistic = {
      ...(progress || {} as ProgressRecord),
      [field]: current,
      percent_complete: optimisticPercent,
    } as ProgressRecord;

    // apply optimistic update
    setProgress(optimistic);
    try { console.debug('[useModuleProgress] optimistic increment', { moduleId: module.id, field, optimistic }); } catch (e) { }
    try {
      try { window.dispatchEvent(new CustomEvent('moduleProgressUpdated', { detail: { moduleId: module.id } })); } catch (e) { /* ignore */ }

      const { data, error } = await supabase
        .from("user_module_progress")
        .update({
          [field]: current,
          percent_complete: optimisticPercent,
          last_activity_at: new Date().toISOString(),
        } as any)
        .eq("user_id", user.id)
        .eq("module_id", module.id)
        .select()
        .single();

      if (error) {
        try { console.error('[useModuleProgress] increment DB error', { error, moduleId: module.id, field }); } catch (e) { }
      }

      if (data) {
        setProgress(data as any);
        try { console.debug('[useModuleProgress] increment DB result', { moduleId: module.id, data }); } catch (e) { }
      }
    } catch (err) {
      // rollback on error
      try { console.error('[useModuleProgress] increment unexpected error', { err, moduleId: module.id, field }); } catch (e) { }
      if (prev) setProgress(prev);
    }
  }, [module, progress, computePercent]);

  const addTimeSpent = useCallback(async (seconds: number) => {
    if (!module || seconds <= 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newTime = (progress?.time_spent_seconds || 0) + seconds;
    const { data } = await supabase
      .from("user_module_progress")
      .update({
        time_spent_seconds: newTime,
        last_activity_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("module_id", module.id)
      .select()
      .single();

    if (data) setProgress(data as any);
    // Notify listeners (dashboard) to refresh aggregated data (time changed)
    try {
      window.dispatchEvent(new CustomEvent('moduleProgressUpdated', { detail: { moduleId: module.id } }));
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [module, progress]);

  return {
    module,
    progress,
    loading,
    status,
    setTheoryCompleted,
    incrementQuizzes: () => increment("quizzes_attempted"),
    incrementTests: () => increment("tests_attempted"),
    addTimeSpent,
  };
}
