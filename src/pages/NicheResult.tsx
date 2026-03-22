import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Home, Sparkles, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import MarketPulseTicker from '@/components/MarketPulseTicker';
import ZeigarnikRing from '@/components/ZeigarnikRing';
import { glossaryTerms } from '@/data/glossary';
import { getNicheBySlug, getComparisonNiches, nicheDatabase } from '@/data/niches';
import StatusBadge from '@/components/StatusBadge';

const ViralScoreGauge = ({ score }: { score: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'hsl(var(--primary))' : score >= 60 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Viral Score</span>
      </div>
    </div>
  );
};

const TrendIcon = ({ direction }: { direction: 'rising' | 'stable' | 'declining' }) => {
  if (direction === 'rising') return <TrendingUp className="w-4 h-4 text-primary" />;
  if (direction === 'declining') return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

/** Get 3 deterministic related niches (same category first) */
const getRelatedNiches = (currentSlug: string) => {
  const current = getNicheBySlug(currentSlug);
  if (!current) return nicheDatabase.filter(n => n.slug !== currentSlug).slice(0, 3);
  const sameCategory = nicheDatabase.filter(n => n.category === current.category && n.slug !== currentSlug);
  const others = nicheDatabase.filter(n => n.category !== current.category && n.slug !== currentSlug);
  return [...sameCategory, ...others].slice(0, 3);
};

const NicheResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const niche = id ? getNicheBySlug(id) : undefined;
  const nicheTitle = niche?.title || (id ? id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '');
  const comparisonNiches = id ? getComparisonNiches(id, 4) : [];
  const relatedNiches = id ? getRelatedNiches(id) : [];
  const relevantTerms = glossaryTerms.slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${nicheTitle} Viral Growth Strategy 2026 | Content Blueprint`,
      "description": niche?.heroDescription || `Complete ${nicheTitle} niche analysis and viral content strategy.`,
      "url": `https://viralhq.vercel.app/niche/${id}`,
      "datePublished": "2026-02-01",
      "dateModified": "2026-03-09",
      "author": { "@type": "Person", "name": "Anuga Weerasinghe", "jobTitle": "Lead Systems Architect & Growth Strategist" },
      "publisher": { "@type": "Organization", "name": "NichePulse AI", "logo": { "@type": "ImageObject", "url": "https://viralhq.vercel.app/images/logo.png" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://viralhq.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": nicheTitle, "item": `https://viralhq.vercel.app/niche/${id}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${nicheTitle} Niche Analysis`,
      "description": niche?.description || `AI-powered ${nicheTitle} niche analysis.`,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
    }
  ];

  const handleAnalyze = () => {
    navigate(`/?q=${encodeURIComponent(nicheTitle)}`);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />

      <header className="fixed top-0 left-0 right-0 z-50 glass micro-glow border-b border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/"><Logo /></Link>
            <div className="flex items-center gap-3">
              <StatusBadge />
              <MarketPulseTicker />
              <ZeigarnikRing />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <SEOHead
        title={`${nicheTitle} Viral Growth Strategy 2026 | Content Blueprint | NichePulse AI`}
        description={niche?.heroDescription || `Complete ${nicheTitle} niche analysis: market saturation, growth potential, viral content ideas, and AI-powered strategy for YouTube, TikTok & Instagram creators in 2026.`}
        canonical={`/niche/${id}`}
        type="article"
        jsonLd={jsonLd}
      />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-10" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{nicheTitle} Analysis</span>
          </nav>

          {/* Hero with Viral Score Gauge */}
          <div className="text-center mb-16">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/8 text-primary border border-primary/12 mb-6 inline-block">
              {niche?.category || 'Niche Intelligence Report'}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient leading-[1.1] mb-4">
              {nicheTitle} Growth Strategy 2026
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              {niche?.heroDescription || `AI-powered analysis of the ${nicheTitle.toLowerCase()} niche with viral content predictions and growth blueprints.`}
            </p>
            {niche && <ViralScoreGauge score={niche.viralScore} />}
          </div>

          {/* Bento Metrics Grid */}
          {niche && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16" style={{ contentVisibility: 'auto' }}>
              {[
                { label: 'Saturation', value: `${niche.saturation}%`, sub: niche.saturation > 60 ? 'High' : niche.saturation > 40 ? 'Medium' : 'Low' },
                { label: 'Growth Rate', value: `+${niche.growthRate}%`, sub: 'YoY' },
                { label: 'Avg Views', value: niche.avgViews, sub: 'per video' },
                { label: 'Engagement', value: `${niche.avgEngagement}%`, sub: 'avg rate' },
                { label: 'Monetization', value: `${niche.monetization}/100`, sub: 'score' },
                { label: 'Avg CPM', value: niche.avgCPM, sub: 'USD' },
                { label: 'Competitors', value: niche.competitorCount, sub: 'creators' },
                { label: 'Audience', value: niche.audienceSize, sub: 'monthly reach' },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  className="rounded-2xl glass-premium p-4 hover:scale-[0.98] active:scale-[0.96] transition-all cursor-default"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</p>
                  <p className="text-xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-[10px] text-muted-foreground">{metric.sub}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Key Insight */}
          {niche && (
            <section className="rounded-3xl bg-primary/5 border border-primary/10 p-6 md:p-8 mb-16" style={{ contentVisibility: 'auto' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-2">Key Intelligence Insight</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{niche.keyInsight}</p>
                </div>
              </div>
            </section>
          )}

          {/* Content Gap Analysis */}
          {niche && (
            <section className="mb-16" style={{ contentVisibility: 'auto' }}>
              <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">Content Gap Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl glass-premium p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Underserved Content Gap</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{niche.contentGap}</p>
                </div>
                <div className="rounded-2xl glass-premium p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Top Performing Format</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The best-performing format in {nicheTitle.toLowerCase()} is <strong className="text-foreground">{niche.topFormat}</strong> on <strong className="text-foreground">{niche.bestPlatform}</strong>.
                    Trend direction: <span className="inline-flex items-center gap-1"><TrendIcon direction={niche.trendDirection} /> {niche.trendDirection}</span>.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Comparison Table */}
          {niche && comparisonNiches.length > 0 && (
            <section className="mb-16" style={{ contentVisibility: 'auto' }}>
              <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                How {nicheTitle} Compares
              </h2>
              <p className="text-xs text-muted-foreground mb-6">Side-by-side comparison with related niches across key performance metrics.</p>
              <div className="overflow-x-auto rounded-2xl border border-border/20">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/20">
                      <th className="px-4 py-3 font-semibold text-foreground">Niche</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Viral Score</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Saturation</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Growth</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Avg CPM</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-primary/5 border-b border-border/10">
                      <td className="px-4 py-3 font-semibold text-primary">{niche.title} ★</td>
                      <td className="px-4 py-3 text-foreground font-medium">{niche.viralScore}</td>
                      <td className="px-4 py-3 text-muted-foreground">{niche.saturation}%</td>
                      <td className="px-4 py-3 text-primary font-medium">+{niche.growthRate}%</td>
                      <td className="px-4 py-3 text-muted-foreground">{niche.avgCPM}</td>
                      <td className="px-4 py-3"><TrendIcon direction={niche.trendDirection} /></td>
                    </tr>
                    {comparisonNiches.map(cn => (
                      <tr key={cn.slug} className="border-b border-border/10 hover:bg-card/40 transition-colors">
                        <td className="px-4 py-3">
                          <Link to={`/niche/${cn.slug}`} className="text-foreground hover:text-primary transition-colors">{cn.title}</Link>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{cn.viralScore}</td>
                        <td className="px-4 py-3 text-muted-foreground">{cn.saturation}%</td>
                        <td className="px-4 py-3 text-muted-foreground">+{cn.growthRate}%</td>
                        <td className="px-4 py-3 text-muted-foreground">{cn.avgCPM}</td>
                        <td className="px-4 py-3"><TrendIcon direction={cn.trendDirection} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Detailed Description (SEO body content) */}
          {niche && (
            <section className="mb-16" style={{ contentVisibility: 'auto' }}>
              <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">About the {nicheTitle} Niche</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{niche.description}</p>
            </section>
          )}

          {/* Internal Linking — Study Related Niches */}
          {relatedNiches.length > 0 && (
            <section className="mb-16" style={{ contentVisibility: 'auto' }}>
              <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">Explore Related Niches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {relatedNiches.map(rn => (
                  <Link
                    key={rn.slug}
                    to={`/niche/${rn.slug}`}
                    className="group rounded-2xl glass-premium p-4 hover:scale-[0.98] active:scale-[0.96] transition-all"
                  >
                    <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      Study {rn.title} Retention Data
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{rn.heroDescription}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>Score: {rn.viralScore}</span>
                      <span>Growth: +{rn.growthRate}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Sticky CTA */}
          <div className="sticky bottom-6 z-40 flex justify-center mb-16">
            <motion.button
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm shadow-xl shadow-primary/25 hover:shadow-2xl hover:brightness-110 transition-all border border-primary/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles className="w-4 h-4" />
              Analyze "{nicheTitle}" Now — Free
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Related Wiki Terms */}
          <section className="mb-16" style={{ contentVisibility: 'auto' }}>
            <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">Related Strategy Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {relevantTerms.map(term => (
                <Link
                  key={term.slug}
                  to={`/wiki/${term.slug}`}
                  className="group rounded-2xl glass-premium p-4 hover:scale-[0.98] active:scale-[0.96] transition-all"
                >
                  <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{term.term}</h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{term.shortDefinition}</p>
                  <span className="text-[10px] text-primary mt-2 inline-flex items-center gap-0.5">
                    Learn more <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Back link */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              Back to NichePulse AI
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NicheResult;
