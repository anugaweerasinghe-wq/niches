import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Search, Flame, Sparkles, TrendingUp, Zap } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useSearchParams, Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import SearchInput from '@/components/SearchInput';
import PlatformCard from '@/components/PlatformCard';
import StyleCard from '@/components/StyleCard';
import LoadingState from '@/components/LoadingState';
import ScorecardGrid from '@/components/ScorecardGrid';
import ContentBlueprint from '@/components/ContentBlueprint';
import SEOHead from '@/components/SEOHead';
import { nicheDatabase } from '@/data/niches';
import EmailCapture from '@/components/EmailCapture';
import ThemeToggle from '@/components/ThemeToggle';
import ExportMenu from '@/components/ExportMenu';
import ViralIdeasSection from '@/components/ViralIdeasSection';
import AnimatedBackground from '@/components/AnimatedBackground';
import HeroVisual from '@/components/HeroVisual';
import Footer from '@/components/Footer';
import { useNicheAnalysis } from '@/hooks/useNicheAnalysis';
import { useEffect } from 'react';

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
      setQuery(q); setPlatform(p); setStyle(s);
      setStep('loading'); analyze(q, p, s);
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
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 300 : -300, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />

      {/* Premium Frosted Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop Tab Navigation */}
            <nav className="hidden md:flex items-center bg-muted/20 backdrop-blur-2xl rounded-2xl p-1 border border-border/15" aria-label="Main navigation">
              {[
                { id: 'niche' as const, icon: Search, label: 'Niche Finder' },
                { id: 'viral' as const, icon: Flame, label: 'Viral Ideas' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-background/80 rounded-xl shadow-sm border border-border/30"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <tab.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden lg:block">
                <StatusBadge />
              </div>

              {/* Mobile Tab Toggle */}
              <div className="md:hidden flex items-center bg-muted/20 backdrop-blur-2xl rounded-xl p-1 border border-border/15">
                {[
                  { id: 'niche' as const, icon: Search, label: 'Niche Finder' },
                  { id: 'viral' as const, icon: Flame, label: 'Viral Ideas' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative p-2.5 rounded-lg transition-all ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}
                    aria-label={tab.label}
                  >
                    {activeTab === tab.id && (
                      <motion.div layoutId="mobileTab" className="absolute inset-0 bg-background/80 rounded-lg shadow-sm border border-border/30" />
                    )}
                    <tab.icon className="w-4 h-4 relative z-10" />
                  </button>
                ))}
              </div>

              {activeTab === 'niche' && step === 'results' && data && (
                <ExportMenu data={data} dashboardRef={dashboardRef} />
              )}
              
              {activeTab === 'niche' && step !== 'search' && step !== 'loading' && (
                <motion.button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Start Over</span>
                </motion.button>
              )}
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20" id="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'viral' ? (
            <motion.div
              key="viral-tab"
              id="viral-ideas"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ViralIdeasSection />
            </motion.div>
          ) : (
            <motion.div
              key="niche-tab"
              id="niche-finder"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <AnimatePresence mode="wait" custom={1}>
                {step === 'search' && (
                  <motion.section
                    key="search"
                    className="container mx-auto px-6 pt-12 pb-8 md:pt-20 md:pb-14"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    aria-label="Niche search"
                  >
                    {/* Hero */}
                    <div className="text-center mb-10">
                      <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/6 backdrop-blur-sm border border-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        AI-Powered Niche Intelligence
                      </motion.div>

                      <motion.h1 
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-apple-tight mb-6 text-gradient leading-[1.05]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        Find Your
                        <br className="hidden sm:block" />
                        <span className="text-gradient-horizontal"> Perfect Niche</span>
                      </motion.h1>

                      <motion.p 
                        className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto tracking-apple leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Analyze competition, audience demand, and growth potential across YouTube, TikTok & Instagram
                      </motion.p>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                      <HeroVisual />
                    </motion.div>

                    <SearchInput value={query} onChange={setQuery} onSubmit={handleSearch} />

                    {/* CTA to Viral Ideas */}
                    <motion.div
                      className="flex justify-center mt-14"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <button
                        onClick={() => setActiveTab('viral')}
                        className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-border/30 bg-card/20 backdrop-blur-2xl hover:bg-card/40 hover:border-primary/20 transition-all duration-500 shadow-lg shadow-background/30"
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/8 group-hover:bg-primary/15 transition-colors">
                          <Flame className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground tracking-apple">Viral Video Ideas</p>
                          <p className="text-xs text-muted-foreground">AI-predicted ideas for your next hit</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                      className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16 text-xs text-muted-foreground/40"
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
                  </motion.section>
                )}

                {step === 'platform' && (
                  <motion.section key="platform" className="container mx-auto px-6 py-20 md:py-28" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} aria-label="Platform selection">
                    <div className="text-center mb-14">
                      <p className="text-xs text-primary mb-4 tracking-widest uppercase font-semibold">Step 1 of 2</p>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-apple-tight mb-5 text-gradient">Choose Your Platform</h2>
                      <p className="text-muted-foreground tracking-apple text-base">Select the platform you want to create content for</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-14">
                      {(['youtube', 'tiktok', 'instagram'] as const).map((p, i) => (
                        <motion.div key={p} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                          <PlatformCard platform={p} isSelected={platform === p} onClick={() => handlePlatformSelect(p)} />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4">
                      <motion.button onClick={handleBack} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <ArrowLeft className="w-4 h-4" /> Back
                      </motion.button>
                      <motion.button onClick={handleNext} disabled={!platform} className="flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" whileHover={{ scale: platform ? 1.02 : 1 }} whileTap={{ scale: platform ? 0.98 : 1 }}>
                        Continue <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.section>
                )}

                {step === 'style' && (
                  <motion.section key="style" className="container mx-auto px-6 py-20 md:py-28" variants={slideVariants} custom={1} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} aria-label="Style selection">
                    <div className="text-center mb-14">
                      <p className="text-xs text-primary mb-4 tracking-widest uppercase font-semibold">Step 2 of 2</p>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-apple-tight mb-5 text-gradient">Your Content Style</h2>
                      <p className="text-muted-foreground tracking-apple text-base">How do you want to present your content?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-14">
                      {(['faceless', 'persona'] as const).map((s, i) => (
                        <motion.div key={s} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                          <StyleCard style={s} isSelected={style === s} onClick={() => handleStyleSelect(s)} />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4">
                      <motion.button onClick={handleBack} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60 transition-all duration-300" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <ArrowLeft className="w-4 h-4" /> Back
                      </motion.button>
                      <motion.button onClick={handleNext} disabled={!style} className="flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" whileHover={{ scale: style ? 1.02 : 1 }} whileTap={{ scale: style ? 0.98 : 1 }}>
                        Analyze My Niche <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.section>
                )}

                {step === 'loading' && (
                  <motion.div key="loading" className="container mx-auto px-6 py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LoadingState progress={progress} />
                  </motion.div>
                )}

                {step === 'results' && data && (
                  <motion.div key="results" ref={dashboardRef} className="container mx-auto px-6 py-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/6 backdrop-blur-sm border border-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        Analysis Complete
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-apple-tight mb-5 text-gradient">Your Niche Insights</h2>
                      <p className="text-base text-muted-foreground tracking-apple">Based on "<span className="text-foreground font-medium">{query}</span>" for <span className="text-foreground font-medium capitalize">{platform}</span> · {style} content</p>
                    </motion.div>

                    <section className="mb-16" aria-label="Niche scorecard">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-primary/8 border border-primary/10">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-apple text-foreground">Niche Scorecard</h3>
                      </div>
                      <ScorecardGrid scorecard={data.scorecard} />
                    </section>

                    <section aria-label="Content blueprint">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-primary/8 border border-primary/10">
                          <Flame className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-apple text-foreground">Content Blueprint</h3>
                      </div>
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
