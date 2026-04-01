import { useEffect, useRef, useState, type MouseEvent } from "react";
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
  "Demand before saturation",
  "Platform-specific insight",
  "Hook and blueprint generation",
  "Creator momentum scoring",
  "Free forever",
];

const workflowPoints = [
  "Score niche opportunity before you invest time creating.",
  "Map demand, competition, and creator momentum in one pass.",
  "Turn analysis into hooks, formats, and a usable content blueprint.",
];

const statCards = [
  {
    icon: TrendingUp,
    label: "Opportunity mapping",
    value: "50+",
    description: "High-upside niche scorecards and breakout angles to explore.",
  },
  {
    icon: Sparkles,
    label: "Viral idea engine",
    value: "10x",
    description: "Hooks, content directions, and creative prompts backed by signals.",
  },
  {
    icon: Globe,
    label: "Platform coverage",
    value: "3",
    description: "Built for YouTube, TikTok, and Instagram workflows.",
  },
];

const platformNotes = [
  "YouTube rewards stronger topic depth, thumbnails, and watch-time compounding.",
  "TikTok prioritizes velocity, loop potential, and immediate curiosity.",
  "Instagram benefits from visual identity, packaging, and repeatable content systems.",
];

const styleNotes = [
  "Faceless fits leverage, automation, and scalable volume.",
  "Persona-led fits trust, authority, and stronger audience attachment.",
];

const topTabs = [
  { id: "niche" as const, icon: Search, label: "Niche Finder" },
  { id: "viral" as const, icon: Flame, label: "Viral Ideas" },
];

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_20px_50px_hsl(var(--primary)/0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_hsl(var(--primary)/0.28)]";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]";

const formatPlatform = (value: "youtube" | "tiktok" | "instagram" | null) => {
  if (!value) return "";
  if (value === "youtube") return "YouTube";
  if (value === "tiktok") return "TikTok";
  return "Instagram";
};

