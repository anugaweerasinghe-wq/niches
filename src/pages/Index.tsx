import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
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
    description: "Find niches with demand, monetization potential, and room to win.",
    gradient: "from-cyan-500/20 to-teal-500/5",
    glow: "hover:shadow-[0_0_70px_rgba(0,255,214,0.14)]",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Sparkles,
    label: "Creator leverage",
    value: "Faster",
    description: "Turn research into formats, hooks, and blueprints without guessing.",
    gradient: "from-violet-500/20 to-purple-500/5",
    glow: "hover:shadow-[0_0_70px_rgba(139,92,246,0.14)]",
    accent: "text-violet-400",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Globe,
    label: "Platform fit",
    value: "3X",
    description: "Adapt the strategy to YouTube, TikTok, and Instagram from the start.",
    gradient: "from-rose-500/20 to-pink-500/5",
    glow: "hover:shadow-[0_0_70px_rgba(244,63,94,0.14)]",
    accent: "text-rose-400",
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/10 border-rose-500/20",
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

const floatingOrbs = [
  { x: "5%",  y: "10%", size: 420, color: "rgba(0,255,214,0.055)", delay: 0,  duration: 20 },
  { x: "72%", y: "4%",  size: 500, color: "rgba(139,92,246,0.065)", delay: 4,  duration: 25 },
  { x: "50%", y: "60%", size: 360, color: "rgba(0,180,255,0.045)", delay: 8,  duration: 18 },
  { x: "12%", y: "68%", size: 300, color: "rgba(120,60,255,0.05)", delay: 2,  duration: 22 },
  { x: "85%", y: "50%", size: 260, color: "rgba(0,255,180,0.045)", delay: 10, duration: 15 },
];

const primaryButton =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-primary/40 bg-primary px-6 py-3.5 text-sm font-bold tracking-wide text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.35),0_18px_55px_hsl(var(--primary)/0.22)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_70px_hsl(var(--primary)/0.55),0_24px_65px_hsl(var(--primary)/0.3)]";

const secondaryButton =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.22] hover:bg-white/[0.075] hover:shadow-[0_8px_32px_rgba(255,255,255,0.055)]";

const glassPanel =
  "relative rounded-[34px] border border-white/[0.07] bg-white/[0.028] shadow-[0_32px_120px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.075)] backdrop-blur-3xl";

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

// ─── Noise grain overlay ──────────────────────────────────────────────────────
const NoiseOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "200px 200px",
    }}
  />
);

// ─── Orbital ring decoration ──────────────────────────────────────────────────
const OrbitalRing = ({
  size,
  opacity,
  duration,
  delay,
}: {
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}) => (
  <motion.div
    className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-white/[0.04]"
    style={{
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      opacity,
    }}
    animate={{ rotate: 360 }}
    transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
  >
    <motion.div
      className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60"
      style={{ boxShadow: "0 0 14px 5px hsl(var(--primary)/0.5)" }}
    />
  </motion.div>
);

