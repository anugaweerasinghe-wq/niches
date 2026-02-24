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
  try { return JSON.parse(content.trim()); } catch {}

  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[1].trim()); } catch {}
  }

  const firstBracket = content.indexOf('[');
  if (firstBracket >= 0) {
    let depth = 0;
    for (let i = firstBracket; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') depth--;
      if (depth === 0) {
        try { return JSON.parse(content.slice(firstBracket, i + 1)); } catch {}
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
    const { query, platform } = await req.json();

    if (!query || !platform) {
      return new Response(JSON.stringify({ error: 'query and platform are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const today = new Date().toISOString().split('T')[0];
    const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const prompt = `You are an elite viral content strategist with deep expertise in ${platform} algorithm mechanics. Today's date is ${today} (${month}).

MISSION: Generate 10 video ideas for the niche "${query}" on ${platform} that have the HIGHEST probability of going viral RIGHT NOW.

Your analysis MUST be grounded in current ${month} trends:
- What topics are currently trending in "${query}" on ${platform}?
- What format/style is the ${platform} algorithm currently favoring?
- What content gaps exist that creators haven't exploited yet?
- What seasonal or cultural moments can be leveraged this month?
- What emerging micro-trends in "${query}" are about to explode?

DATA-DRIVEN REQUIREMENTS:
- Reference real engagement rate benchmarks for ${platform} (avg ER for this niche, top performer ER)
- Cite specific algorithmic signals: watch time thresholds, save-to-view ratios, share velocity
- Include retention curve insights (e.g., "hook pattern retains 78% past 3s")
- Reference platform-specific KPIs (YouTube CTR 4-10%, TikTok completion rate benchmarks, IG save rates)
- Factor in current content saturation and white-space opportunities

VIRAL MAXIMIZATION FACTORS — each idea must exploit at least 2:
1. Pattern interrupt in first 1.5 seconds
2. Emotional trigger (curiosity gap, outrage, awe, FOMO)
3. Trending audio/format/meme alignment
4. Shareability factor (would someone send this to a friend?)
5. Algorithm signal optimization (saves, shares, comments, watch time)
6. Search demand alignment (trending search terms)

Return a JSON array with exactly 10 objects (pure JSON, no markdown):
[
  {
    "id": "<unique numeric string>",
    "title": "<compelling viral title that exploits curiosity — max 80 chars>",
    "hook": "<exact first 3-5 seconds script that stops the scroll — conversational, punchy>",
    "thumbnailConcept": "<detailed thumbnail description: facial expression, text overlay, colors, composition>",
    "bestPostingTime": "<optimal day and time like 'Tuesday 2PM EST' based on niche audience behavior>",
    "hashtags": ["<5 hashtags mixing trending + niche-specific + broad reach>"],
    "viralityScore": <number 60-98 — be honest, not everything is 90+>,
    "engagementRate": "<predicted ER like '8.2%' with niche context>",
    "retentionInsight": "<specific retention pattern, e.g., 'List format with reveals every 8s drives 72% avg watch-through'>",
    "algorithmSignal": "<primary algorithm exploit, e.g., 'High comment-to-view ratio (4.2x niche avg) triggers recommendation engine'>",
    "trendAlignment": "<what ${month} trend this leverages — be specific>",
    "targetEmotion": "<curiosity|shock|inspiration|humor|fear|awe>",
    "contentFormat": "<storytime|tutorial|challenge|reaction|comparison|expose|transformation|listicle|POV>",
    "scriptOutline": "<4-5 sentence detailed script structure with timing>",
    "whyItWorks": "<3 sentence data-backed analysis — reference specific metrics and behavioral patterns>",
    "competitionLevel": "<Low|Medium|High>",
    "searchVolume": "<trend indicator like 'Rising +340%' or 'Breakout' or 'Steady High'>",
    "estimatedProductionTime": "<realistic time like '2-3 hours'>",
    "callToAction": "<CTA that drives algorithm-boosting engagement>"
  }
]

CRITICAL RULES:
- Sort by viralityScore descending
- Each idea must exploit a DIFFERENT algorithmic signal or trend
- Vary content formats across the 10 ideas
- Mix competition levels (at least 3 Low, 3 Medium, some High)
- Make hooks feel natural and conversational, not clickbaity
- Every recommendation must be actionable TODAY in ${month}`;

    const data = await callAIWithRetry({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: `You are a data-driven viral content analyst specializing in ${platform}. Today is ${today}. Your recommendations must reflect current ${month} trends, algorithm behavior, and market conditions. Respond with valid JSON only — no markdown, no code blocks, no extra text.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.75,
    }, LOVABLE_API_KEY);

    const content = data.choices[0].message.content;
    const ideas = parseJSON(content);

    // Validate and ensure array
    if (!Array.isArray(ideas)) {
      throw new Error('AI response is not an array');
    }

    // Ensure all required fields exist with defaults
    const validatedIdeas = ideas.map((idea: any, i: number) => ({
      id: idea.id || String(i + 1),
      title: idea.title || 'Untitled Idea',
      hook: idea.hook || '',
      thumbnailConcept: idea.thumbnailConcept || '',
      bestPostingTime: idea.bestPostingTime || 'Weekday 2PM EST',
      hashtags: Array.isArray(idea.hashtags) ? idea.hashtags : [],
      viralityScore: typeof idea.viralityScore === 'number' ? idea.viralityScore : 70,
      engagementRate: idea.engagementRate || '5.0%',
      retentionInsight: idea.retentionInsight || '',
      algorithmSignal: idea.algorithmSignal || '',
      trendAlignment: idea.trendAlignment || '',
      targetEmotion: idea.targetEmotion || 'curiosity',
      contentFormat: idea.contentFormat || 'tutorial',
      scriptOutline: idea.scriptOutline || '',
      whyItWorks: idea.whyItWorks || '',
      competitionLevel: ['Low', 'Medium', 'High'].includes(idea.competitionLevel) ? idea.competitionLevel : 'Medium',
      searchVolume: idea.searchVolume || 'Moderate',
      estimatedProductionTime: idea.estimatedProductionTime || '2-4 hours',
      callToAction: idea.callToAction || '',
    }));

    return new Response(JSON.stringify({ ideas: validatedIdeas, query, platform }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-viral-ideas:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
