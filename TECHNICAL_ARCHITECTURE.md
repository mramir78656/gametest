# Technical Architecture Documentation

## System Overview

The Educational Gaming Platform is a full-stack web application built with modern JavaScript technologies, designed to deliver interactive educational content for PreK-6 students with comprehensive teacher tools.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │   Data Layer    │
│                 │    │                 │    │                 │
│  React/Vite     │◄──►│  Express.js     │◄──►│  PostgreSQL     │
│  TypeScript     │    │  TypeScript     │    │  In-Memory      │
│  Tailwind CSS   │    │  PDFKit         │    │  Drizzle ORM    │
│  TanStack Query │    │  Zod Validation │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack Analysis

### Frontend Technologies

**React 18 with TypeScript**
- Component-based architecture with functional components
- Hooks for state management (useState, useEffect, useContext)
- Strict TypeScript configuration for type safety
- Hot module replacement for development efficiency

**Vite Build System**
- Fast development server with instant hot reload
- Optimized production builds with tree shaking
- Plugin ecosystem for enhanced functionality
- ES modules support for modern browsers

**Tailwind CSS Framework**
- Utility-first CSS approach for rapid development
- Built-in responsive design utilities
- Consistent design system with customizable theme
- JIT (Just-In-Time) compilation for optimal bundle size

**UI Component Library (Shadcn/UI)**
- Pre-built accessible components using Radix UI primitives
- Consistent design patterns across the application
- Customizable theme system with CSS variables
- TypeScript support with proper prop typing

### Backend Technologies

**Express.js Framework**
- RESTful API design with proper HTTP methods
- Middleware architecture for request processing
- Static file serving for game assets and thumbnails
- Error handling and logging mechanisms

**TypeScript Server Implementation**
- Shared type definitions between frontend and backend
- Compile-time error checking for API endpoints
- Enhanced development experience with IntelliSense
- Consistent code patterns across the entire stack

**PDF Generation System (PDFKit)**
- Server-side PDF creation for educational resources
- Dynamic content generation based on templates
- Educational worksheet creation with visual elements
- Streaming PDF responses for optimal performance

### Data Management

**Drizzle ORM**
- Type-safe database operations with TypeScript
- Schema-first approach with automatic type inference
- Migration management for database evolution
- Query builder with SQL-like syntax

**Database Architecture**
```sql
-- Core entity relationships
Users (1) ─── (M) UserProgress (M) ─── (1) Games
  │                                        │
  │                                        │
  └─── (M) UserBadges (M) ─── (1) Badges   │
                                          │
Subjects (M) ─── (M) GameSubjects ────────┘
  │
  │
Grades (1) ─── (M) Games
```

**Storage Flexibility**
- PostgreSQL for production deployments
- In-memory storage for development and testing
- Abstracted storage interface for easy switching
- Data seeding utilities for consistent development

## Application Architecture Patterns

### Component Architecture

**Atomic Design Pattern**
```
Atoms: Button, Input, Badge, Icon
Molecules: GameCard, SearchBar, FilterDropdown
Organisms: Header, GameGrid, ResourceLibrary
Templates: PageLayout, GameDetailLayout
Pages: HomePage, GamePage, ClassroomToolsPage
```

**Component Hierarchy**
```
App
├── Router
│   ├── HomePage
│   │   ├── Hero
│   │   ├── FeaturedGames
│   │   └── GradeNavigation
│   ├── GameDetailPage
│   │   ├── GameDetail
│   │   ├── GameLoader
│   │   └── SimilarGames
│   └── ClassroomToolsPage
│       ├── ResourceFilter
│       ├── ResourceGrid
│       └── DownloadManager
```

### State Management Strategy

**Server State (TanStack Query)**
- API data fetching and caching
- Background refetching for data freshness
- Optimistic updates for better UX
- Error handling and retry logic

**Client State (React Hooks)**
- UI state management with useState
- Component lifecycle with useEffect
- Cross-component state with useContext
- Form state with custom hooks

**Data Flow Pattern**
```
API Request → TanStack Query → React Component → UI Update
     ↑                                              ↓
Database ← Server Processing ← User Interaction ← Event Handler
```

