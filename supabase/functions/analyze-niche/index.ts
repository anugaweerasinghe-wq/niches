import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, platform, style } = await req.json();

    const prompt = `You are a social media niche analyst. Analyze the niche "${query}" for ${platform} content with a ${style} style preference.

Return a JSON object with this exact structure (no markdown, just pure JSON):
{
  "scorecard": {
    "marketSaturation": <number 0-100>,
    "growthPotential": <number 0-100>,
    "gapScore": <number 0-100>
  },
  "outliers": [
    {
      "name": "<creator name>",
      "niche": "<specific sub-niche>",
      "followers": <number>,
      "avgViews": <number>,
      "viewToFollowerRatio": <number>,
      "insight": "<actionable insight about their success>"
    }
  ],
  "viralContent": [
    {
      "id": "<unique id>",
      "title": "<viral video title>",
      "creator": "<creator name>",
      "platform": "${platform}",
      "thumbnail": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=640&h=360&fit=crop",
      "views": <number>,
      "likes": <number>,
      "comments": <number>,
      "duration": "<duration like 12:34>"
    }
  ],
  "contentIdeas": [
    {
      "title": "<video idea title>",
      "description": "<brief description>",
      "estimatedViews": "<range like 500K-1M>",
      "difficulty": "<Easy|Medium|Hard>"
    }
  ],
  "viralHooks": [
    {
      "text": "<hook text>",
      "platform": "${platform}",
      "hookType": "<hook type like Curiosity Gap, Controversy, etc>"
    }
  ]
}

Provide exactly:
- 3 outlier creators with realistic metrics
- 6 viral content examples with engaging titles
- 3 content ideas with varying difficulty
- 5 viral hooks optimized for ${platform}

Make the data realistic and actionable for someone entering this niche. Use varied thumbnail URLs from Unsplash.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a social media analytics expert. Always respond with valid JSON only, no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response, handling potential markdown code blocks
    let analysisData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      analysisData = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

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
