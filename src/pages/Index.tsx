import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import Logo from '@/components/Logo';
import SearchInput from '@/components/SearchInput';
import PlatformCard from '@/components/PlatformCard';
import StyleCard from '@/components/StyleCard';
import LoadingState from '@/components/LoadingState';
import ScorecardGrid from '@/components/ScorecardGrid';
import OutlierCard from '@/components/OutlierCard';
import VideoCard from '@/components/VideoCard';
import ContentBlueprint from '@/components/ContentBlueprint';
import { useNicheAnalysis } from '@/hooks/useNicheAnalysis';

type Step = 'search' | 'platform' | 'style' | 'loading' | 'results';

const Index = () => {
  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | null>(null);
  const [style, setStyle] = useState<'faceless' | 'persona' | null>(null);
  
  const { data, isLoading, progress, analyze, reset } = useNicheAnalysis();

  const handleSearch = () => {
    if (query.trim()) {
      setStep('platform');
    }
  };

  const handlePlatformSelect = (p: 'youtube' | 'tiktok' | 'instagram') => {
    setPlatform(p);
  };

  const handleStyleSelect = (s: 'faceless' | 'persona') => {
    setStyle(s);
  };

  const handleNext = () => {
    if (step === 'platform' && platform) {
      setStep('style');
    } else if (step === 'style' && style) {
      setStep('loading');
      analyze(query, platform!, style);
    }
  };

  const handleBack = () => {
    if (step === 'platform') {
      setStep('search');
    } else if (step === 'style') {
      setStep('platform');
    }
  };

  const handleReset = () => {
    setStep('search');
    setQuery('');
    setPlatform(null);
    setStyle(null);
    reset();
  };

  // Show results when data is ready
  if (data && step === 'loading') {
    setStep('results');
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          
          {step !== 'search' && step !== 'loading' && (
            <motion.button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <AnimatePresence mode="wait" custom={1}>
          {/* Search Step */}
          {step === 'search' && (
            <motion.div
              key="search"
              className="container mx-auto px-6 py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold tracking-apple-tight mb-6 text-gradient"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Discover Your Niche
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-2xl mx-auto tracking-apple"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  AI-powered analysis to find untapped content opportunities and viral strategies
                </motion.p>
              </div>
              
              <SearchInput
                value={query}
                onChange={setQuery}
                onSubmit={handleSearch}
              />
            </motion.div>
          )}

          {/* Platform Selection */}
          {step === 'platform' && (
            <motion.div
              key="platform"
              className="container mx-auto px-6 py-20"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <motion.p className="text-sm text-primary mb-3 tracking-widest uppercase">
                  Step 1 of 2
                </motion.p>
                <motion.h2 className="text-3xl md:text-4xl font-bold tracking-apple-tight mb-4 text-gradient">
                  Choose Your Platform
                </motion.h2>
                <motion.p className="text-muted-foreground tracking-apple">
                  Select the platform you want to create content for
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
                {(['youtube', 'tiktok', 'instagram'] as const).map((p, i) => (
                  <motion.div
                    key={p}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <PlatformCard
                      platform={p}
                      isSelected={platform === p}
                      onClick={() => handlePlatformSelect(p)}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
                
                <motion.button
                  onClick={handleNext}
                  disabled={!platform}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  whileHover={{ scale: platform ? 1.02 : 1 }}
                  whileTap={{ scale: platform ? 0.98 : 1 }}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Style Selection */}
          {step === 'style' && (
            <motion.div
              key="style"
              className="container mx-auto px-6 py-20"
              variants={slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <motion.p className="text-sm text-primary mb-3 tracking-widest uppercase">
                  Step 2 of 2
                </motion.p>
                <motion.h2 className="text-3xl md:text-4xl font-bold tracking-apple-tight mb-4 text-gradient">
                  Your Content Style
                </motion.h2>
                <motion.p className="text-muted-foreground tracking-apple">
                  How do you want to present your content?
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
                {(['faceless', 'persona'] as const).map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <StyleCard
                      style={s}
                      isSelected={style === s}
                      onClick={() => handleStyleSelect(s)}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
                
                <motion.button
                  onClick={handleNext}
                  disabled={!style}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  whileHover={{ scale: style ? 1.02 : 1 }}
                  whileTap={{ scale: style ? 0.98 : 1 }}
                >
                  Analyze My Niche
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              className="container mx-auto px-6 py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState progress={progress} />
            </motion.div>
          )}

          {/* Results Dashboard */}
          {step === 'results' && data && (
            <motion.div
              key="results"
              className="container mx-auto px-6 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Results Header */}
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-primary mb-3 tracking-widest uppercase">Analysis Complete</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-apple-tight mb-4 text-gradient">
                  Your Niche Insights
                </h2>
                <p className="text-muted-foreground tracking-apple">
                  Based on "{query}" for {platform} with {style} content style
                </p>
              </motion.div>

              {/* Scorecard */}
              <section className="mb-12">
                <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Niche Scorecard</h3>
                <ScorecardGrid scorecard={data.scorecard} />
              </section>

              {/* Outliers */}
              <section className="mb-12">
                <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Outlier Creators</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.outliers.map((creator, index) => (
                    <OutlierCard key={creator.name} creator={creator} index={index} />
                  ))}
                </div>
              </section>

              {/* Viral Content */}
              <section className="mb-12">
                <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Viral Content Feed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.viralContent.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
                  ))}
                </div>
              </section>

              {/* Content Blueprint */}
              <section>
                <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Content Blueprint</h3>
                <ContentBlueprint ideas={data.contentIdeas} hooks={data.viralHooks} />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
