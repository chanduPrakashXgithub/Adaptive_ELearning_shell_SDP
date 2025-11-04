import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityData {
  day: string;
  hours: number;
  completed: number;
}

export interface LearningStreak {
  current: number;
  best: number;
  weeklyGoal: number;
  totalDays: number;
}

export function useActivityTracking() {
  const [weeklyActivity, setWeeklyActivity] = useState<ActivityData[]>([]);
  const [learningStreak, setLearningStreak] = useState<LearningStreak>({
    current: 0,
    best: 0,
    weeklyGoal: 10,
    totalDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch recent activity
      const { data: recentActivity } = await supabase
        .from('user_activity_tracking')
        .select('created_at, time_spent_seconds, activity_type')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Calculate daily activity from actual user data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const activityData = last7Days.map((date) => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dateStr = date.toDateString();
        
        const dayActivities = recentActivity?.filter(activity => 
          new Date(activity.created_at).toDateString() === dateStr
        ) || [];
        
        const totalSeconds = dayActivities.reduce((sum, activity) => sum + activity.time_spent_seconds, 0);
        const hours = totalSeconds / 3600;
        
        return {
          day: dayNames[date.getDay()],
          hours: Math.round(hours * 10) / 10,
          completed: dayActivities.length
        };
      });

      setWeeklyActivity(activityData);

      // Calculate learning streak using the database function
      const { data: streakData } = await supabase
        .rpc('calculate_learning_streak', { user_uuid: user.id });

      if (streakData && streakData.length > 0) {
        const streak = streakData[0];
        setLearningStreak({
          current: streak.current_streak || 0,
          best: streak.best_streak || 0,
          weeklyGoal: 10,
          totalDays: streak.total_days || 0
        });
      }

    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (
    activityType: 'theory_view' | 'quiz_attempt' | 'test_attempt' | 'login' | 'module_complete',
    moduleId?: string,
    timeSpentSeconds: number = 0,
    metadata: any = {}
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_activity_tracking')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          module_id: moduleId,
          time_spent_seconds: timeSpentSeconds,
          metadata
        });

      // Refresh activity data after logging
      fetchActivityData();
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return {
    weeklyActivity,
    learningStreak,
    loading,
    logActivity,
    refetchData: fetchActivityData
  };
}