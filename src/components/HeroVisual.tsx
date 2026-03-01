import { motion } from 'framer-motion';
import { Sparkles, BarChart3, FileText } from 'lucide-react';

/** Premium hero — three feature chips aligned on a strict horizontal axis */
const HeroVisual = () => {
  const features = [
    { label: 'AI Niche Analysis', icon: BarChart3, delay: 0 },
    { label: 'Viral Predictions', icon: Sparkles, delay: 0.15 },
    { label: 'Content Blueprints', icon: FileText, delay: 0.3 },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto mt-6 mb-2" aria-hidden="true">
      {/* Central pulse rings */}
      {[0, 0.6, 1.2].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-primary/15"
          animate={{ scale: [1, 1.6 + i * 0.1, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay }}
        />
      ))}

      {/* Center glow dot */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-primary/8 backdrop-blur-2xl border border-primary/15 flex items-center justify-center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round">
          <motion.path
            d="M2 12L6 8L10 14L14 6L18 12L22 10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          />
        </motion.svg>
      </motion.div>

      {/* Spacer for the rings */}
      <div className="h-40 md:h-48" />

      {/* Horizontally aligned feature chips — strict flexbox row */}
      <div className="flex items-center justify-center gap-3 md:gap-4">
        {features.map((f) => (
          <motion.div
            key={f.label}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-2xl border border-primary/15 bg-primary/6 text-primary text-xs font-medium whitespace-nowrap shadow-lg shadow-primary/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: f.delay + 0.4, duration: 0.5 }}
          >
            <f.icon className="w-3.5 h-3.5 flex-shrink-0" />
            {f.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroVisual;
