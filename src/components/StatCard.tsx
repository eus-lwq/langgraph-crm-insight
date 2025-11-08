import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, className }: StatCardProps) => {
  return (
    <div className={cn("glass-card p-6 rounded-xl", className)}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
};
