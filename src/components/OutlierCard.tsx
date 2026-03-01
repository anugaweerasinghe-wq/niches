import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, ExternalLink } from 'lucide-react';
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

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-card/50 border border-border/40 p-6 group cursor-pointer hover:bg-card/70 hover:border-border/60 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center text-base font-bold text-primary backdrop-blur-sm border border-primary/10">
              {creator.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground tracking-apple group-hover:text-primary transition-colors">
                {creator.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">{creator.niche}</p>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-all" />
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2.5 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/30">
            <Users className="w-3 h-3 text-muted-foreground mx-auto mb-1" />
            <p className="text-sm font-semibold text-foreground tabular-nums">{formatNumber(creator.followers)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Followers</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/30">
            <Eye className="w-3 h-3 text-muted-foreground mx-auto mb-1" />
            <p className="text-sm font-semibold text-foreground tabular-nums">{formatNumber(creator.avgViews)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Avg Views</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-primary/6 backdrop-blur-sm border border-primary/12">
            <TrendingUp className="w-3 h-3 text-primary mx-auto mb-1" />
            <p className="text-sm font-bold text-primary tabular-nums">{creator.viewToFollowerRatio}x</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">V/F Ratio</p>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          {creator.insight}
        </p>

        {creator.channelUrl && (
          <p className="text-[11px] text-primary/50 mt-3 group-hover:text-primary transition-colors font-medium">
            Visit channel →
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default OutlierCard;
