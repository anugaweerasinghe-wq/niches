import { useParams, Link, Navigate } from 'react-router-dom';
import { BookOpen, ArrowRight, ChevronRight, Home } from 'lucide-react';
import { getTermBySlug, getRelatedTerms } from '@/data/glossary';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';

const WikiTerm = () => {
  const { slug } = useParams<{ slug: string }>();
  const term = slug ? getTermBySlug(slug) : undefined;

  if (!term) return <Navigate to="/wiki" replace />;

  const related = getRelatedTerms(term.relatedSlugs);
  
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${term.term} Strategy 2026: The Ultimate Guide to ${term.term} Dominance`,
      "description": term.shortDefinition,
      "url": `https://niches.lovable.app/wiki/${term.slug}`,
      "datePublished": "2026-01-15",
      "dateModified": "2026-03-03",
      "author": { "@type": "Organization", "name": "NichePulse AI" },
      "publisher": { "@type": "Organization", "name": "NichePulse AI", "logo": { "@type": "ImageObject", "url": "https://niches.lovable.app/images/logo.png" } },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `https://niches.lovable.app/wiki/${term.slug}` }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": term.faq.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://niches.lovable.app/" },
        { "@type": "ListItem", "position": 2, "name": "Wiki", "item": "https://niches.lovable.app/wiki" },
        { "@type": "ListItem", "position": 3, "name": term.term, "item": `https://niches.lovable.app/wiki/${term.slug}` }
      ]
    }
  ];

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
        title={`${term.term} Strategy 2026: The Ultimate Guide to ${term.term} Dominance | NichePulse AI`}
        description={term.shortDefinition}
        canonical={`/wiki/${term.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-10" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{term.term}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Main Content */}
            <article>
              <div className="mb-8">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-primary/8 text-primary border border-primary/12 mb-4 inline-block">
                  {term.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient leading-[1.1] mb-4">
                  {term.term}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {term.shortDefinition}
                </p>
              </div>

              {/* Expert Briefing */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Expert Briefing: Understanding {term.term}
                </h2>
                <div className="rounded-2xl backdrop-blur-2xl bg-card/40 border border-border/10 p-6 md:p-8" style={{ borderWidth: '0.5px' }}>
                  {term.expertBriefing.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="mb-12" itemScope itemType="https://schema.org/FAQPage">
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">
                  People Also Ask About {term.term}
                </h2>
                <div className="space-y-4">
                  {term.faq.map((f, i) => (
                    <div
                      key={i}
                      className="rounded-2xl backdrop-blur-2xl bg-card/40 border border-border/10 p-5"
                      style={{ borderWidth: '0.5px' }}
                      itemScope
                      itemProp="mainEntity"
                      itemType="https://schema.org/Question"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-2" itemProp="name">{f.question}</h3>
                      <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                        <p className="text-sm text-muted-foreground leading-relaxed" itemProp="text">{f.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA to tool */}
              <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Analyze {term.term} for Your Niche
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use NichePulse AI to get data-driven insights powered by {term.term.toLowerCase()} analysis.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:shadow-lg hover:shadow-primary/25"
                >
                  Try NichePulse AI Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Related Terms */}
              <div className="rounded-2xl backdrop-blur-2xl bg-card/40 border border-border/10 p-5 sticky top-24" style={{ borderWidth: '0.5px' }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Related Terms</h3>
                <div className="space-y-2">
                  {related.map(r => (
                    <Link
                      key={r.slug}
                      to={`/wiki/${r.slug}`}
                      className="group flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/10 hover:bg-muted/40 hover:border-primary/15 transition-all"
                      style={{ borderWidth: '0.5px' }}
                    >
                      <div>
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{r.term}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{r.shortDefinition}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary flex-shrink-0 transition-all" />
                    </Link>
                  ))}
                </div>

                <div className="border-t border-border/20 mt-4 pt-4">
                  <Link to="/wiki" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 rotate-180" />
                    View all glossary terms
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WikiTerm;
