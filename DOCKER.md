# Docker Setup for MeetMates

This document explains how to run MeetMates using Docker containers.

## 🐳 Services

- **postgres**: PostgreSQL database with PostGIS extension
- **api**: NestJS API server
- **web**: React frontend served by Nginx

## 🚀 Quick Start

### Production Mode (All Services)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Development Mode (Database + API only)

```bash
# Start database and API only
docker-compose -f docker-compose.dev.yml up --build

# Run frontend locally
cd apps/web && npm run dev
```

## 📋 Available Commands

### Production

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build
```

### Development

```bash
# Start database and API
docker-compose -f docker-compose.dev.yml up

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## 🌐 Access Points

- **Web App**: http://localhost:3002
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Database**: localhost:5432

## 🔧 Environment Variables

### API Service
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)
- `PORT`: API port (default: 3001)

### Database
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

## 📁 File Structure

```
├── apps/
│   ├── api/
│   │   └── Dockerfile          # API container
│   └── web/
│       ├── Dockerfile          # Web container
│       ├── nginx.conf          # Nginx configuration
│       └── .dockerignore       # Docker ignore file
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup
└── infra/docker/
    └── init.sql                # Database initialization
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3001, 3002, and 5432 are available
2. **Database connection**: Wait for PostgreSQL to fully start before API
3. **Build failures**: Check Dockerfile syntax and dependencies

### Useful Commands

```bash
# Check running containers
docker ps

# View container logs
docker logs <container_name>

# Execute commands in container
docker exec -it <container_name> sh

# Clean up
docker-compose down -v
docker system prune -a
```

## 🚀 Deployment

For production deployment:

1. Update environment variables
2. Use production docker-compose.yml
3. Set up reverse proxy (Nginx/Traefik)
4. Configure SSL certificates
5. Set up monitoring and logging

## 📝 Notes

- The web app uses Nginx for optimal static file serving
- API uses multi-stage build for smaller production image
- Database includes PostGIS extension for geospatial features
- All services are connected via Docker network






