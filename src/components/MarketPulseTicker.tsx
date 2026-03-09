import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { nicheDatabase } from '@/data/niches';

const MarketPulseTicker = () => {
  // Build ticker items from real niche data with valid routes
  const tickerItems = useMemo(() => {
    const shuffled = [...nicheDatabase].sort(() => Math.random() - 0.5);
    return shuffled.map(n => ({
      label: `${n.title} +${n.growthRate}%`,
      slug: n.slug,
    }));
  }, []);

  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % tickerItems.length);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  const current = tickerItems[index];

  return (
    <Link
      to={`/niche/${current.slug}`}
      className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium border transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
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
          {current.label}
        </motion.span>
      </AnimatePresence>
    </Link>
  );
};

export default MarketPulseTicker;
