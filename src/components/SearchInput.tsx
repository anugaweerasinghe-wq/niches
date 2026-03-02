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
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-xl"
        style={{
          background: 'linear-gradient(135deg, hsl(157 100% 49% / 0.3) 0%, hsl(170 100% 40% / 0.3) 100%)'
        }}
        animate={{ opacity: isFocused ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div 
        className={`relative glass-card overflow-hidden transition-all duration-300 ${
          isFocused ? 'ring-2 ring-primary/50' : ''
        }`}
      >
        <div className="flex items-center gap-4 p-5">
          <Search className="w-6 h-6 text-muted-foreground flex-shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none tracking-apple"
          />
          
          <motion.button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover</span>
          </motion.button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <SearchSuggestions
        suggestions={suggestions}
        isVisible={showSuggestions && suggestions.length > 0}
        onSelect={selectSuggestion}
        selectedIndex={selectedIndex}
      />
      
      <p className="text-center text-sm text-muted-foreground mt-4 tracking-apple">
        Describe your passions and interests in natural language
      </p>
    </motion.div>
  );
};

export default SearchInput;
