import { motion } from 'framer-motion';

interface TrendSparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  className?: string;
}

const generateTrendData = (trend: 'up' | 'stable' = 'up'): number[] => {
  const points = 8;
  const data: number[] = [];
  let value = 20 + Math.random() * 20;
  for (let i = 0; i < points; i++) {
    value += (trend === 'up' ? 3 : 0) + (Math.random() - 0.4) * 10;
    data.push(Math.max(5, Math.min(95, value)));
  }
  return data;
};

const TrendSparkline = ({ data, width = 64, height = 24, className = '' }: TrendSparklineProps) => {
  const points = data || generateTrendData('up');
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const pathData = points
    .map((val, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  // Area fill path
  const areaPath = `${pathData} L${width},${height} L0,${height} Z`;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sparkFill)" />
        <motion.path
          d={pathData}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* End dot */}
        <motion.circle
          cx={(points.length - 1) / (points.length - 1) * width}
          cy={height - ((points[points.length - 1] - min) / range) * (height - 4) - 2}
          r="2"
          fill="hsl(var(--primary))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 }}
        />
      </svg>
    </div>
  );
};

export default TrendSparkline;
