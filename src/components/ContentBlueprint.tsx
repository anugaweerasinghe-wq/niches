import { motion } from 'framer-motion';
import { Lightbulb, Zap, Video, Sparkles } from 'lucide-react';
import type { ContentIdea, ViralHook } from '@/hooks/useNicheAnalysis';

interface ContentBlueprintProps {
  ideas: ContentIdea[];
  hooks: ViralHook[];
}

const ContentBlueprint = ({ ideas, hooks }: ContentBlueprintProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Video Ideas */}
      <motion.div
        className="card-elevated p-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/20">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold tracking-apple text-foreground">Video Ideas</h3>
        </div>
        
        <div className="space-y-4">
          {ideas.map((idea, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1 tracking-apple">{idea.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{idea.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                      {idea.estimatedViews} views potential
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
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
        className="card-elevated p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-warning/20">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-lg font-semibold tracking-apple text-foreground">Viral Hooks</h3>
        </div>
        
        <div className="space-y-3">
          {hooks.map((hook, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground font-medium text-sm leading-relaxed">
                    "{hook.text}"
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                      {hook.platform}
                    </span>
                    <span className="text-xs text-muted-foreground">
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
