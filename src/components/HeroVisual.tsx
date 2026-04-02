import { motion } from 'framer-motion';
import { Sparkles, BarChart3, FileText } from 'lucide-react';

const HeroVisual = () => {
  const features = [
    { label: 'AI Niche Analysis', icon: BarChart3 },
    { label: 'Viral Predictions', icon: Sparkles },
    { label: 'Content Blueprints', icon: FileText },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto mt-2 mb-6" aria-hidden="true">
      {/* Subtle pulse rings */}
      {[0, 1].map((delay) => (
        <motion.div
          key={delay}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-primary/8"
          animate={{ scale: [1, 1.6, 1], opacity: [0.12, 0, 0.12] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeOut', delay: delay * 1 }}
        />
      ))}

      {/* Center icon */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary/5 border border-primary/8 flex items-center justify-center"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round">
          <motion.path
            d="M2 12L6 8L10 14L14 6L18 12L22 10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          />
        </motion.svg>
      </motion.div>

      <div className="h-20" />

      {/* Feature chips — strict horizontal alignment */}
      <div className="flex items-center justify-center gap-3">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm text-muted-foreground text-[11px] font-medium whitespace-nowrap hover:text-foreground hover:border-primary/15 transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <f.icon className="w-3 h-3 flex-shrink-0 text-primary/70" />
            {f.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroVisual;
