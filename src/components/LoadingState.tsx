import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import logoImg from '@/assets/logo.png';

const statusMessages = [
  'Analyzing global trends',
  'Identifying outliers',
  'Cross-referencing viral hooks',
  'Calculating market saturation',
  'Discovering growth opportunities'
];

interface LoadingStateProps {
  progress: number;
}

const LoadingState = ({ progress }: LoadingStateProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated pulse rings */}
      <div className="relative w-32 h-32 mb-12">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.5], 
              opacity: [0.5, 0] 
            }}
            transition={{
              duration: 2,
              delay: i * 0.6,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
        
        {/* Center branded logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ 
              boxShadow: '0 0 40px hsl(var(--primary) / 0.3)',
              mixBlendMode: 'screen'
            }}
          >
            <img 
              src={logoImg} 
              alt="Loading" 
              className="w-16 h-16 object-contain"
              style={{ filter: 'brightness(1.1)' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary progress-glow rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Researching</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Status message */}
      <div className="h-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessageIndex}
            className="text-lg text-muted-foreground tracking-apple text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {statusMessages[currentMessageIndex]}...
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LoadingState;
