# Project Structure Overview

## Directory Structure

```
educational-gaming-platform/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   └── games/
│   │       └── thumbnails/          # Game preview images
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # Shadcn/UI components
│   │   │   ├── GameCard.tsx         # Game display component
│   │   │   ├── GameLoader.tsx       # Dynamic game loading
│   │   │   ├── Header.tsx           # Site navigation
│   │   │   ├── ProgressTracker.tsx  # Student progress display
│   │   │   └── ...
│   │   ├── contexts/                # React contexts
│   │   │   └── UserContext.tsx      # User authentication state
│   │   ├── games/                   # Individual game components
│   │   │   ├── AdditionArcade/      # Math addition game
│   │   │   ├── SpellingBeeGarden/   # Spelling practice game
│   │   │   ├── SubtractionSafari/   # Math subtraction game
│   │   │   └── ...                  # 25+ educational games
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-mobile.tsx       # Mobile detection
│   │   │   └── use-toast.ts         # Toast notifications
│   │   ├── lib/                     # Utility functions
│   │   │   ├── constants.ts         # App constants
│   │   │   ├── queryClient.ts       # TanStack Query setup
│   │   │   └── utils.ts             # Helper functions
│   │   ├── pages/                   # Route components
│   │   │   ├── HomePage.tsx         # Landing page
│   │   │   ├── GameDetailPage.tsx   # Individual game page
│   │   │   ├── ClassroomToolsPage.tsx # Teacher resources
│   │   │   ├── GradePage.tsx        # Grade-specific games
│   │   │   └── ...
│   │   ├── types/                   # TypeScript definitions
│   │   │   └── index.ts             # Shared type exports
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # App entry point
│   │   └── index.css                # Global styles
│   └── index.html                   # HTML template
├── server/                          # Backend Express application
│   ├── databaseStorage.ts           # PostgreSQL storage implementation
│   ├── db.ts                        # Database connection setup
│   ├── index.ts                     # Express server entry point
│   ├── routes.ts                    # API route definitions
│   ├── seedDatabase.ts              # Database seeding utility
│   ├── storage.ts                   # In-memory storage implementation
│   ├── storageInterface.ts          # Storage abstraction layer
│   └── vite.ts                      # Vite integration for SSR
├── shared/                          # Shared code between client/server
│   └── schema.ts                    # Database schema & TypeScript types
├── docs/                            # Documentation files
│   ├── README.md                    # Main project documentation
│   ├── DEPLOYMENT_GUIDE.md          # Deployment instructions
│   ├── TECHNICAL_ARCHITECTURE.md    # Technical deep dive
│   └── PROJECT_STRUCTURE.md         # This file
├── .gitignore                       # Git ignore rules
├── .replit                          # Replit configuration
├── components.json                  # Shadcn/UI configuration
├── drizzle.config.ts                # Database migration config
├── package.json                     # Node.js dependencies
├── package-lock.json                # Dependency lock file
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── version                          # Application version
└── vite.config.ts                   # Vite build configuration
```

## Key File Descriptions

### Frontend Core Files

**client/src/App.tsx**
- Main application component with routing setup
- Global providers (QueryClient, UserContext)
- Route definitions using Wouter

**client/src/main.tsx**
- Application entry point
- React DOM rendering
- Global CSS imports

**client/src/components/GameLoader.tsx**
- Dynamic game component loading system
- Sound management integration
- Progress tracking callbacks

### Backend Core Files

**server/index.ts**
- Express server configuration
- Middleware setup (CORS, compression, static files)
- Route registration and error handling

**server/routes.ts**
- RESTful API endpoint definitions
- PDF generation functionality
- Classroom resource management
- User progress tracking

**server/storage.ts & server/databaseStorage.ts**
- Data storage abstraction layer
- In-memory storage for development
- PostgreSQL implementation for production

### Database Schema

**shared/schema.ts**
- Drizzle ORM schema definitions
- TypeScript type exports
- Validation schemas using Zod

### Configuration Files

**vite.config.ts**
```typescript
export default defineConfig({
  plugins: [
    react(),
    cartographer(),
    runtimeErrorModal()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./attached_assets")
    }
  }
});
```

**tailwind.config.ts**
```typescript
module.exports = {
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette for educational theme
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
```

## Component Architecture

### Game Components Structure

Each game follows a consistent structure:

```
games/[GameName]/
├── index.tsx              # Main game component
├── components/            # Game-specific components
│   ├── GameBoard.tsx      # Game play area
│   ├── ScoreDisplay.tsx   # Score tracking
│   └── Instructions.tsx   # How to play
├── hooks/                 # Game-specific hooks
│   ├── useGameLogic.ts    # Game state management
│   └── useSound.ts        # Audio management
├── utils/                 # Game utilities
│   ├── gameLogic.ts       # Game rules and logic
│   └── constants.ts       # Game constants
└── types.ts               # Game-specific types
```

### Page Components

Pages are organized by functionality:

```
pages/
├── HomePage.tsx           # Landing page with featured games
├── GameDetailPage.tsx     # Individual game information
├── GradePage.tsx          # Grade-specific game listings
├── ClassroomToolsPage.tsx # Teacher resource downloads
├── teachers/              # Teacher-specific pages
│   ├── TeachersPage.tsx
│   ├── ClassroomToolsPage.tsx
│   └── ResourcesPage.tsx
├── parents/               # Parent-specific pages
│   ├── ParentsPage.tsx
│   ├── ProgressPage.tsx
│   └── SafetyPage.tsx
└── ...
```

