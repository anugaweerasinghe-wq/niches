import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Clock, Eye, Flame, Hash, Target, 
  Zap, TrendingUp, Copy, Check, Sparkles, Timer,
  BarChart3, MessageSquare
} from 'lucide-react';
import type { ViralIdea } from '@/hooks/useViralIdeas';

interface ViralIdeaCardProps {
  idea: ViralIdea;
  index: number;
  rank: number;
}

const emotionColors: Record<string, string> = {
  curiosity: 'bg-primary/15 text-primary',
  shock: 'bg-destructive/15 text-destructive',
  inspiration: 'bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]',
  humor: 'bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]',
  fear: 'bg-destructive/15 text-destructive',
  awe: 'bg-primary/15 text-primary',
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group"
    >
      <div 
        className={`card-elevated overflow-hidden transition-all duration-300 ${
          isExpanded ? 'ring-1 ring-primary/30 shadow-lg shadow-primary/5' : 'hover:ring-1 hover:ring-border'
        }`}
      >
        {/* Main Card Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-5 md:p-6"
        >
          <div className="flex items-start gap-4">
            {/* Rank Badge */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">#{rank}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${emotionColors[idea.targetEmotion] || 'bg-muted text-muted-foreground'}`}>
                  <Target className="w-3 h-3" />
                  {idea.targetEmotion}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {idea.contentFormat}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-semibold text-foreground tracking-apple leading-snug mb-3 pr-8">
                {idea.title}
              </h3>

              {/* Metrics Row */}
              <div className="flex items-center gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-1.5">
                  <Flame className={`w-4 h-4 ${viralityColor}`} />
                  <span className={`font-semibold ${viralityColor}`}>{idea.viralityScore}%</span>
                  <span className="text-muted-foreground text-xs">viral</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{idea.estimatedViews}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BarChart3 className="w-4 h-4" />
                  <span className={competitionColors[idea.competitionLevel]}>{idea.competitionLevel}</span>
                </div>
              </div>
            </div>

            {/* Expand Chevron */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 mt-1"
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
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
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-6 pt-0 space-y-5 border-t border-border">
                {/* Hook Section */}
                <div className="pt-5">
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
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-3 italic leading-relaxed">
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

                {/* Why It Works */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Why This Will Perform
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{idea.whyItWorks}</p>
                </div>

                {/* Thumbnail Concept */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Thumbnail Concept
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{idea.thumbnailConcept}</p>
                </div>

                {/* Meta Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      Best Time
                    </div>
                    <p className="text-sm font-medium text-foreground">{idea.bestPostingTime}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Timer className="w-3 h-3" />
                      Production
                    </div>
                    <p className="text-sm font-medium text-foreground">{idea.estimatedProductionTime}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
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
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
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
