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
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

function parseJSON(content: string): any {
  let cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try { return JSON.parse(cleaned); } catch {}

  const jsonStart = cleaned.search(/[\{\[]/);
  if (jsonStart === -1) throw new Error('No JSON found in response');

  const isArray = cleaned[jsonStart] === '[';
  const endChar = isArray ? ']' : '}';
  const startChar = isArray ? '[' : '{';

  let depth = 0;
  let jsonEnd = -1;
  for (let i = jsonStart; i < cleaned.length; i++) {
    if (cleaned[i] === startChar) depth++;
    if (cleaned[i] === endChar) depth--;
    if (depth === 0) { jsonEnd = i; break; }
  }

  if (jsonEnd === -1) {
    cleaned = cleaned.substring(jsonStart);
    const openBraces = (cleaned.match(/{/g) || []).length - (cleaned.match(/}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length - (cleaned.match(/\]/g) || []).length;
    for (let i = 0; i < openBraces; i++) cleaned += '}';
    for (let i = 0; i < openBrackets; i++) cleaned += ']';
  } else {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']').replace(/[\x00-\x1F\x7F]/g, '');
  try { return JSON.parse(cleaned); } catch (e) {
    throw new Error('Failed to parse AI response as JSON');
  }
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
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a social media analyst. Today is ${today}.

Analyze the niche "${query}" for ${platform} with ${style} style.

CRITICAL RULES:
1. OUTLIER CREATORS: You MUST provide REAL, VERIFIED creators who actually exist on ${platform}. Use their REAL channel/account name. Provide their REAL channel URL. Stats should be your best estimate of their current numbers — be approximately accurate, not fabricated.
2. VIRAL CONTENT: You MUST provide REAL videos/posts that actually exist and went viral in this niche on ${platform}. Use REAL video titles, REAL creator names. Provide the ACTUAL video URL (e.g., https://youtube.com/watch?v=XXXXX or https://tiktok.com/@user/video/XXXXX). For thumbnails, use a relevant Unsplash image URL as a visual placeholder (since we can't embed actual thumbnails).
3. DETERMINISM: For the same query, always return the same creators and videos — pick the most well-known, established ones.

Return JSON (no markdown):
{
  "scorecard": {
    "marketSaturation": <0-100>,
    "growthPotential": <0-100>,
    "gapScore": <0-100>
  },
  "outliers": [
    {
      "name": "<REAL creator name as known on ${platform}>",
      "niche": "<their specific sub-niche>",
      "followers": <approximate real follower count>,
      "avgViews": <approximate real avg views>,
      "viewToFollowerRatio": <calculated ratio like 6.5>,
      "insight": "<what strategy makes them successful>",
      "channelUrl": "<REAL full URL to their ${platform} channel/profile>"
    }
  ],
  "viralContent": [
    {
      "id": "<unique id>",
      "title": "<REAL title of an actual viral video/post in this niche>",
      "creator": "<REAL creator name who made it>",
      "platform": "${platform}",
      "thumbnail": "https://images.unsplash.com/photo-<relevant-photo-id>?w=640&h=360&fit=crop",
      "views": <approximate real view count>,
      "likes": <approximate real like count>,
      "comments": <approximate real comment count>,
      "duration": "<actual duration>",
      "videoUrl": "<REAL full URL to the actual video/post>"
    }
  ],
  "contentIdeas": [
    {
      "title": "<video idea>",
      "description": "<brief description>",
      "estimatedViews": "<range like 50K-200K>",
      "difficulty": "<Easy|Medium|Hard>"
    }
  ],
  "viralHooks": [
    {
      "text": "<hook text>",
      "platform": "${platform}",
      "hookType": "<hook type>"
    }
  ]
}

Provide exactly:
- 3 REAL outlier creators with their actual channel URLs
- 6 REAL viral videos/posts with their actual URLs (use Unsplash for thumbnail placeholders)
- 3 content ideas
- 5 viral hooks

IMPORTANT: Every creator and video MUST be real and verifiable. URLs must be actual links to real content. Do not invent fake creators or videos.`;

    const data = await callAIWithRetry({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: `You are a social media analyst. Today is ${today}. Respond with valid JSON only. All creators and videos must be REAL and verifiable — never fabricate names, channels, or URLs. For the same query input, always return the same well-known creators and videos.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    }, LOVABLE_API_KEY);

    const content = data.choices[0].message.content;
    const analysisData = parseJSON(content);

    return new Response(JSON.stringify({
      query, platform, style,
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
