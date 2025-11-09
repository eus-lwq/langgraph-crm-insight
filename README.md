# CRM Insight Frontend

A modern, real-time CRM dashboard built with React, TypeScript, and Tailwind CSS. This frontend application provides an intuitive interface for managing customer interactions, viewing analytics, and interacting with an AI-powered CRM agent.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                     │
│              (React + TypeScript + Vite)                    │
│                    Port: 8080 (dev)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │ (React Query)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8001)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Chat Agent   │  │ Email Monitor │  │ Google Calendar │ │
│  │ (LangChain)  │  │ (Gmail API)  │  │ Agent           │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────────┘ │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│                   ┌────────▼─────────┐                       │
│                   │ Email Extractor │                       │
│                   │ (Vertex AI)     │                       │
│                   └────────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   BigQuery       │
                    │  CRM_DATA.deals │
                    └─────────────────┘
```

### Data Flow

1. **Real-time Sync**: Frontend polls backend every 1 second for interactions, emails, and frequency data
2. **React Query**: Manages caching, refetching, and state synchronization
3. **API Client**: Type-safe API client (`src/lib/api.ts`) handles all backend communication
4. **Component Updates**: Components automatically re-render when data changes

## ✨ Features

- **📊 Real-time Dashboard**: Live updates every 1 second from BigQuery
- **🤖 AI Chat Assistant**: Interactive chat agent for querying CRM data, managing calendar, and sending emails
- **📧 Email Management**: View recent emails with extracted CRM data
- **📅 Calendar Integration**: View and manage Google Calendar events
- **📈 Analytics Charts**: 
  - Recent Interaction Frequency (90 days)
  - Communication Channels distribution
  - Company Distribution pie chart
- **📋 Interactive Data Table**: Filterable table of all interactions/deals
- **🎨 Modern UI**: Glass-morphism design with dark theme support

## 🛠️ Tech Stack

### Core Framework
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **React Router 6.30.1** - Client-side routing

### State Management & Data Fetching
- **TanStack React Query 5.83.0** - Server state management, caching, and real-time sync
- **React Hooks** - Local component state

### UI Components & Styling
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Accessible, unstyled component primitives
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Merge Tailwind classes

### Data Visualization
- **Recharts 2.15.4** - Charting library
  - Bar charts
  - Line charts
  - Pie charts

### Form Handling
- **React Hook Form 7.61.1** - Form state management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Date Handling
- **date-fns 3.6.0** - Date utility library
- **react-day-picker 8.10.1** - Calendar component

### Additional Libraries
- **Sonner 1.7.4** - Toast notifications
- **next-themes 0.3.0** - Theme management (dark/light mode support)

## 📁 Project Structure

```
langgraph-crm-insight/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images (backgrounds, etc.)
│   │   ├── bg-alpine.jpg
│   │   ├── bg-mountains.jpg
│   │   └── bg-sunset.jpg
│   ├── components/       # React components
│   │   ├── AIAssistant.tsx      # AI chat assistant sidebar
│   │   ├── NavLink.tsx         # Navigation link component
│   │   ├── Sidebar.tsx         # Main sidebar navigation
│   │   ├── StatCard.tsx        # Metric card component
│   │   ├── TopBar.tsx          # Top navigation bar
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── table.tsx
│   │       ├── chart.tsx
│   │       ├── calendar.tsx
│   │       └── ... (50+ components)
│   ├── hooks/            # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/              # Utilities and API client
│   │   ├── api.ts        # Backend API client (TypeScript interfaces)
│   │   └── utils.ts      # Utility functions
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Main dashboard page
│   │   └── NotFound.tsx  # 404 page
│   ├── App.tsx           # Root component (routing, providers)
│   ├── App.css           # Global styles
│   ├── index.css         # Tailwind CSS imports
│   └── main.tsx          # Application entry point
├── .gitignore
├── components.json       # shadcn/ui configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json     # App-specific TypeScript config
├── tsconfig.node.json    # Node-specific TypeScript config
└── vite.config.ts        # Vite configuration
```

## 🎨 Design System

### Color Palette

The application uses a custom color system with CSS variables for theming:

- **Glass Morphism**: Translucent cards with backdrop blur
- **Primary Colors**: Custom HSL-based color system
- **Chart Colors**: 5 distinct colors for data visualization
- **Semantic Colors**: Success, warning, danger, muted

### Component Library

Built with **shadcn/ui**, a collection of reusable components:

- **Layout**: Card, Separator, Scroll Area, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch
- **Data Display**: Table, Badge, Avatar, Progress
- **Feedback**: Toast, Alert, Dialog, Tooltip
- **Navigation**: Tabs, Sidebar, Navigation Menu
- **Overlays**: Popover, Dropdown, Context Menu, Sheet
- **Charts**: Chart components (wraps Recharts)

### Design Patterns

1. **Glass Morphism**: Translucent cards with blur effects
2. **Responsive Grid**: CSS Grid for dashboard layout
3. **Real-time Updates**: React Query with 1-second polling
4. **Collapsible Sections**: Accordion-style thinking process display
5. **Dark Theme**: Full dark mode support via CSS variables

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **bun** package manager

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd langgraph-crm-insight
```

