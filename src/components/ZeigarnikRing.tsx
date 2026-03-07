import { motion } from 'framer-motion';

const ZeigarnikRing = () => {
  const progress = 85; // Stays at 85% until user saves 3 niches
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-7 h-7 cursor-pointer group" title="Setup Progress: 85%">
      <svg viewBox="0 0 24 24" className="w-full h-full -rotate-90">
        <circle cx="12" cy="12" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
        <motion.circle
          cx="12" cy="12" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-foreground">
        {progress}
      </span>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-popover text-popover-foreground text-[9px] px-2 py-1 rounded-md border border-border shadow-md pointer-events-none">
        Save 3 niches to complete setup
      </div>
    </div>
  );
};

export default ZeigarnikRing;