### API Design Patterns

**RESTful Endpoint Structure**
```
GET    /api/games              # List all games
GET    /api/games/:slug        # Get specific game
POST   /api/games              # Create new game (admin)
PUT    /api/games/:id          # Update game (admin)
DELETE /api/games/:id          # Delete game (admin)

GET    /api/user-progress/:userId/:gameId  # Get progress
POST   /api/user-progress                  # Update progress

GET    /api/classroom-resources            # List resources
GET    /api/download-resource/:id          # Download PDF
POST   /api/generate-custom-resource       # Create custom PDF
```

**Request/Response Patterns**
```typescript
// Standardized API response format
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Error handling pattern
interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}
```

## Game System Architecture

### Dynamic Game Loading

**Component-Based Game Architecture**
```typescript
// Game interface definition
interface GameComponent {
  title: string;
  description: string;
  play: () => void;
  pause: () => void;
  reset: () => void;
  getScore: () => number;
  onComplete: (score: number) => void;
}

// Dynamic loading pattern
const GameLoader = async (gameSlug: string) => {
  const gameModule = await import(`../games/${gameSlug}/index.tsx`);
  return gameModule.default;
};
```

**Game State Management**
```typescript
interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentLevel: number;
  score: number;
  timeElapsed: number;
  attempts: number;
}

// Game lifecycle hooks
useGameState(gameId: string) {
  // Load saved progress
  // Track playing time
  // Save progress on completion
  // Update achievements
}
```

### Audio System Implementation

**HTML5 Audio API Integration**
```typescript
class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  
  preloadSounds(soundFiles: string[]) {
    // Preload audio files for better performance
  }
  
  playSound(soundId: string, volume: number = 1) {
    // Play educational sound effects
  }
  
  setMuted(muted: boolean) {
    // Global mute control
  }
}
```

## PDF Generation System

### Template-Based Generation

**Educational Resource Templates**
```typescript
interface ResourceTemplate {
  type: 'worksheet' | 'flashcard' | 'poster' | 'template';
  subject: string;
  gradeLevel: string;
  generateContent: (doc: PDFDocument, params: any) => void;
}

// Math worksheet generator
generateMathWorksheet(doc: PDFDocument, config: MathConfig) {
  // Generate problems based on difficulty
  // Add visual aids (dots, shapes)
  // Include answer key
  // Apply grade-appropriate styling
}
```

**Dynamic Content Generation**
```typescript
// PDF streaming for large documents
app.get('/api/download-resource/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="resource.pdf"');
  
  const doc = new PDFDocument();
  doc.pipe(res);
  
  generateResourceContent(doc, req.params.id);
  doc.end();
});
```

## Performance Optimization Strategies

### Frontend Optimizations

**Code Splitting**
```typescript
// Route-based code splitting
const GameDetailPage = lazy(() => import('./pages/GameDetailPage'));
const ClassroomToolsPage = lazy(() => import('./pages/ClassroomToolsPage'));

// Component-based splitting
const HeavyGameComponent = lazy(() => import('./games/ComplexGame'));
```

**Asset Optimization**
```typescript
// Image optimization
import optimizedImage from '../assets/game-thumbnail.jpg?width=300&format=webp';

// Bundle analysis
import { analyzer } from 'rollup-plugin-analyzer';
// Configure in vite.config.ts for bundle size monitoring
```

### Backend Optimizations

**Caching Strategy**
```typescript
// API response caching
app.use('/api/games', cacheMiddleware(300)); // 5 minutes

// Static asset caching
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: true
}));
```

**Database Query Optimization**
```sql
-- Indexed queries for performance
CREATE INDEX idx_games_grade_subject ON games(grade_id, subject_id);
CREATE INDEX idx_user_progress_lookup ON user_progress(user_id, game_id);

-- Query optimization
SELECT g.*, s.name as subject_name 
FROM games g 
JOIN subjects s ON g.subject_id = s.id 
WHERE g.grade_id = $1 
ORDER BY g.display_order;
```

## Security Implementation

### Data Validation

