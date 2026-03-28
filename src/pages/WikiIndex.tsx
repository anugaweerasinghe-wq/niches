import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ChevronRight } from 'lucide-react';
import { glossaryTerms } from '@/data/glossary';
import SEOHead from '@/components/SEOHead';
import { SITE_URL } from '@/lib/site';
import AnimatedBackground from '@/components/AnimatedBackground';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';

const categories = [...new Set(glossaryTerms.map(t => t.category))];

const WikiIndex = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Content Creator Wiki & Glossary 2026",
      "description": "The definitive glossary of content creation, viral marketing, and niche analysis terms for YouTube, TikTok & Instagram creators.",
      "url": `${SITE_URL}/wiki`,
      "isPartOf": { "@type": "WebSite", "name": "NichePulse AI", "url": SITE_URL }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Wiki", "item": `${SITE_URL}/wiki` }
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
        title="Content Creator Wiki & Glossary 2026 | NichePulse AI"
        description="Master every content creation concept with our expert glossary. From niche analysis to viral prediction, learn the strategies behind 10M+ view videos on YouTube, TikTok & Instagram."
        canonical="/wiki"
        jsonLd={jsonLd}
      />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              Creator Intelligence Wiki
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-gradient leading-[1.08]">
              Content Creator Glossary
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The definitive reference for content creation strategies, viral mechanics, and platform algorithms — updated for 2026.
            </p>
          </div>

          {/* Category Grid */}
          {categories.map(category => {
            const terms = glossaryTerms.filter(t => t.category === category);
            return (
              <section key={category} className="mb-16">
                <h2 className="text-lg font-semibold tracking-tight text-foreground mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {terms.map(term => (
                    <Link
                      key={term.slug}
                      to={`/wiki/${term.slug}`}
                      className="group relative overflow-hidden rounded-2xl backdrop-blur-2xl bg-card/40 border border-border/10 p-5 transition-all duration-500 hover:bg-card/60 hover:border-border/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5"
                      style={{ borderWidth: '0.5px' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
                      <div className="relative">
                        <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                          {term.term}
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {term.shortDefinition}
                        </p>
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/8 text-primary border border-primary/12">
                            {term.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {term.faq.length} FAQ{term.faq.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Internal link back */}
          <div className="text-center mt-12">
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

export default WikiIndex;
