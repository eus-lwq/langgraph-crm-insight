/**
 * API client for connecting to the CRM AI Agent backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
}

export interface ThinkingStep {
  thought: string;
  action: string;
  action_input: string;
  observation: string;
}

export interface ChatResponse {
  response: string;
  history: ChatMessage[];
  thinking_steps?: ThinkingStep[];
}

export interface Email {
  id: string;
  subject: string;
  from_email: string;
  to_email: string;
  date: string;
  body: string;
  extracted_data?: {
    contact_name?: string;
    company?: string;
    next_step?: string;
    deal_value?: number;
    follow_up_date?: string;
    notes?: string;
  };
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  attendees?: string[];
  html_link?: string;
}

export interface Interaction {
  id?: number;
  contact_name?: string;
  company?: string;
  next_step?: string;
  deal_value?: number;
  follow_up_date?: string;
  notes?: string;
  interaction_medium?: string;
}

export interface InteractionFrequency {
  date: string;
  emails: number;
  voice_calls: number;
  total: number;
}

export interface InteractionMethod {
  method: string;
  contacts: number;
  percentage: number;
}

export interface CreateCalendarEventRequest {
  summary: string;
  start_time: string;
  end_time: string;
  description?: string;
  location?: string;
  attendees?: string[];
}

// Type alias for consistency
type CreateCalendarEventRequestType = CreateCalendarEventRequest;

export interface UpdateCalendarEventRequest {
  event_id: string;
  summary?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  location?: string;
  attendees?: string[];
}

/**
 * Chat API - Send message to CRM agent
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get recent emails from Gmail
 */
export async function getEmails(limit: number = 10): Promise<Email[]> {
  const response = await fetch(`${API_BASE_URL}/api/emails?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get calendar events from Google Calendar
 */
export async function getCalendarEvents(maxResults: number = 20): Promise<CalendarEvent[]> {
  const response = await fetch(`${API_BASE_URL}/api/calendar/events?max_results=${maxResults}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a new calendar event
 */
export async function createCalendarEvent(request: CreateCalendarEventRequestType): Promise<CalendarEvent> {
  const response = await fetch(`${API_BASE_URL}/api/calendar/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Update a calendar event
 */
export async function updateCalendarEvent(
  eventId: string,
  request: UpdateCalendarEventRequest
): Promise<CalendarEvent> {
  const response = await fetch(`${API_BASE_URL}/api/calendar/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...request, event_id: eventId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get interactions data from BigQuery
 */
export async function getInteractions(limit: number = 50): Promise<Interaction[]> {
  const response = await fetch(`${API_BASE_URL}/api/interactions?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get interaction frequency data for the chart
 */
export async function getInteractionFrequency(days: number = 30): Promise<InteractionFrequency[]> {
  const response = await fetch(`${API_BASE_URL}/api/interactions/frequency?days=${days}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get interaction method distribution
 */
export async function getInteractionMethods(): Promise<InteractionMethod[]> {
  const response = await fetch(`${API_BASE_URL}/api/interactions/methods`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

