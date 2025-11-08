import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import bgMountains from "@/assets/bg-mountains.jpg";

const Index = () => {
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

      {/* Main Content */}
      <main className="relative z-10 p-8 max-w-7xl mx-auto">
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
      </main>
    </div>
  );
};

export default Index;
