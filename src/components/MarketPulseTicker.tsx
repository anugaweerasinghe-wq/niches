import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const trendingTopics = [
  'AI Agents +142%', 'Faceless YouTube +89%', 'No-Code SaaS +67%',
  'Stoicism Shorts +55%', 'Cybersecurity +52%', 'EV Reviews +48%',
  '3D Printing +41%', 'Street Food +38%', 'Horror ASMR +35%',
  'Automation Tools +61%', 'Credit Repair +27%', 'Urbex Content +40%',
];

const MarketPulseTicker = () => {
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % trendingTopics.length);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium border transition-all duration-300 cursor-default ${
        flash
          ? 'bg-primary/10 border-primary/20 text-primary'
          : 'bg-muted/30 border-border/20 text-muted-foreground'
      }`}
    >
      <TrendingUp className="w-3 h-3 flex-shrink-0" />
      <span className="text-[9px] uppercase tracking-wider opacity-60 mr-1">Live</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap"
        >
          {trendingTopics[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default MarketPulseTicker;
