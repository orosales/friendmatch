# Deployment Guide

This guide covers deploying MeetMates to various free hosting platforms.

## 🚀 Quick Deploy Options

### Frontend Deployment

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd apps/web && npm run build`
3. Set output directory: `apps/web/dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://your-api-url.com/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_FACEBOOK_APP_ID=your-facebook-app-id
   ```

#### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `cd apps/web && npm run build`
3. Set publish directory: `apps/web/dist`
4. Add environment variables in Netlify dashboard

### Backend Deployment

#### Railway
1. Connect your GitHub repository to Railway
2. Set root directory: `apps/api`
3. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   REDIS_URL=redis://host:port
   JWT_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   FRONTEND_URL=https://your-frontend-url.com
   ```
4. Deploy

#### Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set root directory: `apps/api`
4. Set build command: `npm install && npm run build`
5. Set start command: `npm run start:prod`
6. Add environment variables

### Database Deployment

#### Supabase (Recommended)
1. Create a new Supabase project
2. Get your database URL from Settings > Database
3. Update your backend's `DATABASE_URL`
4. Run migrations: `npm run db:push`

#### Railway PostgreSQL
1. Add PostgreSQL service to your Railway project
2. Use the provided connection string
3. Run migrations: `npm run db:push`

## 🔧 Environment Setup

### Required Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=https://your-api-url.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis (optional)
REDIS_URL=redis://host:port

# JWT
JWT_SECRET=your-super-secret-jwt-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.com
```

## 📋 Pre-deployment Checklist

- [ ] Set up OAuth applications (Google & Facebook)
- [ ] Create database and get connection string
- [ ] Update environment variables
- [ ] Run database migrations
- [ ] Test locally with production environment
- [ ] Set up monitoring and logging
- [ ] Configure custom domain (optional)

## 🔐 OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/google/callback` (development)
   - `https://your-api-url.com/api/auth/google/callback` (production)

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `http://localhost:3001/api/auth/facebook/callback` (development)
   - `https://your-api-url.com/api/auth/facebook/callback` (production)

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Production docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: meetmates
      POSTGRES_USER: meetmates
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  api:
    build: ./apps/api
    environment:
      DATABASE_URL: postgresql://meetmates:${POSTGRES_PASSWORD}@postgres:5432/meetmates
      REDIS_URL: redis://redis:6379
      # ... other environment variables
    depends_on:
      - postgres
      - redis

  web:
    build: ./apps/web
    environment:
      VITE_API_URL: http://api:3001/api
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

## 📊 Monitoring

### Health Checks
- Frontend: `https://your-frontend-url.com/`
- Backend: `https://your-api-url.com/api/health`

### Logs
- Check your hosting platform's logs
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor database performance

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow will:
1. Run tests on every push
2. Build the application
3. Deploy to your chosen platform

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in backend
2. **Database Connection**: Check `DATABASE_URL` format and credentials
3. **OAuth Redirects**: Verify redirect URIs match exactly
4. **Build Failures**: Check Node.js version and dependencies

### Getting Help

- Check the logs in your hosting platform
- Verify environment variables are set correctly
- Test locally with production environment variables
- Check the [README.md](README.md) for detailed setup instructions

## 🎉 Success!

Once deployed, your MeetMates app will be available at:
- Frontend: `https://your-frontend-url.com`
- Backend API: `https://your-api-url.com/api`
- API Docs: `https://your-api-url.com/api/docs`

Happy connecting! 🚀
