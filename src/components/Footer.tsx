import { motion } from 'framer-motion';

/** SEO-rich footer with GEO-targeted content for search engine visibility */
const Footer = () => {
  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="container mx-auto px-6 py-16">
        {/* GEO Content Sections — Rich text for AI search snippets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-apple">How NichePulse AI Works</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              NichePulse AI uses advanced machine learning to analyze millions of data points across YouTube, TikTok, and Instagram. 
              Our niche analysis engine evaluates competition density, audience demand signals, and monetization potential to score 
              every niche on a 0–100 scale. Content creators worldwide use NichePulse to discover untapped markets before they become saturated.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-apple">Viral Video Prediction Technology</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our viral prediction model studies engagement rate benchmarks, watch-time retention curves, and algorithm signals 
              specific to each platform. Every viral idea includes a data-backed virality score, opening hook script, thumbnail concept, 
              and optimal posting schedule — giving you a complete blueprint to maximize your chance of going viral.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 tracking-apple">Supported Platforms</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Whether you're a YouTube creator seeking long-form content niches, a TikTok creator looking for short-form viral trends, 
              or an Instagram Reels creator wanting to grow your audience — NichePulse delivers tailored insights for your specific platform 
              and content style, including both faceless and persona-based channels.
            </p>
          </div>
        </div>

        {/* FAQ Section for GEO */}
        <section className="mb-14" itemScope itemType="https://schema.org/FAQPage">
          <h3 className="text-sm font-semibold text-foreground mb-6 tracking-apple">Frequently Asked Questions</h3>
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
                a: 'Yes, NichePulse AI is completely free. Enter your niche, select your platform and content style, and get instant AI-powered analysis including scorecards, outlier creators, viral content examples, and content blueprints.',
              },
            ].map((faq) => (
              <div 
                key={faq.q} 
                className="rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 p-4"
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NichePulse AI — AI-Powered Niche Analysis & Viral Video Idea Generator
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>YouTube Niche Finder</span>
            <span>TikTok Viral Ideas</span>
            <span>Instagram Content Strategy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
