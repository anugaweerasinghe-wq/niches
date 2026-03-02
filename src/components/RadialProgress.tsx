import { motion } from 'framer-motion';

interface RadialProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

const RadialProgress = ({ value, size = 56, strokeWidth = 4, label, className = '' }: RadialProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-md"
        style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)` }}
      />
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-primary tabular-nums leading-none">{value}%</span>
        {label && <span className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</span>}
      </div>
    </div>
  );
};

export default RadialProgress;
