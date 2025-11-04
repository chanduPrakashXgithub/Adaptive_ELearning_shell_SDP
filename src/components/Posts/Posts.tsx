import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface Post { id: string; user_id: string; content: string; created_at: string; }

const Posts: React.FC = () => {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user?.id ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id,user_id,content,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("posts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, (_payload) => {
        qc.invalidateQueries({ queryKey: ["posts"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, qc]);

  const canPost = useMemo(() => (content.trim().length > 0 && userId), [content, userId]);

  const addPost = async () => {
    if (!userId) return;
    const { error } = await supabase.from("posts").insert({ user_id: userId, content: content.trim() });
    if (error) {
      toast({ title: "Failed to save", description: error.message });
    } else {
      setContent("");
      toast({ title: "Saved!" });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Your Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="post">New Post</Label>
          <Textarea id="post" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your learning notes..." />
          <div className="mt-2">
            <Button onClick={addPost} disabled={!canPost} className="w-full">Add</Button>
          </div>
        </div>
        <div className="space-y-3">
          {(posts ?? []).map((p) => (
            <div key={p.id} className="p-3 border border-border rounded-lg">
              <div className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
              <div className="mt-1 whitespace-pre-wrap">{p.content}</div>
            </div>
          ))}
          {posts?.length === 0 && (
            <div className="text-sm text-muted-foreground">No posts yet. Write your first note above.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Posts;
