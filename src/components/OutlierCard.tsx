import { motion } from 'framer-motion';
import { Users, Eye, ExternalLink } from 'lucide-react';
import RadialProgress from '@/components/RadialProgress';
import TrendSparkline from '@/components/TrendSparkline';
import type { OutlierCreator } from '@/hooks/useNicheAnalysis';

interface OutlierCardProps {
  creator: OutlierCreator;
  index: number;
}

const OutlierCard = ({ creator, index }: OutlierCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleClick = () => {
    if (creator.channelUrl) {
      window.open(creator.channelUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Convert ratio to a percentage for the radial (cap at 100)
  const ratioPercent = Math.min(Math.round(creator.viewToFollowerRatio * 20), 100);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl backdrop-blur-2xl bg-card/40 p-4 group cursor-pointer hover:bg-card/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
      style={{ border: '0.5px solid hsl(var(--border) / 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={handleClick}
      whileHover={{ borderColor: 'hsl(var(--border) / 0.3)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-2xl pointer-events-none" />

      <div className="relative">
        {/* Top row: avatar + name + external link */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/10">
              {creator.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-xs text-foreground tracking-apple group-hover:text-primary transition-colors">
                {creator.name}
              </h4>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/30 mt-0.5">
                {creator.niche}
              </span>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-all" />
        </div>

        {/* Middle: Radial + Stats + Sparkline */}
        <div className="flex items-center gap-3 mb-3">
          <RadialProgress value={ratioPercent} size={44} strokeWidth={3} label="V/F" />
          
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="font-semibold text-foreground tabular-nums">{formatNumber(creator.followers)}</span>
              <span className="text-muted-foreground text-[10px]">followers</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Eye className="w-3 h-3 text-muted-foreground" />
              <span className="font-semibold text-foreground tabular-nums">{formatNumber(creator.avgViews)}</span>
              <span className="text-muted-foreground text-[10px]">avg views</span>
            </div>
          </div>

          <TrendSparkline width={48} height={20} />
        </div>

        {/* Micro-chip ratio badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/15">
            {creator.viewToFollowerRatio}x V/F Ratio
          </span>
        </div>
        
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {creator.insight}
        </p>

        {creator.channelUrl && (
          <p className="text-[10px] text-primary/40 mt-2 group-hover:text-primary transition-colors font-medium">
            Visit channel →
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default OutlierCard;
