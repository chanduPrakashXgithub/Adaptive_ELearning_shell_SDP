import React, { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import ContentIngestion from "@/components/Admin/ContentIngestion";

const AdminContentIngestion: React.FC = () => {
  useEffect(() => {
    document.title = "Content Ingestion | AdaptiveLearn Admin";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Admin panel for ingesting educational content from open sources into theory modules.";

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);

  return (
    <Layout>
      <header className="container mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold">Content Ingestion</h1>
        <p className="text-muted-foreground mt-1">
          Populate theory modules with educational content from open sources
        </p>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <ContentIngestion />
      </main>
    </Layout>
  );
};

export default AdminContentIngestion;