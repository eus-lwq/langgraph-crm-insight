import { Home, Users, Mail, FileText, Calendar, BarChart3, MessageSquare, ShoppingCart, FileCheck, ScrollText, Bot, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";

const navItems = [
  { icon: Home, label: "Home page", path: "/" },
  { icon: FileText, label: "Feed", path: "/feed" },
  { icon: Users, label: "Leads", path: "/leads" },
  { icon: BarChart3, label: "Accounts", path: "/accounts" },
  { icon: Users, label: "Contacts", path: "/contacts" },
  { icon: Calendar, label: "Activities", path: "/activities" },
  { icon: FileCheck, label: "Opportunities", path: "/opportunities" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: ScrollText, label: "Invoices", path: "/invoices" },
  { icon: FileText, label: "Contracts", path: "/contracts" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-40 glass-card-strong border-r border-glass-border/30 z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-glass-border/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="ml-2 font-semibold text-sm">Creatio</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-1.5 text-xs bg-background/30 border border-glass-border/30 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="mb-3">
            <select className="w-full px-2 py-1.5 text-xs bg-background/30 border border-glass-border/30 rounded-md focus:outline-none">
              <option>All apps</option>
            </select>
          </div>
          
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-primary/10"
              activeClassName="bg-primary/20 text-primary"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
