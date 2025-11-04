import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { FullscreenWrapper } from "@/components/Fullscreen/FullscreenWrapper";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

const TakeTest: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  
  const { incrementTests } = useModuleProgress(test?.module_id || "");

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;
      
      const { data: testData } = await supabase
        .from("tests")
        .select("*, modules(title, slug)")
        .eq("id", testId)
        .single();
      
      const { data: questionsData } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_id", testId)
        .order("order_index");
      
      if (testData) setTest(testData);
      if (questionsData) {
        setQuestions(questionsData);
        setAnswers(new Array(questionsData.length).fill(-1));
      }
      setLoading(false);
    };
    
    fetchTest();
  }, [testId]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(newAnswers[currentIndex + 1] === -1 ? null : newAnswers[currentIndex + 1]);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers: number[]) => {
    const correctCount = finalAnswers.reduce((count, answer, index) => {
      return answer === questions[index].correct_index ? count + 1 : count;
    }, 0);
    
    const percentage = Math.round((correctCount / questions.length) * 100);
    setScore(percentage);
    
    // Save attempt to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("test_attempts").insert({
        user_id: user.id,
        test_id: testId,
        answers: finalAnswers,
        score: percentage,
        completed_at: new Date().toISOString(),
      });
      
      await incrementTests();
    }
    
    setShowResult(true);
    toast({
      title: "Test Completed!",
      description: `You scored ${percentage}%`,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading test...</p>
        </div>
      </Layout>
    );
  }

  if (showResult) {
    return (
      <FullscreenWrapper 
        isEnabled={false} 
        title="Test Complete"
      >
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto shadow-glow">
              <CardHeader className="text-center bg-hero-gradient text-white">
                <CardTitle className="text-2xl">Test Complete!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6 p-8">
                <div className="text-6xl font-bold text-primary">{score}%</div>
                <p className="text-lg">You got {questions.filter((_, i) => answers[i] === questions[i].correct_index).length} out of {questions.length} questions correct.</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button 
                    onClick={() => navigate(`/dashboard/adaptive/tests?slug=${test?.modules?.slug}`)}
                    className="bg-hero-gradient"
                  >
                    Back to Tests
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retake Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </FullscreenWrapper>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <FullscreenWrapper 
      isEnabled={!showResult && !loading} 
      onExit={() => navigate(`/dashboard/adaptive/tests?slug=${test?.modules?.slug}`)}
      title={`Test: ${test?.title || 'Loading...'}`}
      autoEnter={true}
      restrictive={true}
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">{test?.title}</h1>
                <span className="text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <Card className="shadow-card-hover">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-xl">{currentQuestion?.question}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
                  {currentQuestion?.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-all duration-200">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    size="lg"
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="bg-hero-gradient"
                    size="lg"
                  >
                    {currentIndex === questions.length - 1 ? "Submit Test" : "Next Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FullscreenWrapper>
  );
};

export default TakeTest;