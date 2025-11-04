import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Quiz {
  id: string;
  title: string;
  description?: string;
}

const Quizzes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const state = (location.state as any) || {};
  const search = new URLSearchParams(location.search);
  const moduleSlug: string = state?.moduleSlug || search.get("slug") || "introduction-to-ai";
  const moduleTitleFromState: string | undefined = state?.moduleTitle;

  const { module, progress, status, incrementQuizzes, addTimeSpent } = useModuleProgress(moduleSlug);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const title = module?.title || moduleTitleFromState || "Quizzes";

  useEffect(() => {
    const pageTitle = `${title} | Quizzes | AdaptiveLearn`;
    const desc = `Quizzes for ${title}: quick checks to personalize your path.`;
    document.title = pageTitle;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, [title]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!module?.id) return;
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, description")
        .eq("module_id", module.id)
        .eq("published", true);
      if (error) console.error(error);
      if (isMounted) {
        setQuizzes(data || []);
        setLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, [module?.id]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => addTimeSpent(5), 5000);
    return () => clearInterval(interval);
  }, [addTimeSpent]);

  return (
    <Layout>
      <header className="container mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">Short formative checks to adapt your learning journey.</p>
        <div className="mt-4 max-w-xl">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Status: {status}</span>
            <span>{Math.round(progress?.percent_complete || 0)}%</span>
          </div>
          <Progress value={progress?.percent_complete || 0} />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Loading quizzes...</p>
            </div>
          ) : quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <Card key={quiz.id} className="shadow-depth-1 hover:shadow-depth-3 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {quiz.description || "10 questions • ~8 minutes • Adaptive difficulty"}
                  </p>
                  <Button 
                    className="w-full bg-hero-gradient hover:shadow-glow text-primary-foreground font-semibold" 
                    onClick={() => navigate(`/dashboard/adaptive/quiz/${quiz.id}`)}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No quizzes available for this module yet.</p>
            </div>
          )}
        </section>
        <div className="mt-8">
          <Button variant="outline" className="text-foreground border-border hover:bg-accent hover:text-accent-foreground" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </main>
    </Layout>
  );
};

export default Quizzes;