# MeetMates - Find Your People

A modern, privacy-focused friend-finding app that helps people make real-life connections based on shared interests and location. Built with React 19, NestJS, and PostgreSQL.

## 🌟 Features

- **OAuth Authentication**: Secure login with Google and Facebook
- **Smart Matching**: AI-powered matching based on interests, location, and availability
- **Event Management**: Create and join meetups with suggested venues
- **Location Services**: Privacy-focused location sharing with OpenStreetMap integration
- **PWA Support**: Installable as a Progressive Web App
- **Real-time Updates**: Live notifications and updates
- **Privacy First**: No password system, public venues only, comprehensive privacy controls

## 🏗️ Architecture

### Frontend (React 19 + TypeScript)
- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand for client state, TanStack Query for server state
- **Routing**: React Router v6
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **PWA**: Workbox for offline support

### Backend (NestJS + TypeScript)
- **Framework**: NestJS with modular architecture
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with OAuth 2.1/OIDC
- **Caching**: Redis for performance
- **Geospatial**: PostGIS for location queries
- **Documentation**: Swagger/OpenAPI

### Infrastructure
- **Database**: PostgreSQL with PostGIS extension
- **Cache**: Redis
- **Deployment**: Docker Compose for local development
- **CI/CD**: GitHub Actions (ready for deployment)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meetmates
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Database

```bash
npm run docker:up
```

This will start PostgreSQL and Redis containers.

### 4. Set Up Environment Variables

```bash
# Copy the example environment file
cp apps/api/env.example apps/api/.env

# Edit the environment variables
nano apps/api/.env
```

### 5. Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to the database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 6. Start the Development Servers

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

## 📁 Project Structure

```
meetmates/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── stores/      # Zustand stores
│   │   │   └── lib/         # Utilities and helpers
│   │   └── public/          # Static assets
│   └── api/                 # NestJS backend
│       ├── src/
│       │   ├── auth/        # Authentication module
│       │   ├── users/       # User management
│       │   ├── matches/     # Matching algorithm
│       │   ├── invites/     # Event management
│       │   ├── venues/      # Venue suggestions
│       │   └── prisma/      # Database service
│       └── prisma/          # Database schema and migrations
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utilities
│   └── config/              # Shared configuration
└── infra/
    └── docker/              # Docker configuration
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start all services in development mode
npm run build            # Build all packages
npm run test             # Run all tests
npm run lint             # Lint all packages
npm run type-check       # Type check all packages

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio

# Docker
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

### Adding New Features

1. **Frontend**: Add components in `apps/web/src/components/`
2. **Backend**: Create modules in `apps/api/src/`
3. **Types**: Add shared types in `packages/types/src/`
4. **Utils**: Add utilities in `packages/utils/src/`

## 🗄️ Database Schema

### Core Models

- **User**: User profiles with interests, location, and availability
- **Invite**: Event invitations with venue and attendee management
- **RSVP**: User responses to invitations
- **Venue**: Public venues with location and amenities
- **Report**: User reports for safety and moderation

### Key Features

- **Geospatial Queries**: PostGIS for location-based matching
- **JSON Fields**: Flexible storage for interests and availability
- **Relationships**: Proper foreign keys and cascading deletes
- **Indexes**: Optimized for common query patterns

## 🔐 Authentication & Security

### OAuth Flow

1. User clicks "Continue with Google/Facebook"
2. Redirected to OAuth provider
3. User authorizes the application
4. Provider redirects back with authorization code
5. Backend exchanges code for access token
6. Backend fetches user profile from provider
7. User is created/updated in database
8. JWT token is issued for API access

### Security Features

- **No Passwords**: OAuth-only authentication
- **JWT Tokens**: Secure API authentication
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation
- **CORS**: Proper cross-origin resource sharing
- **Helmet**: Security headers

## 🌍 Location & Privacy

### Location Handling

- **Approximate Only**: Never store exact addresses
- **Geohash**: Efficient location indexing
- **User Control**: Explicit consent for location sharing
- **Fallback**: Manual location entry option

### Privacy Features

- **Public Venues Only**: Never suggest private addresses
- **Data Minimization**: Only collect necessary data
- **User Control**: Full control over profile visibility
- **Block/Report**: Comprehensive safety tools

## 🚀 Deployment

### Free Deployment Options

#### Frontend (Vercel/Netlify)
```bash
# Build the frontend
cd apps/web
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod --dir=dist
```

#### Backend (Railway/Render)
```bash
# Set up environment variables
# Deploy using Railway or Render CLI
```

#### Database (Supabase)
1. Create a new Supabase project
2. Update `DATABASE_URL` in your environment
3. Run migrations: `npm run db:push`

### Environment Variables

#### Frontend
```env
VITE_API_URL=https://your-api-url.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

#### Backend
```env
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FRONTEND_URL=https://your-frontend-url.com
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Test Structure

- **Unit Tests**: Individual component and service tests
- **Integration Tests**: API endpoint tests
- **E2E Tests**: Full user flow tests

## 📊 Monitoring & Observability

### Built-in Monitoring

- **Health Checks**: API health endpoints
- **Error Handling**: Comprehensive error responses
- **Logging**: Structured logging throughout
- **Metrics**: Basic performance metrics

### Optional Additions

- **OpenTelemetry**: Distributed tracing
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap**: Free, open-source map data
- **Leaflet**: Lightweight mapping library
- **Prisma**: Modern database toolkit
- **NestJS**: Progressive Node.js framework
- **React**: UI library
- **TailwindCSS**: Utility-first CSS framework

## 📞 Support

For support, email support@meetmates.app or join our Discord community.

---

**Made with ❤️ for building meaningful connections**
