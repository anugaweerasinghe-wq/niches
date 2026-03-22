import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Sparkles } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const features = [
  { name: 'AI Niche Analysis', vhq: true, vidiq: false, tubebuddy: false },
  { name: 'Viral Video Idea Generator', vhq: true, vidiq: false, tubebuddy: false },
  { name: 'YouTube Keyword Research', vhq: true, vidiq: true, tubebuddy: true },
  { name: 'TikTok & Instagram Support', vhq: true, vidiq: false, tubebuddy: false },
  { name: 'Free Tier Available', vhq: true, vidiq: true, tubebuddy: true },
  { name: 'No Browser Extension Required', vhq: true, vidiq: false, tubebuddy: false },
  { name: 'Competitor Channel Analysis', vhq: true, vidiq: true, tubebuddy: true },
  { name: 'Content Blueprint Generation', vhq: true, vidiq: false, tubebuddy: false },
  { name: 'SEO Score Calculator', vhq: true, vidiq: true, tubebuddy: true },
  { name: 'Thumbnail A/B Testing', vhq: false, vidiq: true, tubebuddy: true },
];

const pros = {
  vhq: ['100% free with no limits', 'AI-powered niche discovery', 'Multi-platform (YouTube, TikTok, Instagram)', 'Viral idea generation with hooks & scripts', 'No signup or extension needed'],
  vidiq: ['Established brand with large user base', 'Deep YouTube-specific analytics', 'Channel audit features', 'Trending video alerts'],
  tubebuddy: ['Strong A/B thumbnail testing', 'Bulk processing tools', 'Tag suggestions', 'YouTube-certified partner'],
};

const cons = {
  vhq: ['Newer platform', 'No browser extension yet', 'No thumbnail testing'],
  vidiq: ['YouTube-only', 'Best features behind paywall ($49+/mo)', 'No AI niche discovery', 'Requires browser extension'],
  tubebuddy: ['YouTube-only', 'Premium tiers expensive ($49+/mo)', 'No viral prediction', 'Interface can feel cluttered'],
};

const Comparison = () => (
  <div className="min-h-screen bg-background relative">
    <AnimatedBackground />
    <NavBar />
    <SEOHead
      title="NichePulse AI vs VidIQ vs TubeBuddy — Which Is Best for Finding Niches?"
      description="Compare NichePulse AI, VidIQ, and TubeBuddy side-by-side. See which tool is best for niche discovery, viral video ideas, and content strategy across YouTube, TikTok & Instagram."
      canonical="/vs/nichepulse-vs-vidiq-vs-tubebuddy"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "NichePulse AI vs VidIQ vs TubeBuddy — Feature Comparison 2026",
        "description": "Detailed comparison of the top 3 YouTube niche analysis tools.",
        "url": "https://viralhq.vercel.app/vs/nichepulse-vs-vidiq-vs-tubebuddy",
        "author": { "@type": "Person", "name": "Anuga Weerasinghe" },
      }}
    />
    <main className="pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient leading-[1.1] mb-4">
            NichePulse AI vs VidIQ vs TubeBuddy
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">Which niche analysis tool is right for you? Here's a detailed, unbiased comparison for 2026.</p>
        </div>

        {/* Feature Table */}
        <section className="mb-16 overflow-x-auto rounded-2xl border border-border/20">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/30 border-b border-border/20">
                <th className="px-4 py-3 font-semibold text-foreground">Feature</th>
                <th className="px-4 py-3 font-semibold text-primary">ViralHQ</th>
                <th className="px-4 py-3 font-semibold text-foreground">VidIQ</th>
                <th className="px-4 py-3 font-semibold text-foreground">TubeBuddy</th>
              </tr>
            </thead>
            <tbody>
              {features.map(f => (
                <tr key={f.name} className="border-b border-border/10">
                  <td className="px-4 py-3 text-foreground">{f.name}</td>
                  <td className="px-4 py-3">{f.vhq ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-muted-foreground/30" />}</td>
                  <td className="px-4 py-3">{f.vidiq ? <Check className="w-4 h-4 text-foreground/60" /> : <X className="w-4 h-4 text-muted-foreground/30" />}</td>
                  <td className="px-4 py-3">{f.tubebuddy ? <Check className="w-4 h-4 text-foreground/60" /> : <X className="w-4 h-4 text-muted-foreground/30" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pros & Cons */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {([['ViralHQ', pros.vhq, cons.vhq], ['VidIQ', pros.vidiq, cons.vidiq], ['TubeBuddy', pros.tubebuddy, cons.tubebuddy]] as const).map(([name, p, c]) => (
            <div key={name} className="rounded-2xl glass-premium p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{name}</h3>
              <div className="mb-3">
                <p className="text-[10px] text-primary uppercase tracking-wider mb-1">Pros</p>
                <ul className="space-y-1">{p.map(item => <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5"><Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />{item}</li>)}</ul>
              </div>
              <div>
                <p className="text-[10px] text-destructive uppercase tracking-wider mb-1">Cons</p>
                <ul className="space-y-1">{c.map(item => <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5"><X className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />{item}</li>)}</ul>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm shadow-xl shadow-primary/25 hover:brightness-110 transition-all">
            <Sparkles className="w-4 h-4" />
            Try ViralHQ Free — No Signup Required
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Comparison;
