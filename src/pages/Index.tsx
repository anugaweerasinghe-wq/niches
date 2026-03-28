```tsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  Globe,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import MarketPulseTicker from "@/components/MarketPulseTicker";
import ZeigarnikRing from "@/components/ZeigarnikRing";
import Logo from "@/components/Logo";
import SearchInput from "@/components/SearchInput";
import PlatformCard from "@/components/PlatformCard";
import StyleCard from "@/components/StyleCard";
import LoadingState from "@/components/LoadingState";
import ScorecardGrid from "@/components/ScorecardGrid";
import OutlierCard from "@/components/OutlierCard";
import VideoCard from "@/components/VideoCard";
import ContentBlueprint from "@/components/ContentBlueprint";
import ThemeToggle from "@/components/ThemeToggle";
import ExportMenu from "@/components/ExportMenu";
import ViralIdeasSection from "@/components/ViralIdeasSection";
import AnimatedBackground from "@/components/AnimatedBackground";
import HeroVisual from "@/components/HeroVisual";
import Footer from "@/components/Footer";
import { useNicheAnalysis } from "@/hooks/useNicheAnalysis";

type Step = "search" | "platform" | "style" | "loading" | "results";
type ActiveTab = "niche" | "viral";

const heroChips = [
  "YouTube niche analysis",
  "TikTok trend mapping",
  "Instagram content strategy",
  "Virality scoring",
  "Free forever",
];

const statCards = [
  {
    icon: TrendingUp,
    label: "Niche scorecards",
    value: "50+",
    description: "Curated high-potential categories ready to explore",
  },
  {
    icon: Sparkles,
    label: "Viral predictions",
    value: "10x",
    description: "Data-backed video ideas, hooks, and content blueprints",
  },
  {
    icon: Globe,
    label: "Platform coverage",
    value: "3",
    description: "Built for YouTube, TikTok, and Instagram workflows",
  },
];

const stepMotion = {
  enter: (direction: number) => ({ x: direction > 0 ? 240 : -240, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 240 : -240, opacity: 0 }),
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ActiveTab>("niche");
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<
    "youtube" | "tiktok" | "instagram" | null
  >(null);
  const [style, setStyle] = useState<"faceless" | "persona" | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [heroGlow, setHeroGlow] = useState({ x: 36, y: 32 });
  const dashboardRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const { data, progress, analyze, reset } = useNicheAnalysis();

  useEffect(() => {
    const q = searchParams.get("q");
    const p = searchParams.get("p") as
      | "youtube"
      | "tiktok"
      | "instagram"
      | null;
    const s = searchParams.get("s") as "faceless" | "persona" | null;

    if (q && p && s) {
      setQuery(q);
      setPlatform(p);
      setStyle(s);
      setStep("loading");
      analyze(q, p, s);
    }
  }, [searchParams, analyze]);

  useEffect(() => {
    if (data && step === "loading") {
      setStep("results");
    }
  }, [data, step]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 48) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      setStep("platform");
    }
  };

  const handlePlatformSelect = (
    selectedPlatform: "youtube" | "tiktok" | "instagram",
  ) => {
    setPlatform(selectedPlatform);
  };

  const handleStyleSelect = (selectedStyle: "faceless" | "persona") => {
    setStyle(selectedStyle);
  };

  const handleNext = () => {
    if (step === "platform" && platform) {
      setStep("style");
    } else if (step === "style" && style && platform) {
      setStep("loading");
      analyze(query, platform, style);
    }
  };

  const handleBack = () => {
    if (step === "platform") {
      setStep("search");
    } else if (step === "style") {
      setStep("platform");
    }
  };

  const handleReset = () => {
    setStep("search");
    setQuery("");
    setPlatform(null);
    setStyle(null);
    reset();
  };

  const handleHeroMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;

    const bounds = heroRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setHeroGlow({ x, y });
  };

  const pageTitle =
    activeTab === "niche" ? "Niche Finder" : "Viral Idea Generator";
  const pageSubtitle =
    activeTab === "niche"
      ? "Premium AI-powered niche intelligence"
      : "Data-backed viral video prediction engine";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AnimatedBackground />

      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4"
        animate={{
          y: isHeaderVisible ? 0 : -120,
          opacity: isHeaderVisible ? 1 : 0.9,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="mx-auto mt-3 max-w-[1440px] rounded-[28px] border border-white/5 bg-background/65 px-4 shadow-panel backdrop-blur-2xl sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Logo />
            </div>

            <nav
              className="hidden items-center rounded-2xl border border-white/6 bg-white/[0.03] p-1 md:flex"
              aria-label="Main navigation"
            >
              {[
                { id: "niche" as const, icon: Search, label: "Niche Finder" },
                { id: "viral" as const, icon: Flame, label: "Viral Ideas" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-desktop-tab"
                      className="absolute inset-0 rounded-[14px] border border-primary/20 bg-white/[0.04] shadow-[0_10px_30px_hsl(var(--primary)/0.12)]"
                      transition={{
                        type: "spring",
                        bounce: 0.12,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <tab.icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:block">
                <StatusBadge />
              </div>
              <div className="hidden xl:block">
                <MarketPulseTicker />
              </div>
              <div className="hidden sm:block">
                <ZeigarnikRing />
              </div>

              <div className="flex items-center rounded-2xl border border-white/6 bg-white/[0.03] p-1 md:hidden">
                {[
                  { id: "niche" as const, icon: Search, label: "Niche Finder" },
                  { id: "viral" as const, icon: Flame, label: "Viral Ideas" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative rounded-xl p-2.5 transition-all ${
                      activeTab === tab.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    aria-label={tab.label}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="active-mobile-tab"
                        className="absolute inset-0 rounded-xl border border-primary/20 bg-white/[0.05]"
                      />
                    )}
                    <tab.icon className="relative z-10 h-4 w-4" />
                  </button>
                ))}
              </div>

              {activeTab === "niche" && step === "results" && data && (
                <ExportMenu data={data} dashboardRef={dashboardRef} />
              )}

              {activeTab === "niche" &&
                step !== "search" &&
                step !== "loading" && (
                  <motion.button
                    onClick={handleReset}
                    className="hidden items-center gap-2 rounded-2xl border border-white/6 bg-white/[0.03] px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start over
                  </motion.button>
                )}

              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="pb-16 pt-24 sm:pt-28" id="main-content">
        <AnimatePresence mode="wait">
          {activeTab === "viral" ? (
            <motion.div
              key="viral-tab"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mb-8 px-6">
                <div className="rounded-[28px] border border-white/6 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
                  <p className="text-sm font-medium text-foreground">
                    {pageTitle}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pageSubtitle}
                  </p>
                </div>
              </div>
              <ViralIdeasSection />
            </motion.div>
          ) : (
            <motion.div
              key="niche-tab"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait" custom={1}>
                {step === "search" && (
                  <motion.section
                    key="search"
                    className="container px-6 pb-10 pt-4 md:pt-8"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45 }}
                    aria-label="Niche search"
                  >
                    <div
                      ref={heroRef}
                      onMouseMove={handleHeroMove}
                      className="relative overflow-hidden rounded-[36px] border border-white/6 bg-aurora px-5 py-10 shadow-panel sm:px-8 md:px-10 md:py-12 lg:px-12 lg:py-14"
                    >
                      <div
                        className="hero-glow hidden md:block"
                        style={{
                          left: `${heroGlow.x}%`,
                          top: `${heroGlow.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.18] animate-grid-pan" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <div className="max-w-3xl">
                          <motion.div
                            className="section-label mb-6"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                          >
                            <Zap className="h-3.5 w-3.5" />
                            AI-powered niche intelligence
                          </motion.div>

                          <motion.h1
                            className="max-w-4xl text-5xl font-black leading-[0.92] tracking-apple-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[5.4rem]"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                          >
                            Find the content niche that can
                            <span className="text-gradient block pb-1">
                              actually break through.
                            </span>
                          </motion.h1>

                          <motion.p
                            className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18 }}
                          >
                            Analyze competition, demand, creator momentum, and
                            monetization signals across YouTube, TikTok, and
                            Instagram before you commit to your next niche.
                          </motion.p>

                          <motion.div
                            className="mt-8 flex flex-wrap gap-2.5"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.24 }}
                          >
                            {heroChips.map((chip) => (
                              <span
                                key={chip}
                                className="rounded-full border border-white/8 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl"
                              >
                                {chip}
                              </span>
                            ))}
                          </motion.div>

                          <div className="mt-10">
                            <SearchInput
                              value={query}
                              onChange={setQuery}
                              onSubmit={handleSearch}
                            />
                          </div>

                          <motion.div
                            className="mt-7 flex flex-col gap-3 sm:flex-row"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveTab("viral")}
                              className="cta-primary"
                            >
                              <Flame className="h-4 w-4" />
                              Try viral idea generator
                            </button>
                            <Link to="/wiki" className="cta-secondary">
                              <Globe className="h-4 w-4" />
                              Explore creator wiki
                            </Link>
                          </motion.div>
                        </div>

                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.22 }}
                        >
                          <div className="glass-premium panel-outline noise-overlay relative overflow-hidden rounded-[32px] p-5 md:p-6">
                            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                            <div className="mb-5 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                  Live intelligence snapshot
                                </p>
                                <h2 className="mt-2 text-2xl font-bold tracking-apple-tight text-foreground">
                                  Premium creator workflow.
                                </h2>
                              </div>
                              <div className="spotlight-ring flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Sparkles className="h-5 w-5" />
                              </div>
                            </div>

                            <HeroVisual />

                            <div className="mt-6 space-y-3">
                              {[
                                "Score market saturation before you publish",
                                "Find the gap between creator demand and supply",
                                "Generate hooks and blueprint ideas instantly",
                              ].map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3"
                                >
                                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                                  <span className="text-sm text-muted-foreground">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-3">
                      {statCards.map((card, index) => (
                        <motion.div
                          key={card.label}
                          className="glass-card rounded-[28px] p-5"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.18 + index * 0.08 }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {card.label}
                              </p>
                              <p className="mt-3 text-4xl font-black tracking-apple-tight text-foreground">
                                {card.value}
                              </p>
                              <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">
                                {card.description}
                              </p>
                            </div>
                            <div className="rounded-2xl border border-primary/14 bg-primary/10 p-3 text-primary">
                              <card.icon className="h-5 w-5" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {step === "platform" && (
                  <motion.section
                    key="platform"
                    className="container px-6 py-16 md:py-20"
                    variants={stepMotion}
                    custom={1}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    aria-label="Platform selection"
                  >
                    <div className="mx-auto max-w-5xl rounded-[32px] border border-white/6 bg-white/[0.03] p-6 backdrop-blur-2xl md:p-8">
                      <div className="mb-12 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                          Step 1 of 2
                        </p>
                        <h2 className="mt-4 text-4xl font-black tracking-apple-tight text-foreground md:text-5xl">
                          Choose your main platform
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                          Pick the platform you want to win on first. The
                          analysis and recommendations will adapt to its format
                          and audience behaviour.
                        </p>
                      </div>

                      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
                        {(["youtube", "tiktok", "instagram"] as const).map(
                          (item, index) => (
                            <motion.div
                              key={item}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                            >
                              <PlatformCard
                                platform={item}
                                isSelected={platform === item}
                                onClick={() => handlePlatformSelect(item)}
                              />
                            </motion.div>
                          ),
                        )}
                      </div>

                      <div className="flex justify-center gap-4">
                        <motion.button
                          onClick={handleBack}
                          className="cta-secondary"
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </motion.button>
                        <motion.button
                          onClick={handleNext}
                          disabled={!platform}
                          className="cta-primary disabled:cursor-not-allowed disabled:opacity-40"
                          whileTap={{ scale: platform ? 0.98 : 1 }}
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.section>
                )}

                {step === "style" && (
                  <motion.section
                    key="style"
                    className="container px-6 py-16 md:py-20"
                    variants={stepMotion}
                    custom={1}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    aria-label="Style selection"
                  >
                    <div className="mx-auto max-w-5xl rounded-[32px] border border-white/6 bg-white/[0.03] p-6 backdrop-blur-2xl md:p-8">
                      <div className="mb-12 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                          Step 2 of 2
                        </p>
                        <h2 className="mt-4 text-4xl font-black tracking-apple-tight text-foreground md:text-5xl">
                          Pick your content style
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                          Tell NichePulse whether you want a faceless AI-first
                          brand or a creator-led persona strategy.
                        </p>
                      </div>

                      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
                        {(["faceless", "persona"] as const).map(
                          (item, index) => (
                            <motion.div
                              key={item}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                            >
                              <StyleCard
                                style={item}
                                isSelected={style === item}
                                onClick={() => handleStyleSelect(item)}
                              />
                            </motion.div>
                          ),
                        )}
                      </div>

                      <div className="flex justify-center gap-4">
                        <motion.button
                          onClick={handleBack}
                          className="cta-secondary"
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </motion.button>
                        <motion.button
                          onClick={handleNext}
                          disabled={!style}
                          className="cta-primary disabled:cursor-not-allowed disabled:opacity-40"
                          whileTap={{ scale: style ? 0.98 : 1 }}
                        >
                          Analyze my niche
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.section>
                )}

                {step === "loading" && (
                  <motion.div
                    key="loading"
                    className="container px-6 py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingState progress={progress} />
                  </motion.div>
                )}

                {step === "results" && data && (
                  <motion.div
                    key="results"
                    ref={dashboardRef}
                    className="container px-6 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, staggerChildren: 0.08 }}
                  >
                    <motion.div
                      className="mb-14 rounded-[32px] border border-white/6 bg-white/[0.03] px-6 py-8 text-center backdrop-blur-2xl md:px-8 md:py-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="section-label mb-5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Analysis complete
                      </div>
                      <h2 className="text-3xl font-black tracking-apple-tight text-foreground md:text-5xl">
                        Your niche intelligence dashboard
                      </h2>
                      <p className="mx-auto mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
                        Built for{" "}
                        <span className="font-medium text-foreground">
                          {query}
                        </span>{" "}
                        on{" "}
                        <span className="font-medium capitalize text-foreground">
                          {platform}
                        </span>{" "}
                        with a{" "}
                        <span className="font-medium text-foreground">
                          {style}
                        </span>{" "}
                        content approach.
                      </p>
                    </motion.div>

                    <section className="mb-14" aria-label="Niche scorecard">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <Zap className="h-4 w-4" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-apple text-foreground">
                          Niche scorecard
                        </h3>
                      </div>
                      <ScorecardGrid scorecard={data.scorecard} />
                    </section>

                    <section className="mb-14" aria-label="Outlier creators">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-apple text-foreground">
                          Outlier creators
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {data.outliers.map((creator, index) => (
                          <OutlierCard
                            key={creator.name}
                            creator={creator}
                            index={index}
                          />
                        ))}
                      </div>
                    </section>

                    <section className="mb-14" aria-label="Viral content feed">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <Globe className="h-4 w-4" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-apple text-foreground">
                          Viral content feed
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {data.viralContent.map((video, index) => (
                          <VideoCard
                            key={video.id}
                            video={video}
                            index={index}
                          />
                        ))}
                      </div>
                    </section>

                    <section aria-label="Content blueprint">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <Flame className="h-4 w-4" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-apple text-foreground">
                          Content blueprint
                        </h3>
                      </div>
                      <ContentBlueprint
                        ideas={data.contentIdeas}
                        hooks={data.viralHooks}
                      />
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

```
