import { motion } from 'framer-motion';
import { Youtube, Music2, Instagram } from 'lucide-react';
import { ReactNode } from 'react';

interface PlatformCardProps {
  platform: 'youtube' | 'tiktok' | 'instagram';
  isSelected: boolean;
  onClick: () => void;
}

const platformConfig: Record<string, { icon: ReactNode; label: string; color: string }> = {
  youtube: {
    icon: <Youtube className="w-7 h-7" />,
    label: 'YouTube',
    color: 'hsl(0 100% 50%)'
  },
  tiktok: {
    icon: <Music2 className="w-7 h-7" />,
    label: 'TikTok',
    color: 'hsl(180 100% 50%)'
  },
  instagram: {
    icon: <Instagram className="w-7 h-7" />,
    label: 'Instagram',
    color: 'hsl(330 100% 60%)'
  }
};

const PlatformCard = ({ platform, isSelected, onClick }: PlatformCardProps) => {
  const config = platformConfig[platform];

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-6 rounded-2xl transition-all duration-300 border ${
        isSelected 
          ? 'glass-card border-primary/20 shadow-lg shadow-primary/5' 
          : 'glass-card hover:border-border/40 hover:shadow-lg hover:shadow-background/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        <div 
          className="p-3.5 rounded-xl transition-colors duration-300"
          style={{ 
            backgroundColor: isSelected ? `${config.color}15` : 'hsl(var(--muted) / 0.4)',
            color: isSelected ? config.color : 'hsl(var(--muted-foreground))'
          }}
        >
          {config.icon}
        </div>
        <span className={`font-semibold tracking-apple text-sm ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
          {config.label}
        </span>
      </div>
      
      {isSelected && (
        <motion.div
          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        />
      )}
    </motion.button>
  );
};

export default PlatformCard;
