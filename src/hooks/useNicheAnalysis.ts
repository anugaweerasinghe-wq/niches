import { useState, useCallback } from 'react';

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

// Mock data generator
const generateMockData = (query: string, platform: string, style: string): NicheAnalysisResult => {
  const scorecard: NicheScorecard = {
    marketSaturation: Math.floor(Math.random() * 40) + 30,
    growthPotential: Math.floor(Math.random() * 30) + 65,
    gapScore: Math.floor(Math.random() * 25) + 60
  };

  const outliers: OutlierCreator[] = [
    {
      name: 'TechFitness Pro',
      niche: 'Tech + Fitness Fusion',
      followers: 45000,
      avgViews: 380000,
      viewToFollowerRatio: 8.4,
      insight: 'Combines wearable tech reviews with workout routines. High engagement on comparison content.'
    },
    {
      name: 'GadgetGains',
      niche: 'Smart Home Fitness',
      followers: 28000,
      avgViews: 195000,
      viewToFollowerRatio: 7.0,
      insight: 'Focus on home gym tech integrations. Strong performance on "setup" and "tour" videos.'
    },
    {
      name: 'FitData Analytics',
      niche: 'Data-Driven Training',
      followers: 62000,
      avgViews: 410000,
      viewToFollowerRatio: 6.6,
      insight: 'Uses data visualization to show fitness progress. Excel with "transformation" narratives.'
    }
  ];

  const viralContent: ViralContent[] = [
    {
      id: '1',
      title: 'I Tested Every Fitness Tracker for 30 Days - Here\'s the Truth',
      creator: 'TechFitness Pro',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=640&h=360&fit=crop',
      views: 2400000,
      likes: 89000,
      comments: 4200,
      duration: '18:24'
    },
    {
      id: '2',
      title: 'The $50 vs $500 Smart Scale - Can You Tell the Difference?',
      creator: 'GadgetGains',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=360&fit=crop',
      views: 1800000,
      likes: 72000,
      comments: 3100,
      duration: '12:45'
    },
    {
      id: '3',
      title: 'How I Used AI to Create the Perfect Workout Plan',
      creator: 'FitData Analytics',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&h=360&fit=crop',
      views: 3100000,
      likes: 145000,
      comments: 8900,
      duration: '22:10'
    },
    {
      id: '4',
      title: 'Building a $10,000 Smart Home Gym - Full Tour',
      creator: 'TechFitness Pro',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=640&h=360&fit=crop',
      views: 890000,
      likes: 41000,
      comments: 1800,
      duration: '15:30'
    },
    {
      id: '5',
      title: 'This Gadget Changed My Morning Routine Forever',
      creator: 'GadgetGains',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=640&h=360&fit=crop',
      views: 1200000,
      likes: 56000,
      comments: 2400,
      duration: '8:15'
    },
    {
      id: '6',
      title: 'The Science Behind Why Your Fitness App is Lying to You',
      creator: 'FitData Analytics',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=640&h=360&fit=crop',
      views: 2800000,
      likes: 112000,
      comments: 6700,
      duration: '19:42'
    }
  ];

  const contentIdeas: ContentIdea[] = [
    {
      title: 'Ultimate Wearable Tech Showdown 2024',
      description: 'Compare the top 5 fitness wearables in real workout conditions with data-driven analysis.',
      estimatedViews: '500K-1M',
      difficulty: 'Medium'
    },
    {
      title: '30-Day AI Personal Trainer Challenge',
      description: 'Document a month using only AI-generated workout plans and measure real results.',
      estimatedViews: '1M-2M',
      difficulty: 'Hard'
    },
    {
      title: 'Budget Smart Gym Setup Under $500',
      description: 'Build a connected home gym on a budget with surprising tech hacks.',
      estimatedViews: '300K-700K',
      difficulty: 'Easy'
    }
  ];

  const viralHooks: ViralHook[] = [
    {
      text: 'I spent $5,000 so you don\'t have to...',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      hookType: 'Investment Hook'
    },
    {
      text: 'Nobody is talking about this fitness tech secret',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      hookType: 'Curiosity Gap'
    },
    {
      text: 'This changed everything about how I track my workouts',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      hookType: 'Transformation'
    },
    {
      text: 'The algorithm doesn\'t want you to see this...',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      hookType: 'Controversy'
    },
    {
      text: 'I tested this for 6 months - here\'s the honest truth',
      platform: platform as 'youtube' | 'tiktok' | 'instagram',
      hookType: 'Authority'
    }
  ];

  return {
    query,
    platform,
    style,
    scorecard,
    outliers,
    viralContent,
    contentIdeas,
    viralHooks
  };
};

interface UseNicheAnalysisReturn {
  data: NicheAnalysisResult | null;
  isLoading: boolean;
  progress: number;
  error: string | null;
  analyze: (query: string, platform: string, style: string) => Promise<void>;
  reset: () => void;
}

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

    try {
      // Simulate progressive loading
      const progressSteps = [15, 35, 55, 75, 90, 100];
      
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setProgress(step);
      }

      // Generate mock data
      const result = generateMockData(query, platform, style);
      setData(result);
    } catch (err) {
      setError('Failed to analyze niche. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    reset
  };
};
