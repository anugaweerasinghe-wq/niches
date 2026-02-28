import { motion } from 'framer-motion';

/** Premium animated hero — orbiting dots with pulsing rings and honest labels */
const HeroVisual = () => {
  const labels = [
    { label: 'AI Niche Analysis', delay: 0 },
    { label: 'Viral Predictions', delay: 0.4 },
    { label: 'Content Blueprints', delay: 0.8 },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto h-52 md:h-60 mt-6 mb-2" aria-hidden="true">
      {/* Pulse rings */}
      {[0, 0.5, 1].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 m-auto w-28 h-28 rounded-full border border-primary/20"
          animate={{ scale: [1, 1.5 + i * 0.15, 1], opacity: [0.25, 0, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay }}
        />
      ))}

      {/* Center glow */}
      <motion.div
        className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-primary/8 backdrop-blur-2xl border border-primary/15 flex items-center justify-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round">
          <motion.path
            d="M2 12L6 8L10 14L14 6L18 12L22 10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          />
        </motion.svg>
      </motion.div>

      {/* Floating label chips — no fake metrics */}
      {labels.map((m, i) => {
        const angle = (i * 120 - 90) * (Math.PI / 180);
        const r = 95;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        return (
          <motion.div
            key={m.label}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: [y, y - 6, y] }}
            transition={{
              opacity: { delay: m.delay + 0.6, duration: 0.5 },
              scale: { delay: m.delay + 0.6, duration: 0.5 },
              y: { delay: m.delay + 1.2, duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="px-3 py-1.5 rounded-xl backdrop-blur-2xl border border-primary/15 bg-primary/6 text-primary text-xs font-medium whitespace-nowrap shadow-lg shadow-primary/5">
              {m.label}
            </div>
          </motion.div>
        );
      })}

      {/* Orbiting dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-primary/25"
          animate={{
            x: [Math.cos((i * 60) * Math.PI / 180) * 65, Math.cos((i * 60 + 360) * Math.PI / 180) * 65],
            y: [Math.sin((i * 60) * Math.PI / 180) * 65, Math.sin((i * 60 + 360) * Math.PI / 180) * 65],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
        />
      ))}
    </div>
  );
};

export default HeroVisual;
