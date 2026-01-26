import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a0a0a0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a0a0a0" />
          </linearGradient>
          <linearGradient id="pulseGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* P letter */}
        <path
          d="M12 8V32M12 8H22C26.4183 8 30 11.5817 30 16C30 20.4183 26.4183 24 22 24H12"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Pulse line integrated */}
        <motion.path
          d="M18 16L21 13L24 19L27 16L30 16"
          stroke="url(#pulseGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
      
      <span className="text-xl font-semibold tracking-apple text-gradient">
        NichePulse
      </span>
    </motion.div>
  );
};

export default Logo;
