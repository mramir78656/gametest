# Educational Gaming Platform - Deployment Guide

## Quick Start for Online Preview

### Replit Deployment (Fastest Method)

1. **Automatic Deployment**
   - Click the "Deploy" button in your Replit interface
   - Select "Autoscale Deployment" for production use
   - Your app will be live at: `https://your-repl-name.your-username.replit.app`

2. **Manual Build Check**
   ```bash
   npm run build
   npm start
   ```

3. **Access Your Live Site**
   - Main Platform: `https://your-deployment-url.replit.app`
   - Games Section: `https://your-deployment-url.replit.app/grades/grade-1`
   - Classroom Tools: `https://your-deployment-url.replit.app/classroom-tools`

## Production Deployment Options

### Option 1: Vercel (Recommended for Static + API)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Command**
   ```bash
   vercel --prod
   ```

3. **Configuration File** (`vercel.json`)
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "client/**",
         "use": "@vercel/static-build"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/dist/$1"
       }
     ]
   }
   ```

### Option 2: Railway (Full-Stack with Database)

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add PostgreSQL service

2. **Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=5000
   ```

3. **Build Configuration**
   - Railway automatically detects Node.js
   - Runs `npm run build` and `npm start`

### Option 3: Render (Simple Full-Stack)

1. **Web Service Setup**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

2. **Database Setup**
   - Add PostgreSQL service
   - Connect via DATABASE_URL

## Environment Configuration

### Production Environment Variables
```env
# Required
NODE_ENV=production
PORT=5000

# Database (choose one)
DATABASE_URL=postgresql://user:pass@host:port/dbname
# OR use in-memory storage (no DATABASE_URL needed)

# Optional
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

### Development Environment Variables
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/educational_gaming_dev
```

## Database Setup

### PostgreSQL Production Setup

1. **Create Database**
   ```sql
   CREATE DATABASE educational_gaming_production;
   CREATE USER app_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE educational_gaming_production TO app_user;
   ```

2. **Run Migrations**
   ```bash
   npm run db:push
   ```

3. **Seed Data** (Optional)
   ```bash
   npm run db:seed
   ```

### In-Memory Storage (Default)
- No database setup required
- Data resets on server restart
- Suitable for demos and development

## Build Process

### Production Build Steps

1. **Install Dependencies**
   ```bash
   npm ci --production
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Verify Build**
   ```bash
   npm run start
   curl http://localhost:5000/api/health
   ```

### Build Optimization

1. **Bundle Analysis**
   ```bash
   npm run analyze
   ```

2. **Performance Check**
   - Lighthouse audit
   - Core Web Vitals monitoring
   - Asset optimization

## Domain Configuration

### Custom Domain Setup

1. **DNS Configuration**
   ```
   Type: CNAME
   Name: @
   Value: your-deployment-url.platform.com
   ```

2. **SSL Certificate**
   - Most platforms provide automatic SSL
   - Verify HTTPS redirect is enabled

3. **CDN Setup** (Optional)
   - Cloudflare for global distribution
   - Asset optimization and caching

## Monitoring and Maintenance

### Health Check Endpoints
```bash
# Application health
GET /api/health

# Database connectivity
GET /api/health/db

# Games availability
GET /api/games/featured
```

### Performance Monitoring

1. **Application Metrics**
   - Response times
   - Error rates
   - Database query performance

2. **User Analytics**
   - Game completion rates
   - Popular content tracking
   - User engagement metrics

### Backup Strategy

1. **Database Backups**
   ```bash
   # Daily automated backups
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **File Backups**
   - Generated PDFs and assets
   - User uploaded content

## Security Configuration

### HTTPS Enforcement
```javascript
// Express middleware
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Testing Before Deployment

### Pre-Deployment Checklist

- [ ] All games load and play correctly
- [ ] PDF downloads work properly
- [ ] Database connections are stable
- [ ] API endpoints respond correctly
- [ ] Static assets load properly
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested
- [ ] Performance benchmarks met

### Automated Testing
```bash
# Run full test suite
npm run test:full

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Troubleshooting Common Issues

### Game Loading Problems
```javascript
// Verify dynamic imports work
console.log('Game component path:', `/src/games/${gameSlug}/index.tsx`);
```

### PDF Generation Issues
```bash
# Check PDFKit installation
npm list pdfkit
npm install pdfkit @types/pdfkit
```

### Database Connection Issues
```bash
# Test database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

### Asset Loading Problems
```javascript
// Verify static file serving
app.use('/static', express.static('client/dist'));
```

## Performance Optimization

### Frontend Optimization
```bash
# Bundle analysis
npm run build -- --analyze

# Image optimization
npm install sharp
```

### Backend Optimization
```javascript
// Compression middleware
const compression = require('compression');
app.use(compression());

// Caching headers
app.use('/static', express.static('public', {
  maxAge: '1y'
}));
```

### Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_games_grade_id ON games(grade_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Session store externalization
- Database connection pooling

### Vertical Scaling
- Memory optimization
- CPU usage monitoring
- Database performance tuning

### CDN Integration
- Static asset distribution
- Geographic content delivery
- Image optimization pipeline

---

## Quick Deployment Commands

### For Immediate Testing
```bash
# Build and start
npm run build && npm start

# Quick deploy to Vercel
vercel --prod

# Deploy to Railway
railway up

# Deploy to Render (via GitHub)
git push origin main
```

Your educational gaming platform will be accessible with full functionality including interactive games, progress tracking, and downloadable classroom resources.