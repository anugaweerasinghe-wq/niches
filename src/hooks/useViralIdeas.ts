import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ViralIdea {
  id: string;
  title: string;
  hook: string;
  thumbnailConcept: string;
  bestPostingTime: string;
  hashtags: string[];
  estimatedViews: string;
  viralityScore: number;
  trendAlignment: string;
  targetEmotion: string;
  contentFormat: string;
  scriptOutline: string;
  whyItWorks: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
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

export const useViralIdeas = (): UseViralIdeasReturn => {
  const [ideas, setIdeas] = useState<ViralIdea[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (query: string, platform: string) => {
    setIsLoading(true);
    setError(null);
    setIdeas(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('generate-viral-ideas', {
        body: { query, platform }
      });

      if (fetchError) throw new Error(fetchError.message || 'Failed to generate ideas');
      if (data.error) throw new Error(data.error);

      setIdeas(data.ideas as ViralIdea[]);
    } catch (err) {
      console.error('Viral ideas error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate viral ideas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIdeas(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { ideas, isLoading, error, generate, reset };
};
