import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Chatbot from '@/components/Chatbot/Chatbot';
import { BookOpen, Clock, Award, TrendingUp, Play, BarChart3, Calendar, Target, Zap, Users, Trophy, Brain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InterviewPlanner from '@/components/InterviewPlanner/InterviewPlanner';
import Posts from '@/components/Posts/Posts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // Mock data for demonstration
  const [modules, setModules] = useState([
    { id: 1, title: 'Introduction to AI', progress: 75, timeSpent: '2h 30m', status: 'In Progress', topics: ['AI basics', 'History'] },
    { id: 2, title: 'Machine Learning Basics', progress: 100, timeSpent: '4h 15m', status: 'Completed', topics: ['Supervised', 'Unsupervised'] },
    { id: 3, title: 'Deep Learning Fundamentals', progress: 30, timeSpent: '1h 20m', status: 'In Progress', topics: ['Neurons', 'Backprop'] },
    { id: 4, title: 'Neural Networks', progress: 0, timeSpent: '0m', status: 'Not Started', topics: ['Perceptron', 'Activation'] },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopics, setNewTopics] = useState('');
  const [interviewPlan, setInterviewPlan] = useState<any>(null);
  const navigate = useNavigate();

  const addModule = () => {
    if (!newTitle.trim()) return;
    const topics = newTopics.split(',').map(t => t.trim()).filter(Boolean);
    setModules(prev => [
      ...prev,
      { id: Date.now(), title: newTitle.trim(), progress: 0, timeSpent: '0m', status: 'Not Started', topics }
    ]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewTopics('');
  };

  const stats = [
    { icon: BookOpen, label: 'Courses Enrolled', value: '4', color: 'text-primary', change: '+2 this month', trend: 'up' },
    { icon: Clock, label: 'Hours Learned', value: '8.1', color: 'text-accent', change: '+15% vs last week', trend: 'up' },
    { icon: Award, label: 'Certificates', value: '1', color: 'text-success', change: 'New this week!', trend: 'up' },
    { icon: TrendingUp, label: 'Average Score', value: '87%', color: 'text-warning', change: '+5% improvement', trend: 'up' },
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 1.5, completed: 3 },
    { day: 'Tue', hours: 2.1, completed: 5 },
    { day: 'Wed', hours: 0.8, completed: 2 },
    { day: 'Thu', hours: 2.3, completed: 6 },
    { day: 'Fri', hours: 1.4, completed: 4 },
    { day: 'Sat', hours: 0, completed: 0 },
    { day: 'Sun', hours: 0, completed: 0 },
  ];

  const achievements = [
    { icon: Trophy, title: 'First Course Completed', description: 'Completed Machine Learning Basics', date: '2 days ago', color: 'text-warning' },
    { icon: Target, title: 'Weekly Goal Achieved', description: '8+ hours of learning', date: '1 week ago', color: 'text-success' },
    { icon: Brain, title: 'Knowledge Master', description: 'Scored 95% on AI quiz', date: '2 weeks ago', color: 'text-primary' },
  ];

  const learningStreak = {
    current: 12,
    best: 18,
    weeklyGoal: 10
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Continue your adaptive learning journey</p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      index === 0 ? 'from-primary/20 to-primary/10' :
                      index === 1 ? 'from-accent/20 to-accent/10' :
                      index === 2 ? 'from-success/20 to-success/10' :
                      'from-warning/20 to-warning/10'
                    } ${stat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold mb-2">{stat.value}</p>
                    <p className="text-xs text-success font-medium">{stat.change}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Modules */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Adaptive Learning Modules
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setIsAddOpen(true)}>Add Module</Button>
                </div>
                <CardDescription>
                  Your personalized learning path based on AI recommendations
                </CardDescription>
              </CardHeader>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Module / Material</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="newTitle">Title</Label>
                      <Input id="newTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Probability Basics" />
                    </div>
                    <div>
                      <Label htmlFor="newTopics">Topics (comma separated)</Label>
                      <Textarea id="newTopics" value={newTopics} onChange={(e) => setNewTopics(e.target.value)} placeholder="e.g., regression, overfitting, regularization" />
                    </div>
                    <Button onClick={addModule} className="w-full">Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <CardContent className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{module.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        module.status === 'Completed' ? 'bg-success text-success-foreground' :
                        module.status === 'In Progress' ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">{module.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.timeSpent}
                      </span>
                      <Button 
                        size="sm" 
                        variant={module.status === 'Not Started' ? 'default' : 'outline'}
                        className={module.status === 'Not Started' ? 'bg-hero-gradient' : ''}
                        onClick={() => navigate('/dashboard/adaptive/quizzes', { state: { moduleId: module.id, moduleTitle: module.title } })}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {module.status === 'Not Started' ? 'Start' : 'Continue'}
                      </Button>
                    </div>

                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value={`quizzes-${module.id}`}>
                        <AccordionTrigger>Quizzes</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Short formative checks for this module.</p>
                            <Button
                              size="sm"
                              className="bg-hero-gradient"
                              onClick={() => navigate('/dashboard/adaptive/quizzes', { state: { moduleId: module.id, moduleTitle: module.title } })}
                            >
                              Start
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value={`tests-${module.id}`}>
                        <AccordionTrigger>Tests</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Summative assessments measuring mastery.</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate('/dashboard/adaptive/tests', { state: { moduleId: module.id, moduleTitle: module.title } })}
                            >
                              Continue
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value={`theory-${module.id}`}>
                        <AccordionTrigger>Theory</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Structured readings and notes.</p>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => navigate('/dashboard/adaptive/theory', { state: { moduleId: module.id, moduleTitle: module.title } })}
                            >
                              View Content
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
               </CardContent>
            </Card>
{/* Integrated Assessments & Theory into each module */}
            <div className="mt-8">
              <Posts />
            </div>
          </div>

          {/* Enhanced Analytics Sidebar */}
          <div className="space-y-6">
            <InterviewPlanner onPlan={setInterviewPlan} />
            {/* Learning Streak */}
            <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{learningStreak.current}</div>
                  <p className="text-sm text-muted-foreground mb-4">Days in a row!</p>
                  <div className="flex justify-between text-xs">
                    <span>Personal Best: {learningStreak.best}</span>
                    <span>Goal: {learningStreak.weeklyGoal}/week</span>
                  </div>
                  <Progress value={(learningStreak.current / learningStreak.best) * 100} className="h-2 mt-3" />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
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
                          <span className="text-xs text-muted-foreground">{day.hours}h</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{day.completed} tasks completed</div>
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
                      <span className="text-primary font-medium">8.1/10 hours</span>
                    </div>
                    <Progress value={81} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Course Completion</span>
                      <span className="text-accent font-medium">51%</span>
                    </div>
                    <Progress value={51} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Skill Mastery</span>
                      <span className="text-success font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quiz Accuracy</span>
                      <span className="text-warning font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
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
                        <div className="flex-1">
                          <p className="text-sm font-medium">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="shadow-card bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-background/50 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-1 text-primary">🎯 Focus Area</p>
                    <p className="text-sm text-muted-foreground">
                      Spend more time on neural network concepts to improve understanding.
                    </p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg border border-accent/20">
                    <p className="text-sm font-medium mb-1 text-accent">📚 Next Module</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your progress, "Deep Learning Fundamentals" is recommended next.
                    </p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg border border-success/20">
                    <p className="text-sm font-medium mb-1 text-success">💡 Study Tip</p>
                    <p className="text-sm text-muted-foreground">
                      Try practicing with coding exercises to reinforce theoretical knowledge.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Chatbot modules={modules} interviewPlan={interviewPlan} />
    </Layout>
  );
};

export default Dashboard;