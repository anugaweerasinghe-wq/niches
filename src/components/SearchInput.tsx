import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, onSubmit, placeholder = "I love fitness and tech..." }: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit();
    }
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
          background: 'linear-gradient(135deg, hsl(210 100% 60% / 0.3) 0%, hsl(280 100% 60% / 0.3) 100%)'
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
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
      
      <p className="text-center text-sm text-muted-foreground mt-4 tracking-apple">
        Describe your passions and interests in natural language
      </p>
    </motion.div>
  );
};

export default SearchInput;
