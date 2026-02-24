import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NicheScorecard {
  marketSaturation: number;
  growthPotential: number;
  gapScore: number;
}

export interface OutlierCreator {
  name: string;
  niche: string;
  followers: number;
  avgViews: number;
  viewToFollowerRatio: number;
  insight: string;
}

export interface ViralContent {
  id: string;
  title: string;
  creator: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  videoUrl?: string;
  previewGif?: string;
}

export interface ContentIdea {
  title: string;
  description: string;
  estimatedViews: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ViralHook {
  text: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'all';
  hookType: string;
}

export interface NicheAnalysisResult {
  query: string;
  platform: string;
  style: string;
  scorecard: NicheScorecard;
  outliers: OutlierCreator[];
  viralContent: ViralContent[];
  contentIdeas: ContentIdea[];
  viralHooks: ViralHook[];
}

interface UseNicheAnalysisReturn {
  data: NicheAnalysisResult | null;
  isLoading: boolean;
  progress: number;
  error: string | null;
  analyze: (query: string, platform: string, style: string) => Promise<void>;
  reset: () => void;
}

const MAX_RETRIES = 2;

export const useNicheAnalysis = (): UseNicheAnalysisReturn => {
  const [data, setData] = useState<NicheAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (query: string, platform: string, style: string) => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setData(null);

    let lastError = '';

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
          setProgress(10); // Reset progress on retry
        }

        setProgress(20);

        const { data: responseData, error: fetchError } = await supabase.functions.invoke('analyze-niche', {
          body: { query, platform, style }
        });

        if (fetchError) throw new Error(fetchError.message || 'Failed to analyze niche');
        if (responseData?.error) throw new Error(responseData.error);

        // Validate essential fields
        if (!responseData?.scorecard || !responseData?.outliers) {
          throw new Error('Incomplete analysis data received');
        }

        setProgress(100);
        setData(responseData as NicheAnalysisResult);
        setIsLoading(false);
        return; // Success
      } catch (err) {
        lastError = err instanceof Error ? err.message : 'Failed to analyze niche. Please try again.';
        console.error(`Analysis attempt ${attempt + 1} failed:`, lastError);

        if (lastError.includes('Rate limit') || lastError.includes('credits')) {
          break;
        }
      }
    }

    setError(lastError);
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    progress,
    error,
    analyze,
    reset,
  };
};
