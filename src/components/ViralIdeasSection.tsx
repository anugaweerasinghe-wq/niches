import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Flame, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import ViralIdeaCard from '@/components/ViralIdeaCard';
import { useViralIdeas } from '@/hooks/useViralIdeas';

const platforms = [
  { id: 'youtube', label: 'YouTube', icon: '▶' },
  { id: 'tiktok', label: 'TikTok', icon: '♪' },
  { id: 'instagram', label: 'Instagram', icon: '◎' },
] as const;

const ViralIdeasSection = () => {
  const [query, setQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('youtube');
  const { ideas, isLoading, error, generate, reset } = useViralIdeas();

  const handleGenerate = () => {
    if (query.trim()) {
      generate(query.trim(), selectedPlatform);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleGenerate();
    }
  };

  const handleReset = () => {
    setQuery('');
    reset();
  };

  return (
    <section className="container mx-auto px-6 py-12 md:py-20">
      {/* Hero Header */}
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Flame className="w-4 h-4" />
          AI-Powered Viral Prediction
        </motion.div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-apple-tight mb-5 text-gradient">
          Find Your Next Viral Video
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto tracking-apple leading-relaxed">
          AI analyzes millions of data points to predict which video ideas will go viral in your niche
        </p>
      </motion.div>

      {/* Search Interface */}
      <motion.div
        className="max-w-2xl mx-auto mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Platform Selector */}
        <div className="flex justify-center gap-2 mb-5">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedPlatform === p.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              <span className="mr-1.5">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="glass-card p-2 flex items-center gap-2">
            <div className="flex-1 relative">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your niche (e.g., fitness tech, cooking tips, crypto)"
                className="w-full bg-transparent pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none text-base tracking-apple"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!query.trim() || isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Ideas
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card-elevated p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted rounded-full" />
                        <div className="h-5 w-20 bg-muted rounded-full" />
                      </div>
                      <div className="h-5 w-3/4 bg-muted rounded-lg" />
                      <div className="flex gap-4">
                        <div className="h-4 w-16 bg-muted rounded" />
                        <div className="h-4 w-20 bg-muted rounded" />
                        <div className="h-4 w-14 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card-elevated p-6 flex items-center gap-4 border-destructive/30">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Something went wrong</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {ideas && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold tracking-apple text-foreground">
                {ideas.length} Viral Ideas Found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ranked by virality probability · Click to expand
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Search
            </button>
          </div>

          {/* Ideas List */}
          <div className="space-y-3">
            {ideas.map((idea, index) => (
              <ViralIdeaCard
                key={idea.id}
                idea={idea}
                index={index}
                rank={index + 1}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!ideas && !isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-4">
            <Sparkles className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Enter your niche above to discover viral video opportunities
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default ViralIdeasSection;
