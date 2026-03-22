import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, Home, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EmailCapture from '@/components/EmailCapture';
import { blogArticles } from '@/data/blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find(a => a.slug === slug);

  if (!article) return <Navigate to="/blog" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.metaDescription,
    "url": `https://viralhq.vercel.app/blog/${article.slug}`,
    "datePublished": article.publishDate,
    "dateModified": article.publishDate,
    "author": { "@type": "Person", "name": "Anuga Weerasinghe", "jobTitle": "Lead Systems Architect & Growth Strategist" },
    "publisher": { "@type": "Organization", "name": "ViralHQ" },
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <NavBar />
      <SEOHead
        title={`${article.title} | ViralHQ Blog`}
        description={article.metaDescription}
        canonical={`/blog/${article.slug}`}
        type="article"
        jsonLd={jsonLd}
      />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-10" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors"><Home className="w-3.5 h-3.5" /></Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{article.title}</span>
          </nav>

          <article>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">{article.publishDate} · {article.targetKeyword}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient leading-[1.1] mb-6">{article.title}</h1>

            {article.sections.map((section, i) => (
              <section key={i} className="mb-8">
                {section.heading && <h2 className="text-xl font-semibold text-foreground mb-3">{section.heading}</h2>}
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-4">{p}</p>
                ))}
              </section>
            ))}

            {/* Internal links to niches */}
            <div className="rounded-2xl glass-premium p-6 mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-3">Explore Related Niches</h3>
              <div className="flex flex-wrap gap-2">
                {article.relatedNiches.map(slug => (
                  <Link
                    key={slug}
                    to={`/niche/${slug}`}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/8 text-primary border border-primary/12 hover:bg-primary/15 transition-all"
                  >
                    {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links to tools and wiki */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                Try our free tools <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {article.relatedWikiSlugs.map(ws => (
                <Link key={ws} to={`/wiki/${ws}`} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                  Learn about {ws.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </article>

          <EmailCapture source={`blog-${article.slug}`} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
