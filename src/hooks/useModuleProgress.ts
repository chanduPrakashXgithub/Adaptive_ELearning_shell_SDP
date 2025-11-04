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
  const [loading, setLoading] = useState(true);

  const computePercent = useCallback((p: {
    theory_completed: boolean;
    quizzes_attempted: number;
    tests_attempted: number;
  }) => {
    const theory = p.theory_completed ? 40 : 0;
    const quizzes = Math.min(p.quizzes_attempted, 1) * 30;
    const tests = Math.min(p.tests_attempted, 1) * 30;
    return Math.min(100, theory + quizzes + tests);
  }, []);

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

    const newPercent = computePercent({
      theory_completed: completed,
      quizzes_attempted: progress?.quizzes_attempted || 0,
      tests_attempted: progress?.tests_attempted || 0,
    });

    const { data } = await supabase
      .from("user_module_progress")
      .update({
        theory_completed: completed,
        percent_complete: newPercent,
        last_activity_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("module_id", module.id)
      .select()
      .single();

    if (data) setProgress(data as any);
  }, [module, progress, computePercent]);

  const increment = useCallback(async (field: "quizzes_attempted" | "tests_attempted") => {
    if (!module) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const current = (progress?.[field] || 0) + 1;
    const newPercent = computePercent({
      theory_completed: progress?.theory_completed || false,
      quizzes_attempted: field === "quizzes_attempted" ? current : (progress?.quizzes_attempted || 0),
      tests_attempted: field === "tests_attempted" ? current : (progress?.tests_attempted || 0),
    });

    const { data } = await supabase
      .from("user_module_progress")
      .update({
        [field]: current,
        percent_complete: newPercent,
        last_activity_at: new Date().toISOString(),
      } as any)
      .eq("user_id", user.id)
      .eq("module_id", module.id)
      .select()
      .single();

    if (data) setProgress(data as any);
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