## Data Flow Architecture

### API Data Flow

```
Frontend Component
    ↓ (useQuery)
TanStack Query
    ↓ (HTTP Request)
Express Router
    ↓ (Storage Interface)
Storage Implementation
    ↓ (Database Query)
PostgreSQL/Memory Store
    ↓ (Response)
Storage Interface
    ↓ (JSON Response)
Express Router
    ↓ (HTTP Response)
TanStack Query
    ↓ (State Update)
React Component
```

### Game Progress Flow

```
Game Component
    ↓ (onScoreUpdate)
Progress Tracker
    ↓ (API Call)
/api/user-progress
    ↓ (Database Update)
User Progress Table
    ↓ (Badge Check)
Achievement System
    ↓ (UI Update)
Progress Display
```

## Development Workflow

### Local Development Setup

1. **Environment Setup**
   ```bash
   npm install
   cp .env.example .env
   ```

2. **Database Setup**
   ```bash
   # For PostgreSQL
   npm run db:push
   npm run db:seed
   
   # For in-memory (default)
   # No setup required
   ```

3. **Development Server**
   ```bash
   npm run dev
   # Starts both frontend (Vite) and backend (Express)
   ```

### Build Process

1. **Development Build**
   ```bash
   npm run build:dev
   ```

2. **Production Build**
   ```bash
   npm run build
   npm run start
   ```

### Testing Strategy

```
tests/
├── unit/                  # Component unit tests
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/           # API integration tests
│   ├── games.test.ts
│   ├── progress.test.ts
│   └── resources.test.ts
├── e2e/                   # End-to-end tests
│   ├── game-flow.test.ts
│   ├── teacher-tools.test.ts
│   └── navigation.test.ts
└── fixtures/              # Test data
    ├── games.json
    ├── users.json
    └── progress.json
```

## Deployment Structure

### Production Build Output

```
dist/
├── client/                # Frontend build output
│   ├── assets/            # Bundled CSS/JS files
│   ├── index.html         # Main HTML file
│   └── ...
├── server/                # Backend build output
│   ├── index.js           # Compiled server code
│   └── ...
└── shared/                # Shared compiled code
    └── schema.js
```

### Environment Configuration

**Development (.env.development)**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/educational_gaming_dev
```

**Production (.env.production)**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://prod-host:5432/educational_gaming_prod
CORS_ORIGIN=https://yourdomain.com
```

## Package Dependencies

### Frontend Dependencies

**Core React Ecosystem**
- react: ^18.2.0 - UI library
- react-dom: ^18.2.0 - DOM rendering
- @types/react: ^18.2.0 - TypeScript types
- @types/react-dom: ^18.2.0 - TypeScript types

**Routing & State Management**
- wouter: ^2.11.0 - Lightweight routing
- @tanstack/react-query: ^4.29.0 - Server state management

**UI Framework**
- tailwindcss: ^3.3.0 - CSS framework
- @radix-ui/*: Various - Accessible UI primitives
- lucide-react: ^0.263.0 - Icon library
- framer-motion: ^10.12.0 - Animation library

**Form Handling**
- react-hook-form: ^7.45.0 - Form management
- @hookform/resolvers: ^3.1.0 - Form validation
- zod: ^3.21.0 - Schema validation

### Backend Dependencies

**Server Framework**
- express: ^4.18.0 - Web framework
- @types/express: ^4.17.0 - TypeScript types

**Database & ORM**
- drizzle-orm: ^0.28.0 - Type-safe ORM
- drizzle-kit: ^0.19.0 - Migration toolkit
- @neondatabase/serverless: ^0.4.0 - PostgreSQL driver
- drizzle-zod: ^0.5.0 - Zod integration

**PDF Generation**
- pdfkit: ^0.13.0 - PDF creation library
- @types/pdfkit: ^0.12.0 - TypeScript types

**Development Tools**
- tsx: ^3.12.0 - TypeScript execution
- typescript: ^5.0.0 - TypeScript compiler
- @types/node: ^20.0.0 - Node.js types

### Build Tools

**Vite Ecosystem**
- vite: ^4.3.0 - Build tool
- @vitejs/plugin-react: ^4.0.0 - React plugin
- @replit/vite-plugin-cartographer: Latest - Replit integration

**CSS Processing**
- postcss: ^8.4.0 - CSS processor
- autoprefixer: ^10.4.0 - CSS prefixing
- @tailwindcss/typography: ^0.5.0 - Typography plugin

## Security Considerations

### Input Validation
- All API endpoints use Zod schema validation
- Frontend form validation with react-hook-form
- SQL injection prevention with parameterized queries

### File Security
- PDF generation sandboxed with PDFKit
- Static file serving with proper headers
- No direct file system access from frontend

### Environment Security
- Sensitive data in environment variables
- CORS properly configured for production
- Rate limiting on API endpoints

This project structure provides a scalable foundation for the educational gaming platform with clear separation of concerns, type safety throughout the stack, and comprehensive tooling for development and deployment.