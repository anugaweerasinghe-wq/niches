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
      className="card-elevated p-5 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-semibold text-primary">
            {creator.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground tracking-apple group-hover:text-primary transition-colors">
              {creator.name}
            </h4>
            <p className="text-sm text-muted-foreground">{creator.niche}</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Users className="w-3 h-3" />
          </div>
          <p className="text-sm font-semibold text-foreground">{formatNumber(creator.followers)}</p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
        
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Eye className="w-3 h-3" />
          </div>
          <p className="text-sm font-semibold text-foreground">{formatNumber(creator.avgViews)}</p>
          <p className="text-xs text-muted-foreground">Avg Views</p>
        </div>
        
        <div className="text-center p-2 rounded-lg bg-primary/10">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <TrendingUp className="w-3 h-3" />
          </div>
          <p className="text-sm font-bold text-primary">{creator.viewToFollowerRatio}x</p>
          <p className="text-xs text-muted-foreground">V/F Ratio</p>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {creator.insight}
      </p>
    </motion.div>
  );
};

export default OutlierCard;
