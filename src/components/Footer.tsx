/** SEO-rich footer with maximum GEO content for search engine visibility */
const Footer = () => {
  return (
    <footer className="border-t border-border/30 mt-24">
      <div className="container mx-auto px-6 py-16 md:py-20">
        {/* GEO Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <article>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-apple">How NichePulse AI Works</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              NichePulse AI uses advanced machine learning to analyze millions of data points across YouTube, TikTok, and Instagram.
              Our niche analysis engine evaluates competition density, audience demand signals, and monetization potential to score
              every niche on a 0–100 scale. Content creators worldwide use NichePulse to discover untapped markets before they become saturated.
            </p>
          </article>
          <article>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-apple">Viral Video Prediction Technology</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our viral prediction model studies engagement rate benchmarks, watch-time retention curves, and algorithm signals
              specific to each platform. Every viral idea includes a data-backed virality score, opening hook script, thumbnail concept,
              and optimal posting schedule — giving you a complete blueprint to maximize your chance of going viral.
            </p>
          </article>
          <article>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-apple">Supported Platforms &amp; Formats</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Whether you're a YouTube creator seeking long-form content niches, a TikTok creator looking for short-form viral trends,
              or an Instagram Reels creator wanting to grow your audience — NichePulse delivers tailored insights for your specific platform
              and content style, including both faceless and persona-based channels.
            </p>
          </article>
        </div>

        {/* FAQ Section for GEO */}
        <section className="mb-16" itemScope itemType="https://schema.org/FAQPage" aria-label="Frequently Asked Questions">
          <h3 className="text-sm font-semibold text-foreground mb-8 tracking-apple">Frequently Asked Questions</h3>
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
            <span>YouTube Niche Finder</span>
            <span>TikTok Viral Ideas</span>
            <span>Instagram Content Strategy</span>
            <span>Free AI Analysis</span>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
