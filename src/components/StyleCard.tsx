import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface StyleCardProps {
  style: 'faceless' | 'persona';
  isSelected: boolean;
  onClick: () => void;
}

const styleConfig = {
  faceless: {
    icon: <Bot className="w-7 h-7" />,
    label: 'Faceless / AI-Driven',
    description: 'Automated content with voiceovers and AI-generated visuals'
  },
  persona: {
    icon: <User className="w-7 h-7" />,
    label: 'Persona-Led',
    description: 'Build a personal brand with on-camera presence'
  }
};

const StyleCard = ({ style, isSelected, onClick }: StyleCardProps) => {
  const config = styleConfig[style];

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-6 rounded-2xl text-left transition-all duration-300 border ${
        isSelected 
          ? 'glass-card border-primary/20 shadow-lg shadow-primary/5' 
          : 'glass-card hover:border-border/40 hover:shadow-lg hover:shadow-background/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-4">
        <div 
          className={`p-3 rounded-xl transition-colors duration-300 ${
            isSelected ? 'bg-primary/10 text-primary' : 'bg-muted/30 text-muted-foreground'
          }`}
        >
          {config.icon}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold tracking-apple mb-1.5 text-sm ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
            {config.label}
          </h3>
          <p className="text-sm text-muted-foreground/70 leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
      
      {isSelected && (
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        />
      )}
    </motion.button>
  );
};

export default StyleCard;
