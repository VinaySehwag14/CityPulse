# CityPulse 🏙️⚡

**CityPulse** is a hyperlocal event discovery platform designed to help users find the "pulse" of their city in real-time. By surfacing live and trending events based on social buzz, it provides a unique way to discover what's happening *right now* around you.

---

## ✨ Features

- **Live Event Discovery**: Real-time feed of events happening in your immediate vicinity.
- **Trending Pulse**: Events ranked by social momentum and attendee real-time buzz.
- **Interactive Maps**: Seamlessly browse events geographically with a polished Mapbox integration.
- **Seamless Auth**: Frictionless login experience powered by Clerk.
- **Event Hosting**: Empowering users to create, manage, and promote their own local events.
- **Animated UI**: A fluid, high-performance interface with GSAP-powered micro-animations for a premium feel.

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: [GSAP](https://greensock.com/gsap/) + `@gsap/react`
- **Auth**: [Clerk](https://clerk.com/)
- **Maps**: [Mapbox GL JS](https://www.mapbox.com/) + [React-Map-GL](https://visgl.github.io/react-map-gl/)
- **Data Fetching**: TanStack Query (React Query) v5
- **Icons**: Lucide React

### Backend (`apps/api`)
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express
- **Database**: PostgreSQL (Neon)
- **Real-time**: WebSockets (`ws`)
- **AI**: Google Generative AI (`@google/genai`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm or pnpm
- Clerk Account (for API keys)
- Mapbox Access Token

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VinaySehwag14/CityPulse.git
   cd CityPulse
   ```

2. **Install dependencies**:
   ```bash
   # Install root and workspace dependencies
   cd apps/web && npm install
   cd ../api && npm install
   ```

3. **Environment Setup**:
   Create `.env.local` in `apps/web` and `.env` in `apps/api` with the required Clerk and Mapbox credentials:

   **Web (`apps/web/.env.local`):**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_token
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

   **API (`apps/api/.env`):**
   ```env
   PORT=4000
   DATABASE_URL=your_postgres_url
   CLERK_SECRET_KEY=your_key
   ```

### Running Locally

Run both applications concurrently:

```bash
# In terminal 1 (Frontend)
cd apps/web
npm run dev

# In terminal 2 (Backend)
cd apps/api
npm run dev
```

---

## 📂 Project Structure

```text
CityPulse/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # Express backend API
├── docs/             # Documentation and design assets
└── README.md         # You are here!
```

---

## 🗺️ Roadmap & Contributing

We are currently building towards the ultimate vision of an AI-powered hyperlocal hub. Our next priorities include:

1.  **User Sync**: Robust profile synchronization between Clerk and Postgres.
2.  **Event Management**: Full CRUD capabilities for event owners.
3.  **Feed Organization**: Smart filtering by "Live", "Trending", and "Upcoming".
4.  **AI Capabilities**: Semantic search and automated event tagging.

### 🤝 How to Contribute

We welcome contributions from the community!

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please ensure your code follows the existing style guidelines and includes appropriate TypeScript definitions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Created with ❤️ by [Vinay Sehwag](https://github.com/VinaySehwag14)
