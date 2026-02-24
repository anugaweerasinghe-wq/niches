import { motion } from 'framer-motion';

/** Animated floating cards that showcase the tool's capabilities — serves as the "moving images" hero visual */
const HeroVisual = () => {
  const cards = [
    { label: '92% Viral Score', color: 'hsl(var(--success))', delay: 0 },
    { label: '1.2M Views Predicted', color: 'hsl(var(--primary))', delay: 0.3 },
    { label: 'Trending Niche ↑', color: 'hsl(var(--warning))', delay: 0.6 },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto h-48 md:h-56 mt-8 mb-4">
      {/* Central pulsing ring */}
      <motion.div
        className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-primary/20"
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-primary/30"
        animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
      />

      {/* Central icon */}
      <motion.div
        className="absolute inset-0 m-auto w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round">
          <motion.path
            d="M2 12L6 8L10 14L14 6L18 12L22 10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          />
        </motion.svg>
      </motion.div>

      {/* Floating metric cards */}
      {cards.map((card, i) => {
        const angle = (i * 120 - 90) * (Math.PI / 180);
        const radius = 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={card.label}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [y, y - 8, y],
            }}
            transition={{
              opacity: { delay: card.delay + 0.5, duration: 0.5 },
              scale: { delay: card.delay + 0.5, duration: 0.5 },
              y: { delay: card.delay + 1, duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div
              className="px-3 py-2 rounded-xl backdrop-blur-xl border text-xs font-medium whitespace-nowrap shadow-lg"
              style={{
                background: `${card.color} / 0.08`,
                borderColor: `${card.color} / 0.2`,
                color: card.color,
              }}
            >
              {card.label}
            </div>
          </motion.div>
        );
      })}

      {/* Orbiting dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-primary/30"
          animate={{
            x: [
              Math.cos((i * 60) * Math.PI / 180) * 70,
              Math.cos((i * 60 + 360) * Math.PI / 180) * 70,
            ],
            y: [
              Math.sin((i * 60) * Math.PI / 180) * 70,
              Math.sin((i * 60 + 360) * Math.PI / 180) * 70,
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default HeroVisual;
