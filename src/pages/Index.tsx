import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import bgMountains from "@/assets/bg-mountains.jpg";

const Index = () => {
  const [showAI, setShowAI] = useState(true);
  const [filterText, setFilterText] = useState("");

  // Mock BigQuery data
  const interactionsData = [
    {
      id: 1,
      contact_name: "Sarah Johnson",
      company: "TechCorp Inc",
      next_step: "Schedule product demo",
      deal_value: 50000,
      follow_up_date: "2025-11-15",
      notes: "Interested in enterprise plan. Needs pricing for 200+ users.",
      interaction_medium: "phone call"
    },
    {
      id: 2,
      contact_name: "Michael Chen",
      company: "DataFlow Systems",
      next_step: "Send proposal",
      deal_value: 75000,
      follow_up_date: "2025-11-12",
      notes: "Discussed integration requirements. Very positive about API capabilities.",
      interaction_medium: "phone call"
    },
    {
      id: 3,
      contact_name: "Emily Rodriguez",
      company: "CloudScale Ltd",
      next_step: "Contract review",
      deal_value: 120000,
      follow_up_date: "2025-11-20",
      notes: "Legal team reviewing terms. Expects to close by end of month.",
      interaction_medium: "phone call"
    },
    {
      id: 4,
      contact_name: "David Park",
      company: "InnovateTech",
      next_step: "Follow-up call",
      deal_value: 35000,
      follow_up_date: "2025-11-18",
      notes: "Comparing with competitors. Price-sensitive but likes features.",
      interaction_medium: "phone call"
    },
    {
      id: 5,
      contact_name: "Lisa Anderson",
      company: "GlobalSoft",
      next_step: "Technical consultation",
      deal_value: 95000,
      follow_up_date: "2025-11-14",
      notes: "Needs clarification on security protocols and data compliance.",
      interaction_medium: "phone call"
    }
  ];

  const funnelData = [
    { stage: "Qualification", value: 16, fill: "hsl(var(--chart-1))" },
    { stage: "Presentation", value: 9, fill: "hsl(var(--chart-2))" },
    { stage: "Proposal", value: 6, fill: "hsl(var(--chart-3))" },
    { stage: "Contracting", value: 3, fill: "hsl(var(--chart-4))" },
    { stage: "Closed won", value: 1, fill: "hsl(var(--chart-5))" },
  ];

  const salesData = [
    { name: "James Smith", plan: 45000, fact: 52000 },
    { name: "William Clarke", plan: 55000, fact: 70950 },
    { name: "Mary King", plan: 60000, fact: 75000 },
    { name: "Peter Moore", plan: 70000, fact: 90000 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getTime = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", { weekday: "long", hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgMountains})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-background/40 backdrop-blur-sm"></div>
      </div>

      {/* AI Toggle Button */}
      <Button
        onClick={() => setShowAI(!showAI)}
        className="fixed top-4 right-4 z-50 glass-card-strong"
        size="icon"
      >
        <Bot className="w-5 h-5" />
      </Button>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}

      {/* Main Content */}
      <main className={`relative z-10 p-8 max-w-7xl mx-auto transition-all ${showAI ? 'mr-96' : 'mr-0'}`}>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="glass-card mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interactions">Interactions Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Header */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-1">{getTime()}</p>
              <h1 className="text-4xl font-bold mb-2">{getGreeting()}, Olivia!</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total opportunity count"
                value="463"
              />
              <StatCard
                title="Opportunity amount, current m.."
                value="$ 999,928.00"
              />
              <StatCard
                title="# Open leads"
                value="56"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Funnel Chart */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Funnel</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border))" opacity={0.3} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="stage" stroke="hsl(var(--muted-foreground))" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--glass))",
                        border: "1px solid hsl(var(--glass-border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Sales Team Performance */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Plan vs Fact by sales team, current quarter</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--glass))",
                        border: "1px solid hsl(var(--glass-border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar dataKey="plan" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="fact" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interactions">
            <div className="glass-card p-6 rounded-xl">
              {/* Filter */}
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Filter</span>
                <Input
                  placeholder="Enter property name or value"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="max-w-md bg-background/30 border-glass-border/30"
                />
              </div>

              {/* Data Table */}
              <div className="rounded-lg border border-glass-border/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-glass-border/30 hover:bg-background/20">
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Contact Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Next Step</TableHead>
                      <TableHead>Deal Value</TableHead>
                      <TableHead>Follow-up Date</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Interaction Medium</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interactionsData
                      .filter(row => 
                        !filterText || 
                        Object.values(row).some(val => 
                          String(val).toLowerCase().includes(filterText.toLowerCase())
                        )
                      )
                      .map((row) => (
                        <TableRow key={row.id} className="border-glass-border/30 hover:bg-background/20">
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{row.contact_name}</TableCell>
                          <TableCell>{row.company}</TableCell>
                          <TableCell>{row.next_step}</TableCell>
                          <TableCell>${row.deal_value.toLocaleString()}</TableCell>
                          <TableCell>{row.follow_up_date}</TableCell>
                          <TableCell className="max-w-xs truncate">{row.notes}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                              {row.interaction_medium}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
