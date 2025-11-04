import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface IngestionStatus {
  moduleSlug: string;
  sourceIndex: number;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
}

const ContentIngestion: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState<IngestionStatus[]>([]);

  const sources = [
    { moduleSlug: 'introduction-to-ai', title: 'Introduction to AI', sourceCount: 2 },
    { moduleSlug: 'machine-learning-basics', title: 'Machine Learning Basics', sourceCount: 2 },
    { moduleSlug: 'deep-learning-fundamentals', title: 'Deep Learning Fundamentals', sourceCount: 2 },
    { moduleSlug: 'neural-networks', title: 'Neural Networks', sourceCount: 2 },
  ];

  const initializeStatuses = () => {
    const initialStatuses: IngestionStatus[] = [];
    sources.forEach(source => {
      for (let i = 0; i < source.sourceCount; i++) {
        initialStatuses.push({
          moduleSlug: source.moduleSlug,
          sourceIndex: i,
          status: 'pending'
        });
      }
    });
    return initialStatuses;
  };

  const updateStatus = (moduleSlug: string, sourceIndex: number, status: IngestionStatus['status'], message?: string) => {
    setStatuses(prev => prev.map(s => 
      s.moduleSlug === moduleSlug && s.sourceIndex === sourceIndex 
        ? { ...s, status, message }
        : s
    ));
  };

  const ingestContent = async (moduleSlug: string, sourceIndex: number) => {
    updateStatus(moduleSlug, sourceIndex, 'running');
    
    try {
      const { data, error } = await supabase.functions.invoke('ingest-content', {
        body: { moduleSlug, sourceIndex }
      });

      if (error) throw error;

      if (data.success) {
        updateStatus(moduleSlug, sourceIndex, 'completed', `Content ingested from ${data.sourceUrl}`);
      } else {
        updateStatus(moduleSlug, sourceIndex, 'error', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Ingestion error:', error);
      updateStatus(moduleSlug, sourceIndex, 'error', error instanceof Error ? error.message : 'Network error');
    }
  };

  const startIngestion = async () => {
    setIsRunning(true);
    setProgress(0);
    setStatuses(initializeStatuses());

    let completed = 0;
    const total = sources.reduce((sum, source) => sum + source.sourceCount, 0);

    for (const source of sources) {
      for (let i = 0; i < source.sourceCount; i++) {
        await ingestContent(source.moduleSlug, i);
        completed++;
        setProgress((completed / total) * 100);
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsRunning(false);
    toast({
      title: "Content Ingestion Complete",
      description: `Processed ${total} sources across ${sources.length} modules.`
    });
  };

  const getStatusIcon = (status: IngestionStatus['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'error': return '❌';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Theory Content Ingestion</CardTitle>
        <p className="text-muted-foreground">
          Automatically populate theory content from educational sources using Firecrawl
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={startIngestion} 
            disabled={isRunning}
            className="bg-hero-gradient hover:shadow-glow"
          >
            {isRunning ? 'Ingesting Content...' : 'Start Content Ingestion'}
          </Button>
          
          {isRunning && (
            <div className="flex-1 ml-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-1">{Math.round(progress)}% complete</p>
            </div>
          )}
        </div>

        {statuses.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ingestion Progress</h3>
            <div className="grid gap-3">
              {sources.map(source => (
                <div key={source.moduleSlug} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{source.title}</h4>
                  <div className="space-y-2">
                    {statuses
                      .filter(s => s.moduleSlug === source.moduleSlug)
                      .map((status, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span>{getStatusIcon(status.status)}</span>
                            <span>Source {status.sourceIndex + 1}</span>
                          </span>
                          <span className="text-muted-foreground">
                            {status.message || status.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <h4 className="font-medium">Content Sources:</h4>
          <ul className="space-y-1 ml-4">
            <li>• Introduction to AI: MIT OCW AI Course, Google AI Education</li>
            <li>• Machine Learning Basics: Google MLCC, fast.ai Intro to ML</li>
            <li>• Deep Learning Fundamentals: Stanford CS230, Neural Networks & Deep Learning</li>
            <li>• Neural Networks: Stanford CS231n, TensorFlow Tutorials</li>
          </ul>
          <p className="text-xs mt-2">
            All sources use open educational licenses (CC, MIT, or comparable).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentIngestion;