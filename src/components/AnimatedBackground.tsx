const particles = [
  { top: '10%', left: '15%', size: 2, opacity: 0.12, blur: 1, duration: 22, color: 'hsl(var(--glow-primary))' },
  { top: '25%', left: '80%', size: 2, opacity: 0.08, blur: 1, duration: 28, color: 'hsl(var(--glow-secondary))' },
  { top: '50%', left: '8%', size: 3, opacity: 0.06, blur: 2, duration: 35, color: 'hsl(var(--glow-primary))' },
  { top: '65%', left: '90%', size: 2, opacity: 0.1, blur: 1, duration: 24, color: 'hsl(var(--glow-secondary))' },
  { top: '80%', left: '40%', size: 2, opacity: 0.08, blur: 1, duration: 30, color: 'hsl(var(--glow-primary))' },
  { top: '15%', left: '55%', size: 2, opacity: 0.1, blur: 1, duration: 26, color: 'hsl(var(--glow-secondary))' },
  { top: '90%', left: '20%', size: 2, opacity: 0.06, blur: 1, duration: 38, color: 'hsl(var(--glow-primary))' },
  { top: '40%', left: '85%', size: 2, opacity: 0.08, blur: 1, duration: 20, color: 'hsl(var(--glow-secondary))' },
];

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--glow-primary) / 0.04) 0%, transparent 70%)',
        }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${i * -3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
