import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const contentSources = {
  'introduction-to-ai': [
    'https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/',
    'https://ai.google/education/ai-for-everyone/'
  ],
  'machine-learning-basics': [
    'https://developers.google.com/machine-learning/crash-course',
    'https://course.fast.ai/'
  ],
  'deep-learning-fundamentals': [
    'https://cs230.stanford.edu/',
    'https://www.coursera.org/learn/neural-networks-deep-learning'
  ],
  'neural-networks': [
    'https://cs231n.stanford.edu/',
    'https://www.tensorflow.org/tutorials'
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { moduleSlug, sourceIndex = 0 } = await req.json();
    
    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured');
    }

    const sources = contentSources[moduleSlug as keyof typeof contentSources];
    if (!sources) {
      throw new Error(`No sources configured for module: ${moduleSlug}`);
    }

    const sourceUrl = sources[sourceIndex];
    console.log(`Ingesting content from ${sourceUrl} for module ${moduleSlug}`);

    // Get module ID
    const { data: module } = await supabase
      .from('modules')
      .select('id')
      .eq('slug', moduleSlug)
      .single();

    if (!module) {
      throw new Error(`Module not found: ${moduleSlug}`);
    }

    // Scrape content with Firecrawl
    const crawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: sourceUrl,
        pageOptions: {
          includeHtml: true,
          includeRawHtml: false,
          onlyMainContent: true
        },
        extractorOptions: {
          extractionSchema: {
            content: "string",
            title: "string",
            description: "string"
          }
        }
      }),
    });

    if (!crawlResponse.ok) {
      throw new Error(`Firecrawl API error: ${crawlResponse.status}`);
    }

    const crawlData = await crawlResponse.json();
    
    if (!crawlData.success) {
      throw new Error(`Firecrawl scraping failed: ${crawlData.error}`);
    }

    const content = crawlData.data;
    
    // Store content in database
    const { data: theoryContent, error } = await supabase
      .from('theory_contents')
      .insert({
        module_id: module.id,
        content_markdown: content.markdown || '',
        content_html: content.html || '',
        source_url: sourceUrl,
        content_format: 'markdown',
        license: 'CC/MIT (Educational Use)',
        version: 1,
        published: true
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`Successfully ingested content for ${moduleSlug} from ${sourceUrl}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Content ingested for ${moduleSlug}`,
      contentId: theoryContent.id,
      sourceUrl 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Content ingestion error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});