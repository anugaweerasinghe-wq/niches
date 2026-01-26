import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Gauge, Rocket, Zap } from 'lucide-react';
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
      color: scorecard.marketSaturation > 70 ? 'text-destructive' : scorecard.marketSaturation > 40 ? 'text-warning' : 'text-success',
      description: scorecard.marketSaturation > 70 ? 'Highly competitive' : scorecard.marketSaturation > 40 ? 'Moderate competition' : 'Low competition'
    },
    {
      label: 'Growth Potential',
      value: scorecard.growthPotential,
      icon: <Rocket className="w-5 h-5" />,
      color: scorecard.growthPotential > 70 ? 'text-success' : scorecard.growthPotential > 40 ? 'text-warning' : 'text-destructive',
      description: scorecard.growthPotential > 70 ? 'Excellent opportunity' : scorecard.growthPotential > 40 ? 'Moderate potential' : 'Limited growth'
    },
    {
      label: 'The Gap Score',
      value: scorecard.gapScore,
      icon: <Target className="w-5 h-5" />,
      color: scorecard.gapScore > 70 ? 'text-success' : scorecard.gapScore > 40 ? 'text-warning' : 'text-destructive',
      description: scorecard.gapScore > 70 ? 'Strong opportunity gap' : scorecard.gapScore > 40 ? 'Some opportunities' : 'Crowded space'
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          className="card-elevated p-6"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted">
              {card.icon}
            </div>
            <span className="text-sm font-medium text-muted-foreground tracking-apple">
              {card.label}
            </span>
          </div>
          
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-4xl font-bold tracking-apple-tight ${card.color}`}>
              {card.value}
            </span>
            <span className="text-muted-foreground text-sm mb-1">/100</span>
          </div>
          
          <p className="text-sm text-muted-foreground">{card.description}</p>
          
          {/* Mini progress bar */}
          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                card.color === 'text-success' ? 'bg-success' : 
                card.color === 'text-warning' ? 'bg-warning' : 'bg-destructive'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${card.value}%` }}
              transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ScorecardGrid;
