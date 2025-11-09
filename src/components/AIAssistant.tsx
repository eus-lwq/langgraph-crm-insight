import { X, Send, Brain, Zap, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { sendChatMessage, type ChatMessage, type ThinkingStep } from "@/lib/api";
import { Card, CardContent } from "./ui/card";

interface AIAssistantProps {
  onClose?: () => void;
}

export const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [showThinking, setShowThinking] = useState(false);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setThinkingSteps([]);
    setShowThinking(true); // Start expanded by default
    
    try {
      const response = await sendChatMessage({
        message: currentInput,
        conversation_history: messages,
      });
      
      setMessages(prev => [...prev, ...response.history.slice(prev.length)]);
      
      // Store thinking steps if available
      if (response.thinking_steps && response.thinking_steps.length > 0) {
        setThinkingSteps(response.thinking_steps);
        setShowThinking(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-96 glass-card-strong border-l border-glass-border/30 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-glass-border/30 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <span className="text-xs font-bold">ai</span>
            </div>
            <span className="font-semibold">CRM-agent.ai</span>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Please enter your question or request below. You can:
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
              <li>Query BigQuery tables</li>
              <li>Check calendar events</li>
              <li>Edit calendar events</li>
              <li>Add new calendar events</li>
            </ul>
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              // Check if this is the last assistant message and we have thinking steps
              const isLastAssistantMessage = 
                msg.role === "assistant" && 
                idx === messages.length - 1 && 
                !isLoading &&
                thinkingSteps.length > 0;
              
              return (
                <div key={idx}>
                  {/* Show thinking steps above the last assistant response */}
                  {isLastAssistantMessage && (
                    <div className="mb-4">
                      <Card className="bg-background/40 border-primary/20 overflow-hidden">
                        <CardContent className="p-4 space-y-3 overflow-x-auto">
                          <div 
                            className="flex items-center gap-2 mb-3 cursor-pointer"
                            onClick={() => setShowThinking(!showThinking)}
                          >
                            <Brain className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">Agent Thinking Process</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowThinking(!showThinking);
                              }}
                            >
                              {showThinking ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Collapse
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  Expand
                                </>
                              )}
                            </Button>
                          </div>
                          {showThinking && thinkingSteps.map((step, stepIdx) => (
                            <div key={stepIdx} className="space-y-2 border-l-2 border-primary/30 pl-3 py-2">
                              {/* Thought */}
                              {step.thought && (
                                <div className="flex items-start gap-2">
                                  <Brain className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-primary mb-1">Thought</p>
                                    <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere">{step.thought}</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Action */}
                              {step.action && (
                                <div className="flex items-start gap-2">
                                  <Zap className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-yellow-500 mb-1">Action</p>
                                    <p className="text-xs text-muted-foreground font-mono break-words overflow-wrap-anywhere">{step.action}</p>
                                    {step.action_input && (
                                      <p className="text-xs text-muted-foreground/70 mt-1 font-mono bg-background/50 p-2 rounded break-words overflow-wrap-anywhere overflow-x-auto">
                                        {step.action_input}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Observation */}
                              {step.observation && (
                                <div className="flex items-start gap-2">
                                  <Eye className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-green-500 mb-1">Observation</p>
                                    <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere">{step.observation}</p>
                                  </div>
                                </div>
                              )}
                              
                              {stepIdx < thinkingSteps.length - 1 && (
                                <div className="border-t border-glass-border/30 mt-2 pt-2" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Message content */}
                  <div
                    className={`flex items-start gap-2 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`glass-card p-3 rounded-lg max-w-[80%] break-words overflow-wrap-anywhere ${
                        msg.role === "user"
                          ? "bg-primary/20"
                          : "bg-background/30"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="glass-card p-3 rounded-lg bg-background/30">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-glass-border/30 flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none bg-background/30 border-glass-border/30"
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            className="flex-shrink-0"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
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
