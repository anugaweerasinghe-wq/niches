import { useState } from 'react';
import { Calculator, Sparkles, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import AnimatedBackground from '@/components/AnimatedBackground';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const tools = [
  { id: 'calculator', icon: Calculator, title: 'YouTube Niche Score Calculator', desc: 'Input a niche topic and get a scored breakdown of competition, growth potential, and monetization.' },
  { id: 'hooks', icon: Sparkles, title: 'Viral Hook Generator', desc: 'Enter your niche and get 5 scroll-stopping video hook ideas powered by AI.' },
  { id: 'quiz', icon: HelpCircle, title: 'Platform Match Quiz', desc: '5 quick questions to discover if you should focus on YouTube, TikTok, or Instagram.' },
];

const quizQuestions = [
  { q: 'How long is your ideal content?', options: [{ label: '< 60 seconds', scores: { tiktok: 3, instagram: 2, youtube: 0 } }, { label: '1-10 minutes', scores: { tiktok: 1, instagram: 2, youtube: 2 } }, { label: '10+ minutes', scores: { tiktok: 0, instagram: 0, youtube: 3 } }] },
  { q: 'Are you comfortable on camera?', options: [{ label: 'Yes, love it', scores: { tiktok: 2, instagram: 3, youtube: 2 } }, { label: 'Prefer faceless', scores: { tiktok: 1, instagram: 0, youtube: 3 } }, { label: 'Sometimes', scores: { tiktok: 2, instagram: 2, youtube: 2 } }] },
  { q: 'What matters most?', options: [{ label: 'Viral reach', scores: { tiktok: 3, instagram: 1, youtube: 1 } }, { label: 'Ad revenue', scores: { tiktok: 0, instagram: 0, youtube: 3 } }, { label: 'Brand deals', scores: { tiktok: 1, instagram: 3, youtube: 1 } }] },
  { q: 'How often can you post?', options: [{ label: 'Daily', scores: { tiktok: 3, instagram: 2, youtube: 0 } }, { label: '2-3x/week', scores: { tiktok: 1, instagram: 2, youtube: 3 } }, { label: 'Weekly', scores: { tiktok: 0, instagram: 1, youtube: 3 } }] },
  { q: 'What is your editing skill level?', options: [{ label: 'Beginner', scores: { tiktok: 3, instagram: 2, youtube: 0 } }, { label: 'Intermediate', scores: { tiktok: 2, instagram: 2, youtube: 2 } }, { label: 'Advanced', scores: { tiktok: 1, instagram: 1, youtube: 3 } }] },
];

const ToolsIndex = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [nicheInput, setNicheInput] = useState('');
  const [hookInput, setHookInput] = useState('');
  const [calcResult, setCalcResult] = useState<any>(null);
  const [hookResult, setHookResult] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScores, setQuizScores] = useState({ youtube: 0, tiktok: 0, instagram: 0 });
  const [quizDone, setQuizDone] = useState(false);

  const handleCalc = async () => {
    if (!nicheInput.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-niche', { body: { niche: nicheInput, platform: 'youtube', style: 'faceless' } });
      if (error) throw error;
      setCalcResult(data?.scorecard || data);
    } catch { toast({ title: 'Analysis failed. Try again.', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleHooks = async () => {
    if (!hookInput.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-viral-ideas', { body: { niche: hookInput, count: 5 } });
      if (error) throw error;
      const ideas = data?.ideas || data;
      setHookResult(Array.isArray(ideas) ? ideas.map((i: any) => typeof i === 'string' ? i : i.title || i.hook || JSON.stringify(i)).slice(0, 5) : ['No hooks generated.']);
    } catch { toast({ title: 'Hook generation failed. Try again.', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleQuizAnswer = (scores: { youtube: number; tiktok: number; instagram: number }) => {
    const next = { youtube: quizScores.youtube + scores.youtube, tiktok: quizScores.tiktok + scores.tiktok, instagram: quizScores.instagram + scores.instagram };
    setQuizScores(next);
    if (quizStep < quizQuestions.length - 1) setQuizStep(quizStep + 1);
    else setQuizDone(true);
  };

  const quizWinner = Object.entries(quizScores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'youtube';

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <NavBar />
      <SEOHead
        title="Free Creator Tools — Niche Calculator, Hook Generator & Platform Quiz | ViralHQ"
        description="Free AI-powered tools for content creators: YouTube Niche Score Calculator, Viral Hook Generator, and Platform Match Quiz. Find your perfect niche and platform."
        canonical="/tools"
      />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient leading-[1.1] mb-4">Free Creator Tools</h1>
            <p className="text-base text-muted-foreground">AI-powered micro-tools to accelerate your content strategy.</p>
          </div>

          {/* Tab bar */}
          <div className="flex justify-center gap-2 mb-10">
            {tools.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:text-foreground border border-border/20'}`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.title.split(' ').slice(0, 2).join(' ')}</span>
              </button>
            ))}
          </div>

          {/* Calculator */}
          {activeTab === 'calculator' && (
            <div className="rounded-2xl glass-premium p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">YouTube Niche Score Calculator</h2>
              <div className="flex gap-2 mb-6">
                <input value={nicheInput} onChange={e => setNicheInput(e.target.value)} placeholder="e.g. AI tools, cooking tips" className="flex-1 h-10 rounded-xl border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button onClick={handleCalc} disabled={loading} className="px-5 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
                </button>
              </div>
              {calcResult && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(calcResult).filter(([, v]) => typeof v === 'number' || typeof v === 'string').slice(0, 6).map(([key, val]) => (
                    <div key={key} className="rounded-xl bg-muted/20 p-4 border border-border/10">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-lg font-bold text-foreground">{String(val)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hook Generator */}
          {activeTab === 'hooks' && (
            <div className="rounded-2xl glass-premium p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Viral Hook Generator</h2>
              <div className="flex gap-2 mb-6">
                <input value={hookInput} onChange={e => setHookInput(e.target.value)} placeholder="e.g. personal finance, fitness" className="flex-1 h-10 rounded-xl border border-border/50 bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button onClick={handleHooks} disabled={loading} className="px-5 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                </button>
              </div>
              {hookResult && (
                <ol className="space-y-3">
                  {hookResult.map((h, i) => (
                    <li key={i} className="flex gap-3 rounded-xl bg-muted/20 p-4 border border-border/10">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <p className="text-sm text-foreground">{h}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Quiz */}
          {activeTab === 'quiz' && (
            <div className="rounded-2xl glass-premium p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Platform Match Quiz</h2>
              {!quizDone ? (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Question {quizStep + 1} of {quizQuestions.length}</p>
                  <p className="text-sm font-medium text-foreground mb-4">{quizQuestions[quizStep].q}</p>
                  <div className="space-y-2">
                    {quizQuestions[quizStep].options.map(opt => (
                      <button key={opt.label} onClick={() => handleQuizAnswer(opt.scores)} className="w-full text-left px-4 py-3 rounded-xl bg-muted/20 border border-border/10 text-sm text-foreground hover:bg-primary/10 hover:border-primary/20 transition-all">
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary capitalize mb-2">{quizWinner}</p>
                  <p className="text-sm text-muted-foreground mb-4">Based on your answers, <strong className="text-foreground capitalize">{quizWinner}</strong> is your best platform match!</p>
                  <button onClick={() => { setQuizStep(0); setQuizScores({ youtube: 0, tiktok: 0, instagram: 0 }); setQuizDone(false); }} className="text-xs text-primary hover:underline">Retake quiz</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsIndex;
