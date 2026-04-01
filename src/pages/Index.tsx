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
import Footer from "@/components/Footer";
import { useNicheAnalysis } from "@/hooks/useNicheAnalysis";

type Step = "search" | "platform" | "style" | "loading" | "results";
type ActiveTab = "niche" | "viral";

const topTabs = [
  { id: "niche" as const, icon: Search, label: "Niche Finder" },
  { id: "viral" as const, icon: Flame, label: "Viral Ideas" },
];

const heroChips = [
  "Demand mapping",
  "Competition analysis",
  "Creator momentum",
  "Virality scoring",
  "Free forever",
];

const statCards = [
  {
    icon: TrendingUp,
    label: "Opportunity clarity",
    value: "Sharper",
    description:
      "Find niches with demand, monetization potential, and room to win.",
  },
  {
    icon: Sparkles,
    label: "Creator leverage",
    value: "Faster",
    description:
      "Turn research into formats, hooks, and blueprints without guessing.",
  },
  {
    icon: Globe,
    label: "Platform fit",
    value: "3X",
    description:
      "Adapt the strategy to YouTube, TikTok, and Instagram from the start.",
  },
];

const platformNotes = [
  "YouTube favors stronger topic depth, packaging, and watch-time compounding.",
  "TikTok rewards speed, immediacy, loop value, and sharp curiosity triggers.",
  "Instagram benefits from branding, repeatable formats, and visual clarity.",
];

const styleNotes = [
  "Faceless works best for scalable volume, leverage, and AI-assisted production.",
  "Persona-led works best for trust, authority, and stronger audience connection.",
];

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_55px_hsl(var(--primary)/0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_65px_hsl(var(--primary)/0.28)]";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]";

