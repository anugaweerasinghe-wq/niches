import { useState, useEffect, useMemo } from 'react';

interface Suggestion {
  text: string;
  category: string;
  icon: 'trending' | 'spark' | 'zap';
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  // Fitness
  { text: 'Fitness and wellness', category: 'Health', icon: 'trending' },
  { text: 'Fitness tech reviews', category: 'Tech + Health', icon: 'spark' },
  { text: 'Home workout routines', category: 'Fitness', icon: 'zap' },
  
  // Tech
  { text: 'Tech gadgets and reviews', category: 'Technology', icon: 'trending' },
  { text: 'Tech tutorials for beginners', category: 'Education', icon: 'spark' },
  { text: 'Smart home automation', category: 'Tech', icon: 'zap' },
  
  // Gaming
  { text: 'Gaming reviews and walkthroughs', category: 'Entertainment', icon: 'trending' },
  { text: 'Gaming setup tours', category: 'Gaming', icon: 'spark' },
  { text: 'Esports and competitive gaming', category: 'Gaming', icon: 'zap' },
  
  // Finance
  { text: 'Personal finance tips', category: 'Finance', icon: 'trending' },
  { text: 'Investing for beginners', category: 'Finance', icon: 'spark' },
  { text: 'Crypto and blockchain', category: 'Finance', icon: 'zap' },
  
  // Lifestyle
  { text: 'Minimalist lifestyle', category: 'Lifestyle', icon: 'trending' },
  { text: 'Productivity and time management', category: 'Self-improvement', icon: 'spark' },
  { text: 'Travel vlogs and tips', category: 'Lifestyle', icon: 'zap' },
  
  // Education
  { text: 'Online learning and courses', category: 'Education', icon: 'trending' },
  { text: 'Study tips and motivation', category: 'Education', icon: 'spark' },
  { text: 'Career development', category: 'Professional', icon: 'zap' },
  
  // Creative
  { text: 'Photography and editing', category: 'Creative', icon: 'trending' },
  { text: 'Art and illustration tutorials', category: 'Creative', icon: 'spark' },
  { text: 'Music production', category: 'Creative', icon: 'zap' },
  
  // Food
  { text: 'Cooking and recipes', category: 'Food', icon: 'trending' },
  { text: 'Meal prep and nutrition', category: 'Health + Food', icon: 'spark' },
  { text: 'Restaurant reviews', category: 'Food', icon: 'zap' },
];

interface UseSearchSuggestionsReturn {
  suggestions: Suggestion[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  selectSuggestion: (text: string) => void;
}

export const useSearchSuggestions = (
  query: string,
  onSelect: (value: string) => void,
  isOpen: boolean
): UseSearchSuggestionsReturn => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase();
    const filtered = MOCK_SUGGESTIONS.filter(
      (s) =>
        s.text.toLowerCase().includes(normalizedQuery) ||
        s.category.toLowerCase().includes(normalizedQuery)
    );
    
    return filtered.slice(0, 6);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          onSelect(suggestions[selectedIndex].text);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (text: string) => {
    onSelect(text);
    setSelectedIndex(-1);
  };

  return {
    suggestions,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    selectSuggestion,
  };
};
