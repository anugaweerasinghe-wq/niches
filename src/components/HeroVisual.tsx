import { motion } from 'framer-motion';
import { Sparkles, BarChart3, FileText } from 'lucide-react';

const HeroVisual = () => {
  const features = [
    { label: 'AI Niche Analysis', icon: BarChart3 },
    { label: 'Viral Predictions', icon: Sparkles },
    { label: 'Content Blueprints', icon: FileText },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto mt-4 mb-4" aria-hidden="true">
      {/* Subtle pulse rings */}
      {[0, 0.8].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-primary/10"
          animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeOut', delay }}
        />
      ))}

      {/* Center icon */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary/6 border border-primary/10 flex items-center justify-center"
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

      <div className="h-24" />

      {/* Feature chips — strict horizontal alignment */}
      <div className="flex items-center justify-center gap-2.5">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/10 bg-primary/4 text-primary text-[11px] font-medium whitespace-nowrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
          >
            <f.icon className="w-3 h-3 flex-shrink-0" />
            {f.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroVisual;
