import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function callAIWithRetry(body: object, apiKey: string, maxRetries = 3): Promise<any> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        const wait = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited, waiting ${wait}ms before retry ${attempt + 1}`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI Gateway error (attempt ${attempt + 1}):`, response.status, errorText);
        if (attempt < maxRetries - 1) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw new Error(`AI Gateway error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      if (attempt < maxRetries - 1) {
        console.log(`Retry ${attempt + 1} after error:`, err);
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

function parseJSON(content: string): any {
  // Try direct parse first
  try {
    return JSON.parse(content.trim());
  } catch {}

  // Try extracting from markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1].trim());
    } catch {}
  }

  // Try finding JSON object/array boundaries
  const firstBrace = content.indexOf('{');
  const firstBracket = content.indexOf('[');
  const start = Math.min(
    firstBrace >= 0 ? firstBrace : Infinity,
    firstBracket >= 0 ? firstBracket : Infinity
  );
  
  if (start !== Infinity) {
    const isArray = content[start] === '[';
    const endChar = isArray ? ']' : '}';
    let depth = 0;
    for (let i = start; i < content.length; i++) {
      if (content[i] === (isArray ? '[' : '{')) depth++;
      if (content[i] === endChar) depth--;
      if (depth === 0) {
        try {
          return JSON.parse(content.slice(start, i + 1));
        } catch {}
        break;
      }
    }
  }

  throw new Error('Failed to parse AI response as JSON');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, platform, style } = await req.json();

    if (!query || !platform || !style) {
      return new Response(JSON.stringify({ error: 'query, platform, and style are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a world-class social media niche analyst with access to real-time platform data. Today's date is ${today}.

Analyze the niche "${query}" for ${platform} content with a ${style} style preference.

CRITICAL: Your analysis must reflect CURRENT market conditions as of ${today}:
- Reference trending topics and hashtags that are performing well RIGHT NOW on ${platform}
- Consider seasonal trends, current events, and emerging micro-trends
- Base metrics on current platform algorithm behavior (${platform}'s latest algorithm update priorities)
- Include creators who are currently growing fastest in this space
- Factor in current audience sentiment and content fatigue levels

Return a JSON object with this exact structure (no markdown, pure JSON only):
{
  "scorecard": {
    "marketSaturation": <number 0-100>,
    "growthPotential": <number 0-100>,
    "gapScore": <number 0-100>
  },
  "outliers": [
    {
      "name": "<real-sounding creator name>",
      "niche": "<specific sub-niche>",
      "followers": <number>,
      "avgViews": <number>,
      "viewToFollowerRatio": <number like 6.5>,
      "insight": "<actionable insight about their current success strategy>"
    }
  ],
  "viralContent": [
    {
      "id": "<unique id>",
      "title": "<viral video title reflecting current trends>",
      "creator": "<creator name>",
      "platform": "${platform}",
      "thumbnail": "<unsplash URL with w=640&h=360&fit=crop>",
      "views": <realistic number>,
      "likes": <realistic number>,
      "comments": <realistic number>,
      "duration": "<duration like 12:34>"
    }
  ],
  "contentIdeas": [
    {
      "title": "<video idea title aligned with current trends>",
      "description": "<brief description with trend context>",
      "estimatedViews": "<range like 500K-1M>",
      "difficulty": "<Easy|Medium|Hard>"
    }
  ],
  "viralHooks": [
    {
      "text": "<hook text optimized for current ${platform} algorithm>",
      "platform": "${platform}",
      "hookType": "<hook type>"
    }
  ]
}

Provide exactly:
- 3 outlier creators with realistic metrics (varied follower counts from 10K to 500K+)
- 6 viral content examples with engaging trend-aware titles and varied Unsplash thumbnail URLs
- 3 content ideas with varying difficulty, each exploiting a different current trend
- 5 viral hooks optimized for ${platform}'s current algorithm priorities

Make every recommendation feel timely, specific to ${today}'s market, and immediately actionable.`;

    const data = await callAIWithRetry({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: `You are a social media analytics expert. Today is ${today}. Always respond with valid JSON only. No markdown formatting, no code blocks, no extra text. Just the JSON object.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }, LOVABLE_API_KEY);

    const content = data.choices[0].message.content;
    const analysisData = parseJSON(content);

    return new Response(JSON.stringify({
      query,
      platform,
      style,
      ...analysisData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-niche function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
