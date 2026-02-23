import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

    const prompt = `You are an elite viral content strategist and data analyst. Given the niche "${query}" on ${platform}, generate exactly 10 video ideas that have the highest probability of going viral based on current trends, audience psychology, and platform algorithms.

For each idea, provide a comprehensive breakdown. Return a JSON array (no markdown, pure JSON only) with this exact structure:

[
  {
    "id": "<unique numeric string>",
    "title": "<compelling viral video title>",
    "hook": "<the opening hook/first 3 seconds script that stops the scroll>",
    "thumbnailConcept": "<detailed description of an attention-grabbing thumbnail>",
    "bestPostingTime": "<optimal day and time like 'Tuesday 2PM EST'>",
    "hashtags": ["<hashtag1>", "<hashtag2>", "<hashtag3>", "<hashtag4>", "<hashtag5>"],
    "estimatedViews": "<realistic view range like '500K-2M'>",
    "viralityScore": <number 1-100 representing probability of going viral>,
    "trendAlignment": "<what current trend this taps into>",
    "targetEmotion": "<primary emotion this triggers: curiosity, shock, inspiration, humor, fear, awe>",
    "contentFormat": "<format type: storytime, tutorial, challenge, reaction, comparison, expose, transformation>",
    "scriptOutline": "<3-4 sentence outline of the video structure>",
    "whyItWorks": "<1-2 sentence analysis of why this will perform well>",
    "competitionLevel": "<Low|Medium|High>",
    "estimatedProductionTime": "<time to produce like '2-3 hours'>",
    "callToAction": "<suggested CTA for the video>"
  }
]

Sort by viralityScore descending (highest first). Make all data realistic, actionable, and based on real platform dynamics for ${platform}. Each idea should feel unique and tap into different audience segments or content formats.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are an expert viral content strategist. Always respond with valid JSON only, no markdown formatting or code blocks.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let ideas;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      ideas = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify({ ideas, query, platform }), {
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
