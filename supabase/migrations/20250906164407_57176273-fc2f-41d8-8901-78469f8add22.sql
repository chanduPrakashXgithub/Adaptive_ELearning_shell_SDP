-- Create user_activity_tracking table for dynamic tracking
CREATE TABLE IF NOT EXISTS public.user_activity_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('theory_view', 'quiz_attempt', 'test_attempt', 'login', 'module_complete')),
  module_id UUID,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own activity" 
ON public.user_activity_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity" 
ON public.user_activity_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" 
ON public.user_activity_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_activity_user_id ON public.user_activity_tracking(user_id);
CREATE INDEX idx_user_activity_created_at ON public.user_activity_tracking(created_at);
CREATE INDEX idx_user_activity_type ON public.user_activity_tracking(activity_type);

-- Create function to calculate learning streak
CREATE OR REPLACE FUNCTION public.calculate_learning_streak(user_uuid UUID)
RETURNS TABLE(current_streak INTEGER, best_streak INTEGER, total_days INTEGER) AS $$
DECLARE
    streak_days INTEGER[];
    current_count INTEGER := 0;
    best_count INTEGER := 0;
    temp_count INTEGER := 0;
    day_record DATE;
BEGIN
    -- Get all unique dates when user had activity
    SELECT ARRAY_AGG(DISTINCT DATE(created_at) ORDER BY DATE(created_at))
    INTO streak_days
    FROM public.user_activity_tracking 
    WHERE user_id = user_uuid 
    AND created_at >= CURRENT_DATE - INTERVAL '365 days';
    
    IF streak_days IS NULL THEN
        RETURN QUERY SELECT 0, 0, 0;
        RETURN;
    END IF;
    
    -- Calculate current streak (from today backwards)
    FOR i IN REVERSE ARRAY_LENGTH(streak_days, 1)..1 LOOP
        IF streak_days[i] = CURRENT_DATE - (current_count || ' days')::INTERVAL::DATE THEN
            current_count := current_count + 1;
        ELSE
            EXIT;
        END IF;
    END LOOP;
    
    -- Calculate best streak
    temp_count := 1;
    FOR i IN 2..ARRAY_LENGTH(streak_days, 1) LOOP
        IF streak_days[i] = streak_days[i-1] + 1 THEN
            temp_count := temp_count + 1;
            best_count := GREATEST(best_count, temp_count);
        ELSE
            temp_count := 1;
        END IF;
    END LOOP;
    
    best_count := GREATEST(best_count, temp_count, current_count);
    
    RETURN QUERY SELECT 
        current_count,
        best_count,
        ARRAY_LENGTH(streak_days, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update module progress automatically
CREATE OR REPLACE FUNCTION public.update_module_progress_from_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user_module_progress when activities are logged
    INSERT INTO public.user_module_progress (
        user_id, 
        module_id, 
        time_spent_seconds,
        last_activity_at,
        theory_completed,
        quizzes_attempted,
        tests_attempted,
        percent_complete
    )
    VALUES (
        NEW.user_id,
        NEW.module_id,
        NEW.time_spent_seconds,
        NEW.created_at,
        CASE WHEN NEW.activity_type = 'theory_view' THEN true ELSE false END,
        CASE WHEN NEW.activity_type = 'quiz_attempt' THEN 1 ELSE 0 END,
        CASE WHEN NEW.activity_type = 'test_attempt' THEN 1 ELSE 0 END,
        CASE 
            WHEN NEW.activity_type = 'module_complete' THEN 100
            WHEN NEW.activity_type = 'theory_view' THEN 30
            WHEN NEW.activity_type = 'quiz_attempt' THEN 60
            WHEN NEW.activity_type = 'test_attempt' THEN 90
            ELSE 10
        END
    )
    ON CONFLICT (user_id, module_id) 
    DO UPDATE SET
        time_spent_seconds = user_module_progress.time_spent_seconds + NEW.time_spent_seconds,
        last_activity_at = NEW.created_at,
        theory_completed = CASE 
            WHEN NEW.activity_type = 'theory_view' THEN true 
            ELSE user_module_progress.theory_completed 
        END,
        quizzes_attempted = CASE 
            WHEN NEW.activity_type = 'quiz_attempt' THEN user_module_progress.quizzes_attempted + 1
            ELSE user_module_progress.quizzes_attempted 
        END,
        tests_attempted = CASE 
            WHEN NEW.activity_type = 'test_attempt' THEN user_module_progress.tests_attempted + 1
            ELSE user_module_progress.tests_attempted 
        END,
        percent_complete = CASE 
            WHEN NEW.activity_type = 'module_complete' THEN 100
            ELSE LEAST(100, user_module_progress.percent_complete + 5)
        END,
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER update_module_progress_trigger
    AFTER INSERT ON public.user_activity_tracking
    FOR EACH ROW
    WHEN (NEW.module_id IS NOT NULL)
    EXECUTE FUNCTION public.update_module_progress_from_activity();