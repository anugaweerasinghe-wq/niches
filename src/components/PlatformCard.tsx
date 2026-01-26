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
    icon: <Youtube className="w-8 h-8" />,
    label: 'YouTube',
    color: 'hsl(0 100% 50%)'
  },
  tiktok: {
    icon: <Music2 className="w-8 h-8" />,
    label: 'TikTok',
    color: 'hsl(180 100% 50%)'
  },
  instagram: {
    icon: <Instagram className="w-8 h-8" />,
    label: 'Instagram',
    color: 'hsl(330 100% 60%)'
  }
};

const PlatformCard = ({ platform, isSelected, onClick }: PlatformCardProps) => {
  const config = platformConfig[platform];

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-6 rounded-2xl glow-border transition-all duration-300 ${
        isSelected ? 'active bg-secondary' : 'bg-card hover:bg-secondary/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        <div 
          className="p-4 rounded-xl transition-colors duration-300"
          style={{ 
            backgroundColor: isSelected ? `${config.color}20` : 'hsl(var(--muted))',
            color: isSelected ? config.color : 'hsl(var(--muted-foreground))'
          }}
        >
          {config.icon}
        </div>
        <span className={`font-medium tracking-apple ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
          {config.label}
        </span>
      </div>
      
      {isSelected && (
        <motion.div
          className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        />
      )}
    </motion.button>
  );
};

export default PlatformCard;
