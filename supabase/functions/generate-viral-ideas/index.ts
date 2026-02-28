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
  // Strip markdown code blocks
  let cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Try direct parse
  try { return JSON.parse(cleaned); } catch {}

  // Find JSON boundaries
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
    // Truncated response — try to repair by closing brackets
    console.warn('Detected truncated JSON, attempting repair');
    cleaned = cleaned.substring(jsonStart);
    // Close any open strings, objects, arrays
    const openBraces = (cleaned.match(/{/g) || []).length - (cleaned.match(/}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length - (cleaned.match(/\]/g) || []).length;
    for (let i = 0; i < openBraces; i++) cleaned += '}';
    for (let i = 0; i < openBrackets; i++) cleaned += ']';
  } else {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  // Fix common LLM JSON issues
  cleaned = cleaned
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/[\x00-\x1F\x7F]/g, '');

  try { return JSON.parse(cleaned); } catch (e) {
    throw new Error('Failed to parse AI response as JSON');
  }
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

CRITICAL REQUIREMENT — PRACTICALITY & EXECUTABILITY:
Every single idea MUST be something a solo creator can film and publish TODAY with:
- A phone/camera, basic editing software, and 1-8 hours of work
- No special equipment, celebrity features, or expensive setups unless explicitly noted
- Clear step-by-step execution path (not vague concepts)
- A specific, proven format that has worked for similar creators in the last 30 days

VIRAL MAXIMIZATION — RESEARCH-BACKED FRAMEWORK:
Use this evidence-based viral formula for EACH idea:
1. HOOK (0-3 seconds): Pattern interrupt that creates an open loop. Reference hooks that achieved >80% 3-second retention in similar niches. Examples: "I spent $X so you don't have to", "Nobody talks about this", "POV:", controversial statement + proof
2. RETENTION ENGINE: Build in at least 2 retention triggers — curiosity payoffs every 15-30 seconds, visual changes, unexpected reveals, countdown/list structure
3. SHAREABILITY: Each idea must pass the "DM test" — would someone screenshot or send this to a friend? Why specifically?
4. ALGORITHM EXPLOIT: Target ONE primary signal per idea:
   - YouTube: High CTR (8%+) + Watch Time (>50% AVD) + Comment Velocity
   - TikTok: Completion Rate (>65%) + Save Rate (>3%) + Share Rate (>2%)  
   - Instagram: Save Rate (>5%) + Share Rate (>3%) + Reach via Explore
5. TREND SURFING: Each idea must ride a SPECIFIC current trend from ${month} — not generic evergreen topics
6. EMOTIONAL TRIGGER: Every idea must target a specific emotion (curiosity, shock, FOMO, nostalgia, outrage, awe) that has been proven to drive shares in this niche
7. THUMBNAIL PSYCHOLOGY: Thumbnails must use proven CTR principles — contrast colors, expressive faces (or striking visuals for faceless), max 4 words of text, curiosity gap

PROVEN VIRAL PATTERNS TO LEVERAGE (pick different ones per idea):
- "I tested X for Y days" (transformation + curiosity)
- "Stop doing X, do Y instead" (contrarian + value)
- Comparison/battle format (built-in engagement bait)
- "What $X gets you" (price anchoring + visual satisfaction)
- Myth-busting/exposé (outrage + education)
- "Day in my life as X" (aspirational + relatable)
- Before/After reveals (visual dopamine hit)
- Tutorial with unexpected twist (value + surprise)
- Reaction to trending topic (timeliness + commentary)
- Ranked list with controversial ordering (comment bait)

ADDITIONAL VIRAL AMPLIFIERS:
- Use "series potential" — ideas that naturally lead to Part 2, Part 3 for subscriber retention
- Include at least 2 ideas that tap into current news, pop culture, or seasonal events of ${month}
- At least 1 idea should be a "low effort, high reward" format (screen recordings, voiceovers, text-on-screen)
- Include specific B-roll suggestions or visual references for each idea
- Each hook must create a "knowledge gap" — viewer NEEDS to watch to find out the answer

