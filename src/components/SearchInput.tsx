import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import SearchSuggestions from './SearchSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, onSubmit, placeholder = "I love fitness and tech..." }: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const { suggestions, selectedIndex, handleKeyDown, selectSuggestion } = useSearchSuggestions(
    value,
    handleSelect,
    showSuggestions
  );

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && selectedIndex === -1) {
      onSubmit();
      setShowSuggestions(false);
    } else {
      handleKeyDown(e);
    }
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Focus glow */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 blur-lg"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--glow-primary) / 0.25) 0%, hsl(var(--glow-secondary) / 0.2) 100%)'
        }}
        animate={{ opacity: isFocused ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div
        className={`relative glass-card overflow-hidden transition-all duration-200 ${
          isFocused ? 'ring-1 ring-primary/40 border-primary/20' : ''
        }`}
      >
        <div className="flex items-center gap-3 p-4 md:p-5">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-base md:text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none tracking-apple"
          />

          <motion.button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover</span>
          </motion.button>
        </div>
      </div>

      <SearchSuggestions
        suggestions={suggestions}
        isVisible={showSuggestions && suggestions.length > 0}
        onSelect={selectSuggestion}
        selectedIndex={selectedIndex}
      />

      <p className="text-center text-xs text-muted-foreground/60 mt-3 tracking-apple">
        Describe your passions and interests in natural language
      </p>
    </motion.div>
  );
};

export default SearchInput;