2. **Install dependencies:**
```bash
npm install
# or
bun install
```

3. **Set up environment variables:**
```bash
# Create .env file (optional)
# VITE_API_URL=http://localhost:8001
```

The default API URL is `http://localhost:8001` (backend port).

4. **Start the development server:**
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
bun run preview
```

## 📡 API Integration

### API Client

The frontend communicates with the backend via a type-safe API client located in `src/lib/api.ts`.

**Base URL**: `http://localhost:8001` (configurable via `VITE_API_URL`)

### Available API Functions

#### Chat Agent
```typescript
sendChatMessage(request: ChatRequest): Promise<ChatResponse>
```

#### Interactions
```typescript
getInteractions(limit?: number): Promise<Interaction[]>
getInteractionFrequency(days?: number): Promise<InteractionFrequency[]>
getInteractionMethods(): Promise<InteractionMethod[]>
```

#### Emails
```typescript
getEmails(limit?: number): Promise<Email[]>
```

#### Calendar
```typescript
getCalendarEvents(maxResults?: number): Promise<CalendarEvent[]>
createCalendarEvent(request: CreateCalendarEventRequest): Promise<CalendarEvent>
updateCalendarEvent(eventId: string, request: UpdateCalendarEventRequest): Promise<CalendarEvent>
```

### Real-time Sync

All data fetching uses **React Query** with automatic refetching:

- **Interactions**: 1 second interval
- **Emails**: 1 second interval
- **Frequency Data**: 1 second interval
- **Method Data**: 1 second interval
- **Calendar Events**: 60 second interval

## 🎯 Key Components

### Dashboard (`src/pages/Index.tsx`)

Main dashboard page with:
- **Metric Cards**: Total customers, deal value, companies
- **Recent Interaction Frequency Chart**: Bar + line chart (90 days)
- **Communication Channels**: Distribution by interaction method
- **Company Distribution**: Pie chart
- **Next Steps**: Grouped by action items
- **Interactive Table**: Filterable interactions data
- **Tabs**: Overview, Interactions Data, Calendar, Emails

### AI Assistant (`src/components/AIAssistant.tsx`)

Sidebar chat component with:
- **Chat Interface**: Message history and input
- **Thinking Process**: Collapsible agent reasoning steps
- **Real-time Responses**: Streaming from backend
- **Error Handling**: User-friendly error messages

### Stat Card (`src/components/StatCard.tsx`)

Reusable metric card component displaying:
- Icon
- Label
- Value
- Optional trend indicator

## 🔧 Development

### Code Structure

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route components in `src/pages/`
- **Hooks**: Custom React hooks in `src/hooks/`
- **Utils**: Helper functions in `src/lib/`
- **Types**: TypeScript interfaces in `src/lib/api.ts`

### Adding New Components

1. **Create component file** in `src/components/`
2. **Use shadcn/ui** for base components:
```bash
npx shadcn-ui@latest add [component-name]
```
3. **Import and use** in pages

### Styling Guidelines

- Use **Tailwind CSS** utility classes
- Follow **shadcn/ui** component patterns
- Use CSS variables for theming
- Maintain responsive design (mobile-first)

### TypeScript

- **Strict mode enabled**
- **Type all props and state**
- **Use interfaces from `src/lib/api.ts`** for API responses
- **Avoid `any` types**

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format with Prettier (if configured)
npm run format
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... more colors
}
```

CSS variables are defined in `src/index.css`.

### Background Images

Replace images in `src/assets/`:
- `bg-mountains.jpg` - Main dashboard background
- `bg-alpine.jpg` - Alternative background
- `bg-sunset.jpg` - Alternative background

### API Endpoint

Change backend URL:
1. Set `VITE_API_URL` in `.env` file
2. Or modify `API_BASE_URL` in `src/lib/api.ts`

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend-url.com`
3. Deploy

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.com`

### Deploy to Cloud Run / Docker

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

2. Build and deploy:
```bash
docker build -t crm-insight-frontend .
docker run -p 8080:8080 crm-insight-frontend
```

## 🐛 Troubleshooting

### Backend Connection Issues

**Error**: "Failed to fetch" or CORS errors

**Solution**:
1. Ensure backend is running on `http://localhost:8001`
2. Check CORS settings in backend (`api/main.py`)
3. Verify `VITE_API_URL` environment variable

### Port Conflicts

**Error**: Port 8080 already in use

**Solution**:
1. Change port in `vite.config.ts`:
```typescript
server: {
  port: 3000, // or any available port
}
```

### Build Errors

**Error**: TypeScript or build errors

**Solution**:
1. Clear cache: `rm -rf node_modules .vite dist`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Real-time Updates Not Working

**Solution**:
1. Check browser console for errors
2. Verify backend is running
3. Check React Query DevTools (if installed)
4. Verify `refetchInterval` in `useQuery` hooks

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
