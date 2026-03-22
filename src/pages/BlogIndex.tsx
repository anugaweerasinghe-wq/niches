import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { blogArticles } from '@/data/blog';
import { ArrowRight } from 'lucide-react';

const BlogIndex = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <NavBar />
      <SEOHead
        title="Blog — YouTube & TikTok Niche Strategies 2026 | ViralHQ"
        description="Expert guides on finding untapped YouTube niches, going viral on TikTok, and building faceless channels. Data-driven strategies for content creators in 2026."
        canonical="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "ViralHQ Blog",
          "url": "https://viralhq.vercel.app/blog",
          "description": "Expert guides on finding untapped YouTube niches and going viral."
        }}
      />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient leading-[1.1] mb-4">Creator Strategy Blog</h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">Data-driven insights for YouTube, TikTok & Instagram creators looking to grow in 2026.</p>
          </div>
          <div className="space-y-6">
            {blogArticles.map(article => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group block rounded-2xl glass-premium p-6 hover:scale-[0.99] active:scale-[0.97] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{article.publishDate}</p>
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{article.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.metaDescription}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {article.relatedNiches.slice(0, 3).map(slug => (
                        <span key={slug} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/8 text-primary border border-primary/12">
                          {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
