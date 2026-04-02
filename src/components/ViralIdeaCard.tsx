import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Clock, Flame, Hash, Target, 
  Zap, Copy, Check, Sparkles, Timer,
  MessageSquare, Activity, Signal, Search
} from 'lucide-react';
import RadialProgress from '@/components/RadialProgress';
import TrendSparkline from '@/components/TrendSparkline';
import type { ViralIdea } from '@/hooks/useViralIdeas';

interface ViralIdeaCardProps {
  idea: ViralIdea;
  index: number;
  rank: number;
}

const emotionColors: Record<string, string> = {
  curiosity: 'bg-primary/8 text-primary border-primary/15',
  shock: 'bg-destructive/8 text-destructive border-destructive/15',
  inspiration: 'bg-success/8 text-success border-success/15',
  humor: 'bg-warning/8 text-warning border-warning/15',
  fear: 'bg-destructive/8 text-destructive border-destructive/15',
  awe: 'bg-primary/8 text-primary border-primary/15',
};

const competitionColors: Record<string, string> = {
  Low: 'text-success',
  Medium: 'text-warning',
  High: 'text-destructive',
};

const ViralIdeaCard = ({ idea, index, rank }: ViralIdeaCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div 
        className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl transition-all duration-500 ${
          isExpanded 
            ? 'glass-card border-primary/15 shadow-2xl shadow-primary/5' 
            : 'glass-card hover:border-primary/10 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.015] to-transparent pointer-events-none" />

        {/* Compact Bento Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-full text-left p-5 md:p-6"
        >
          <div className="flex items-start gap-3.5">
            {/* Radial Virality Score */}
            <div className="flex-shrink-0">
              <RadialProgress value={idea.viralityScore} size={54} strokeWidth={3} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Micro-chip tags */}
              <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${emotionColors[idea.targetEmotion] || 'bg-muted text-muted-foreground border-border'}`}>
                  {idea.targetEmotion}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/30 text-muted-foreground border border-border/20">
                  {idea.contentFormat}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border border-border/20 bg-muted/20 ${competitionColors[idea.competitionLevel]}`}>
                  {idea.competitionLevel}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-foreground tracking-apple leading-snug mb-2.5 pr-6 line-clamp-2">
                {idea.title}
              </h3>

              {/* Stats row + sparkline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-primary" />
                    <span className="font-bold text-primary tabular-nums">{idea.viralityScore}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium text-foreground tabular-nums">{idea.engagementRate}</span>
                  </div>
                </div>
                <TrendSparkline width={52} height={20} />
              </div>
            </div>

            {/* Expand */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="flex-shrink-0 w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center border border-border/15"
            >
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.div>
          </div>
        </button>

        {/* Expandable Detail */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="relative px-5 md:px-6 pb-6 pt-0 space-y-4">
                <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                {/* Algorithm & Retention */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="rounded-xl bg-primary/4 border border-primary/8 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary mb-1.5 uppercase tracking-wider">
                      <Signal className="w-3 h-3" />
                      Algorithm
                    </div>
                    <p className="text-[12px] text-foreground/70 leading-relaxed">{idea.algorithmSignal}</p>
                  </div>
                  <div className="rounded-xl bg-success/4 border border-success/8 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-success mb-1.5 uppercase tracking-wider">
                      <Activity className="w-3 h-3" />
                      Retention
                    </div>
                    <p className="text-[12px] text-foreground/70 leading-relaxed">{idea.retentionInsight}</p>
                  </div>
                </div>

                {/* Hook */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      Hook
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(idea.hook, 'hook'); }}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === 'hook' ? <Check className="w-2.5 h-2.5 text-success" /> : <Copy className="w-2.5 h-2.5" />}
                      {copiedField === 'hook' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-foreground/60 bg-muted/20 rounded-xl p-3.5 italic leading-relaxed border border-border/15">
                    "{idea.hook}"
                  </p>
                </div>

                {/* Script + Why + Thumbnail */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      Script Outline
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{idea.scriptOutline}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Why It Works
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{idea.whyItWorks}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                      <Target className="w-3.5 h-3.5 text-primary" />
                      Thumbnail
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{idea.thumbnailConcept}</p>
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Clock, label: 'Time', value: idea.bestPostingTime },
                    { icon: Timer, label: 'Prod.', value: idea.estimatedProductionTime },
                    { icon: Search, label: 'Vol.', value: idea.searchVolume },
                    { icon: Sparkles, label: 'Trend', value: idea.trendAlignment },
                  ].map((m) => (
                    <div key={m.label} className="bg-muted/15 rounded-xl p-2.5 border border-border/15">
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground mb-1 uppercase tracking-wider">
                        <m.icon className="w-2.5 h-2.5" />
                        {m.label}
                      </div>
                      <p className="text-[11px] font-medium text-foreground truncate">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Hash className="w-3.5 h-3.5 text-primary" />
                      Tags
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(idea.hashtags.map(h => `#${h}`).join(' '), 'hashtags'); }}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === 'hashtags' ? <Check className="w-2.5 h-2.5 text-success" /> : <Copy className="w-2.5 h-2.5" />}
                      {copiedField === 'hashtags' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.hashtags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-primary/6 text-primary text-[10px] font-medium border border-primary/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-primary/4 border border-primary/8 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    Call-to-Action
                  </div>
                  <p className="text-xs text-muted-foreground italic">"{idea.callToAction}"</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default ViralIdeaCard;
