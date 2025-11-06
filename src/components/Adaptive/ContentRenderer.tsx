import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import ErrorBoundary from "@/components/ErrorBoundary";

interface ContentRendererProps {
  contentMarkdown?: string | null;
  contentHtml?: string | null;
  className?: string;
}

// Renders markdown or sanitized HTML using site typography
export const ContentRenderer: React.FC<ContentRendererProps> = ({
  contentMarkdown,
  contentHtml,
  className = "",
}) => {
  if (contentMarkdown && contentMarkdown.trim()) {
    return (
      <article className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}>
        <ErrorBoundary
          fallback={
            <div className="prose max-w-none">
              <p className="text-muted-foreground">This content cannot be rendered as Markdown. Showing raw content below.</p>
              <pre className="whitespace-pre-wrap break-words bg-muted/10 p-4 rounded mt-2">{contentMarkdown}</pre>
            </div>
          }
        >
          <ReactMarkdown
            // Cast to any to avoid type issues across unified versions
            remarkPlugins={[remarkGfm as any]}
            rehypePlugins={[rehypeSanitize as any]}
          >
            {contentMarkdown}
          </ReactMarkdown>
        </ErrorBoundary>
      </article>
    );
  }

  if (contentHtml && contentHtml.trim()) {
    return (
      <article
        className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    );
  }

  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>No content available. Please run content ingestion from the admin panel.</p>
    </div>
  );
};

export default ContentRenderer;
