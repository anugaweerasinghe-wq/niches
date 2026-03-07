import { Link } from 'react-router-dom';
import { glossaryTerms } from '@/data/glossary';
import { nicheDatabase } from '@/data/niches';

/** SEO-rich footer with Hub & Spoke internal linking */
const Footer = () => {
  return (
    <footer className="border-t border-border/30 mt-24">
      <div className="container mx-auto px-6 py-16 md:py-20">
        {/* GEO Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <article>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-tight">How NichePulse AI Works</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              NichePulse AI uses advanced machine learning to analyze millions of data points across YouTube, TikTok, and Instagram.
              Our <Link to="/wiki/niche-analysis" className="text-primary hover:underline">niche analysis</Link> engine evaluates competition density, audience demand signals, and monetization potential to score
              every niche on a 0–100 scale. Content creators worldwide use NichePulse to discover untapped markets before they become saturated.
            </p>
          </article>
          <article>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-tight">Viral Video Prediction Technology</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our <Link to="/wiki/viral-prediction" className="text-primary hover:underline">viral prediction</Link> model studies <Link to="/wiki/engagement-rate" className="text-primary hover:underline">engagement rate</Link> benchmarks, watch-time <Link to="/wiki/retention-pattern" className="text-primary hover:underline">retention curves</Link>, and <Link to="/wiki/algorithm-signal" className="text-primary hover:underline">algorithm signals</Link>
              specific to each platform. Every viral idea includes a data-backed virality score, opening hook script, thumbnail concept,
              and optimal posting schedule.
            </p>
          </article>
          <article>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-tight">Supported Platforms &amp; Formats</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Whether you're a YouTube creator seeking long-form content niches, a TikTok creator looking for <Link to="/wiki/short-form-content" className="text-primary hover:underline">short-form viral trends</Link>,
              or an Instagram Reels creator wanting to grow — NichePulse delivers tailored insights for your specific platform
              and content style, including both <Link to="/wiki/faceless-channel" className="text-primary hover:underline">faceless</Link> and persona-based channels.
            </p>
          </article>
        </div>

        {/* Wiki Quick Links */}
        <section className="mb-16">
          <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">Creator Intelligence Wiki</h3>
          <div className="flex flex-wrap gap-2">
            {glossaryTerms.map(term => (
              <Link
                key={term.slug}
                to={`/wiki/${term.slug}`}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/8 border border-border/20 hover:border-primary/15 transition-all"
              >
                {term.term}
              </Link>
            ))}
            <Link
              to="/wiki"
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/8 text-primary border border-primary/15 hover:bg-primary/15 transition-all"
            >
              View All →
            </Link>
          </div>
        </section>

        {/* Niche Quick Links — All 50 */}
        <section className="mb-16">
          <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">All Niche Analyses ({nicheDatabase.length})</h3>
          <div className="flex flex-wrap gap-2">
            {nicheDatabase.map(niche => (
              <Link
                key={niche.slug}
                to={`/niche/${niche.slug}`}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/8 border border-border/20 hover:border-primary/15 transition-all"
              >
                {niche.title}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section for GEO */}
        <section className="mb-16" itemScope itemType="https://schema.org/FAQPage" aria-label="Frequently Asked Questions">
          <h3 className="text-sm font-semibold text-foreground mb-8 tracking-tight">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: 'What is a niche scorecard?',
                a: 'A niche scorecard is an AI-generated report that evaluates a content niche across multiple dimensions including competition level, audience demand, monetization potential, and growth trajectory. NichePulse scores each factor from 0-100 and provides an overall viability rating.',
              },
              {
                q: 'How accurate is the viral prediction?',
                a: 'Our viral prediction model analyzes real-time engagement benchmarks and algorithm signals. While no prediction is 100% certain, our system identifies the key factors that correlate with viral performance — including optimal video length, trending hooks, and audience sentiment patterns.',
              },
              {
                q: 'Can I use NichePulse for multiple platforms?',
                a: 'Yes. NichePulse supports YouTube, TikTok, and Instagram with platform-specific analysis. Each platform has unique algorithm behaviors, and our AI tailors recommendations accordingly — from YouTube SEO optimization to TikTok trend timing.',
              },
              {
                q: 'Is NichePulse AI free to use?',
                a: 'Yes, NichePulse AI is completely free. Enter your niche, select your platform and content style, and get instant AI-powered analysis including scorecards, outlier creators, viral content examples, and content blueprints — no signup required.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 p-5"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h4 className="text-sm font-medium text-foreground mb-2" itemProp="name">{faq.q}</h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-xs text-muted-foreground leading-relaxed" itemProp="text">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} NichePulse AI — AI-Powered Niche Analysis & Viral Video Idea Generator
          </p>
          <nav className="flex items-center gap-6 text-xs text-muted-foreground/50" aria-label="Platform features">
            <Link to="/wiki" className="hover:text-primary transition-colors">Creator Wiki</Link>
            <span>YouTube Niche Finder</span>
            <span>TikTok Viral Ideas</span>
            <span>Instagram Content Strategy</span>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
