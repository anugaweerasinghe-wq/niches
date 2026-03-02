const particles = [
  { top: '8%', left: '15%', size: 3, opacity: 0.2, blur: 2, duration: 18 },
  { top: '22%', left: '78%', size: 2, opacity: 0.15, blur: 1, duration: 25 },
  { top: '45%', left: '5%', size: 4, opacity: 0.1, blur: 3, duration: 32 },
  { top: '60%', left: '92%', size: 2, opacity: 0.25, blur: 1, duration: 20 },
  { top: '75%', left: '40%', size: 3, opacity: 0.12, blur: 2, duration: 28 },
  { top: '12%', left: '55%', size: 2, opacity: 0.18, blur: 1, duration: 22 },
  { top: '88%', left: '20%', size: 3, opacity: 0.1, blur: 2, duration: 35 },
  { top: '35%', left: '85%', size: 2, opacity: 0.2, blur: 1, duration: 19 },
  { top: '50%', left: '30%', size: 4, opacity: 0.08, blur: 3, duration: 40 },
  { top: '95%', left: '65%', size: 2, opacity: 0.15, blur: 1, duration: 24 },
  { top: '5%', left: '42%', size: 3, opacity: 0.22, blur: 2, duration: 30 },
  { top: '70%', left: '12%', size: 2, opacity: 0.13, blur: 1, duration: 27 },
];

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Emerald particle dots */}
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
            background: 'hsl(157 100% 49%)',
            animationDuration: `${p.duration}s`,
            animationDelay: `${i * -2}s`,
          }}
        />
      ))}

      {/* Subtle emerald-tinted grid */}
      <div 
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(157 100% 49%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(157 100% 49%) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
