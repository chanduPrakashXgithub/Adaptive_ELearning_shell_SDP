import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  Code,
  Users,
  TrendingUp,
  BookOpen,
  Play,
  Award,
  RotateCcw
} from 'lucide-react';
import type { InterviewPlan } from '@/components/Chatbot/engine';

interface InterviewPlanDisplayProps {
  plan: InterviewPlan;
  onReset: () => void;
}

interface TaskProgress {
  [key: string]: boolean;
}

const InterviewPlanDisplay: React.FC<InterviewPlanDisplayProps> = ({ plan, onReset }) => {
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({});
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem(`interview-plan-${plan.primaryCompany}-${plan.daysUntil}`);
    if (savedProgress) {
      setTaskProgress(JSON.parse(savedProgress));
    }
  }, [plan.primaryCompany, plan.daysUntil]);

  useEffect(() => {
    // Save progress to localStorage whenever it changes
    localStorage.setItem(`interview-plan-${plan.primaryCompany}-${plan.daysUntil}`, JSON.stringify(taskProgress));
  }, [taskProgress, plan.primaryCompany, plan.daysUntil]);

  const toggleTask = (taskId: string) => {
    setTaskProgress(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getTaskId = (weekNumber: number, taskIndex: number, type: 'task' | 'problem' = 'task') => {
    return `${type}-week-${weekNumber}-${taskIndex}`;
  };

  const calculateWeekProgress = (weekNumber: number) => {
    const week = plan.plan.find(w => w.week === weekNumber);
    if (!week) return 0;

    const totalItems = week.tasks.length + (week.problems || 0);
    if (totalItems === 0) return 0;

    let completedItems = 0;

    // Count completed tasks
    week.tasks.forEach((_, index) => {
      const taskId = getTaskId(weekNumber, index);
      if (taskProgress[taskId]) completedItems++;
    });

    // Count completed problems (simplified - assume daily problems as individual items)
    for (let i = 0; i < (week.problems || 0); i++) {
      const problemId = getTaskId(weekNumber, i, 'problem');
      if (taskProgress[problemId]) completedItems++;
    }

    return Math.round((completedItems / totalItems) * 100);
  };

  const calculateOverallProgress = () => {
    const totalWeeks = plan.plan.length;
    const totalProgress = plan.plan.reduce((sum, week) => sum + calculateWeekProgress(week.week), 0);
    return Math.round(totalProgress / totalWeeks);
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const targetDate = new Date(today.getTime() + plan.daysUntil * 24 * 60 * 60 * 1000);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const overallProgress = calculateOverallProgress();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="shadow-card bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              {plan.primaryCompany} Interview Plan
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{plan.role}</div>
              <div className="text-sm text-muted-foreground">Target Role</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{daysRemaining}</div>
              <div className="text-sm text-muted-foreground">Days Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{plan.weeks}</div>
              <div className="text-sm text-muted-foreground">Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>

          <Progress value={overallProgress} className="h-3" />

          {plan.companyProfile && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Technical Focus</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {plan.companyProfile.focus.map((area) => (
                    <Badge key={area} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Behavioral Focus</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {plan.companyProfile.behavioral.map((trait) => (
                    <Badge key={trait} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Plan Tabs */}
      <Card className="shadow-card">
        <Tabs value={`week-${currentWeek}`} onValueChange={(value) => setCurrentWeek(parseInt(value.split('-')[1]))}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
              {plan.plan.map((week) => (
                <TabsTrigger
                  key={week.week}
                  value={`week-${week.week}`}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">Week {week.week}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                      <span className="text-xs">{calculateWeekProgress(week.week)}%</span>
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>

          <CardContent>
            {plan.plan.map((week) => (
              <TabsContent key={week.week} value={`week-${week.week}`} className="space-y-6">
                {/* Week Overview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{week.title}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {calculateWeekProgress(week.week)}% Complete
                    </Badge>
                  </div>

                  <Progress value={calculateWeekProgress(week.week)} className="h-2" />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4" />
                        Key Concepts
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {week.concepts.map((concept) => (
                          <Badge key={concept} variant="secondary" className="text-xs">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4" />
                        Target Problems
                      </h4>
                      <div className="text-2xl font-bold text-primary">{week.problems}</div>
                      <div className="text-sm text-muted-foreground">Problems to solve</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">{week.notes}</p>
                  </div>
                </div>

                <Separator />

                {/* Daily Tasks */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Daily Activities
                  </h4>

                  <div className="space-y-3">
                    {week.tasks.map((task, index) => {
                      const taskId = getTaskId(week.week, index);
                      const isCompleted = taskProgress[taskId] || false;

                      return (
                        <div
                          key={index}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isCompleted
                              ? 'bg-primary/5 border-primary/20 text-muted-foreground'
                              : 'bg-background border-border hover:bg-muted/30'
                            }`}
                        >
                          <Checkbox
                            id={taskId}
                            checked={isCompleted}
                            onCheckedChange={() => toggleTask(taskId)}
                            className="mt-0.5"
                          />
                          <label
                            htmlFor={taskId}
                            className={`flex-1 text-sm cursor-pointer ${isCompleted ? 'line-through' : ''
                              }`}
                          >
                            {task}
                          </label>
                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Problem Tracking */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Problem Solving Progress
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {(((week as any).problemList as any[]) || Array.from({ length: week.problems }, (_, i) => null)).map((p, index) => {
                      const problemId = getTaskId(week.week, index, 'problem');
                      const isCompleted = taskProgress[problemId] || false;
                      const title = p?.title || `Problem ${index + 1}`;
                      const url = p?.url;
                      const platform = p?.platform;

                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${isCompleted
                              ? 'bg-primary/10 border-primary/20'
                              : 'bg-background border-border hover:bg-muted/30'
                            }`}
                          onClick={() => toggleTask(problemId)}
                        >
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => toggleTask(problemId)}
                          />
                          <div className="flex-1 text-sm">
                            {url ? (
                              <a href={url} target="_blank" rel="noreferrer" className="underline hover:text-primary">
                                {title}
                              </a>
                            ) : (
                              <span>{title}</span>
                            )}
                            {platform && <span className="text-xs text-muted-foreground ml-2">· {platform}</span>}
                          </div>
                          {isCompleted && (
                            <CheckCircle2 className="w-3 h-3 text-primary ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>

      {/* Popular Questions for Current Company */}
      {plan.companyProfile && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Popular {plan.primaryCompany} Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {plan.companyProfile.popularQuestions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <span className="flex-1 text-sm">{question}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewPlanDisplay;