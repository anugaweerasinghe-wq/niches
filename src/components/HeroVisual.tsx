import { motion } from "framer-motion";
import { BarChart3, FileText, Sparkles } from "lucide-react";

const features = [
  { label: "AI niche analysis", icon: BarChart3, delay: 0 },
  { label: "Viral predictions", icon: Sparkles, delay: 0.12 },
  { label: "Content blueprints", icon: FileText, delay: 0.24 },
];

const HeroVisual = () => {
  return (
    <div className="relative mx-auto mt-2 w-full max-w-xl" aria-hidden="true">
      {[0, 0.5, 1].map((delay, index) => (
        <motion.div
          key={index}
          className="absolute left-1/2 top-[42%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15"
          animate={{
            scale: [1, 1.7 + index * 0.14, 1],
            opacity: [0.24, 0, 0.24],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeOut",
            delay,
          }}
        />
      ))}

      <motion.div
        className="spotlight-ring absolute left-1/2 top-[42%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <motion.path
            d="M3 14L7.5 9.5L11 13L16.5 6L21 10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>

      <div className="h-28 md:h-32" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {features.map((feature) => (
          <motion.div
            key={feature.label}
            className="rounded-2xl border border-white/6 bg-white/[0.04] px-4 py-3 text-center backdrop-blur-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay + 0.3, duration: 0.45 }}
          >
            <feature.icon className="mx-auto mb-2 h-4 w-4 text-primary" />
            <p className="text-xs font-medium text-foreground">
              {feature.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroVisual;
