import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Filter, Users, DollarSign, Building2, Calendar as CalendarIcon, CalendarDays, Mail, Clock, Phone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import bgMountains from "@/assets/bg-mountains.jpg";
import { getInteractions, type Interaction, getCalendarEvents, type CalendarEvent, getEmails, type Email, getInteractionFrequency, type InteractionFrequency, getInteractionMethods, type InteractionMethod } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { format, formatDistanceToNow } from "date-fns";

const Index = () => {
  const [showAI, setShowAI] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch real data from backend (real-time sync every 1 second)
  const { data: interactionsData = [], isLoading, error } = useQuery<Interaction[]>({
    queryKey: ["interactions"],
    queryFn: () => getInteractions(50),
    refetchInterval: 1000, // Refetch every 1 second for real-time sync
    retry: 2, // Retry failed requests
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Fetch calendar events from backend
  const { data: calendarEvents = [], isLoading: eventsLoading, error: eventsError } = useQuery<CalendarEvent[]>({
    queryKey: ["calendar-events"],
    queryFn: () => getCalendarEvents(50),
    refetchInterval: 60000, // Refetch every 60 seconds
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch emails from backend (real-time sync)
  const { data: emails = [], isLoading: emailsLoading, error: emailsError } = useQuery<Email[]>({
    queryKey: ["emails"],
    queryFn: () => getEmails(20),
    refetchInterval: 1000, // Refetch every 1 second for real-time sync (backend syncs every 1s)
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch interaction frequency data (real-time sync) - Extended to 90 days for more activity
  const { data: frequencyData = [], isLoading: frequencyLoading } = useQuery<InteractionFrequency[]>({
    queryKey: ["interaction-frequency"],
    queryFn: () => getInteractionFrequency(90), // Increased from 30 to 90 days
    refetchInterval: 1000, // Refetch every 1 second for real-time sync
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch interaction methods data (real-time sync)
  const { data: methodData = [], isLoading: methodsLoading } = useQuery<InteractionMethod[]>({
    queryKey: ["interaction-methods"],
    queryFn: () => getInteractionMethods(),
    refetchInterval: 1000, // Refetch every 1 second for real-time sync
    retry: 2,
    retryDelay: 1000,
  });

  // Calculate metrics from interactions data
  const totalCustomers = interactionsData.length;
  const totalDealValue = interactionsData.reduce((sum, item) => sum + (item.deal_value || 0), 0);
  
  // Company distribution data
  const companyDistribution = interactionsData.reduce((acc, item) => {
    if (!item.company) return acc;
    const existing = acc.find(c => c.company === item.company);
    if (existing) {
      existing.count += 1;
      existing.value += (item.deal_value || 0);
    } else {
      acc.push({ company: item.company, count: 1, value: (item.deal_value || 0) });
    }
    return acc;
  }, [] as { company: string; count: number; value: number }[]);

  // Group by next step for ticket view
  const nextStepGroups = interactionsData.reduce((acc, item) => {
    const step = item.next_step || "No next step";
    if (!acc[step]) {
      acc[step] = [];
    }
    acc[step].push(item);
    return acc;
  }, {} as Record<string, Interaction[]>);

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
            <TabsTrigger value="emails">Emails</TabsTrigger>
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

            {/* Charts and Views Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Recent Interaction Frequency Chart - Fixed position */}
              <div className="glass-card p-6 rounded-xl order-1">
                <h3 className="text-lg font-semibold mb-4">Recent Interaction Frequency</h3>
                {frequencyLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : frequencyData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>No interaction data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={frequencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => format(new Date(date), "MMM d")}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--glass))",
                          border: "1px solid hsl(var(--glass-border))",
                          borderRadius: "8px"
                        }}
                        labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
                      />
                      <Legend />
                      <Bar dataKey="emails" fill="hsl(var(--chart-1))" name="Emails" />
                      <Bar dataKey="voice_calls" fill="hsl(var(--chart-2))" name="Voice Calls" />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Total Interactions"
                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Interaction Method Component - Fixed position */}
              <div className="glass-card p-6 rounded-xl order-2">
                <h3 className="text-lg font-semibold mb-4">Communication Channels</h3>
                {methodsLoading ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : methodData.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>No interaction method data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {methodData
                      .slice()
                      .sort((a, b) => b.contacts - a.contacts) // Sort by contacts descending for stable order
                      .map((method, index) => (
                      <div key={`${method.method}-${index}`} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {method.method === "Email" ? (
                              <Mail className="w-5 h-5 text-muted-foreground" />
                            ) : method.method === "Voice Call" ? (
                              <Phone className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Users className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className="font-medium">{method.method}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{method.contacts} contacts</span>
                            <Badge variant="secondary" className="text-xs">
                              {method.percentage}%
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${method.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Second Row: Company Distribution and Next Steps */}
            <div className="grid grid-cols-2 gap-6">
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

              {/* Next Steps - Ticket View */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
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
                              <p className="font-medium">{item.contact_name || "N/A"}</p>
                              <p className="text-muted-foreground">{item.company || "N/A"}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">${((item.deal_value || 0) / 1000).toFixed(0)}k</p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {item.follow_up_date ? new Date(item.follow_up_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interactions">
            <div className="glass-card p-6 rounded-xl">
              {isLoading && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading interactions from BigQuery...</p>
                </div>
              )}
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-semibold mb-1">Error loading interactions:</p>
                  <p className="text-destructive text-sm">{String(error)}</p>
                  <p className="text-muted-foreground text-xs mt-2">
                    Make sure the backend server is running on http://localhost:8001
                  </p>
                </div>
              )}
              {!isLoading && !error && interactionsData.length === 0 && (
                <div className="mb-4 p-4 bg-muted/50 border border-muted rounded-lg">
                  <p className="text-muted-foreground">No interactions found in BigQuery.</p>
                </div>
              )}
              
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
                      .map((row, idx) => (
                        <TableRow key={row.id || idx} className="border-glass-border/30 hover:bg-background/20">
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{row.contact_name || "N/A"}</TableCell>
                          <TableCell>{row.company || "N/A"}</TableCell>
                          <TableCell>{row.next_step || "N/A"}</TableCell>
                          <TableCell>${(row.deal_value || 0).toLocaleString()}</TableCell>
                          <TableCell>{row.follow_up_date || "N/A"}</TableCell>
                          <TableCell className="max-w-xs truncate">{row.notes || "N/A"}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                              {row.interaction_medium || "N/A"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Calendar Component */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Calendar</h3>
                </div>
                {eventsLoading && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading calendar events...</p>
                  </div>
                )}
                {eventsError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">Error loading calendar: {String(eventsError)}</p>
                  </div>
                )}
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    hasEvents: (date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      return calendarEvents.some(event => {
                        const eventDate = new Date(event.start);
                        return format(eventDate, "yyyy-MM-dd") === dateStr;
                      });
                    }
                  }}
                  modifiersClassNames={{
                    hasEvents: "underline underline-offset-2 decoration-2 decoration-primary"
                  }}
                />
              </div>

              {/* Events for Selected Date */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Events on {format(selectedDate, "MMM d, yyyy")}
                </h3>
                {eventsLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading events...</p>
                  </div>
                ) : eventsError ? (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">Error: {String(eventsError)}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
                      const dayEvents = calendarEvents.filter(event => {
                        const eventDate = new Date(event.start);
                        const eventDateStr = format(eventDate, "yyyy-MM-dd");
                        return eventDateStr === selectedDateStr;
                      });

                      if (dayEvents.length === 0) {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No events scheduled for this date</p>
                          </div>
                        );
                      }

                      return dayEvents.map((event) => {
                        const startTime = new Date(event.start);
                        const endTime = new Date(event.end);
                        return (
                          <Card key={event.id} className="bg-background/30 border-glass-border/30">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium">{event.summary}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                <span>
                                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                                </span>
                              </div>
                              {event.location && (
                                <div className="text-muted-foreground">
                                  📍 {event.location}
                                </div>
                              )}
                              {event.description && (
                                <p className="text-muted-foreground text-xs mt-2">{event.description}</p>
                              )}
                              {event.attendees && event.attendees.length > 0 && (
                                <div className="text-muted-foreground text-xs">
                                  👥 {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                                </div>
                              )}
                              {event.html_link && (
                                <a
                                  href={event.html_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline"
                                >
                                  Open in Google Calendar →
                                </a>
                              )}
                            </CardContent>
                          </Card>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5" />
                <h2 className="text-2xl font-bold">Recent Emails</h2>
              </div>
              
              {emailsLoading && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading emails from Gmail...</p>
                </div>
              )}
              
              {emailsError && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-semibold mb-1">Error loading emails:</p>
                  <p className="text-destructive text-sm">{String(emailsError)}</p>
                  <p className="text-muted-foreground text-xs mt-2">
                    Make sure the backend server is running on http://localhost:8001
                  </p>
                </div>
              )}
              
              {!emailsLoading && !emailsError && emails.length === 0 && (
                <div className="mb-4 p-4 bg-muted/50 border border-muted rounded-lg">
                  <p className="text-muted-foreground">No emails found.</p>
                </div>
              )}
              
              <div className="space-y-4">
                {emails.map((email) => {
                  const emailDate = new Date(email.date);
                  const timeAgo = formatDistanceToNow(emailDate, { addSuffix: true });
                  
                  return (
                    <Card key={email.id} className="bg-background/30 border-glass-border/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold mb-2">{email.subject}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <span className="font-medium">{email.from_email}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{timeAgo}</span>
                              </div>
                            </div>
                            {email.extracted_data?.company && (
                              <Badge variant="secondary" className="mt-1">
                                {email.extracted_data.company}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          <p className="line-clamp-3">{email.body.substring(0, 200)}...</p>
                        </div>
                        {email.extracted_data && (
                          <div className="pt-3 border-t border-glass-border/30 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Extracted Data:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {email.extracted_data.contact_name && (
                                <div>
                                  <span className="text-muted-foreground">Contact: </span>
                                  <span className="font-medium">{email.extracted_data.contact_name}</span>
                                </div>
                              )}
                              {email.extracted_data.company && (
                                <div>
                                  <span className="text-muted-foreground">Company: </span>
                                  <span className="font-medium">{email.extracted_data.company}</span>
                                </div>
                              )}
                              {email.extracted_data.deal_value && (
                                <div>
                                  <span className="text-muted-foreground">Deal Value: </span>
                                  <span className="font-medium">${email.extracted_data.deal_value.toLocaleString()}</span>
                                </div>
                              )}
                              {email.extracted_data.follow_up_date && (
                                <div>
                                  <span className="text-muted-foreground">Follow-up: </span>
                                  <span className="font-medium">{email.extracted_data.follow_up_date}</span>
                                </div>
                              )}
                            </div>
                            {email.extracted_data.next_step && (
                              <div className="mt-2">
                                <span className="text-muted-foreground text-xs">Next Step: </span>
                                <span className="font-medium text-xs">{email.extracted_data.next_step}</span>
                              </div>
                            )}
                            {email.extracted_data.notes && (
                              <div className="mt-2">
                                <span className="text-muted-foreground text-xs">Notes: </span>
                                <span className="text-xs">{email.extracted_data.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
