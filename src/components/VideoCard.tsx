import { motion } from 'framer-motion';
import { Play, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import type { ViralContent } from '@/hooks/useNicheAnalysis';

interface VideoCardProps {
  video: ViralContent;
  index: number;
}

const VideoCard = ({ video, index }: VideoCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <motion.div
      className="card-elevated overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        
        {/* Platform badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
          <span className="text-xs font-medium text-white capitalize">{video.platform}</span>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
          <span className="text-xs text-white">{video.duration}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h4 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors tracking-apple text-sm">
          {video.title}
        </h4>
        
        <p className="text-xs text-muted-foreground mb-3">{video.creator}</p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{formatNumber(video.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{formatNumber(video.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>{formatNumber(video.comments)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
