# 🌍 Smart Collaborative Travel Planner

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Branch](https://img.shields.io/badge/Branch-development-orange?style=for-the-badge&logo=git)](https://github.com/hitanshigor1572/Code_crew/tree/development)

> **GlobeTrotter** is a modern, full-featured AI-powered travel planning and itinerary management platform built by **Code_crew**. It empowers travelers to seamlessly build multi-city itineraries, manage travel budgets with visual analytics, collaborate with companions in real-time, and get AI-assisted travel recommendations.

---

## 📌 Development Branch Status

> [!NOTE]
> You are currently on the **`development`** branch. This branch contains the latest active features, frontend prototypes, mock services, and upcoming backend integrations.

---

## ✨ Key Features

### 🗺️ Dynamic Itinerary Builder
- **Multi-City Trip Management**: Plan complex trips with multi-destination stops, arrival/departure schedules, and custom transit notes.
- **Day-by-Day Timeline Planner**: Organize daily activities with specific times, location tags, activity types (Sightseeing, Dining, Adventure, Relaxation), and costs.
- **Interactive Route Map & Weather**: Preview destinations with interactive route mapping and integrated local weather forecasts.
- **Trip Duplication & Sharing**: Clone existing itineraries or share live read-only links with custom public IDs (`/shared/[id]`).

### 🤖 AI Travel Assistant
- Built-in AI Travel Chatbot widget for destination recommendations, itinerary optimization, hidden gems, and packing checklists.

### 💰 Budget & Expense Tracker
- **Visual Analytics**: Interactive Recharts breakdown including Category Pie Charts, Daily Spending Bar Charts, and Budget Burn Trends.
- **Multi-Category Allocation**: Track flights, lodging, meals, transit, activities, and emergency buffers.
- **Currency Converter**: Built-in multi-currency conversion utility modal.

### 👥 Collaboration & Community
- **Companion Invites**: Add travel buddies with role-based access (`Editor` / `Viewer`).
- **Destination & Activity Discovery Hub**: Explore popular global cities, trending curated community itineraries, and filtered activity searches.
- **PDF Export**: Export clean printable travel summaries for offline access.

### 📊 Admin & Analytics Dashboard
- Comprehensive metrics monitoring platform users, active trips, popular destinations, and system engagement.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **UI Library** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), `tailwind-merge`, `tailwindcss-animate` |
| **Components & Primitives** | [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/), `canvas-confetti` |
| **Charts & Data Viz** | [Recharts](https://recharts.org/) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **State & Data Layer** | Mock Services (`/lib/services`) transitioning to REST/GraphQL APIs |
| **Backend (In-Progress)** | Planned Node.js/Express or Next.js API Routes + PostgreSQL / MongoDB |

---

## 📂 Project Structure

```text
Code_crew/
├── REDME.md                    # Project documentation
├── backend/                    # Backend API service (In Development)
│   └── .gitkeep
└── frontend/                   # Next.js 15 Frontend application
    ├── app/                    # Next.js App Router
    │   ├── (auth)/             # Authentication routes
    │   │   ├── login/          # Login page
    │   │   └── signup/         # Signup page
    │   ├── (main)/             # Core authenticated application layout
    │   │   ├── admin/          # Admin dashboard & analytics
    │   │   ├── budget/         # Global budget & expense overview
    │   │   ├── calendar/       # Trip calendar & timeline view
    │   │   ├── dashboard/      # User dashboard & upcoming trips
    │   │   ├── discover/       # Destination & activity discovery hub
    │   │   │   └── activities/ # Activity search & filter
    │   │   ├── profile/        # User profile & settings
    │   │   └── trips/          # Trip management
    │   │       ├── [id]/       # Trip detail view & itinerary builder
    │   │       └── create/     # Step-by-step trip creation wizard
    │   ├── shared/             # Public shareable trip view (/shared/[id])
    │   ├── globals.css         # Global Tailwind styles & design tokens
    │   ├── layout.tsx          # Root HTML layout
    │   ├── page.tsx            # High-conversion landing page
    │   └── providers.tsx       # Theme, toast, & context providers
    ├── components/             # Reusable UI component library
    │   ├── charts/             # Recharts visualizations (Budget, Spending, Trends)
    │   ├── common/             # AI Assistant, Modals (Currency, PDF, Collaboration)
    │   ├── forms/              # Login, Signup, Trip creation, Add Expense forms
    │   ├── layout/             # AppNavbar, Sidebar, LandingNavbar, Footer, MobileNav
    │   ├── map/                # Interactive trip maps & 3D Globe Hero
    │   ├── trip/               # TripCard, ActivityCard, WeatherCard, TimelineItem
    │   └── ui/                 # Radix UI primitives (Button, Dialog, Card, etc.)
    ├── data/                   # Mock data & initial seeds (MOCK_TRIPS, MOCK_CITIES)
    ├── lib/                    # Utilities & business logic
    │   ├── services/           # Service layer (Trip, City, Budget, Activity, User)
    │   └── utils.ts            # Helper methods & class merger
    ├── types/                  # TypeScript interfaces & domain models
    │   ├── activity.ts         # Activity & booking definitions
    │   ├── budget.ts           # Expense & category definitions
    │   ├── city.ts             # City & destination metadata
    │   ├── trip.ts             # Trip, ItineraryDay, CityStop models
    │   └── user.ts             # User & companion models
    ├── next.config.ts          # Next.js configuration
    ├── package.json            # Dependencies & scripts
    ├── tailwind.config.ts      # Tailwind styling configuration
    └── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- **Node.js**: `v18.18.0` or higher (Recommended: `v20+`)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Git**

### Installation

1. **Clone the repository and switch to `development` branch:**
   ```bash
   git clone -b development https://github.com/hitanshigor1572/Code_crew.git
   cd Code_crew
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Available Scripts

Inside the `frontend/` directory, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server with Turbopack / hot-reloading at `localhost:3000` |
| `npm run build` | Builds the optimized production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## 🌿 Git Branching & Contribution Workflow

To maintain clean code and avoid conflicts on the `development` branch:

1. **Always pull latest changes before starting work:**
   ```bash
   git checkout development
   git pull origin development
   ```

2. **Create a dedicated feature or bugfix branch:**
   ```bash
   # For new features
   git checkout -b feature/trip-drag-and-drop

   # For bug fixes
   git checkout -b fix/budget-currency-rounding
   ```

3. **Commit your changes using conventional commits:**
   ```bash
   git commit -m "feat(trip-builder): add drag-and-drop reordering for itinerary stops"
   ```

4. **Push your branch and open a Pull Request against `development`:**
   ```bash
   git push origin feature/trip-drag-and-drop
   ```

---

## 🗺️ Roadmap & Upcoming Milestones

- [x] **Phase 1: Frontend Architecture & UI System** (Landing page, Auth, Dashboard, Trip Builder, Budget Charts)
- [ ] **Phase 2: Backend & Database Integration** (REST/GraphQL API, PostgreSQL/Prisma, User Auth JWT/OAuth)
- [ ] **Phase 3: Live Real-Time Collaboration** (WebSockets / Supabase Realtime for concurrent trip planning)
- [ ] **Phase 4: AI & External API Integrations** (Live LLM Trip Generator, Google Places API, Live Flight/Hotel pricing)
- [ ] **Phase 5: PWA & Mobile Optimization** (Offline itinerary caching, mobile navigation enhancements)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
