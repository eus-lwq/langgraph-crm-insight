import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Filter, Users, DollarSign, Building2, Calendar as CalendarIcon, Mail, Phone } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ComposedChart } from "recharts";
import bgMountains from "@/assets/bg-mountains.jpg";

const Index = () => {
  const [showAI, setShowAI] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  // Mock email data
  const emailsData = [
    {
      id: 1,
      subject: "Follow-up to next steps",
      from: "Tyler Li",
      email: "tylerli.lwq@gmail.com",
      time: "5:56 PM",
      timeAgo: "7 minutes ago",
      body: "Hello — thanks for the technical walkthrough on the phone this morning. For the next step, could we schedule a technical consultation with our security and compliance teams? We'd like to see architecture diagrams and any SOC/ISO docs you have. Follow-up: I'm aiming for Nov 14 to gather our questions and reconvene. Estimated deal value is roughly $95,000 based on scope we talked about. Notes: GlobalSoft needs more clarity on encryption at rest and data compliance before signing. — Lisa",
      company: "GlobalSoft"
    },
    {
      id: 2,
      subject: "Re: Product Demo Request",
      from: "Sarah Johnson",
      email: "sjohnson@techcorp.com",
      time: "2:30 PM",
      timeAgo: "3 hours ago",
      body: "Hi there, I wanted to follow up on our conversation from yesterday. Our team is very interested in seeing a full demo of the enterprise features. Could we schedule something for next week? We're particularly interested in the user management capabilities for 200+ users. Looking forward to hearing from you. Best regards, Sarah",
      company: "TechCorp Inc"
    },
    {
      id: 3,
      subject: "Integration Requirements Discussion",
      from: "Michael Chen",
      email: "m.chen@dataflow.io",
      time: "11:15 AM",
      timeAgo: "6 hours ago",
      body: "Thanks for the detailed walkthrough of your API capabilities. Our engineering team reviewed the documentation and we're impressed with the flexibility. We'd like to move forward with a proposal. Can you send over pricing for 150 seats with full API access? Timeline: We're looking to implement by Q1 2026. Deal value estimated at $75,000 annually.",
      company: "DataFlow Systems"
    }
  ];

  // Calculate metrics from interactions data
  const totalCustomers = interactionsData.length;
  const totalDealValue = interactionsData.reduce((sum, item) => sum + item.deal_value, 0);
  
  // Company distribution data
  const companyDistribution = interactionsData.reduce((acc, item) => {
    const existing = acc.find(c => c.company === item.company);
    if (existing) {
      existing.count += 1;
      existing.value += item.deal_value;
    } else {
      acc.push({ company: item.company, count: 1, value: item.deal_value });
    }
    return acc;
  }, [] as { company: string; count: number; value: number }[]);

  // Group by next step for ticket view
  const nextStepGroups = interactionsData.reduce((acc, item) => {
    if (!acc[item.next_step]) {
      acc[item.next_step] = [];
    }
    acc[item.next_step].push(item);
    return acc;
  }, {} as Record<string, typeof interactionsData>);

  // Communication channels breakdown
  const communicationChannels = [
    { 
      channel: "Email", 
      count: emailsData.length,
      percentage: Math.round((emailsData.length / (emailsData.length + interactionsData.length)) * 100)
    },
    { 
      channel: "Voice Call", 
      count: interactionsData.filter(i => i.interaction_medium === "phone call").length,
      percentage: Math.round((interactionsData.filter(i => i.interaction_medium === "phone call").length / (emailsData.length + interactionsData.length)) * 100)
    }
  ];

  // Interaction frequency by date (last 7 days)
  const interactionFrequency = (() => {
    const allInteractions = [
      ...interactionsData.map(i => ({ date: i.follow_up_date, type: 'voice' })),
      ...emailsData.map(e => ({ 
        date: new Date(new Date().setDate(new Date().getDate() - e.id)).toISOString().split('T')[0], 
        type: 'email' 
      }))
    ];
    
    const grouped = allInteractions.reduce((acc, item) => {
      const existing = acc.find(d => d.date === item.date);
      if (existing) {
        existing.total += 1;
        if (item.type === 'email') existing.emails += 1;
        if (item.type === 'voice') existing.calls += 1;
      } else {
        acc.push({
          date: item.date,
          total: 1,
          emails: item.type === 'email' ? 1 : 0,
          calls: item.type === 'voice' ? 1 : 0
        });
      }
      return acc;
    }, [] as { date: string; total: number; emails: number; calls: number }[]);
    
    return grouped.sort((a, b) => a.date.localeCompare(b.date)).map(item => ({
      ...item,
      dateFormatted: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  })();

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const events = [];
    
    // Add interactions
    interactionsData.forEach(interaction => {
      if (interaction.follow_up_date === dateStr) {
        events.push({
          type: 'interaction',
          title: interaction.next_step,
          contact: interaction.contact_name,
          company: interaction.company,
          value: interaction.deal_value,
          medium: interaction.interaction_medium
        });
      }
    });
    
    // Add emails
    emailsData.forEach(email => {
      const emailDate = new Date(new Date().setDate(new Date().getDate() - email.id)).toISOString().split('T')[0];
      if (emailDate === dateStr) {
        events.push({
          type: 'email',
          title: email.subject,
          contact: email.from,
          company: email.company,
          email: email.email
        });
      }
    });
    
    return events;
  };

  // Get dates that have events
  const eventDates = (() => {
    const dates = new Set<string>();
    interactionsData.forEach(i => dates.add(i.follow_up_date));
    emailsData.forEach(e => {
      const emailDate = new Date(new Date().setDate(new Date().getDate() - e.id)).toISOString().split('T')[0];
      dates.add(emailDate);
    });
    return Array.from(dates).map(d => new Date(d));
  })();

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
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
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
                title="# Customers"
                value={totalCustomers}
                icon={Users}
              />
              <StatCard
                title="Total Deal Value"
                value={`$ ${totalDealValue.toLocaleString()}`}
                icon={DollarSign}
              />
              <StatCard
                title="Companies"
                value={companyDistribution.length}
                icon={Building2}
              />
            </div>

            {/* Interaction Frequency Chart */}
            <div className="glass-card p-6 rounded-xl col-span-2">
              <h3 className="text-lg font-semibold mb-4">Recent Interaction Frequency</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={interactionFrequency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--glass-border))" opacity={0.3} />
                  <XAxis 
                    dataKey="dateFormatted" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--glass))",
                      border: "1px solid hsl(var(--glass-border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="emails" fill="hsl(var(--chart-1))" name="Emails" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="calls" fill="hsl(var(--chart-2))" name="Voice Calls" radius={[4, 4, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Total Interactions"
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Charts and Views Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Next Steps - Ticket View (Fixed height) */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {Object.entries(nextStepGroups).map(([step, items]) => (
                    <Card key={step} className="bg-background/30 border-glass-border/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span>{step}</span>
                          <Badge variant="secondary">{items.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between text-xs p-2 rounded bg-background/20">
                            <div className="flex-1">
                              <p className="font-medium">{item.contact_name}</p>
                              <p className="text-muted-foreground">{item.company}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">${(item.deal_value / 1000).toFixed(0)}k</p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(item.follow_up_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Column: Company Distribution and Communication Channels */}
              <div className="space-y-6">
                {/* Company Distribution Chart */}
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Company Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={companyDistribution}
                        dataKey="value"
                        nameKey="company"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ company, value }) => `${company}: $${(value / 1000).toFixed(0)}k`}
                        labelLine={true}
                      >
                        {companyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--glass))",
                          border: "1px solid hsl(var(--glass-border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Deal Value']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Communication Channels */}
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Communication Channels</h3>
                  <div className="space-y-4">
                    {communicationChannels.map((channel) => (
                      <div key={channel.channel} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {channel.channel === "Email" ? (
                              <Mail className="w-4 h-4 text-primary" />
                            ) : (
                              <Phone className="w-4 h-4 text-primary" />
                            )}
                            <span className="font-medium">{channel.channel}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{channel.count} contacts</span>
                            <Badge variant="secondary">{channel.percentage}%</Badge>
                          </div>
                        </div>
                        <div className="w-full bg-background/30 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${channel.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emails Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Recent Emails
              </h3>
              {emailsData.map((email) => (
                <Card key={email.id} className="glass-card border-glass-border/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">{email.subject}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">{email.from}</span>
                          <span className="text-xs">&lt;{email.email}&gt;</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{email.time}</p>
                        <p className="text-xs">({email.timeAgo})</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {email.company}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                      {email.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="grid grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl col-span-2">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Calendar
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                  modifiers={{
                    hasEvent: eventDates
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      textDecoration: 'underline',
                      textDecorationColor: 'hsl(var(--primary))',
                      textDecorationThickness: '2px'
                    }
                  }}
                />
              </div>

              {/* Events for Selected Date */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDate ? (
                    <>Events on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                  ) : (
                    'Select a date'
                  )}
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map((event, idx) => (
                      <Card key={idx} className="bg-background/30 border-glass-border/30">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-2 mb-2">
                            {event.type === 'email' ? (
                              <Mail className="w-4 h-4 text-primary mt-0.5" />
                            ) : (
                              <Phone className="w-4 h-4 text-primary mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{event.contact}</p>
                              <p className="text-xs text-muted-foreground">{event.company}</p>
                              {event.type === 'interaction' && (
                                <p className="text-xs font-semibold text-primary mt-2">
                                  ${((event as any).value / 1000).toFixed(0)}k
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No events scheduled for this date
                    </p>
                  )}
                </div>
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
