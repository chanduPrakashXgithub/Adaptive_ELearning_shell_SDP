import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardModule {
  id: string;
  slug: string;
  title: string;
  description?: string;
  progress: number;
  timeSpent: string;
  status: string;
  quizCount: number;
  testCount: number;
  theoryCompleted: boolean;
  quizzesAttempted: number;
  testsAttempted: number;
}

export interface DashboardStats {
  coursesEnrolled: number;
  hoursLearned: number;
  certificates: number;
  averageScore: number;
}

export function useDashboardData() {
  const [modules, setModules] = useState<DashboardModule[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    coursesEnrolled: 0,
    hoursLearned: 0,
    certificates: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all modules with optional progress data (left join)
      const { data: moduleData } = await supabase
        .from('modules')
        .select(`
          id,
          slug,
          title,
          description,
          user_module_progress(
            theory_completed,
            quizzes_attempted,
            tests_attempted,
            time_spent_seconds,
            percent_complete
          )
        `)
        .eq('user_module_progress.user_id', user.id);

      // Fetch quiz and test counts
      const { data: quizCounts } = await supabase
        .from('quizzes')
        .select('module_id')
        .eq('published', true);

      const { data: testCounts } = await supabase
        .from('tests')
        .select('module_id')
        .eq('published', true);

      // Fetch user's quiz and test attempts for score calculation
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('score, quiz_id, quizzes!inner(module_id)')
        .eq('user_id', user.id)
        .not('score', 'is', null);

      const { data: testAttempts } = await supabase
        .from('test_attempts')
        .select('score, test_id, tests!inner(module_id)')
        .eq('user_id', user.id)
        .not('score', 'is', null);

      // Process modules data
      const processedModules: DashboardModule[] = (moduleData || []).map(module => {
        // Handle modules without progress (new modules)
        const progress = module.user_module_progress?.[0] || {
          theory_completed: false,
          quizzes_attempted: 0,
          tests_attempted: 0,
          time_spent_seconds: 0,
          percent_complete: 0
        };
        
        const quizCount = quizCounts?.filter(q => q.module_id === module.id).length || 0;
        const testCount = testCounts?.filter(t => t.module_id === module.id).length || 0;
        
        const hours = Math.floor(progress.time_spent_seconds / 3600);
        const minutes = Math.floor((progress.time_spent_seconds % 3600) / 60);
        const timeSpent = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

        let status = 'Not Started';
        if (progress.percent_complete >= 100) status = 'Completed';
        else if (progress.percent_complete > 0) status = 'In Progress';

        return {
          id: module.id,
          slug: module.slug,
          title: module.title,
          description: module.description,
          progress: Math.round(progress.percent_complete),
          timeSpent,
          status,
          quizCount,
          testCount,
          theoryCompleted: progress.theory_completed,
          quizzesAttempted: progress.quizzes_attempted,
          testsAttempted: progress.tests_attempted
        };
      });

      setModules(processedModules);

      // Calculate stats
      const totalHours = processedModules.reduce((sum, module) => {
        const timeStr = module.timeSpent;
        const hours = timeStr.includes('h') ? parseInt(timeStr.split('h')[0]) : 0;
        const minutes = timeStr.includes('m') ? parseInt(timeStr.split('m')[0].split(' ').pop() || '0') : 0;
        return sum + hours + (minutes / 60);
      }, 0);

      const allScores = [...(quizAttempts || []), ...(testAttempts || [])].map(a => a.score);
      const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
      const certificates = processedModules.filter(m => m.status === 'Completed').length;

      setStats({
        coursesEnrolled: processedModules.length,
        hoursLearned: Math.round(totalHours * 10) / 10,
        certificates,
        averageScore: Math.round(avgScore)
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { modules, stats, loading, refetchData: fetchDashboardData };
}