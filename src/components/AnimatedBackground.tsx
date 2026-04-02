const particles = [
  { top: '8%', left: '12%', size: 2, opacity: 0.1, blur: 1, duration: 24, color: 'hsl(var(--glow-primary))' },
  { top: '22%', left: '82%', size: 2, opacity: 0.06, blur: 1, duration: 30, color: 'hsl(var(--glow-secondary))' },
  { top: '48%', left: '6%', size: 2.5, opacity: 0.05, blur: 2, duration: 36, color: 'hsl(var(--glow-primary))' },
  { top: '68%', left: '92%', size: 2, opacity: 0.08, blur: 1, duration: 26, color: 'hsl(var(--glow-secondary))' },
  { top: '82%', left: '38%', size: 2, opacity: 0.06, blur: 1, duration: 32, color: 'hsl(var(--glow-primary))' },
  { top: '12%', left: '58%', size: 2, opacity: 0.08, blur: 1, duration: 28, color: 'hsl(var(--glow-secondary))' },
];

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Subtle top gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--glow-primary) / 0.04) 0%, transparent 70%)',
        }}
      />

      {/* Bottom corner accent */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 80% 100%, hsl(var(--glow-secondary) / 0.03) 0%, transparent 70%)',
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
            animationDelay: `${i * -4}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
