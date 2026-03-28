const particles = [
  {
    top: "8%",
    left: "16%",
    size: 4,
    opacity: 0.2,
    blur: 2,
    duration: 22,
    color: "hsl(176 100% 47%)",
  },
  {
    top: "18%",
    left: "78%",
    size: 3,
    opacity: 0.18,
    blur: 1,
    duration: 28,
    color: "hsl(262 88% 70%)",
  },
  {
    top: "42%",
    left: "7%",
    size: 5,
    opacity: 0.12,
    blur: 3,
    duration: 34,
    color: "hsl(176 100% 47%)",
  },
  {
    top: "60%",
    left: "90%",
    size: 3,
    opacity: 0.22,
    blur: 1,
    duration: 21,
    color: "hsl(262 88% 70%)",
  },
  {
    top: "72%",
    left: "35%",
    size: 4,
    opacity: 0.12,
    blur: 2,
    duration: 26,
    color: "hsl(176 100% 47%)",
  },
  {
    top: "12%",
    left: "54%",
    size: 2,
    opacity: 0.18,
    blur: 1,
    duration: 19,
    color: "hsl(262 88% 70%)",
  },
];

const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[8%] top-[6%] h-[28rem] w-[28rem] rounded-full bg-primary/12 blur-[90px]" />
      <div className="absolute right-[10%] top-[8%] h-[24rem] w-[24rem] rounded-full bg-secondary/10 blur-[90px]" />
      <div className="absolute bottom-[-6rem] left-1/2 h-[24rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full animate-float-slow"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            filter: `blur(${particle.blur}px)`,
            background: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${index * -2}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-hero-grid bg-[size:80px_80px] opacity-[0.045]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(0_0%_100%/0.06),transparent_58%)] opacity-50" />
    </div>
  );
};

export default AnimatedBackground;