// ─── Result section header ────────────────────────────────────────────────────
const ResultSectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) => (
  <div className="mb-7 flex items-center gap-4">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/[0.08] text-primary shadow-[0_0_22px_hsl(var(--primary)/0.15)]">
      <Icon className="h-[18px] w-[18px]" />
    </div>
    <div>
      <h3 className="text-xl font-bold tracking-[-0.03em] text-foreground">{title}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Index = () => {
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<ActiveTab>("niche");
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<"youtube" | "tiktok" | "instagram" | null>(null);
  const [style, setStyle] = useState<"faceless" | "persona" | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [heroGlow, setHeroGlow] = useState({ x: 50, y: 18 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, -70]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.65]);
  const springY = useSpring(heroParallaxY, { stiffness: 70, damping: 18 });

  const { data, progress, analyze, reset } = useNicheAnalysis();

  useEffect(() => {
    const q = searchParams.get("q");
    const p = searchParams.get("p") as "youtube" | "tiktok" | "instagram" | null;
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
    if (data && step === "loading") setStep("results");
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

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSearch = () => { if (!query.trim()) return; setStep("platform"); };
  const handlePlatformSelect = (p: "youtube" | "tiktok" | "instagram") => setPlatform(p);
  const handleStyleSelect = (s: "faceless" | "persona") => setStyle(s);

  const handleNext = () => {
    if (step === "platform" && platform) { setStep("style"); return; }
    if (step === "style" && style && platform) { setStep("loading"); analyze(query, platform, style); }
  };

  const handleBack = () => {
    if (step === "platform") { setStep("search"); return; }
    if (step === "style") { setStep("platform"); }
  };

  const handleReset = () => {
    setStep("search"); setQuery(""); setPlatform(null); setStyle(null); reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeroMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    setHeroGlow({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const pageTitle = activeTab === "niche" ? "Niche Finder" : "Viral Idea Generator";
  const pageSubtitle = activeTab === "niche" ? "AI-powered niche intelligence" : "Data-backed viral content engine";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBackground />
      <NoiseOverlay />

      {/* Ambient cursor glow — desktop only */}
      <div
        className="pointer-events-none fixed inset-0 z-0 hidden transition-all duration-100 lg:block"
        style={{
          background: `radial-gradient(circle 550px at ${mousePos.x}px ${mousePos.y}px, rgba(0,255,214,0.032), transparent 70%)`,
        }}
      />

      {/* ─── Floating ambient orbs ─── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {floatingOrbs.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              filter: "blur(90px)",
            }}
            animate={{
              scale: [1, 1.18, 0.93, 1],
              opacity: [0.75, 1, 0.65, 0.75],
              x: [0, 28, -18, 0],
              y: [0, -22, 20, 0],
            }}
            transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />

      {/* Bottom vignette */}
      <div className="pointer-events-none fixed inset-0 z-0 [background:radial-gradient(ellipse_80%_50%_at_50%_-5%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* ════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════ */}
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5"
        animate={{ y: isHeaderVisible ? 0 : -130, opacity: isHeaderVisible ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="mx-auto mt-3.5 max-w-[1540px]">
          <div className="rounded-[26px] border border-white/[0.075] bg-background/58 shadow-[0_28px_100px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.065)] backdrop-blur-3xl">
            <div className="flex h-[62px] items-center justify-between gap-4 px-4 sm:px-6">

              <div className="flex min-w-0 items-center gap-3">
                <Logo />
              </div>

              {/* Desktop nav */}
              <nav
                className="hidden items-center rounded-2xl border border-white/[0.065] bg-white/[0.022] p-1 md:flex"
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
                          ? "relative flex items-center gap-2 rounded-[13px] px-4 py-2.5 text-sm font-semibold text-foreground"
                          : "relative flex items-center gap-2 rounded-[13px] px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground"
                      }
                    >
                      {isActive && (
                        <motion.div
                          layoutId="desktop-nav-pill"
                          className="absolute inset-0 rounded-[13px] border border-primary/25 bg-primary/[0.11] shadow-[0_0_28px_hsl(var(--primary)/0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                          transition={{ type: "spring", bounce: 0.16, duration: 0.55 }}
                        />
                      )}
                      <Icon className="relative z-10 h-4 w-4" />
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
                <Link
                  to="/wiki"
                  className="rounded-[13px] px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  Creator Wiki
                </Link>
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden lg:block"><StatusBadge /></div>
                <div className="hidden xl:block"><MarketPulseTicker /></div>
                <div className="hidden sm:block"><ZeigarnikRing /></div>

                {/* Mobile nav */}
                <div className="flex items-center rounded-2xl border border-white/[0.065] bg-white/[0.022] p-1 md:hidden">
                  {topTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={isActive ? "relative rounded-xl p-2.5 text-foreground" : "relative rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground"}
                        aria-label={tab.label}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobile-nav-pill"
                            className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/[0.11]"
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

                {activeTab === "niche" && step !== "search" && step !== "loading" && (
                  <motion.button
                    onClick={handleReset}
                    className="hidden items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground sm:inline-flex"
                    whileTap={{ scale: 0.97 }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start over
                  </motion.button>
                )}

                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ════════════════════════════════════════════════
          MAIN
      ════════════════════════════════════════════════ */}
      <main className="relative z-10 pb-20 pt-24 sm:pt-28">
        <AnimatePresence mode="wait">

          {/* ─── VIRAL TAB ─── */}
          {activeTab === "viral" ? (
            <motion.div
              key="viral-tab"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="container mb-8 px-6">
                <div className={`${glassPanel} px-6 py-5`}>
                  <p className="text-sm font-bold tracking-wide text-foreground">{pageTitle}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{pageSubtitle}</p>
                </div>
              </div>
              <ViralIdeasSection />
            </motion.div>

          ) : (
            /* ─── NICHE TAB ─── */
            <motion.div
              key="niche-tab"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <AnimatePresence mode="wait">

                {/* ════════════════════════════
                    HERO — SEARCH STEP
                ════════════════════════════ */}
                {step === "search" && (
                  <motion.section
                    key="search"
                    className="relative container px-6 pb-32 pt-8 md:pt-14"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.55 }}
                  >
                    <div ref={heroRef} onMouseMove={handleHeroMove} className="relative overflow-visible">

                      {/* Interactive hero glow */}
                      <motion.div
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: -240,
                          width: 1100,
                          height: 780,
                          background: `radial-gradient(ellipse at ${heroGlow.x}% ${heroGlow.y}%, rgba(0,255,214,0.12), transparent 28%), radial-gradient(ellipse at ${100 - heroGlow.x}% ${heroGlow.y + 12}%, rgba(120,90,255,0.12), transparent 32%)`,
                          filter: "blur(50px)",
                        }}
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 7, repeat: Infinity }}
                      />

                      {/* Orbital rings decorating hero */}
                      <div className="pointer-events-none absolute left-1/2 top-[340px] h-0 w-0">
                        <OrbitalRing size={640}  opacity={0.35} duration={42} delay={0}  />
                        <OrbitalRing size={860}  opacity={0.22} duration={65} delay={6}  />
                        <OrbitalRing size={1100} opacity={0.12} duration={95} delay={12} />
                      </div>

                      {/* Horizontal separator line */}
                      <div className="pointer-events-none absolute inset-x-0 top-[-36px] h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

                      <motion.div style={{ y: springY, opacity: heroOpacity }}>
                        <div className="relative flex min-h-[96vh] flex-col items-center justify-center">
                          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">

                            {/* Live indicator badge */}
                            <motion.div
                              initial={{ opacity: 0, y: 22, scale: 0.90 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.08] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-primary backdrop-blur-xl shadow-[0_0_32px_hsl(var(--primary)/0.18),inset_0_1px_0_rgba(255,255,255,0.1)]">
                                <motion.span
                                  animate={{ opacity: [1, 0.3, 1] }}
                                  transition={{ duration: 2.2, repeat: Infinity }}
                                  className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_3px_hsl(var(--primary)/0.75)]"
                                />
                                AI-powered niche intelligence
                              </div>
                            </motion.div>

                            {/* Main headline — the crown jewel */}
                            <motion.h1
                              className="mx-auto mt-10 max-w-5xl font-black leading-[0.87] tracking-[-0.07em] text-foreground"
                              style={{ fontSize: "clamp(3rem, 8vw, 6.6rem)" }}
                              initial={{ opacity: 0, y: 32 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <span className="block">Find the niche</span>
                              <span className="block">that can actually</span>
                              <span className="relative block pb-2">
                                <span className="bg-gradient-to-r from-cyan-300 via-primary to-violet-400 bg-clip-text text-transparent">
                                  break through.
                                </span>
                                {/* Glowing underline */}
                                <motion.span
                                  className="absolute -bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/65 to-transparent"
                                  animate={{ opacity: [0.35, 1, 0.35], width: ["55%", "68%", "55%"] }}
                                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                />
                              </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                              className="mx-auto mt-9 max-w-2xl text-[1.06rem] leading-[1.92] text-muted-foreground md:text-[1.18rem]"
                              initial={{ opacity: 0, y: 22 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            >
                              Analyze competition, demand, creator momentum, and monetization
                              signals across YouTube, TikTok, and Instagram — before you lock in
                              your next content bet.
                            </motion.p>

                            {/* Search input */}
                            <motion.div
                              className="mx-auto mt-12 w-full max-w-[780px]"
                              initial={{ opacity: 0, y: 26, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: 0.26, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div className="relative">
                                {/* Outer glow ring */}
                                <motion.div
                                  className="absolute -inset-[1px] rounded-[34px] bg-gradient-to-r from-primary/35 via-violet-500/25 to-primary/35"
                                  style={{ filter: "blur(14px)" }}
                                  animate={{ opacity: [0.55, 0.8, 0.55] }}
                                  transition={{ duration: 4, repeat: Infinity }}
                                />
                                <div className="relative rounded-[32px] border border-white/[0.1] bg-white/[0.04] p-3 shadow-[0_28px_100px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-3xl">
                                  <SearchInput value={query} onChange={setQuery} onSubmit={handleSearch} />
                                </div>
                              </div>
                            </motion.div>

                            <motion.p
                              className="mt-5 text-[13px] text-muted-foreground/65"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.34 }}
                            >
                              Natural language search — describe what you love and NichePulse does the rest.
                            </motion.p>

                            {/* CTA row */}
                            <motion.div
                              className="mt-8 flex flex-wrap items-center justify-center gap-3"
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.6 }}
                            >
                              <button type="button" onClick={() => setActiveTab("viral")} className={secondaryButton}>
                                <Flame className="h-4 w-4" />
                                Open viral ideas
                              </button>
                              <Link to="/wiki" className={secondaryButton}>
                                <Globe className="h-4 w-4" />
                                Explore creator wiki
                              </Link>
                            </motion.div>

                            <motion.p
                              className="mt-5 text-[13px] text-muted-foreground/55"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.46 }}
                            >
                              No signup required · Free forever · Built for serious creators
                            </motion.p>

                            {/* Feature chips */}
                            <motion.div
                              className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.52 }}
                            >
                              {heroChips.map((chip, i) => (
                                <motion.span
                                  key={chip}
                                  initial={{ opacity: 0, scale: 0.86 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.52 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                                  className="cursor-default rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-xl transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-foreground"
                                >
                                  {chip}
                                </motion.span>
                              ))}
                            </motion.div>
                          </div>

                          {/* ─── Stat cards ─── */}
                          <div className="mx-auto mt-28 grid w-full max-w-6xl gap-5 md:grid-cols-3">
                            {statCards.map((card, i) => {
                              const Icon = card.icon;
                              return (
                                <motion.div
                                  key={card.label}
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.62 + i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                                  whileHover={{ y: -7, transition: { duration: 0.32, ease: "easeOut" } }}
                                  className={`group relative overflow-hidden rounded-[30px] border ${card.border} bg-white/[0.025] p-8 text-left backdrop-blur-2xl transition-all duration-500 hover:bg-white/[0.05] ${card.glow} hover:border-opacity-50`}
                                >
                                  {/* Card ambient fill */}
                                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 transition-opacity duration-500 group-hover:opacity-90`} />
                                  {/* Top shimmer */}
                                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />

                                  <div className="relative">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] border ${card.iconBg} ${card.accent}`}>
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div className={`mt-4 text-[10px] font-bold uppercase tracking-[0.28em] ${card.accent}`}>
                                      {card.label}
                                    </div>
                                    <div className="mt-5 font-black leading-none tracking-[-0.06em] text-foreground" style={{ fontSize: "clamp(2.2rem, 4vw, 2.8rem)" }}>
                                      {card.value}
                                    </div>
                                    <p className="mt-4 text-sm leading-[1.82] text-muted-foreground">
                                      {card.description}
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.section>
                )}

                {/* ════════════════════════════
                    PLATFORM STEP
                ════════════════════════════ */}
                {step === "platform" && (
                  <motion.section
                    key="platform"
                    className="container px-6 py-9"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className={`${glassPanel} overflow-hidden`}>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
                        {/* Main col */}
                        <div className="p-8 md:p-10 lg:p-12">
                          <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.08] px-4.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-primary shadow-[0_0_22px_hsl(var(--primary)/0.16)]">
                              <Sparkles className="h-3.5 w-3.5" />
                              Step 1 of 2
                            </div>

                            <h2
                              className="mt-7 font-black leading-[0.9] tracking-[-0.06em] text-foreground"
                              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
                            >
                              Choose the platform you want to win on first.
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-[1.88] text-muted-foreground md:text-lg">
                              NichePulse will adapt the analysis, opportunity framing, and
                              recommendations to the platform you care about most right now.
                            </p>
                          </div>

                          <div className="mt-11 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {(["youtube", "tiktok", "instagram"] as const).map((item, index) => (
                              <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <PlatformCard
                                  platform={item}
                                  isSelected={platform === item}
                                  onClick={() => handlePlatformSelect(item)}
                                />
                              </motion.div>
                            ))}
                          </div>

                          <div className="mt-11 flex flex-wrap gap-4">
                            <motion.button onClick={handleBack} className={secondaryButton} whileTap={{ scale: 0.97 }}>
                              <ArrowLeft className="h-4 w-4" />Back
                            </motion.button>
                            <motion.button
                              onClick={handleNext}
                              disabled={!platform}
                              className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none`}
                              whileTap={{ scale: platform ? 0.97 : 1 }}
                            >
                              Continue
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Sidebar */}
                        <div className="relative border-t border-white/[0.065] bg-black/22 p-7 xl:border-l xl:border-t-0 xl:p-8">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.035] to-violet-500/[0.035]" />
                          <div className="relative rounded-[26px] border border-white/[0.065] bg-white/[0.022] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Current niche</p>
                            <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-foreground">
                              {query || "No niche entered"}
                            </h3>
                            <div className="mt-6 space-y-3">
                              {platformNotes.map((item, i) => (
                                <motion.div
                                  key={item}
                                  initial={{ opacity: 0, x: 14 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="rounded-2xl border border-white/[0.065] bg-white/[0.022] px-4 py-3.5 text-sm leading-[1.78] text-muted-foreground"
                                >
                                  {item}
                                </motion.div>
                              ))}
                            </div>
                            <div className="mt-6 rounded-2xl border border-primary/[0.18] bg-primary/[0.07] p-4.5 shadow-[0_0_22px_hsl(var(--primary)/0.08)]">
                              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">Why this matters</p>
                              <p className="mt-2.5 text-sm leading-[1.82] text-muted-foreground">
                                Platform fit changes your content packaging, growth speed, and the
                                type of opportunity worth pursuing.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* ════════════════════════════
                    STYLE STEP
                ════════════════════════════ */}
                {step === "style" && (
                  <motion.section
                    key="style"
                    className="container px-6 py-9"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className={`${glassPanel} overflow-hidden`}>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="p-8 md:p-10 lg:p-12">
                          <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.08] px-4.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.28em] text-primary shadow-[0_0_22px_hsl(var(--primary)/0.16)]">
                              <Sparkles className="h-3.5 w-3.5" />
                              Step 2 of 2
                            </div>

                            <h2
                              className="mt-7 font-black leading-[0.9] tracking-[-0.06em] text-foreground"
                              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)" }}
                            >
                              Choose the content style that fits your growth model.
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-[1.88] text-muted-foreground md:text-lg">
                              This shapes the workflow, trust strategy, and how your content brand
                              will scale over time.
                            </p>
                          </div>

                          <div className="mt-11 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {(["faceless", "persona"] as const).map((item, index) => (
                              <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <StyleCard
                                  style={item}
                                  isSelected={style === item}
                                  onClick={() => handleStyleSelect(item)}
                                />
                              </motion.div>
                            ))}
                          </div>

                          <div className="mt-11 flex flex-wrap gap-4">
                            <motion.button onClick={handleBack} className={secondaryButton} whileTap={{ scale: 0.97 }}>
                              <ArrowLeft className="h-4 w-4" />Back
                            </motion.button>
                            <motion.button
                              onClick={handleNext}
                              disabled={!style}
                              className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none`}
                              whileTap={{ scale: style ? 0.97 : 1 }}
                            >
                              Analyze my niche
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Sidebar */}
                        <div className="relative border-t border-white/[0.065] bg-black/22 p-7 xl:border-l xl:border-t-0 xl:p-8">
                          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.035] to-primary/[0.035]" />
                          <div className="relative rounded-[26px] border border-white/[0.065] bg-white/[0.022] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-2xl border border-white/[0.065] bg-white/[0.022] p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">Platform</p>
                                <p className="mt-2.5 text-lg font-bold text-foreground">{formatPlatform(platform) || "Not selected"}</p>
                              </div>
                              <div className="rounded-2xl border border-white/[0.065] bg-white/[0.022] p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">Niche</p>
                                <p className="mt-2.5 text-lg font-bold text-foreground">{query || "Not entered"}</p>
                              </div>
                            </div>
                            <div className="mt-5 space-y-3">
                              {styleNotes.map((item, i) => (
                                <motion.div
                                  key={item}
                                  initial={{ opacity: 0, x: 14 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="rounded-2xl border border-white/[0.065] bg-white/[0.022] px-4 py-3.5 text-sm leading-[1.78] text-muted-foreground"
                                >
                                  {item}
                                </motion.div>
                              ))}
                            </div>
                            <div className="mt-5 rounded-2xl border border-primary/[0.18] bg-primary/[0.07] p-4.5 shadow-[0_0_22px_hsl(var(--primary)/0.08)]">
                              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">Output quality</p>
                              <p className="mt-2.5 text-sm leading-[1.82] text-muted-foreground">
                                The right style choice makes the analysis more realistic, actionable,
                                and aligned to how you'll actually create.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* ════════════════════════════
                    LOADING STEP
                ════════════════════════════ */}
                {step === "loading" && (
                  <motion.div
                    key="loading"
                    className="container px-6 py-24"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.42 }}
                  >
                    <div className={`${glassPanel} mx-auto max-w-5xl p-8 md:p-10`}>
                      <LoadingState progress={progress} />
                    </div>
                  </motion.div>
                )}

                {/* ════════════════════════════
                    RESULTS STEP
                ════════════════════════════ */}
                {step === "results" && data && (
                  <motion.div
                    key="results"
                    ref={dashboardRef}
                    className="container px-6 py-7"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Results hero panel */}
                    <div className="relative overflow-hidden rounded-[40px] border border-white/[0.075] bg-[#040c1a]/96 px-7 py-12 shadow-[0_44px_160px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.065)] md:px-10 md:py-14">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(0,255,214,0.09),transparent_62%),radial-gradient(circle_at_86%_0%,rgba(119,93,255,0.13),transparent_32%)]" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
                      <div className="pointer-events-none absolute inset-0 opacity-[0.028] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:60px_60px]" />

                      <div className="relative text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 14, scale: 0.93 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.08] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-primary shadow-[0_0_28px_hsl(var(--primary)/0.2)]"
                        >
                          <motion.span
                            animate={{ opacity: [1, 0.25, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_3px_hsl(var(--primary)/0.8)]"
                          />
                          Analysis complete
                        </motion.div>

                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 }}
                          className="mx-auto mt-7 max-w-4xl font-black leading-[0.9] tracking-[-0.06em] text-foreground"
                          style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
                        >
                          Your niche intelligence dashboard
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.14 }}
                          className="mx-auto mt-5 max-w-3xl text-base leading-[1.88] text-muted-foreground md:text-lg"
                        >
                          Built for{" "}
                          <span className="font-bold text-foreground">{query}</span>{" "}
                          on{" "}
                          <span className="font-bold text-foreground">{formatPlatform(platform)}</span>{" "}
                          using a{" "}
                          <span className="font-bold text-foreground">{formatStyle(style)}</span> strategy.
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-6 flex flex-wrap items-center justify-center gap-3"
                        >
                          {[formatPlatform(platform), formatStyle(style), "Strategy-ready output"].map((tag) => (
                            <span key={tag} className="rounded-full border border-white/[0.075] bg-white/[0.04] px-4 py-2 text-xs font-medium text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </motion.div>
                      </div>
                    </div>

                    {/* Scorecard */}
                    <motion.section className="mt-14" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <ResultSectionHeader icon={Zap} title="Niche scorecard" subtitle="Core viability signals for this direction." />
                      <div className={`${glassPanel} p-5 md:p-6`}>
                        <ScorecardGrid scorecard={data.scorecard} />
                      </div>
                    </motion.section>

                    {/* Outlier creators */}
                    <motion.section className="mt-14" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                      <ResultSectionHeader icon={TrendingUp} title="Outlier creators" subtitle="Accounts already proving traction in this space." />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {data.outliers.map((creator, index) => (
                          <OutlierCard key={creator.name} creator={creator} index={index} />
                        ))}
                      </div>
                    </motion.section>

                    {/* Viral content feed */}
                    <motion.section className="mt-14" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                      <ResultSectionHeader icon={Globe} title="Viral content feed" subtitle="High-performing content patterns worth studying." />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {data.viralContent.map((video, index) => (
                          <VideoCard key={video.id} video={video} index={index} />
                        ))}
                      </div>
                    </motion.section>

                    {/* Content blueprint */}
                    <motion.section className="mt-14" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                      <ResultSectionHeader icon={Flame} title="Content blueprint" subtitle="Hooks and ideas you can actually build from next." />
                      <div className={`${glassPanel} p-5 md:p-6`}>
                        <ContentBlueprint ideas={data.contentIdeas} hooks={data.viralHooks} />
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
