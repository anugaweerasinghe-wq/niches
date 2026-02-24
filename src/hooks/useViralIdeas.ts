import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ViralIdea {
  id: string;
  title: string;
  hook: string;
  thumbnailConcept: string;
  bestPostingTime: string;
  hashtags: string[];
  viralityScore: number;
  engagementRate: string;
  retentionInsight: string;
  algorithmSignal: string;
  trendAlignment: string;
  targetEmotion: string;
  contentFormat: string;
  scriptOutline: string;
  whyItWorks: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
  searchVolume: string;
  estimatedProductionTime: string;
  callToAction: string;
}

interface UseViralIdeasReturn {
  ideas: ViralIdea[] | null;
  isLoading: boolean;
  error: string | null;
  generate: (query: string, platform: string) => Promise<void>;
  reset: () => void;
}

const MAX_RETRIES = 2;

export const useViralIdeas = (): UseViralIdeasReturn => {
  const [ideas, setIdeas] = useState<ViralIdea[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (query: string, platform: string) => {
    setIsLoading(true);
    setError(null);
    setIdeas(null);

    let lastError: string = '';

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          // Wait before retry with exponential backoff
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }

        const { data, error: fetchError } = await supabase.functions.invoke('generate-viral-ideas', {
          body: { query, platform }
        });

        if (fetchError) throw new Error(fetchError.message || 'Failed to generate ideas');
        if (data?.error) throw new Error(data.error);
        if (!data?.ideas || !Array.isArray(data.ideas)) throw new Error('Invalid response format');

        setIdeas(data.ideas as ViralIdea[]);
        setIsLoading(false);
        return; // Success - exit retry loop
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Failed to generate viral ideas';
        console.error(`Viral ideas attempt ${attempt + 1} failed:`, lastError);
        
        // Don't retry on rate limit or credits errors
        if (lastError.includes('Rate limit') || lastError.includes('credits')) {
          break;
        }
      }
    }

    setError(lastError);
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setIdeas(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { ideas, isLoading, error, generate, reset };
};
