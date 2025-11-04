import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ContentRenderer } from "@/components/Adaptive/ContentRenderer";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Theory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const state = (location.state as any) || {};
  const search = new URLSearchParams(location.search);
  const moduleSlug: string = state?.moduleSlug || search.get("slug") || "introduction-to-ai";
  const moduleTitleFromState: string | undefined = state?.moduleTitle;

  const { module, progress, status, setTheoryCompleted, addTimeSpent } = useModuleProgress(moduleSlug);
  const [content, setContent] = useState<{ md?: string | null; html?: string | null } | null>(null);

  const title = useMemo(() => module?.title || moduleTitleFromState || "Theory", [module?.title, moduleTitleFromState]);

  useEffect(() => {
    const pageTitle = `${title} | Theory | AdaptiveLearn`;
    const desc = `Theory for ${title}: structured readings and notes.`;
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
        .from("theory_contents")
        .select("content_markdown, content_html")
        .eq("module_id", module.id)
        .eq("published", true)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) console.error(error);
      if (isMounted) setContent({ md: data?.content_markdown, html: data?.content_html });
    })();
    return () => { isMounted = false };
  }, [module?.id]);

  // Track time spent: add every 5s while on page
  useEffect(() => {
    const interval = setInterval(() => addTimeSpent(5), 5000);
    return () => clearInterval(interval);
  }, [addTimeSpent]);

  return (
    <Layout>
      <header className="container mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">Structured readings and notes for this module.</p>
        <div className="mt-4 max-w-xl">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Status: {status}</span>
            <span>{Math.round(progress?.percent_complete || 0)}%</span>
          </div>
          <Progress value={progress?.percent_complete || 0} />
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <section>
          {content?.md || content?.html ? (
            <Card className="shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 p-6">
              <ContentRenderer contentMarkdown={content?.md || undefined} contentHtml={content?.html || undefined} />
              <div className="mt-6 flex gap-3">
                <Button 
                  className="bg-hero-gradient text-primary-foreground font-semibold hover:shadow-glow" 
                  onClick={async () => {
                    await setTheoryCompleted(true);
                    toast({ title: "Marked complete", description: "Theory marked as completed." });
                  }}
                >
                  Mark as Completed
                </Button>
                <Button variant="outline" className="text-foreground border-border hover:bg-accent hover:text-accent-foreground" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              </div>
            </Card>
          ) : (
            <Card className="shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 p-6">
              <p className="text-muted-foreground">No theory content available yet. Once content is ingested from approved sources, it will appear here in your site style.</p>
              <div className="mt-6">
                <Button variant="outline" className="text-foreground border-border hover:bg-accent hover:text-accent-foreground" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              </div>
            </Card>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default Theory;