const formatStyle = (value: "faceless" | "persona" | null) => {
  if (!value) return "";
  return value === "faceless" ? "Faceless AI-first" : "Creator-led persona";
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
  const [heroGlow, setHeroGlow] = useState({ x: 28, y: 26 });

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
      return;
    }

    if (step === "style" && style && platform) {
      setStep("loading");
      analyze(query, platform, style);
    }
  };

  const handleBack = () => {
    if (step === "platform") {
      setStep("search");
      return;
    }

    if (step === "style") {
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

  const handleHeroMove = (event: MouseEvent<HTMLDivElement>) => {
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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBackground />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,242,255,0.08),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(120,80,255,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.6)_0.6px,transparent_0.6px)] [background-size:24px_24px]" />

      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4"
        animate={{
          y: isHeaderVisible ? 0 : -120,
          opacity: isHeaderVisible ? 1 : 0.96,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="mx-auto mt-3 max-w-[1480px] rounded-[28px] border border-white/8 bg-background/65 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Logo />
            </div>

            <nav
              className="hidden items-center rounded-2xl border border-white/8 bg-white/[0.035] p-1 md:flex"
              aria-label="Main navigation"
            >
              {topTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={
                      isActive
                        ? "relative flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium text-foreground"
                        : "relative flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground"
                    }
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-desktop-tab"
                        className="absolute inset-0 rounded-[14px] border border-primary/25 bg-white/[0.05] shadow-[0_10px_40px_hsl(var(--primary)/0.16)]"
                        transition={{ type: "spring", bounce: 0.12, duration: 0.5 }}
                      />
                    )}
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
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

              <div className="flex items-center rounded-2xl border border-white/8 bg-white/[0.03] p-1 md:hidden">
                {topTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={
                        isActive
                          ? "relative rounded-xl p-2.5 text-foreground"
                          : "relative rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground"
                      }
                      aria-label={tab.label}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-mobile-tab"
                          className="absolute inset-0 rounded-xl border border-primary/20 bg-white/[0.05]"
                        />
                      )}
                      <Icon className="relative z-10 h-4 w-4" />
                    </button>
                  );
                })}
              </div>

              {activeTab === "niche" && step === "results" && data && (
                <ExportMenu data={data} dashboardRef={dashboardRef} />
              )}

              {activeTab === "niche" &&
                step !== "search" &&
                step !== "loading" && (
                  <motion.button
                    onClick={handleReset}
                    className="hidden items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground sm:inline-flex"
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

      <main className="relative z-10 pb-16 pt-24 sm:pt-28" id="main-content">
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
                <div className="rounded-[28px] border border-white/8 bg-white/[0.035] px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
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
              <AnimatePresence mode="wait">
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
                      className="relative overflow-hidden rounded-[38px] border border-white/8 bg-[#050816]/90 px-5 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:px-8 md:px-10 md:py-10 lg:px-12 lg:py-12"
                    >
                      <div
                        className="pointer-events-none absolute inset-0 opacity-90"
                        style={{
                          background: `
                            radial-gradient(circle at ${heroGlow.x}% ${heroGlow.y}%, rgba(31, 224, 255, 0.14), transparent 20%),
                            radial-gradient(circle at 84% 10%, rgba(123, 92, 255, 0.12), transparent 22%),
                            linear-gradient(135deg, rgba(8,14,30,0.98), rgba(5,7,16,0.96) 45%, rgba(8,10,24,0.98))
                          `,
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)] opacity-40" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <div className="max-w-4xl">
                          <motion.div
                            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                          >
                            <Zap className="h-3.5 w-3.5" />
                            AI-powered niche intelligence
                          </motion.div>

                          <motion.h1
                            className="mt-6 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                          >
                            Find the content niche that can
                            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-primary to-violet-300 bg-clip-text pb-1 text-transparent">
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
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl"
                              >
                                {chip}
                              </span>
                            ))}
                          </motion.div>

                          <motion.div
                            className="mt-10 rounded-[30px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-5"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.28 }}
                          >
                            <SearchInput
                              value={query}
                              onChange={setQuery}
                              onSubmit={handleSearch}
                            />

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                              <button
                                type="button"
                                onClick={() => setActiveTab("viral")}
                                className={primaryButton}
                              >
                                <Flame className="h-4 w-4" />
                                Try viral idea generator
                              </button>

                              <Link to="/wiki" className={secondaryButton}>
                                <Globe className="h-4 w-4" />
                                Explore creator wiki
                              </Link>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                Opportunity scoring
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                Format-aware recommendations
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                Fast creator workflow
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        <motion.div
                          className="relative"
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.3)] backdrop-blur-2xl md:p-6">
                            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                            <div className="mb-5 flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                  Live intelligence snapshot
                                </p>
                                <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-foreground">
                                  Premium creator workflow.
                                </h2>
                              </div>

                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-[0_12px_32px_hsl(var(--primary)/0.16)]">
                                <Sparkles className="h-5 w-5" />
                              </div>
                            </div>

                            <div className="rounded-[28px] border border-white/8 bg-black/20 p-4">
                              <HeroVisual />
                            </div>

                            <div className="mt-6 space-y-3">
                              {workflowPoints.map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                                >
                                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                                  <span className="text-sm text-muted-foreground">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                              {statCards.map((card) => {
                                const Icon = card.icon;

                                return (
                                  <div
                                    key={card.label}
                                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                                  >
                                    <div className="flex items-center gap-2 text-primary">
                                      <Icon className="h-4 w-4" />
                                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
                                        {card.label}
                                      </span>
                                    </div>
                                    <div className="mt-3 text-2xl font-bold tracking-[-0.04em] text-foreground">
                                      {card.value}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-3">
                      {statCards.map((card, index) => {
                        const Icon = card.icon;

                        return (
                          <motion.div
                            key={card.label}
                            className="overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * index + 0.22 }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="text-right text-xs uppercase tracking-[0.24em] text-primary/80">
                                Signature metric
                              </div>
                            </div>

                            <div className="mt-6 text-sm font-medium text-muted-foreground">
                              {card.label}
                            </div>
                            <div className="mt-2 text-4xl font-black tracking-[-0.05em] text-foreground">
                              {card.value}
                            </div>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                              {card.description}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>

                    <motion.div
                      className="mt-4 overflow-hidden rounded-[30px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur-2xl md:p-6"
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.34 }}
                    >
                      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            Why this matters
                          </div>
                          <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-foreground md:text-3xl">
                            Better positioning beats prettier content.
                          </h3>
                          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                            NichePulse is built to help you choose smarter before
                            you spend hours producing. The goal is not random
                            inspiration. It is cleaner positioning, stronger
                            demand alignment, and more intelligent content bets.
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            "Demand vs supply gaps",
                            "Monetization potential",
                            "Repeatable format viability",
                          ].map((item) => (
                            <div
                              key={item}
                              className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-muted-foreground"
                            >
                              <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-primary/80 to-cyan-300/70" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.section>
                )}

                {step === "platform" && (
                  <motion.section
                    key="platform"
                    className="container px-6 py-8"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    aria-label="Choose platform"
                  >
                    <div className="mx-auto max-w-6xl overflow-hidden rounded-[34px] border border-white/8 bg-white/[0.035] shadow-[0_36px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="p-6 md:p-8 lg:p-10">
                          <div className="mb-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                              Step 1 of 2
                            </p>
                            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
                              Choose your main platform
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                              Pick the platform you want to win on first. The
                              analysis and recommendations will adapt to its
                              format and audience behavior.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

                          <div className="mt-10 flex flex-wrap justify-center gap-4 xl:justify-start">
                            <motion.button
                              onClick={handleBack}
                              className={secondaryButton}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Back
                            </motion.button>

                            <motion.button
                              onClick={handleNext}
                              disabled={!platform}
                              className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0`}
                              whileTap={{ scale: platform ? 0.98 : 1 }}
                            >
                              Continue
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>

                        <div className="border-t border-white/8 bg-black/20 p-6 xl:border-l xl:border-t-0 xl:p-8">
                          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                              <Globe className="h-3.5 w-3.5" />
                              Platform intelligence
                            </div>

                            <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-foreground">
                              Start where the format works for you.
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                              Your first platform should match how you want to
                              create, what kind of content system you can sustain,
                              and how fast you want feedback from the market.
                            </p>

                            <div className="mt-6 space-y-3">
                              {platformNotes.map((item) => (
                                <div
                                  key={item}
                                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/10 p-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Current niche
                              </p>
                              <p className="mt-2 text-lg font-semibold text-foreground">
                                {query || "No niche entered yet"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {step === "style" && (
                  <motion.section
                    key="style"
                    className="container px-6 py-8"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35 }}
                    aria-label="Choose style"
                  >
                    <div className="mx-auto max-w-6xl overflow-hidden rounded-[34px] border border-white/8 bg-white/[0.035] shadow-[0_36px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="p-6 md:p-8 lg:p-10">
                          <div className="mb-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                              Step 2 of 2
                            </p>
                            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
                              Pick your content style
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                              Tell NichePulse whether you want a faceless
                              AI-first brand or a creator-led persona strategy.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                          <div className="mt-10 flex flex-wrap justify-center gap-4 xl:justify-start">
                            <motion.button
                              onClick={handleBack}
                              className={secondaryButton}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ArrowLeft className="h-4 w-4" />
                              Back
                            </motion.button>

                            <motion.button
                              onClick={handleNext}
                              disabled={!style}
                              className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0`}
                              whileTap={{ scale: style ? 0.98 : 1 }}
                            >
                              Analyze my niche
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>

                        <div className="border-t border-white/8 bg-black/20 p-6 xl:border-l xl:border-t-0 xl:p-8">
                          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                              <Sparkles className="h-3.5 w-3.5" />
                              Style positioning
                            </div>

                            <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-foreground">
                              Pick the engine behind your growth model.
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                              This choice changes tone, workflow, content format,
                              trust strategy, and how scalable the brand becomes
                              over time.
                            </p>

                            <div className="mt-6 space-y-3">
                              {styleNotes.map((item) => (
                                <div
                                  key={item}
                                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                                  Platform
                                </p>
                                <p className="mt-2 text-lg font-semibold text-foreground">
                                  {formatPlatform(platform) || "Not selected"}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                                  Niche
                                </p>
                                <p className="mt-2 text-lg font-semibold text-foreground">
                                  {query || "Not entered"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
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
                    <div className="mx-auto max-w-5xl rounded-[34px] border border-white/8 bg-white/[0.035] p-6 shadow-[0_36px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-8">
                      <LoadingState progress={progress} />
                    </div>
                  </motion.div>
                )}

                {step === "results" && data && (
                  <motion.div
                    key="results"
                    ref={dashboardRef}
                    className="container px-6 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="mb-14 overflow-hidden rounded-[34px] border border-white/8 bg-white/[0.04] px-6 py-8 text-center shadow-[0_36px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:px-8 md:py-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        Analysis complete
                      </div>

                      <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
                        Your niche intelligence dashboard
                      </h2>

                      <p className="mx-auto mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
                        Built for{" "}
                        <span className="font-medium text-foreground">
                          {query}
                        </span>{" "}
                        on{" "}
                        <span className="font-medium text-foreground">
                          {formatPlatform(platform)}
                        </span>{" "}
                        using a{" "}
                        <span className="font-medium text-foreground">
                          {formatStyle(style)}
                        </span>{" "}
                        approach.
                      </p>

                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-muted-foreground">
                          {formatPlatform(platform)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-muted-foreground">
                          {formatStyle(style)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-muted-foreground">
                          Strategy-ready output
                        </span>
                      </div>
                    </motion.div>

                    <motion.section
                      className="mb-14"
                      aria-label="Niche scorecard"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 }}
                    >
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                            Niche scorecard
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Core viability signals for this niche direction.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/8 bg-white/[0.035] p-4 backdrop-blur-2xl md:p-5">
                        <ScorecardGrid scorecard={data.scorecard} />
                      </div>
                    </motion.section>

                    <motion.section
                      className="mb-14"
                      aria-label="Outlier creators"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 }}
                    >
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                            Outlier creators
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Accounts already proving traction in this space.
                          </p>
                        </div>
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
                    </motion.section>

                    <motion.section
                      className="mb-14"
                      aria-label="Viral content feed"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 }}
                    >
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                            Viral content feed
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            High-performing content patterns worth studying.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {data.viralContent.map((video, index) => (
                          <VideoCard key={video.id} video={video} index={index} />
                        ))}
                      </div>
                    </motion.section>

                    <motion.section
                      aria-label="Content blueprint"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16 }}
                    >
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <Flame className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                            Content blueprint
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Hooks and ideas you can actually build from next.
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/8 bg-white/[0.035] p-4 backdrop-blur-2xl md:p-5">
                        <ContentBlueprint
                          ideas={data.contentIdeas}
                          hooks={data.viralHooks}
                        />
                      </div>
                    </motion.section>
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
