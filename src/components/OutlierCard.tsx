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

  return (
    <motion.div
      className="relative overflow-hidden card-premium p-6 group cursor-pointer hover:scale-[1.01] transition-transform duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-lg font-semibold text-primary backdrop-blur-sm">
              {creator.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold text-foreground tracking-apple group-hover:text-primary transition-colors">
                {creator.name}
              </h4>
              <p className="text-sm text-muted-foreground">{creator.niche}</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all" />
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="text-center p-2.5 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/30">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="w-3 h-3" />
            </div>
            <p className="text-sm font-semibold text-foreground tabular-nums">{formatNumber(creator.followers)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Followers</p>
          </div>
          
          <div className="text-center p-2.5 rounded-xl bg-muted/30 backdrop-blur-sm border border-border/30">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Eye className="w-3 h-3" />
            </div>
            <p className="text-sm font-semibold text-foreground tabular-nums">{formatNumber(creator.avgViews)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Views</p>
          </div>
          
          <div className="text-center p-2.5 rounded-xl bg-primary/6 backdrop-blur-sm border border-primary/12">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <TrendingUp className="w-3 h-3" />
            </div>
            <p className="text-sm font-bold text-primary tabular-nums">{creator.viewToFollowerRatio}x</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">V/F Ratio</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {creator.insight}
        </p>
      </div>
    </motion.div>
  );
};

export default OutlierCard;
