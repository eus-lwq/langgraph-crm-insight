import { Search, Grid3x3, Bell, HelpCircle, Settings, Bot } from "lucide-react";
import { Button } from "./ui/button";

interface TopBarProps {
  onAIClick?: () => void;
}

export const TopBar = ({ onAIClick }: TopBarProps) => {
  return (
    <header className="fixed top-0 left-40 right-0 h-14 glass-card-strong border-b border-glass-border/30 z-40 px-6">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Creatio</span>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <span className="text-lg">▶</span>
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <span className="text-lg">+</span>
          </Button>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background/30 border border-glass-border/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onAIClick}>
            <Bot className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid3x3 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center ml-2">
            <span className="text-xs font-bold">O</span>
          </div>
        </div>
      </div>
    </header>
  );
};
