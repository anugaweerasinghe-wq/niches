import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import type { ViralContent } from '@/hooks/useNicheAnalysis';

interface VideoCardProps {
  video: ViralContent;
  index: number;
}

const VideoCard = ({ video, index }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && video.videoUrl) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, likely due to browser restrictions
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      className="card-elevated overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail / Video Preview */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {/* Static Thumbnail */}
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isHovered && (video.videoUrl || video.previewGif) ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video Preview (if available) */}
        <AnimatePresence>
          {isHovered && video.videoUrl && (
            <motion.video
              ref={videoRef}
              src={video.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              muted
              loop
              playsInline
            />
          )}
        </AnimatePresence>

        {/* Animated GIF Preview (fallback) */}
        <AnimatePresence>
          {isHovered && video.previewGif && !video.videoUrl && (
            <motion.img
              src={video.previewGif}
              alt={`${video.title} preview`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* Play overlay - hidden during preview */}
        <AnimatePresence>
          {!isHovered && (
            <motion.div 
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Play Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered && !video.videoUrl && !video.previewGif ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </motion.div>
        
        {/* Platform badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
          <span className="text-xs font-medium text-white capitalize">{video.platform}</span>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
          <span className="text-xs text-white">{video.duration}</span>
        </div>

        {/* Preview indicator */}
        <AnimatePresence>
          {isHovered && (video.videoUrl || video.previewGif) && (
            <motion.div
              className="absolute top-2 right-2 px-2 py-1 rounded-md bg-primary/80 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-xs font-medium text-white">Preview</span>
            </motion.div>
          )}
        </AnimatePresence>
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
