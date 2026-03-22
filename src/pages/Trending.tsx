import { Link } from 'react-router-dom';
import { TrendingUp, Flame, ArrowRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EmailCapture from '@/components/EmailCapture';
import { getNicheBySlug } from '@/data/niches';

const trendingNiches = [
  { slug: 'ai-tools', reason: 'AI tool launches are happening daily — every new release creates a content vacuum. Search volume up 180% YoY.' },
  { slug: 'ai-saas', reason: 'SaaS review creators are earning $18+ CPMs with affiliate stacking. The AI SaaS market hits $300B in 2026.' },
  { slug: 'no-code-development', reason: 'Non-technical founders are flooding this space. "Build a SaaS without coding" searches up 240%.' },
  { slug: 'automation-zapier', reason: 'Businesses are automating aggressively. Creators teaching automation workflows are landing $5K+ consulting deals.' },
  { slug: 'cybersecurity', reason: 'Major data breaches are driving mainstream interest. $32 CPMs make this the highest-paying tech niche.' },
  { slug: 'stoicism-philosophy', reason: 'Faceless Stoicism channels are exploding. 45% growth rate with minimal production costs.' },
  { slug: 'ai-art-generation', reason: 'Every new AI model (Midjourney v7, DALL-E 4) creates week-long content spikes. 58% annual growth.' },
  { slug: 'space-exploration', reason: 'SpaceX Starship missions and NASA Artemis are driving massive search spikes. 44% growth.' },
  { slug: 'productivity-systems', reason: 'Notion template creators are earning six figures. The "second brain" movement is mainstream now.' },
  { slug: 'horror-narration', reason: 'The perfect faceless niche — 245K average views, 39% growth, and minimal production investment required.' },
];

const weekOf = 'March 17–23, 2026';

const Trending = () => (
  <div className="min-h-screen bg-background relative">
    <AnimatedBackground />
    <NavBar />
    <SEOHead
      title="Top 10 Trending YouTube Niches This Week | ViralHQ"
      description={`Discover the top 10 trending YouTube niches for the week of ${weekOf}. Data-driven picks based on search volume, growth rate, and creator opportunity.`}
      canonical="/trending"
    />
    <main className="pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-6">
            <Flame className="w-3.5 h-3.5" />
            Updated Weekly
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient leading-[1.1] mb-4">
            Top 10 Trending YouTube Niches This Week
          </h1>
          <p className="text-sm text-muted-foreground">Week of {weekOf} — curated by the ViralHQ data team.</p>
        </div>

        <ol className="space-y-4 mb-16">
          {trendingNiches.map((tn, i) => {
            const niche = getNicheBySlug(tn.slug);
            if (!niche) return null;
            return (
              <li key={tn.slug}>
                <Link to={`/niche/${tn.slug}`} className="group flex gap-4 rounded-2xl glass-premium p-5 hover:scale-[0.99] active:scale-[0.97] transition-all">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{niche.title}</h2>
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] text-primary font-medium">+{niche.growthRate}% growth</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tn.reason}</p>
                    <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
                      <span>Viral Score: {niche.viralScore}</span>
                      <span>CPM: {niche.avgCPM}</span>
                      <span>Saturation: {niche.saturation}%</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                </Link>
              </li>
            );
          })}
        </ol>

        <EmailCapture source="trending" />
      </div>
    </main>
    <Footer />
  </div>
);

export default Trending;
