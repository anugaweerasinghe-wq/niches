import { motion } from 'framer-motion';
import { Zap, Video, Sparkles } from 'lucide-react';
import type { ContentIdea, ViralHook } from '@/hooks/useNicheAnalysis';

interface ContentBlueprintProps {
  ideas: ContentIdea[];
  hooks: ViralHook[];
}

const ContentBlueprint = ({ ideas, hooks }: ContentBlueprintProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Video Ideas */}
      <motion.div
        className="glass-card p-7"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2.5 rounded-xl bg-primary/8 border border-primary/10">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <h4 className="text-base font-semibold tracking-apple text-foreground">Video Ideas</h4>
        </div>
        
        <div className="space-y-3">
          {ideas.map((idea, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-muted/15 border border-border/15 hover:bg-muted/25 hover:border-border/30 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-foreground mb-1.5 tracking-apple text-sm">{idea.title}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">{idea.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[hsl(var(--success))]/6 text-[hsl(var(--success))] border border-[hsl(var(--success))]/10 font-medium">
                      {idea.estimatedViews} views
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-primary/6 text-primary border border-primary/10 font-medium">
                      {idea.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Viral Hooks */}
      <motion.div
        className="glass-card p-7"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="p-2.5 rounded-xl bg-[hsl(var(--warning))]/8 border border-[hsl(var(--warning))]/10">
            <Zap className="w-5 h-5 text-[hsl(var(--warning))]" />
          </div>
          <h4 className="text-base font-semibold tracking-apple text-foreground">Viral Hooks</h4>
        </div>
        
        <div className="space-y-3">
          {hooks.map((hook, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-muted/15 border border-border/15 hover:bg-muted/25 hover:border-border/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.06 }}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[hsl(var(--warning))] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground font-medium text-sm leading-relaxed italic">
                    "{hook.text}"
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-muted/30 text-muted-foreground border border-border/20 capitalize font-medium">
                      {hook.platform}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60">
                      {hook.hookType}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContentBlueprint;