**Zod Schema Validation**
```typescript
// Input validation schema
const gameProgressSchema = z.object({
  gameId: z.number().positive(),
  userId: z.number().positive(),
  score: z.number().min(0).max(1000),
  level: z.number().min(1).max(50),
  completedAt: z.date().optional()
});

// API endpoint validation
app.post('/api/user-progress', (req, res) => {
  const result = gameProgressSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  // Process validated data
});
```

**SQL Injection Prevention**
```typescript
// Parameterized queries with Drizzle
const userProgress = await db
  .select()
  .from(userProgressTable)
  .where(
    and(
      eq(userProgressTable.userId, userId),
      eq(userProgressTable.gameId, gameId)
    )
  );
```

### Content Security

**CORS Configuration**
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Rate Limiting**
```typescript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', apiLimiter);
```

## Testing Architecture

### Testing Strategy

**Unit Testing**
```typescript
// Component testing with React Testing Library
describe('GameCard Component', () => {
  test('renders game information correctly', () => {
    const mockGame = {
      id: 1,
      title: 'Math Adventure',
      description: 'Learn math through fun games'
    };
    
    render(<GameCard game={mockGame} />);
    expect(screen.getByText('Math Adventure')).toBeInTheDocument();
  });
});
```

**Integration Testing**
```typescript
// API endpoint testing
describe('Games API', () => {
  test('GET /api/games returns game list', async () => {
    const response = await request(app)
      .get('/api/games')
      .expect(200);
    
    expect(response.body).toHaveProperty('length');
    expect(response.body[0]).toHaveProperty('title');
  });
});
```

**End-to-End Testing**
```typescript
// User flow testing with Playwright
test('user can play a game and see progress', async ({ page }) => {
  await page.goto('/games/math-adventure');
  await page.click('[data-testid="play-button"]');
  await page.waitForSelector('[data-testid="game-container"]');
  
  // Simulate game completion
  await page.evaluate(() => {
    window.gameComplete(85); // 85% score
  });
  
  await expect(page.locator('[data-testid="score-display"]')).toContainText('85');
});
```

## Deployment Architecture

### Production Infrastructure

**Application Server**
```yaml
# Docker configuration
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

**Database Configuration**
```typescript
// Production database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

### Monitoring and Logging

**Application Monitoring**
```typescript
// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/health/db', async (req, res) => {
  try {
    await db.select().from(games).limit(1);
    res.json({ database: 'connected' });
  } catch (error) {
    res.status(503).json({ database: 'disconnected', error: error.message });
  }
});
```

**Error Tracking**
```typescript
// Centralized error handling
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error ${req.method} ${req.path}:`, error);
  
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    errorTracker.captureException(error, {
      user: req.user,
      request: req
    });
  }
  
  res.status(500).json({
    message: 'Internal server error',
    requestId: req.id
  });
});
```

## Scalability Considerations

### Horizontal Scaling

**Load Balancing**
```nginx
upstream app_servers {
    server app1:5000;
    server app2:5000;
    server app3:5000;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Session Management**
```typescript
// Stateless authentication with JWT
const sessionConfig = {
  store: new RedisStore({
    client: redisClient
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};
```

### Database Optimization

**Read Replicas**
```typescript
// Database connection routing
const masterDb = drizzle(masterPool);
const replicaDb = drizzle(replicaPool);

// Read from replica, write to master
export const getGames = () => replicaDb.select().from(games);
export const createGame = (data) => masterDb.insert(games).values(data);
```

**Caching Layer**
```typescript
// Redis caching for frequently accessed data
const getGamesWithCache = async (gradeId: number) => {
  const cacheKey = `games:grade:${gradeId}`;
  
  let games = await redis.get(cacheKey);
  if (!games) {
    games = await db.select().from(gamesTable).where(eq(gamesTable.gradeId, gradeId));
    await redis.setex(cacheKey, 300, JSON.stringify(games)); // 5 minute cache
  }
  
  return JSON.parse(games);
};
```

This technical architecture provides a solid foundation for scaling the educational gaming platform while maintaining performance, security, and maintainability.