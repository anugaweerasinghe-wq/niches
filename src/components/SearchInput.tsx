```tsx
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import SearchSuggestions from "./SearchSuggestions";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const quickPrompts = [
  "AI tools for busy founders",
  "faceless wellness content",
  "profitable study channels",
];

const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe the niche you want to explore...",
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const { suggestions, selectedIndex, handleKeyDown, selectSuggestion } =
    useSearchSuggestions(value, handleSelect, showSuggestions);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim() && selectedIndex === -1) {
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
      className="relative mx-auto w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.18 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-3 rounded-[32px] blur-2xl"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--primary) / 0.24), transparent 62%)",
        }}
        animate={{
          opacity: isFocused ? 1 : 0.52,
          scale: isFocused ? 1.02 : 0.98,
        }}
        transition={{ duration: 0.3 }}
      />

      <div
        className={`glass-card relative overflow-visible rounded-[30px] p-3 transition-all duration-300 ${
          isFocused ? "border-primary/30 shadow-glow" : "border-white/8"
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4 rounded-[24px] border border-white/6 bg-black/10 px-4 py-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/12 bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                Explain your niche idea
              </p>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none md:text-lg"
              />
            </div>
          </div>

          <motion.button
            onClick={onSubmit}
            disabled={!value.trim()}
            className="cta-primary min-w-[170px] disabled:cursor-not-allowed disabled:opacity-45"
            whileTap={{ scale: value.trim() ? 0.98 : 1 }}
          >
            <Sparkles className="h-4 w-4" />
            Discover now
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/65">
            Try
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChange(prompt)}
              className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <SearchSuggestions
        suggestions={suggestions}
        isVisible={showSuggestions && suggestions.length > 0}
        onSelect={selectSuggestion}
        selectedIndex={selectedIndex}
      />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Natural language search. Describe what you like and NichePulse will do
        the research.
      </p>
    </motion.div>
  );
};

export default SearchInput;

```