Return a JSON array with exactly 10 objects (pure JSON, no markdown):
[
  {
    "id": "<unique numeric string>",
    "title": "<compelling viral title that exploits curiosity — max 80 chars>",
    "hook": "<EXACT word-for-word script for first 3-5 seconds. Must create an irresistible open loop. Write it as the creator would say it on camera.>",
    "thumbnailConcept": "<detailed thumbnail: facial expression, text overlay (max 4 words), colors, composition. Reference what's proven to get 10%+ CTR in this niche>",
    "bestPostingTime": "<optimal day and time like 'Tuesday 2PM EST' — based on when ${platform} niche audience is most active in ${month}>",
    "hashtags": ["<5 hashtags mixing 1 trending, 2 niche-specific, 2 broad reach — include actual current trending tags>"],
    "viralityScore": <number 60-98 — calibrate honestly: 60-70 = solid content, 70-80 = high potential, 80-90 = strong viral signals, 90+ = exceptional alignment with multiple viral factors>,
    "engagementRate": "<predicted ER with context, e.g., '8.2% (2.1x niche average of 3.9%)'>",
    "retentionInsight": "<specific retention strategy with timing, e.g., 'Reveal at 0:45 creates 2nd retention peak. List format with visual change every 8s maintains 72% avg watch-through'>",
    "algorithmSignal": "<primary algorithm exploit with benchmarks, e.g., 'Save-to-view ratio of 4.8% (3x niche avg) triggers Explore page recommendation'>",
    "trendAlignment": "<SPECIFIC ${month} trend this leverages — name the trend, why it's peaking now, and its trajectory>",
    "targetEmotion": "<curiosity|shock|inspiration|humor|fear|awe — explain WHY this emotion drives shares in this niche>",
    "contentFormat": "<storytime|tutorial|challenge|reaction|comparison|expose|transformation|listicle|POV>",
    "scriptOutline": "<DETAILED 5-step script structure with exact timing: 0:00-0:03 hook, 0:03-0:15 context, 0:15-0:45 main content, 0:45-1:00 twist/reveal, 1:00-1:15 CTA. Adapt timing to ideal video length for this format on ${platform}>",
    "whyItWorks": "<3 sentences citing SPECIFIC metrics: 'This format averages X views in ${query} niche because [psychological trigger]. Similar videos by [type of creator] achieved [metric]. The ${month} timing amplifies this because [reason].'>",
    "competitionLevel": "<Low|Medium|High>",
    "searchVolume": "<trend indicator like 'Rising +340%' or 'Breakout' or 'Steady High' — reference actual search demand>",
    "estimatedProductionTime": "<realistic time like '2-3 hours' — include what's needed: filming, editing, thumbnail>",
    "callToAction": "<CTA that drives algorithm-boosting engagement — must feel natural, not forced. e.g., 'Comment which one surprised you most' drives comment velocity>"
  }
]

CRITICAL RULES:
- Sort by viralityScore descending
- Each idea must exploit a DIFFERENT viral pattern from the list above
- Vary content formats — no more than 2 ideas with the same format
- Mix competition levels (at least 3 Low, 3 Medium, some High)
- Hooks must be CONVERSATIONAL and authentic — never clickbaity or generic
- Every idea must be filmable TODAY by a solo creator with a smartphone
- ScriptOutlines must include specific timing for ${platform}'s ideal video length
- WHY IT WORKS must cite specific metrics, not vague claims
- All trends must be specific to ${month} — not generic evergreen advice
- Do NOT fabricate view counts or follower numbers — use ranges and estimates
- Be honest about competition levels and realistic about engagement predictions`;

    const data = await callAIWithRetry({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: `You are a data-driven viral content analyst specializing in ${platform}. Today is ${today}. You have deep knowledge of viral video patterns, algorithm mechanics, and creator economics. Your recommendations must be PRACTICAL (filmable today), SPECIFIC (exact scripts and timing), and GROUNDED in proven ${month} trends. Respond with valid JSON only — no markdown, no code blocks, no extra text.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.72,
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
