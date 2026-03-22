import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import StatusBadge from '@/components/StatusBadge';
import MarketPulseTicker from '@/components/MarketPulseTicker';
import ZeigarnikRing from '@/components/ZeigarnikRing';

const navLinks = [
  { to: '/', label: 'Niche Finder' },
  { to: '/blog', label: 'Blog' },
  { to: '/tools', label: 'Tools' },
  { to: '/trending', label: 'Trending' },
  { to: '/wiki', label: 'Wiki' },
];

const NavBar = () => {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass micro-glow border-b border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-1 bg-muted/30 backdrop-blur-xl rounded-2xl p-1 border border-border/20" aria-label="Main navigation">
            {navLinks.map(link => {
              const active = pathname === link.to || (link.to !== '/' && pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active ? 'bg-background/80 text-foreground shadow-sm border border-border/40' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <StatusBadge />
            <MarketPulseTicker />
            <ZeigarnikRing />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
