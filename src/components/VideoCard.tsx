import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, ThumbsUp, MessageCircle, ExternalLink, Film } from 'lucide-react';
import type { ViralContent } from '@/hooks/useNicheAnalysis';

interface VideoCardProps {
  video: ViralContent;
  index: number;
}

const VideoCard = ({ video, index }: VideoCardProps) => {
  const [imgError, setImgError] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const handleClick = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="overflow-hidden rounded-2xl backdrop-blur-xl bg-card/50 border border-border/40 group cursor-pointer hover:bg-card/70 hover:border-border/60 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted/50 overflow-hidden">
        {!imgError ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/8 to-muted/50 gap-2">
            <Film className="w-7 h-7 text-primary/30" />
            <span className="text-[11px] text-muted-foreground text-center px-4 line-clamp-2">{video.title}</span>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
        
        {/* Platform badge */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10">
          <span className="text-[11px] font-medium text-white capitalize">{video.platform}</span>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm">
          <span className="text-[11px] text-white tabular-nums">{video.duration}</span>
        </div>

        {video.videoUrl && (
          <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h4 className="font-medium text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors tracking-apple text-sm leading-snug">
          {video.title}
        </h4>
        
        <p className="text-[11px] text-muted-foreground mb-3 font-medium">{video.creator}</p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span className="tabular-nums">{formatNumber(video.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span className="tabular-nums">{formatNumber(video.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span className="tabular-nums">{formatNumber(video.comments)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
