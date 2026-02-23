import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Clock, Flame, Hash, Target, 
  Zap, TrendingUp, Copy, Check, Sparkles, Timer,
  BarChart3, MessageSquare, Activity, Signal, Search
} from 'lucide-react';
import type { ViralIdea } from '@/hooks/useViralIdeas';

interface ViralIdeaCardProps {
  idea: ViralIdea;
  index: number;
  rank: number;
}

const emotionColors: Record<string, string> = {
  curiosity: 'bg-primary/10 text-primary border border-primary/20',
  shock: 'bg-destructive/10 text-destructive border border-destructive/20',
  inspiration: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border border-[hsl(var(--success))]/20',
  humor: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border border-[hsl(var(--warning))]/20',
  fear: 'bg-destructive/10 text-destructive border border-destructive/20',
  awe: 'bg-primary/10 text-primary border border-primary/20',
};

const competitionColors: Record<string, string> = {
  Low: 'text-[hsl(var(--success))]',
  Medium: 'text-[hsl(var(--warning))]',
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

  const viralityColor = idea.viralityScore >= 80 
    ? 'text-[hsl(var(--success))]' 
    : idea.viralityScore >= 60 
      ? 'text-[hsl(var(--warning))]' 
      : 'text-muted-foreground';

  const viralityBg = idea.viralityScore >= 80 
    ? 'bg-[hsl(var(--success))]/10' 
    : idea.viralityScore >= 60 
      ? 'bg-[hsl(var(--warning))]/10' 
      : 'bg-muted/50';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div 
        className={`relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-500 ${
          isExpanded 
            ? 'bg-card/80 ring-1 ring-primary/20 shadow-2xl shadow-primary/5' 
            : 'bg-card/40 hover:bg-card/60 ring-1 ring-border/50 hover:ring-border'
        }`}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />

        {/* Main Card Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-full text-left p-5 md:p-6"
        >
          <div className="flex items-start gap-4">
            {/* Rank Badge with glow */}
            <div className={`flex-shrink-0 w-11 h-11 rounded-2xl ${viralityBg} backdrop-blur-sm flex items-center justify-center border border-border/30`}>
              <span className={`text-sm font-bold ${viralityColor}`}>#{rank}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${emotionColors[idea.targetEmotion] || 'bg-muted text-muted-foreground border border-border'}`}>
                  {idea.targetEmotion}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted/50 text-muted-foreground border border-border/50 backdrop-blur-sm">
                  {idea.contentFormat}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-semibold text-foreground tracking-apple leading-snug mb-3 pr-8">
                {idea.title}
              </h3>

              {/* Stats Row */}
              <div className="flex items-center gap-3 md:gap-5 flex-wrap text-sm">
                <div className="flex items-center gap-1.5">
                  <Flame className={`w-3.5 h-3.5 ${viralityColor}`} />
                  <span className={`font-bold tabular-nums ${viralityColor}`}>{idea.viralityScore}%</span>
                  <span className="text-muted-foreground text-xs">viral</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-primary tabular-nums">{idea.engagementRate}</span>
                  <span className="text-muted-foreground text-xs">eng.</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className={`font-medium ${competitionColors[idea.competitionLevel]}`}>{idea.competitionLevel}</span>
                </div>
              </div>
            </div>

            {/* Expand Chevron */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-shrink-0 mt-1 w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </div>
        </button>

        {/* Expandable Deep Dive */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="relative px-5 md:px-6 pb-6 pt-0 space-y-5">
                <div className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Algorithm & Retention Insights */}
                <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/10 p-3.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1.5">
                      <Signal className="w-3.5 h-3.5" />
                      Algorithm Signal
                    </div>
                    <p className="text-[13px] text-foreground/80 leading-relaxed">{idea.algorithmSignal}</p>
                  </div>
                  <div className="rounded-xl bg-[hsl(var(--success))]/5 backdrop-blur-sm border border-[hsl(var(--success))]/10 p-3.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-[hsl(var(--success))] mb-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      Retention Insight
                    </div>
                    <p className="text-[13px] text-foreground/80 leading-relaxed">{idea.retentionInsight}</p>
                  </div>
                </div>

                {/* Hook Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Zap className="w-4 h-4 text-primary" />
                      Opening Hook
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(idea.hook, 'hook'); }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === 'hook' ? <Check className="w-3 h-3 text-[hsl(var(--success))]" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'hook' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm text-foreground/70 bg-muted/30 backdrop-blur-sm rounded-xl p-4 italic leading-relaxed border border-border/30">
                    "{idea.hook}"
                  </p>
                </div>

                {/* Script Outline */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Script Outline
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{idea.scriptOutline}</p>
                </div>

                {/* Why It Works — Data-backed */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Data-Backed Analysis
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{idea.whyItWorks}</p>
                </div>

                {/* Thumbnail Concept */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    Thumbnail Concept
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{idea.thumbnailConcept}</p>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      Best Time
                    </div>
                    <p className="text-sm font-medium text-foreground">{idea.bestPostingTime}</p>
                  </div>
                  <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">
                      <Timer className="w-3 h-3" />
                      Production
                    </div>
                    <p className="text-sm font-medium text-foreground">{idea.estimatedProductionTime}</p>
                  </div>
                  <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">
                      <Search className="w-3 h-3" />
                      Search Vol.
                    </div>
                    <p className="text-sm font-medium text-foreground">{idea.searchVolume}</p>
                  </div>
                  <div className="bg-muted/30 backdrop-blur-sm rounded-xl p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1 uppercase tracking-wider">
                      <TrendingUp className="w-3 h-3" />
                      Trend
                    </div>
                    <p className="text-sm font-medium text-foreground">{idea.trendAlignment}</p>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Hash className="w-4 h-4 text-primary" />
                      Hashtags
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(idea.hashtags.map(h => `#${h}`).join(' '), 'hashtags'); }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === 'hashtags' ? <Check className="w-3 h-3 text-[hsl(var(--success))]" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'hashtags' ? 'Copied' : 'Copy all'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {idea.hashtags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-xs font-medium border border-primary/15 backdrop-blur-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/[0.02] backdrop-blur-sm border border-primary/10 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    Suggested Call-to-Action
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{idea.callToAction}"</p>
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
