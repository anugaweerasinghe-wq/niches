import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

interface Suggestion {
  text: string;
  category: string;
  icon: 'trending' | 'spark' | 'zap';
}

interface SearchSuggestionsProps {
  suggestions: Suggestion[];
  isVisible: boolean;
  onSelect: (suggestion: string) => void;
  selectedIndex: number;
}

const iconMap = {
  trending: TrendingUp,
  spark: Sparkles,
  zap: Zap,
};

const SearchSuggestions = ({ suggestions, isVisible, onSelect, selectedIndex }: SearchSuggestionsProps) => {
  return (
    <AnimatePresence>
      {isVisible && suggestions.length > 0 && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => {
              const Icon = iconMap[suggestion.icon];
              return (
                <motion.button
                  key={suggestion.text}
                  onClick={() => onSelect(suggestion.text)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary/10 text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate tracking-apple">{suggestion.text}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchSuggestions;
