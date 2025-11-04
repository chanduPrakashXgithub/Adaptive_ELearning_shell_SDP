import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Play,
  Lightbulb,
  Target
} from 'lucide-react';

const CourseViewer = () => {
  const { id } = useParams();
  const [currentProgress, setCurrentProgress] = useState(65);

  // Mock course data - in real app this would come from API
  const courseData = {
    id: id || '1',
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning algorithms and their applications.',
    currentLesson: 3,
    totalLessons: 8,
    estimatedTime: '45 minutes',
    difficulty: 'Intermediate',
    content: {
      title: 'Supervised Learning Algorithms',
      sections: [
        'Linear Regression Overview',
        'Decision Trees and Random Forests',
        'Support Vector Machines',
        'Model Evaluation Metrics'
      ]
    }
  };

  const handleNextLesson = async () => {
    try {
      // Simulate API call to recommendation endpoint
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentLessonId: courseData.currentLesson,
          courseId: courseData.id,
          userProgress: currentProgress 
        })
      });
      
      const data = await response.json();
      
      toast({
        title: "Lesson Completed!",
        description: `AI recommends lesson ${data.nextLessonId} based on your progress.`,
      });
      
      // Update progress
      setCurrentProgress(Math.min(currentProgress + 12.5, 100));
      
    } catch (error) {
      // Fallback for when API is not available
      toast({
        title: "Lesson Completed!",
        description: "AI recommends lesson 42 based on your progress.",
      });
      setCurrentProgress(Math.min(currentProgress + 12.5, 100));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4 mr-1" />
            Course {courseData.id} • Lesson {courseData.currentLesson} of {courseData.totalLessons}
          </div>
          <h1 className="text-3xl font-bold mb-2">{courseData.title}</h1>
          <p className="text-muted-foreground mb-4">{courseData.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {courseData.estimatedTime}
            </Badge>
            <Badge variant="outline">{courseData.difficulty}</Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Progress:</span>
              <Progress value={currentProgress} className="w-32 h-2" />
              <span className="text-sm font-medium">{currentProgress}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  {courseData.content.title}
                </CardTitle>
                <CardDescription>
                  Lesson {courseData.currentLesson}: Understanding the core concepts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video/Content Placeholder */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive Learning Content</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Video, simulations, and hands-on exercises would appear here
                    </p>
                  </div>
                </div>

                {/* Lesson Sections */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Lesson Outline</h3>
                  {courseData.content.sections.map((section, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-medium">{section}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-border">
                  <Button variant="outline" disabled={courseData.currentLesson === 1}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous Lesson
                  </Button>
                  <Button 
                    onClick={handleNextLesson}
                    className="bg-hero-gradient hover:shadow-glow transition-shadow"
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-1">Personalized Tip</p>
                  <p className="text-sm text-muted-foreground">
                    You're showing strong understanding of linear concepts. Ready for advanced algorithms!
                  </p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium mb-1">Difficulty Adjustment</p>
                  <p className="text-sm text-muted-foreground">
                    Content adapted to intermediate level based on your performance.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                    <span>Understand supervised learning principles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                    <span>Compare different algorithm types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 border-2 border-muted rounded-full mt-0.5" />
                    <span>Apply evaluation metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 border-2 border-muted rounded-full mt-0.5" />
                    <span>Implement basic models</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Course Notes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Practice Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Ask AI Tutor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseViewer;