# Educational Gaming Platform

A comprehensive interactive educational gaming platform designed for PreK-6 students, delivering engaging subject-specific learning experiences through HTML5 games and comprehensive classroom management tools.

## 🎯 Project Overview

This full-stack application provides:

- **Interactive Educational Games**: 25+ HTML5 games covering Math, English, Science, and more
- **Classroom Management Tools**: PDF worksheet generation, resource downloads, and teacher utilities
- **Progress Tracking**: Student achievement tracking with badges and analytics
- **Responsive Design**: Multi-device accessibility for tablets, desktops, and mobile devices
- **Sound Integration**: Educational sound effects and audio feedback for enhanced learning

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript for enhanced development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Shadcn/UI** - Pre-built component library with Radix UI primitives
- **TanStack Query (React Query)** - Data fetching and state management
- **Wouter** - Lightweight client-side routing
- **React Helmet** - Document head management for SEO
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Modern icon library

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe server-side development
- **PDFKit** - PDF generation library for educational resources
- **Drizzle ORM** - Type-safe database operations
- **Zod** - Schema validation and type inference

### Database & Data Management
- **PostgreSQL** - Primary database (configurable)
- **In-Memory Storage** - Alternative storage for development/testing
- **Drizzle Schema** - Database schema management with TypeScript support

### Development & Build Tools
- **TSX** - TypeScript execution for Node.js
- **ESBuild** - Fast bundling and compilation
- **PostCSS** - CSS processing with Autoprefixer
- **npm** - Package management

## 📊 Database Schema

### Core Tables

#### Users
```sql
- id: Primary key
- username: Unique username
- password: Encrypted password
- displayName: User display name
- email: User email address
- role: User role (student/teacher/admin)
- createdAt: Account creation timestamp
```

#### Grades
```sql
- id: Primary key
- name: Grade name (PreK, Grade 1, etc.)
- slug: URL-friendly identifier
- displayOrder: Sorting order
- color: UI theme color
- icon: Grade icon identifier
```

#### Subjects
```sql
- id: Primary key
- name: Subject name (Math, English, Science)
- slug: URL-friendly identifier
- displayOrder: Sorting order
- color: UI theme color
- icon: Subject icon
- description: Subject description
```

#### Games
```sql
- id: Primary key
- title: Game title
- slug: URL-friendly identifier
- description: Game description
- instructions: How to play
- educationalBenefits: Learning outcomes
- gradeId: Associated grade level
- gameType: Technology type (HTML5, CreateJS)
- thumbnail: Preview image path
- isPremium: Premium content flag
- difficulty: Difficulty level
- estimatedDuration: Play time estimate
- createdAt/updatedAt: Timestamps
```

#### User Progress
```sql
- id: Primary key
- userId: Reference to users table
- gameId: Reference to games table
- level: Current level achieved
- score: Highest score
- completedAt: Completion timestamp
- lastPlayed: Last activity timestamp
```

#### Badges & Achievements
```sql
- badges: Achievement badges with requirements
- user_badges: User-earned badges mapping
- achievements: Game-specific achievements
- user_achievements: User-earned achievements
```

## 🎮 Game Architecture

### Game Loader System
The platform uses a dynamic game loading system:

```typescript
// Game components are loaded dynamically
const GameLoader = ({ gameSlug, isMuted, onScoreUpdate }) => {
  // Dynamically import game components
  const gameComponent = await import(`../games/${gameSlug}/index.tsx`);
  return gameComponent;
};
```

### Sound System
Educational sound effects using HTML5 Audio API:

```typescript
// Sound management for educational feedback
const playSound = (soundType: 'correct' | 'incorrect' | 'complete') => {
  const audio = new Audio(`/sounds/${soundType}.mp3`);
  audio.play();
};
```

### Available Games
1. **Addition Arcade** - Math addition practice with visual aids
2. **Subtraction Safari** - Animal-themed subtraction problems
3. **Spelling Bee Garden** - Interactive spelling practice
4. **Sight Word Memory** - Memory games for sight word recognition
5. **Grammar Castle Adventure** - Grammar and sentence structure
6. **Space Math Explorer** - Advanced math concepts
7. **Pirate Treasure Multiplication** - Multiplication tables practice
8. **Dinosaur Fossil Fractions** - Fraction learning with prehistoric themes
9. **Word Wizards** - Vocabulary and word formation
10. **Superhero Sight Words** - Action-packed sight word games

## 🛠️ Classroom Tools System

### PDF Generation
Using PDFKit library for creating educational resources:

```javascript
// Math worksheet generation
function generateMathAdditionWorksheet(doc) {
  doc.fontSize(20).text('Math Addition Worksheets - Grade 1');
  // Generate problems with visual aids
  problems.forEach(problem => {
    doc.text(`${problem.a} + ${problem.b} = ___`);
    // Add visual dots for counting
  });
}
```

### Available Resources
- **Worksheets**: Math, English, Science practice sheets
- **Flashcards**: Sight words, multiplication tables
- **Posters**: Phonics charts, safety rules
- **Templates**: Reading comprehension, custom activities

### Resource API Endpoints
```javascript
GET /api/classroom-resources - List all resources with filtering
GET /api/download-resource/:id - Download PDF resource
GET /api/resource-preview/:id - Preview resource thumbnail
POST /api/generate-custom-resource - Create custom teaching materials
```

## 📱 Frontend Architecture

### Component Structure
```
client/src/
├── components/
│   ├── ui/ - Reusable UI components (Shadcn)
│   ├── GameCard.tsx - Game display component
│   ├── GameLoader.tsx - Dynamic game loading
│   ├── Header.tsx - Navigation header
│   └── ProgressTracker.tsx - Student progress display
├── games/ - Individual game components
├── pages/ - Route components
├── hooks/ - Custom React hooks
├── lib/ - Utilities and constants
└── types/ - TypeScript type definitions
```

### State Management
- **TanStack Query** for server state management
- **React Context** for user authentication
- **Local State** with useState/useEffect hooks

### Routing System
Using Wouter for client-side routing:

```typescript
// Route definitions
<Route path="/" component={HomePage} />
<Route path="/games/:slug" component={GameDetailPage} />
<Route path="/classroom-tools" component={ClassroomToolsPage} />
<Route path="/grades/:gradeSlug" component={GradePage} />
```

## 💻 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional - uses in-memory storage by default)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd educational-gaming-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
```env
# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Development
NODE_ENV=development
PORT=5000
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema changes
npm run db:generate  # Generate database migrations
```

## 🚀 Deployment Guide

### Option 1: Replit Deployment (Recommended)

1. **Prepare for Deployment**
   ```bash
   # Ensure all dependencies are installed
   npm install
   
   # Build the application
   npm run build
   ```

2. **Deploy on Replit**
   - Open your Replit project
   - Click the "Deploy" button in the top right
   - Select "Autoscale deployment" for production use
   - Configure custom domain if needed
   - Click "Deploy" to publish

3. **Access Your Application**
   - Your app will be available at: `https://your-repl-name.your-username.repl.co`
   - Or your custom domain if configured

### Option 2: Traditional Hosting (Vercel, Netlify, etc.)

1. **Build Configuration**
   ```bash
   # Build the application
   npm run build
   
   # The dist/ folder contains the built application
   ```

2. **Environment Setup**
   ```env
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   PORT=5000
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

4. **Deploy to Railway/Render**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically on push

### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Deploy with Docker**
   ```bash
   # Build image
   docker build -t educational-gaming .
   
   # Run container
   docker run -p 5000:5000 educational-gaming
   ```

### Database Configuration for Production

#### PostgreSQL Setup
```sql
-- Create database
CREATE DATABASE educational_gaming;

-- Run migrations
npm run db:push
```

#### Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

## 📋 API Documentation

### Game Endpoints
```
GET /api/games - List all games
GET /api/games/:slug - Get specific game
GET /api/games/by-grade/:gradeId - Games by grade level
GET /api/games/featured - Featured games
```

### User Progress Endpoints
```
GET /api/user-progress/:userId/:gameId - Get user progress
POST /api/user-progress - Update user progress
GET /api/user-badges/:userId - Get user badges
```

### Classroom Resources
```
GET /api/classroom-resources - List teaching resources
GET /api/download-resource/:resourceId - Download PDF
POST /api/generate-custom-resource - Create custom material
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Coverage
- Component rendering tests
- API endpoint testing
- Database operation testing
- PDF generation validation

## 🔒 Security Features

- **Input Validation**: Zod schema validation on all endpoints
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **XSS Protection**: React's built-in XSS prevention
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Sensitive data protection

## 📈 Performance Optimizations

- **Code Splitting**: Dynamic imports for game components
- **Image Optimization**: Optimized thumbnails and assets
- **Caching**: React Query caching for API responses
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **CDN Ready**: Static asset serving optimization

## 🎨 Design System

### Colors
- Primary: Blue (#3B82F6)
- Secondary: Green (#10B981)
- Accent: Purple (#8B5CF6)
- Grade-specific color coding for visual organization

### Typography
- Headings: Inter font family
- Body: System font stack for performance
- Accessible font sizes and contrast ratios

### Icons
- Lucide React icon library
- Consistent 16px/20px/24px sizing
- Semantic icon usage throughout

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Conventional commits for clear history

## 📞 Support

### Common Issues
1. **PDF Download Issues**: Check PDFKit installation and file permissions
2. **Game Loading Problems**: Verify dynamic import paths and component exports
3. **Database Connection**: Confirm DATABASE_URL format and credentials
4. **Sound Playback**: Check browser audio policy and file formats

### Troubleshooting
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
npm run db:reset

# Check build errors
npm run build --verbose
```

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Educational content reviewed by certified teachers
- Accessibility guidelines following WCAG 2.1 standards
- Game mechanics based on educational research
- UI/UX designed for young learners

---

**Live Preview**: Once deployed, access your educational gaming platform at your chosen domain to experience the full functionality including interactive games, progress tracking, and classroom tools with PDF downloads.