import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Search, Flame, Sparkles, TrendingUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Logo from '@/components/Logo';
import SearchInput from '@/components/SearchInput';
import PlatformCard from '@/components/PlatformCard';
import StyleCard from '@/components/StyleCard';
import LoadingState from '@/components/LoadingState';
import ScorecardGrid from '@/components/ScorecardGrid';
import OutlierCard from '@/components/OutlierCard';
import VideoCard from '@/components/VideoCard';
import ContentBlueprint from '@/components/ContentBlueprint';
import ThemeToggle from '@/components/ThemeToggle';
import ExportMenu from '@/components/ExportMenu';
import ViralIdeasSection from '@/components/ViralIdeasSection';
import AnimatedBackground from '@/components/AnimatedBackground';
import HeroVisual from '@/components/HeroVisual';
import Footer from '@/components/Footer';
import { useNicheAnalysis } from '@/hooks/useNicheAnalysis';

type Step = 'search' | 'platform' | 'style' | 'loading' | 'results';
type ActiveTab = 'niche' | 'viral';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>('niche');
  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | null>(null);
  const [style, setStyle] = useState<'faceless' | 'persona' | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading, progress, analyze, reset } = useNicheAnalysis();

  useEffect(() => {
    const q = searchParams.get('q');
    const p = searchParams.get('p') as 'youtube' | 'tiktok' | 'instagram' | null;
    const s = searchParams.get('s') as 'faceless' | 'persona' | null;
    if (q && p && s) {
      setQuery(q);
      setPlatform(p);
      setStyle(s);
      setStep('loading');
      analyze(q, p, s);
    }
  }, [searchParams, analyze]);

  const handleSearch = () => { if (query.trim()) setStep('platform'); };
  const handlePlatformSelect = (p: 'youtube' | 'tiktok' | 'instagram') => setPlatform(p);
  const handleStyleSelect = (s: 'faceless' | 'persona') => setStyle(s);

  const handleNext = () => {
    if (step === 'platform' && platform) setStep('style');
    else if (step === 'style' && style) { setStep('loading'); analyze(query, platform!, style); }
  };

  const handleBack = () => {
    if (step === 'platform') setStep('search');
    else if (step === 'style') setStep('platform');
  };

  const handleReset = () => {
    setStep('search'); setQuery(''); setPlatform(null); setStyle(null); reset();
  };

  if (data && step === 'loading') setStep('results');

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 })
  };

  // Dynamic page title based on active tab
  const pageTitle = activeTab === 'niche' ? 'Niche Finder' : 'Viral Idea Generator';
  const pageSubtitle = activeTab === 'niche'
    ? 'AI-powered content niche analysis'
    : 'Data-driven viral video predictions';

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />

      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-background/70 border-b border-border/40">
        <div className="container mx-auto px-6">
          {/* Top row: Logo + Nav + Actions */}
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center bg-muted/40 backdrop-blur-sm rounded-2xl p-1 border border-border/30" aria-label="Main navigation">
              <button
                onClick={() => setActiveTab('niche')}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'niche'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === 'niche' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/50"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Search className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Niche Finder</span>
              </button>
              <button
                onClick={() => setActiveTab('viral')}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === 'viral'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === 'viral' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/50"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Flame className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Viral Ideas</span>
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {/* Mobile Tab Toggle */}
              <div className="md:hidden flex items-center bg-muted/40 backdrop-blur-sm rounded-xl p-1 border border-border/30">
                <button
                  onClick={() => setActiveTab('niche')}
                  className={`relative p-2.5 rounded-lg transition-all ${activeTab === 'niche' ? 'text-foreground' : 'text-muted-foreground'}`}
                  aria-label="Niche Finder"
                >
                  {activeTab === 'niche' && (
                    <motion.div layoutId="mobileTab" className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50" />
                  )}
                  <Search className="w-4 h-4 relative z-10" />
                </button>
                <button
                  onClick={() => setActiveTab('viral')}
                  className={`relative p-2.5 rounded-lg transition-all ${activeTab === 'viral' ? 'text-foreground' : 'text-muted-foreground'}`}
                  aria-label="Viral Ideas"
                >
                  {activeTab === 'viral' && (
                    <motion.div layoutId="mobileTab" className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50" />
                  )}
                  <Flame className="w-4 h-4 relative z-10" />
                </button>
              </div>

              {activeTab === 'niche' && step === 'results' && data && (
                <ExportMenu data={data} dashboardRef={dashboardRef} />
              )}
              
              {activeTab === 'niche' && step !== 'search' && step !== 'loading' && (
                <motion.button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Start Over</span>
                </motion.button>
              )}
              
              <ThemeToggle />
            </div>
          </div>

          {/* Page title bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="pb-4 -mt-1"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold tracking-apple text-foreground">{pageTitle}</h1>
                <span className="hidden sm:inline-block text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border/30">
                  {pageSubtitle}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'viral' ? (
            <motion.div
              key="viral-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ViralIdeasSection />
            </motion.div>
          ) : (
            <motion.div
              key="niche-tab"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait" custom={1}>
                {step === 'search' && (
                  <motion.div
                    key="search"
                    className="container mx-auto px-6 py-12 md:py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 backdrop-blur-sm border border-primary/15 text-primary text-sm font-medium mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        AI-Powered Niche Analysis
                      </motion.div>
                      <motion.h2 
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-apple-tight mb-5 text-gradient leading-[1.1]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        Discover Your Niche
                      </motion.h2>
                      <motion.p 
                        className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto tracking-apple leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Analyze competition, audience demand, and growth potential across YouTube, TikTok & Instagram
                      </motion.p>
                    </div>

                    {/* Animated Hero Visual */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <HeroVisual />
                    </motion.div>

                    <SearchInput value={query} onChange={setQuery} onSubmit={handleSearch} />

                    {/* CTA to Viral Ideas */}
                    <motion.div
                      className="flex justify-center mt-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <button
                        onClick={() => setActiveTab('viral')}
                        className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl hover:bg-card/60 hover:border-primary/30 transition-all duration-300 shadow-lg shadow-background/50"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Flame className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">Viral Video Ideas</p>
                          <p className="text-xs text-muted-foreground">AI-predicted ideas for your next hit</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </motion.div>

                    {/* Trust indicators for GEO */}
                    <motion.div
                      className="flex flex-wrap justify-center gap-6 mt-14 text-xs text-muted-foreground/60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {['YouTube Niche Analysis', 'TikTok Viral Trends', 'Instagram Growth', 'AI-Powered Insights', 'Free Forever'].map((item) => (
                        <span key={item} className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          {item}
                        </span>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {step === 'platform' && (
                  <motion.div key="platform" className="container mx-auto px-6 py-20" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                    <div className="text-center mb-12">
                      <p className="text-sm text-primary mb-3 tracking-widest uppercase">Step 1 of 2</p>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-apple-tight mb-4 text-gradient">Choose Your Platform</h2>
                      <p className="text-muted-foreground tracking-apple">Select the platform you want to create content for</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
                      {(['youtube', 'tiktok', 'instagram'] as const).map((p, i) => (
                        <motion.div key={p} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                          <PlatformCard platform={p} isSelected={platform === p} onClick={() => handlePlatformSelect(p)} />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4">
                      <motion.button onClick={handleBack} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <ArrowLeft className="w-4 h-4" /> Back
                      </motion.button>
                      <motion.button onClick={handleNext} disabled={!platform} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed" whileHover={{ scale: platform ? 1.02 : 1 }} whileTap={{ scale: platform ? 0.98 : 1 }}>
                        Continue <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 'style' && (
                  <motion.div key="style" className="container mx-auto px-6 py-20" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                    <div className="text-center mb-12">
                      <p className="text-sm text-primary mb-3 tracking-widest uppercase">Step 2 of 2</p>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-apple-tight mb-4 text-gradient">Your Content Style</h2>
                      <p className="text-muted-foreground tracking-apple">How do you want to present your content?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
                      {(['faceless', 'persona'] as const).map((s, i) => (
                        <motion.div key={s} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                          <StyleCard style={s} isSelected={style === s} onClick={() => handleStyleSelect(s)} />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4">
                      <motion.button onClick={handleBack} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <ArrowLeft className="w-4 h-4" /> Back
                      </motion.button>
                      <motion.button onClick={handleNext} disabled={!style} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed" whileHover={{ scale: style ? 1.02 : 1 }} whileTap={{ scale: style ? 0.98 : 1 }}>
                        Analyze My Niche <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 'loading' && (
                  <motion.div key="loading" className="container mx-auto px-6 py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LoadingState progress={progress} />
                  </motion.div>
                )}

                {step === 'results' && data && (
                  <motion.div key="results" ref={dashboardRef} className="container mx-auto px-6 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-sm text-primary mb-3 tracking-widest uppercase">Analysis Complete</p>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-apple-tight mb-4 text-gradient">Your Niche Insights</h2>
                      <p className="text-muted-foreground tracking-apple">Based on "{query}" for {platform} with {style} content style</p>
                    </motion.div>
                    <section className="mb-12">
                      <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Niche Scorecard</h3>
                      <ScorecardGrid scorecard={data.scorecard} />
                    </section>
                    <section className="mb-12">
                      <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Outlier Creators</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.outliers.map((creator, index) => (
                          <OutlierCard key={creator.name} creator={creator} index={index} />
                        ))}
                      </div>
                    </section>
                    <section className="mb-12">
                      <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Viral Content Feed</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.viralContent.map((video, index) => (
                          <VideoCard key={video.id} video={video} index={index} />
                        ))}
                      </div>
                    </section>
                    <section>
                      <h3 className="text-xl font-semibold tracking-apple mb-6 text-foreground">Content Blueprint</h3>
                      <ContentBlueprint ideas={data.contentIdeas} hooks={data.viralHooks} />
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
