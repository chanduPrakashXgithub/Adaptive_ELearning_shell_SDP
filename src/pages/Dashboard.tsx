import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen, Clock, Award, TrendingUp, Play, BarChart3, Calendar, Target, Zap, Users, Trophy, Brain, Star, Timer, BookMinus } from 'lucide-react';
import InterviewPlanner from '@/components/InterviewPlanner/InterviewPlanner';
import Posts from '@/components/Posts/Posts';
import DiscussionPanel from '@/components/Discussion/DiscussionPanel';
import type { InterviewPlan } from '@/components/Chatbot/engine';
import { useNavigate } from 'react-router-dom';
import { useDashboardData, type DashboardStats } from '@/hooks/useDashboardData';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { supabase } from '@/integrations/supabase/client';
import learningBg from '@/assets/learning-bg.jpg';
import booksStudy from '@/assets/books-study.jpg';
import studentActivities from '@/assets/student-activities.jpg';

const Dashboard = () => {
  const navigate = useNavigate();
  const { modules, stats, loading, refetchData } = useDashboardData();
  const { weeklyActivity, learningStreak, logActivity, refetchData: refetchActivity } = useActivityTracking();
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [previousStats, setPreviousStats] = useState<DashboardStats>({
    coursesEnrolled: 0,
    hoursLearned: 0,
    certificates: 0,
    averageScore: 0
  });

  // Load previous stats on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('previousDashboardStats');
    if (savedStats) {
      setPreviousStats(JSON.parse(savedStats));
    }

    // Log login activity once
    logActivity('login');
    // Refresh activity/stats when module progress is updated elsewhere
    const handler = (_e?: any) => {
      try { refetchData(); } catch (e) { }
      try { refetchActivity(); } catch (e) { }
    };
    window.addEventListener('moduleProgressUpdated', handler as EventListener);
    return () => window.removeEventListener('moduleProgressUpdated', handler as EventListener);
  }, []); // Run only once on mount

  // Fetch dynamic data when modules change
  useEffect(() => {
    if (modules.length > 0) {
      fetchDynamicData();
    }
  }, [modules.length]); // Only depend on modules count, not the array itself

  // Save current stats when they change (after loading is complete)
  useEffect(() => {
    if (!loading && stats.coursesEnrolled > 0) {
      localStorage.setItem('previousDashboardStats', JSON.stringify(stats));
    }
  }, [loading, stats.coursesEnrolled, stats.hoursLearned, stats.certificates, stats.averageScore]);

  const fetchDynamicData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate learning streak from user activity
      const totalTimeSeconds = modules.reduce((sum, module) => {
        const timeStr = module.timeSpent;
        const hours = timeStr.includes('h') ? parseInt(timeStr.split('h')[0]) : 0;
        const minutes = timeStr.includes('m') ? parseInt(timeStr.split('m')[0].split(' ').pop() || '0') : 0;
        return sum + (hours * 3600) + (minutes * 60);
      }, 0);

      const averageSessionTime = totalTimeSeconds > 0 ? totalTimeSeconds / 3600 : 0;

      // Generate AI recommendations based on progress
      const recommendations = [];
      const inProgressModules = modules.filter(m => m.status === 'In Progress');
      const notStartedModules = modules.filter(m => m.status === 'Not Started');

      if (inProgressModules.length > 0) {
        recommendations.push(`Continue with "${inProgressModules[0].title}" to maintain momentum`);
      }
      if (stats.averageScore < 80) {
        recommendations.push("Review theory sections to improve your quiz scores");
      }
      if (notStartedModules.length > 0) {
        recommendations.push(`Start "${notStartedModules[0].title}" to expand your knowledge`);
      }
      if (stats.hoursLearned < 5) {
        recommendations.push("Try to study at least 30 minutes daily for better retention");
      }

      setAiRecommendations(recommendations);

      // Generate achievements based on actual progress
      const dynamicAchievements = [];
      const completedCount = modules.filter(m => m.status === 'Completed').length;

      if (completedCount > 0) {
        dynamicAchievements.push({
          icon: Trophy,
          title: 'Course Completed',
          description: `Finished ${completedCount} course${completedCount > 1 ? 's' : ''}`,
          date: '2 days ago',
          color: 'text-warning'
        });
      }

      if (stats.hoursLearned >= 5) {
        dynamicAchievements.push({
          icon: Target,
          title: 'Learning Goal Achieved',
          description: `${stats.hoursLearned} hours of focused learning`,
          date: '1 week ago',
          color: 'text-success'
        });
      }

      if (stats.averageScore >= 85) {
        dynamicAchievements.push({
          icon: Brain,
          title: 'High Achiever',
          description: `Average score: ${stats.averageScore}%`,
          date: '3 days ago',
          color: 'text-primary'
        });
      }

      setAchievements(dynamicAchievements);

    } catch (error) {
      console.error('Error fetching dynamic data:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const statsData = [
    {
      icon: BookOpen,
      label: 'Courses Enrolled',
      value: stats.coursesEnrolled.toString(),
      color: 'text-primary',
      change: previousStats.coursesEnrolled > 0
        ? `+${stats.coursesEnrolled - previousStats.coursesEnrolled} new`
        : `${stats.coursesEnrolled} total`,
      trend: stats.coursesEnrolled >= previousStats.coursesEnrolled ? 'up' : 'neutral'
    },
    {
      icon: Clock,
      label: 'Hours Learned',
      value: stats.hoursLearned.toString(),
      color: 'text-accent',
      change: previousStats.hoursLearned > 0
        ? `+${(stats.hoursLearned - previousStats.hoursLearned).toFixed(1)}h gained`
        : `${stats.hoursLearned}h total`,
      trend: stats.hoursLearned >= previousStats.hoursLearned ? 'up' : 'neutral'
    },
    {
      icon: Award,
      label: 'Certificates',
      value: stats.certificates.toString(),
      color: 'text-success',
      change: stats.certificates > previousStats.certificates
        ? `+${stats.certificates - previousStats.certificates} new!`
        : stats.certificates > 0 ? 'Keep learning!' : 'Start learning!',
      trend: stats.certificates > previousStats.certificates ? 'up' : 'neutral'
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      color: 'text-warning',
      change: previousStats.averageScore > 0
        ? `${stats.averageScore >= previousStats.averageScore ? '+' : ''}${(stats.averageScore - previousStats.averageScore).toFixed(0)}% change`
        : stats.averageScore > 0 ? `${stats.averageScore}% average` : 'No scores yet',
      trend: stats.averageScore >= previousStats.averageScore ? 'up' : 'neutral'
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none"
        style={{ backgroundImage: `url(${learningBg})` }}
      />

      <Layout>
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold bg-hero-gradient bg-clip-text text-transparent mb-4">
              Welcome back, Learner!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl lg:max-w-none">
              Continue your adaptive learning journey with AI-powered recommendations
            </p>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-4 lg:p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-br ${index === 0 ? 'from-primary/20 to-primary/10' :
                        index === 1 ? 'from-accent/20 to-accent/10' :
                          index === 2 ? 'from-success/20 to-success/10' :
                            'from-warning/20 to-warning/10'
                        } ${stat.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                      <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl lg:text-3xl font-bold mb-2">{stat.value}</p>
                      <p className="text-xs text-success font-medium">{stat.change}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Learning Modules */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                        <BookOpen className="w-5 h-5 lg:w-6 lg:h-6" />
                        Adaptive Learning Modules
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Your personalized learning path based on AI recommendations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  {modules.map((module) => (
                    <Card key={module.id} className="p-4 lg:p-6 border border-border/50 hover:border-primary/50 hover:shadow-glow/50 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                          {module.description && (
                            <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full self-start lg:self-center ${module.status === 'Completed' ? 'bg-success text-success-foreground' :
                          module.status === 'In Progress' ? 'bg-primary text-primary-foreground' :
                            'bg-muted text-muted-foreground'
                          }`}>
                          {module.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <Progress value={module.progress} className="h-2 lg:h-3" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{module.progress}%</span>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.timeSpent}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookMinus className="w-3 h-3" />
                            {module.quizCount} Quizzes
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            {module.testCount} Tests
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant={module.status === 'Not Started' ? 'default' : 'outline'}
                          className={module.status === 'Not Started' ? 'bg-hero-gradient' : ''}
                          onClick={() => navigate(`/dashboard/adaptive/theory`, {
                            state: { moduleSlug: module.slug }
                          })}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {module.status === 'Not Started' ? 'Start Learning' : 'Continue'}
                        </Button>
                      </div>

                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value={`activities-${module.id}`}>
                          <AccordionTrigger className="text-sm">Learning Activities</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                              <div className="text-center p-3 rounded-lg border bg-muted/20">
                                <BookOpen className="w-5 h-5 mx-auto mb-2 text-primary" />
                                <p className="text-xs font-medium mb-1">Theory</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {module.theoryCompleted ? 'Completed' : 'Not completed'}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => navigate(`/dashboard/adaptive/theory`, {
                                    state: { moduleSlug: module.slug }
                                  })}
                                >
                                  {module.theoryCompleted ? 'Review' : 'Start'}
                                </Button>
                              </div>

                              <div className="text-center p-3 rounded-lg border bg-muted/20">
                                <Brain className="w-5 h-5 mx-auto mb-2 text-accent" />
                                <p className="text-xs font-medium mb-1">Quizzes</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {module.quizzesAttempted} attempted
                                </p>
                                <Button
                                  size="sm"
                                  className="bg-hero-gradient w-full"
                                  onClick={() => navigate(`/dashboard/adaptive/quizzes`, {
                                    state: { moduleSlug: module.slug }
                                  })}
                                >
                                  Practice
                                </Button>
                              </div>

                              <div className="text-center p-3 rounded-lg border bg-muted/20">
                                <Target className="w-5 h-5 mx-auto mb-2 text-warning" />
                                <p className="text-xs font-medium mb-1">Tests</p>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {module.testsAttempted} attempted
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => navigate(`/dashboard/adaptive/tests`, {
                                    state: { moduleSlug: module.slug }
                                  })}
                                >
                                  Take Test
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Study Resources */}
              <Card className="mt-8 shadow-card overflow-hidden">
                <div
                  className="h-32 lg:h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${booksStudy})` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <BookOpen className="w-8 h-8 mx-auto mb-2" />
                      <h3 className="text-lg lg:text-xl font-bold">Study Resources</h3>
                      <p className="text-sm opacity-90">Curated materials for deeper learning</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 lg:p-6">
                  <Posts />
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Analytics Sidebar */}
            <div className="space-y-6">
              <InterviewPlanner onPlan={(plan) =>
                navigate('/dashboard/interview-plan', { state: { plan } })
              } />

              {/* AI Recommendations */}
              <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiRecommendations.map((rec, index) => (
                      <div key={index} className="p-3 rounded-lg bg-background/50 border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Streak */}
              <Card className="shadow-card bg-gradient-to-br from-success/5 to-warning/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-success" />
                    Learning Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-success mb-2">{learningStreak.current}</div>
                    <p className="text-sm text-muted-foreground mb-4">Days in a row!</p>
                    <div className="flex justify-between text-xs mb-3">
                      <span>Personal Best: {learningStreak.best}</span>
                      <span>Goal: {learningStreak.weeklyGoal}/week</span>
                    </div>
                    <Progress value={(learningStreak.current / learningStreak.best) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyActivity.map((day, index) => (
                      <div key={day.day} className="flex items-center gap-3">
                        <span className="text-xs font-medium w-8">{day.day}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Progress value={(day.hours / 3) * 100} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-8">{day.hours.toFixed(1)}h</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{day.completed} tasks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Analytics */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Weekly Goal</span>
                        <span className="text-primary font-medium">{stats.hoursLearned}/10 hours</span>
                      </div>
                      <Progress value={Math.min((stats.hoursLearned / 10) * 100, 100)} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Course Completion</span>
                        <span className="text-accent font-medium">
                          {modules.length > 0 ? Math.round((stats.certificates / modules.length) * 100) : 0}%
                        </span>
                      </div>
                      <Progress value={modules.length > 0 ? (stats.certificates / modules.length) * 100 : 0} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span className="text-warning font-medium">{stats.averageScore}%</span>
                      </div>
                      <Progress value={stats.averageScore} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student Activities */}
              <Card className="shadow-card overflow-hidden">
                <div
                  className="h-24 lg:h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${studentActivities})` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Users className="w-6 h-6 mx-auto mb-1" />
                      <h3 className="text-sm lg:text-base font-bold">Student Community</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3 lg:p-4">
                  <p className="text-sm text-muted-foreground mb-3">Connect with fellow learners</p>
                  <Button size="sm" variant="outline" className="w-full transform active:translate-y-1 active:scale-95" onClick={() => setShowDiscussion(true)}>
                    Join Discussion
                  </Button>
                </CardContent>
              </Card>

              {showDiscussion && (
                <DiscussionPanel onClose={() => setShowDiscussion(false)} />
              )}

              {/* Recent Achievements */}
              {achievements.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.map((achievement, index) => {
                        const Icon = achievement.icon;
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                            <div className={`p-2 rounded-lg bg-background ${achievement.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{achievement.title}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;