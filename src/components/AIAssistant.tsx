import { X, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface AIAssistantProps {
  onClose?: () => void;
}

export const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [input, setInput] = useState("");
  
  const insights = [
    {
      title: "The funnel shows a sharp drop-off at the later stages.",
      action: [
        "1. Analyze reasons for losing deals in the Contracting and Proposal stages.",
        "2. Revisit proposals for clarity and competitive value."
      ]
    },
    {
      title: "A high opportunity amount ($999,928) is active, but only a tiny percentage progresses to 'Closed Won.'",
      action: [
        "1. Review active opportunities to identify bottlenecks or delays.",
        "2. Implement regular pipeline reviews to keep deals moving."
      ]
    }
  ];

  return (
    <div className="fixed right-0 top-0 h-screen w-96 glass-card-strong border-l border-glass-border/30 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-glass-border/30 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <span className="text-xs font-bold">ai</span>
            </div>
            <span className="font-semibold">Creatio.ai</span>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Please enter your question or request below
        </p>

        <div className="glass-card p-4 rounded-lg space-y-3">
          <p className="text-xs text-muted-foreground">
            Please provide a short summary of the dashboard with recommendations
          </p>
          
          <div className="flex items-start gap-2 text-sm">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">C</span>
            </div>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="font-medium text-sm">{insight.title}</p>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Action:</p>
                    {insight.action.map((action, i) => (
                      <p key={i} className="mb-1">{action}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-glass-border/30">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none bg-background/30 border-glass-border/30"
          />
          <Button size="icon" className="flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <span className="text-xs">f</span>
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <span className="text-xs">✓</span>
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <span className="text-xs">≡</span>
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <span className="text-xs">⌂</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
