import { motion } from 'framer-motion';
import { Target, Gauge, Rocket } from 'lucide-react';
import type { NicheScorecard } from '@/hooks/useNicheAnalysis';

interface ScorecardGridProps {
  scorecard: NicheScorecard;
}

const ScorecardGrid = ({ scorecard }: ScorecardGridProps) => {
  const cards = [
    {
      label: 'Market Saturation',
      value: scorecard.marketSaturation,
      icon: <Gauge className="w-5 h-5" />,
      color: scorecard.marketSaturation > 70 ? 'text-destructive' : scorecard.marketSaturation > 40 ? 'text-[hsl(var(--warning))]' : 'text-[hsl(var(--success))]',
      barColor: scorecard.marketSaturation > 70 ? 'bg-destructive' : scorecard.marketSaturation > 40 ? 'bg-[hsl(var(--warning))]' : 'bg-[hsl(var(--success))]',
      description: scorecard.marketSaturation > 70 ? 'Highly competitive' : scorecard.marketSaturation > 40 ? 'Moderate competition' : 'Low competition'
    },
    {
      label: 'Growth Potential',
      value: scorecard.growthPotential,
      icon: <Rocket className="w-5 h-5" />,
      color: scorecard.growthPotential > 70 ? 'text-[hsl(var(--success))]' : scorecard.growthPotential > 40 ? 'text-[hsl(var(--warning))]' : 'text-destructive',
      barColor: scorecard.growthPotential > 70 ? 'bg-[hsl(var(--success))]' : scorecard.growthPotential > 40 ? 'bg-[hsl(var(--warning))]' : 'bg-destructive',
      description: scorecard.growthPotential > 70 ? 'Excellent opportunity' : scorecard.growthPotential > 40 ? 'Moderate potential' : 'Limited growth'
    },
    {
      label: 'The Gap Score',
      value: scorecard.gapScore,
      icon: <Target className="w-5 h-5" />,
      color: scorecard.gapScore > 70 ? 'text-[hsl(var(--success))]' : scorecard.gapScore > 40 ? 'text-[hsl(var(--warning))]' : 'text-destructive',
      barColor: scorecard.gapScore > 70 ? 'bg-[hsl(var(--success))]' : scorecard.gapScore > 40 ? 'bg-[hsl(var(--warning))]' : 'bg-destructive',
      description: scorecard.gapScore > 70 ? 'Strong opportunity gap' : scorecard.gapScore > 40 ? 'Some opportunities' : 'Crowded space'
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          className="relative overflow-hidden glass-card p-7 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-500"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none rounded-2xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20">
                {card.icon}
              </div>
              <span className="text-sm font-medium text-muted-foreground tracking-apple">
                {card.label}
              </span>
            </div>
            
            <div className="flex items-end gap-2 mb-3">
              <span className={`text-5xl font-extrabold tracking-apple-tight ${card.color}`}>
                {card.value}
              </span>
              <span className="text-muted-foreground text-sm mb-2">/100</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-5">{card.description}</p>
            
            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${card.barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${card.value}%` }}
                transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ScorecardGrid;
