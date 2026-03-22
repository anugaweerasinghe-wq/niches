import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

interface EmailCaptureProps {
  source?: string;
}

const EmailCapture = ({ source = 'homepage' }: EmailCaptureProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: 'Please enter a valid email', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await (supabase as any).from('subscribers').insert({ email: trimmed, source });
      if (error) {
        if (error.code === '23505') {
          toast({ title: "You're already subscribed!" });
          setSubmitted(true);
        } else throw error;
      } else {
        toast({ title: 'Subscribed! Check your inbox soon.' });
        setSubmitted(true);
      }
    } catch {
      toast({ title: 'Something went wrong. Try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl glass-premium p-6 md:p-8 text-center">
        <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground">You're on the list! 🎉</p>
        <p className="text-xs text-muted-foreground mt-1">Weekly trending niche ideas coming your way.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-premium p-6 md:p-8">
      <div className="text-center mb-4">
        <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-foreground">Get Weekly Trending Niche Ideas</h3>
        <p className="text-xs text-muted-foreground mt-1">Join 2,000+ creators getting data-driven niche insights every week.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 h-10 rounded-xl border border-border/50 bg-background/50 px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50"
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default EmailCapture;