const panelClass =
  "rounded-[30px] border border-white/8 bg-white/[0.035] shadow-[0_28px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl";

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
  const [heroGlow, setHeroGlow] = useState({ x: 50, y: 18 });

  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
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

      if (currentScrollY < 40) {
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
    if (!query.trim()) return;
    setStep("platform");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      ? "AI-powered niche intelligence"
      : "Data-backed viral content engine";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBackground />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,214,0.08),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(119,93,255,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />

      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4"
        animate={{
          y: isHeaderVisible ? 0 : -120,
          opacity: isHeaderVisible ? 1 : 0.96,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="mx-auto mt-3 max-w-[1480px] rounded-[28px] border border-white/8 bg-background/70 shadow-[0_24px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Logo />
            </div>

            <nav
              className="hidden items-center rounded-2xl border border-white/8 bg-white/[0.03] p-1 md:flex"
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
                        ? "relative flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-semibold text-foreground"
                        : "relative flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground"
                    }
                  >
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-pill"
                        className="absolute inset-0 rounded-[14px] border border-primary/25 bg-primary/10 shadow-[0_10px_38px_hsl(var(--primary)/0.16)]"
                        transition={{ type: "spring", bounce: 0.12, duration: 0.5 }}
                      />
                    )}
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}

              <Link
                to="/wiki"
                className="rounded-[14px] px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Creator Wiki
              </Link>
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
                          layoutId="mobile-nav-pill"
                          className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/10"
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

      <main className="relative z-10 pb-16 pt-24 sm:pt-28">
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
                <div className={`${panelClass} px-5 py-5 md:px-6`}>
                  <p className="text-sm font-semibold text-foreground">
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
                    className="container px-6 pb-10 pt-4 md:pt-6"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      ref={heroRef}
                      onMouseMove={handleHeroMove}
                      className="relative overflow-hidden rounded-[38px] border border-white/8 bg-[#040814]/90 shadow-[0_40px_140px_rgba(0,0,0,0.45)]"
                    >
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: `
                            radial-gradient(circle at ${heroGlow.x}% ${heroGlow.y}%, rgba(0,255,214,0.16), transparent 18%),
                            radial-gradient(circle at 80% 12%, rgba(113,88,255,0.18), transparent 20%),
                            linear-gradient(180deg, rgba(8,12,24,0.97), rgba(3,6,14,0.98))
                          `,
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <div className="relative flex min-h-[78vh] flex-col justify-center px-5 py-12 sm:px-8 md:px-12 lg:px-16">
                        <div className="mx-auto w-full max-w-5xl text-center">
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
                            className="mx-auto mt-6 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.7rem]"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            Find the niche that can
                            <span className="block bg-gradient-to-r from-cyan-300 via-primary to-violet-300 bg-clip-text pb-1 text-transparent">
                              actually break through.
                            </span>
                          </motion.h1>

                          <motion.p
                            className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-xl"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.16 }}
                          >
                            Analyze competition, demand, creator momentum, and
                            monetization signals across YouTube, TikTok, and
                            Instagram before you lock in your next content bet.
                          </motion.p>

                          <motion.div
                            className="mx-auto mt-9 max-w-3xl"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22 }}
                          >
                            <SearchInput
                              value={query}
                              onChange={setQuery}
                              onSubmit={handleSearch}
                            />
                          </motion.div>

                          <motion.div
                            className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.28 }}
                          >
                            <button
                              type="button"
                              onClick={handleSearch}
                              className={primaryButton}
                            >
                              <Sparkles className="h-4 w-4" />
                              Discover my niche
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveTab("viral")}
                              className={secondaryButton}
                            >
                              <Flame className="h-4 w-4" />
                              Open viral ideas
                            </button>

                            <Link to="/wiki" className={secondaryButton}>
                              <Globe className="h-4 w-4" />
                              Explore creator wiki
                            </Link>
                          </motion.div>

                          <motion.p
                            className="mt-5 text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.34 }}
                          >
                            No signup required · Free forever · Built for serious
                            creators
                          </motion.p>

                          <motion.div
                            className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
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
                        </div>

                        <motion.div
                          className="mx-auto mt-14 grid w-full max-w-6xl gap-4 md:grid-cols-3"
                          initial={{ opacity: 0, y: 22 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.44 }}
                        >
                          {statCards.map((card) => {
                            const Icon = card.icon;

                            return (
                              <div
                                key={card.label}
                                className="rounded-[26px] border border-white/8 bg-white/[0.04] p-5 text-left shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                                    {card.label}
                                  </div>
                                </div>

                                <div className="mt-5 text-3xl font-black tracking-[-0.05em] text-foreground">
                                  {card.value}
                                </div>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                  {card.description}
                                </p>
                              </div>
                            );
                          })}
                        </motion.div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {step === "platform" && (
                  <motion.section
                    key="platform"
                    className="container px-6 py-8"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className={`${panelClass} overflow-hidden`}>
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="p-6 md:p-8 lg:p-10">
                          <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                              <Sparkles className="h-3.5 w-3.5" />
                              Step 1 of 2
                            </div>

                            <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
                              Choose the platform you want to win on first.
                            </h2>

                            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                              NichePulse will adapt the analysis, opportunity
                              framing, and recommendations to the platform you
                              care about most right now.
                            </p>
                          </div>

                          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {(["youtube", "tiktok", "instagram"] as const).map(
                              (item, index) => (
                                <motion.div
                                  key={item}
                                  initial={{ opacity: 0, y: 18 }}
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

                          <div className="mt-10 flex flex-wrap gap-4">
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
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                              Current niche
                            </p>
                            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-foreground">
                              {query || "No niche entered"}
                            </h3>

                            <div className="mt-6 space-y-3">
                              {platformNotes.map((item) => (
                                <div
                                  key={item}
                                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-muted-foreground"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/10 p-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Why this matters
                              </p>
                              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                Platform fit changes your content packaging,
                                growth speed, and the type of opportunity worth
                                pursuing.
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
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className={`${panelClass} overflow-hidden`}>
                      <div className="grid gap-0 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="p-6 md:p-8 lg:p-10">
                          <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                              <Sparkles className="h-3.5 w-3.5" />
                              Step 2 of 2
                            </div>

                            <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
                              Choose the content style that fits your growth
                              model.
                            </h2>

                            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                              This shapes the workflow, trust strategy, and how
                              your content brand will scale over time.
                            </p>
                          </div>

                          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {(["faceless", "persona"] as const).map(
                              (item, index) => (
                                <motion.div
                                  key={item}
                                  initial={{ opacity: 0, y: 18 }}
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

                          <div className="mt-10 flex flex-wrap gap-4">
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
                            <div className="grid gap-3 sm:grid-cols-2">
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

                            <div className="mt-6 space-y-3">
                              {styleNotes.map((item) => (
                                <div
                                  key={item}
                                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-muted-foreground"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/10 p-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                                Output quality
                              </p>
                              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                The right style choice makes the analysis more
                                realistic, more actionable, and more aligned to
                                how you’ll actually create.
                              </p>
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
                    <div className={`${panelClass} mx-auto max-w-5xl p-6 md:p-8`}>
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
                    transition={{ duration: 0.35 }}
                  >
                    <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-[#050916]/95 px-6 py-9 shadow-[0_36px_120px_rgba(0,0,0,0.38)] md:px-8 md:py-10">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,214,0.10),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(119,93,255,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_22%)]" />
                      <div className="relative text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                          <Sparkles className="h-3.5 w-3.5" />
                          Analysis complete
                        </div>

                        <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black tracking-[-0.05em] text-foreground md:text-5xl">
                          Your niche intelligence dashboard
                        </h2>

                        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                          Built for{" "}
                          <span className="font-semibold text-foreground">
                            {query}
                          </span>{" "}
                          on{" "}
                          <span className="font-semibold text-foreground">
                            {formatPlatform(platform)}
                          </span>{" "}
                          using a{" "}
                          <span className="font-semibold text-foreground">
                            {formatStyle(style)}
                          </span>{" "}
                          strategy.
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
                      </div>
                    </div>

                    <section className="mt-12">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-2xl border border-primary/15 bg-primary/10 p-2.5 text-primary">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                            Niche scorecard
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Core viability signals for this direction.
                          </p>
                        </div>
                      </div>

                      <div className={`${panelClass} p-4 md:p-5`}>
                        <ScorecardGrid scorecard={data.scorecard} />
                      </div>
                    </section>

                    <section className="mt-12">
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
                    </section>

                    <section className="mt-12">
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
                    </section>

                    <section className="mt-12">
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

                      <div className={`${panelClass} p-4 md:p-5`}>
                        <ContentBlueprint
                          ideas={data.contentIdeas}
                          hooks={data.viralHooks}
                        />
                      </div>
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
