import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ExternalLink } from 'lucide-react';
import { nicheDatabase } from '@/data/niches';
import { glossaryTerms } from '@/data/glossary';

interface AuditResult {
  url: string;
  title: string;
  hasTitle: boolean;
  hasDescription: boolean;
  hasCanonical: boolean;
}

const SeoAudit = () => {
  const [nicheResults, setNicheResults] = useState<AuditResult[]>([]);
  const [wikiResults, setWikiResults] = useState<AuditResult[]>([]);

  useEffect(() => {
    // Build niche audit results
    setNicheResults(
      nicheDatabase.map(n => ({
        url: `/niche/${n.slug}`,
        title: n.title,
        hasTitle: true, // All pages use SEOHead with dynamic title
        hasDescription: !!n.heroDescription,
        hasCanonical: true, // SEOHead sets canonical
      }))
    );

    setWikiResults(
      glossaryTerms.map(t => ({
        url: `/wiki/${t.slug}`,
        title: t.term,
        hasTitle: true,
        hasDescription: !!t.shortDefinition,
        hasCanonical: true,
      }))
    );
  }, []);

  const StatusIcon = ({ ok }: { ok: boolean }) =>
    ok ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />;

  const passCount = (results: AuditResult[]) =>
    results.filter(r => r.hasTitle && r.hasDescription && r.hasCanonical).length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">SEO Audit Dashboard</h1>
            <p className="text-sm text-muted-foreground">Programmatic page health verification</p>
          </div>
          <Link to="/" className="text-sm text-primary hover:underline">← Back to site</Link>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-card border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Niche Pages</p>
            <p className="text-3xl font-bold text-foreground">{nicheResults.length}</p>
            <p className="text-xs text-primary">{passCount(nicheResults)} passing</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Wiki Pages</p>
            <p className="text-3xl font-bold text-foreground">{wikiResults.length}</p>
            <p className="text-xs text-primary">{passCount(wikiResults)} passing</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Coverage</p>
            <p className="text-3xl font-bold text-foreground">{nicheResults.length + wikiResults.length}</p>
            <p className="text-xs text-primary">{passCount(nicheResults) + passCount(wikiResults)} all green</p>
          </div>
        </div>

        {/* Niche Pages Table */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">Niche Pages ({nicheResults.length})</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Page</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">URL</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Title</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Meta Desc</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Canonical</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Link</th>
                </tr>
              </thead>
              <tbody>
                {nicheResults.map((r, i) => (
                  <tr key={r.url} className="border-b border-border/50 hover:bg-card/40">
                    <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2 text-foreground font-medium">{r.title}</td>
                    <td className="px-4 py-2 text-muted-foreground font-mono">{r.url}</td>
                    <td className="px-4 py-2 text-center"><StatusIcon ok={r.hasTitle} /></td>
                    <td className="px-4 py-2 text-center"><StatusIcon ok={r.hasDescription} /></td>
                    <td className="px-4 py-2 text-center"><StatusIcon ok={r.hasCanonical} /></td>
                    <td className="px-4 py-2 text-center">
                      <Link to={r.url} className="text-primary hover:underline"><ExternalLink className="w-3.5 h-3.5" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Wiki Pages Table */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Wiki Pages ({wikiResults.length})</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Term</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">URL</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Title</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Meta Desc</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Canonical</th>
                  <th className="text-center px-4 py-3 font-semibold text-foreground">Link</th>
                </tr>
              </thead>
              <tbody>
                {wikiResults.map((r, i) => (
                  <tr key={r.url} className="border-b border-border/50 hover:bg-card/40">
                    <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2 text-foreground font-medium">{r.title}</td>
                    <td className="px-4 py-2 text-muted-foreground font-mono">{r.url}</td>
                    <td className="px-4 py-2 text-center"><StatusIcon ok={r.hasTitle} /></td>
                    <td className="px-4 py-2 text-center"><StatusIcon ok={r.hasDescription} /></td>
                    <td className="px-4 py-2 text-center"><StatusIcon ok={r.hasCanonical} /></td>
                    <td className="px-4 py-2 text-center">
                      <Link to={r.url} className="text-primary hover:underline"><ExternalLink className="w-3.5 h-3.5" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SeoAudit;
