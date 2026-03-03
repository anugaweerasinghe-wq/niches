import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, Home, Search, Sparkles } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import { glossaryTerms } from '@/data/glossary';

const NicheResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const nicheTitle = id ? id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

  // Find 3 relevant glossary terms for internal linking
  const relevantTerms = glossaryTerms.slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${nicheTitle} Viral Growth Strategy 2026 | Content Blueprint`,
      "description": `Complete ${nicheTitle} niche analysis and viral content strategy for YouTube, TikTok & Instagram. AI-powered growth blueprint with engagement predictions.`,
      "url": `https://niches.lovable.app/niche/${id}`,
      "datePublished": "2026-02-01",
      "dateModified": "2026-03-03",
      "author": { "@type": "Organization", "name": "NichePulse AI" },
      "publisher": { "@type": "Organization", "name": "NichePulse AI", "logo": { "@type": "ImageObject", "url": "https://niches.lovable.app/images/logo.png" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niches.lovable.app/" },
        { "@type": "ListItem", "position": 2, "name": nicheTitle, "item": `https://niches.lovable.app/niche/${id}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${nicheTitle} Niche Analysis`,
      "description": `AI-powered ${nicheTitle} niche analysis with market saturation, growth potential, and content gap scoring.`,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
    }
  ];

  const handleAnalyze = () => {
    navigate(`/?q=${encodeURIComponent(nicheTitle)}`);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-3xl bg-background/60 border-b border-border/30 micro-glow">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/"><Logo /></Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <SEOHead
        title={`${nicheTitle} Viral Growth Strategy 2026 | Content Blueprint | NichePulse AI`}
        description={`Complete ${nicheTitle} niche analysis: market saturation, growth potential, viral content ideas, and AI-powered strategy for YouTube, TikTok & Instagram creators in 2026.`}
        canonical={`/niche/${id}`}
        type="article"
        jsonLd={jsonLd}
      />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-10" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{nicheTitle} Analysis</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-16">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/8 text-primary border border-primary/12 mb-6 inline-block">
              Niche Intelligence Report
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient leading-[1.1] mb-4">
              {nicheTitle} Growth Strategy 2026
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-powered analysis of the {nicheTitle.toLowerCase()} niche with viral content predictions, engagement benchmarks, and actionable growth blueprints.
            </p>
          </div>

          {/* CTA Card */}
          <div className="rounded-3xl backdrop-blur-2xl bg-card/40 border border-border/10 p-8 md:p-12 text-center mb-16" style={{ borderWidth: '0.5px' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 mb-6">
              <Search className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              Analyze "{nicheTitle}" Now
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              Get a complete niche scorecard with market saturation analysis, outlier creator discovery, viral content examples, and content blueprints — powered by AI.
            </p>
            <button
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:brightness-110 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Run Free Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Expert Content for SEO */}
          <section className="mb-16">
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">
              What You'll Discover About {nicheTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Market Saturation Score', desc: `How competitive is the ${nicheTitle.toLowerCase()} niche in 2026? Our AI evaluates creator density, average views per video, and new entrant success rates.` },
                { title: 'Growth Potential Rating', desc: `Is the ${nicheTitle.toLowerCase()} audience expanding or contracting? We analyze search volume trends, subscriber growth velocity, and platform algorithm momentum.` },
                { title: 'Outlier Creator Analysis', desc: `Which ${nicheTitle.toLowerCase()} creators are outperforming their size? We identify outliers with 3-10x view-to-follower ratios and reverse-engineer their strategies.` },
                { title: 'Viral Content Blueprint', desc: `Get AI-generated video ideas, hook scripts, and thumbnail concepts specifically optimized for the ${nicheTitle.toLowerCase()} niche and your target platform.` },
              ].map(card => (
                <div key={card.title} className="rounded-2xl backdrop-blur-2xl bg-card/40 border border-border/10 p-5" style={{ borderWidth: '0.5px' }}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal Links to Wiki — Inter-Niche Mesh */}
          <section className="mb-16">
            <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
              Related Strategy Concepts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {relevantTerms.map(term => (
                <Link
                  key={term.slug}
                  to={`/wiki/${term.slug}`}
                  className="group rounded-2xl backdrop-blur-2xl bg-card/40 border border-border/10 p-4 hover:bg-card/60 hover:border-primary/15 transition-all"
                  style={{ borderWidth: '0.5px' }}
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
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
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
