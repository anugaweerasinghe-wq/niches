import { motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center gap-2.5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="h-8 w-auto flex-shrink-0"
        style={{ mixBlendMode: 'screen', filter: 'brightness(1.1)' }}
      >
        <img 
          src={logoImg} 
          alt="NichePulse logo" 
          className="h-8 w-auto"
        />
      </div>
      
      <span className="text-lg font-bold tracking-tight text-foreground">
        NichePulse
      </span>
    </motion.div>
  );
};

export default Logo;
