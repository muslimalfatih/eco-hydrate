# 🌱 Eco-Hydrate

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=flat-square&logo=prometheus)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-Dashboards-F46800?style=flat-square&logo=grafana)](https://grafana.com/)


## 🚀 Quick Start

```bash
# Clone and setup
git clone git@github.com:muslimalfatih/eco-hydrate.git
cd eco-hydrate
pnpm install

# Start development
cd apps/frontend && pnpm dev
```

**Access Points:**
- 🌐 **Application**: http://localhost:3000
- 📊 **Grafana**: http://localhost:3001 (admin/eco2025)
- 📈 **Prometheus**: http://localhost:9090

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [Performance](#-performance)
- [Setup Guide](#-setup-guide)
- [API Documentation](#-api-documentation)
- [Monitoring & Observability](#-monitoring--observability)
- [Testing Strategy](#-testing-strategy)
- [Deployment](#-deployment)
- [Scaling to 100k+ Users](#-scaling-to-100k-users)
- [Development Workflow](#-development-workflow)

---

## 🎯 Overview

**Eco-Hydrate** is a e-commerce platform built for sustainable water bottles.

### Key Achievements

- ✅ **Real-time A/B testing** with conversion tracking
- ✅ **Production monitoring** with Prometheus + Grafana
- ✅ **Auto-scaling infrastructure** with Docker orchestration
- ✅ **Type-safe development** with end-to-end TypeScript

---

## 🏗️ Architecture

### High-Level Architecture

```bash
graph TB
Client[Client Browser] --> LB[NGINX Load Balancer]
LB --> F1[Frontend Instance 1]
LB --> F2[Frontend Instance 2]
LB --> F3[Frontend Instance 3]

    F1 --> Cache[Redis Cache]
    F2 --> Cache
    F3 --> Cache
    
    F1 --> DB[(PostgreSQL)]
    F2 --> DB
    F3 --> DB
    
    F1 --> Analytics[PostHog Analytics]
    F2 --> Analytics
    F3 --> Analytics
    
    Prometheus[Prometheus] --> F1
    Prometheus --> F2
    Prometheus --> F3
    
    Grafana[Grafana] --> Prometheus
    ```

```
### System Components
```bash
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│ -  Next.js 15 App Router     -  React Server Components     │
│ -  TypeScript Interface      -  Tailwind CSS + Animations   │
│ -  A/B Testing Engine        -  Real-time Analytics         │
└─────────────────────────────────────────────────────────────┘
│
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER                              │
├─────────────────────────────────────────────────────────────┤
│ -  RESTful API Endpoints     -  Rate Limiting & Security    │
│ -  Authentication (Supabase) -  Input Validation (Zod)      │
│ -  Custom Metrics Export     -  Health Checks               │
└─────────────────────────────────────────────────────────────┘
│
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC                           │
├─────────────────────────────────────────────────────────────┤
│ -  Product Management        -  Order Processing            │
│ -  A/B Test Variants         -  Conversion Tracking         │
│ -  Cache Strategies          -  Background Jobs             │
└─────────────────────────────────────────────────────────────┘
│
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│ -  PostgreSQL (Primary)      -  Redis (Cache + Sessions)    │
│ -  Drizzle ORM              -  Connection Pooling           │
│ -  Database Migrations       -  Query Optimization          │
└─────────────────────────────────────────────────────────────┘
│
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                       │
├─────────────────────────────────────────────────────────────┤
│ -  Docker Containers         -  NGINX Load Balancer         │
│ -  Prometheus Monitoring     -  Grafana Dashboards          │
│ -  Automated Scaling         -  Health Monitoring           │
└─────────────────────────────────────────────────────────────┘

```
---


## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion with optimized performance
- **State Management**: React Server State + Zustand
- **Forms**: React Hook Form + Zod validation

### Backend & API
- **Runtime**: Node.js with Next.js API routes
- **Database ORM**: Drizzle ORM (type-safe, performant)
- **Authentication**: Supabase Auth with JWT
- **Caching**: Upstash Redis with intelligent invalidation
- **Rate Limiting**: Token bucket algorithm
- **API Design**: RESTful with OpenAPI specification

### Database & Storage
- **Primary Database**: PostgreSQL (Supabase)
- **Cache Layer**: Redis (Upstash)
- **File Storage**: Supabase Storage
- **Search**: Full-text search with PostgreSQL
- **Migrations**: Drizzle Kit automated migrations

### DevOps & Monitoring
- **Containerization**: Docker + Docker Compose
- **Load Balancing**: NGINX with health checks
- **Monitoring**: Prometheus + Grafana
- **Metrics**: Custom business metrics + system metrics
- **Logging**: Structured logging with Winston
- **Alerting**: Prometheus Alertmanager

### Testing & QA
- **Load Testing**: Artillery with realistic scenarios
- **Performance Testing**: Apache Benchmark
- **Unit Tests**: Vitest + Testing Library
- **E2E Tests**: Playwright
- **Type Safety**: TypeScript strict mode

---

## ⚡ Features

### Core E-commerce Features
- 🛒 **Product Catalog** with search, filtering, and pagination
- 🛍️ **Shopping Cart** with persistent sessions
- 📦 **Order Management** with status tracking
- 👤 **User Authentication** and profile management
- 💳 **Checkout Process** with form validation
- 📱 **Responsive Design** for all devices

### Advanced Features
- 🧪 **A/B Testing Engine** with real-time variant assignment
- 📊 **Analytics Dashboard** with conversion tracking
- ⚡ **Performance Optimization** with caching strategies
- 🔒 **Security Features** (rate limiting, CSRF protection)
- 🌐 **Internationalization** ready
- 📈 **SEO Optimization** with meta tags and structured data

### Developer Experience
- 🔧 **Hot Module Replacement** for instant development feedback
- 📝 **Type Safety** throughout the entire stack
- 🧹 **Code Quality** with ESLint, Prettier, and Husky
- 📖 **API Documentation** with automated generation
- 🐳 **Docker Development** environment
- 🚀 **CI/CD Ready** with automated testing and deployment

---

## 📈 Performance


### Performance Optimizations

- **Server-Side Rendering** for faster initial page loads
- **Intelligent Caching** with Redis and browser caches
- **Code Splitting** and lazy loading for reduced bundle size
- **Image Optimization** with Next.js Image component
- **Database Indexing** for optimized query performance
- **Connection Pooling** to handle concurrent database connections

---

## 🚀 Setup Guide

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- PostgreSQL database (or Supabase account)
- Redis instance (or Upstash account)

### Environment Setup

1. **Clone and Install**
```bash
git clone git@github.com:muslimalfatih/eco-hydrate.git
cd eco-hydrate
pnpm install

```
2. **Environment Variables**
```bash
cp .env.example .env.local

# Configure your database and API keys
```

3. **Database Setup**
```bash
# Run migrations
cd packages/db
pnpm db:migrate
pnpm db:seed

```

4. **Start Development**
```bash
# Start the application
cd apps/frontend
pnpm dev

# Start monitoring
docker compose -f docker-compose.monitoring.yml up -d

# Run tests
pnpm test:load

```
### Docker Setup (Production-like)

```bash
# Start full stack with monitoring
docker compose up --build -d

# Scale frontend instances
docker compose up --scale frontend=3 -d

# Access services
open http://localhost       \# Application (load balanced)
open http://localhost:3001  \# Grafana monitoring
open http://localhost:9090  \# Prometheus metrics

```

---

## 📚 API Documentation

### Core Endpoints

#### Products API
```bash
GET    /api/products           \# List products with pagination/filtering
GET    /api/products/:id       \# Get single product
POST   /api/products           \# Create product (authenticated)
PUT    /api/products/:id       \# Update product (authenticated)
DELETE /api/products/:id       \# Delete product (authenticated)

```

#### Orders API (WIP)
```bash
POST   /api/orders             \# Create new order
GET    /api/orders/:id         \# Get order status
PUT    /api/orders/:id         \# Update order (authenticated)

```

#### Analytics API
```bash
POST   /api/analytics/track    \# Track user events
GET    /api/analytics/stats    \# Get analytics dashboard data (authenticated)

```

#### Monitoring API
```

GET    /api/health             \# Health check endpoint
GET    /api/metrics            \# Prometheus metrics export

```

### API Response Format

```bash

{
"success": true,
"data": {
"products": [...],
"pagination": {
"page": 1,
"limit": 12,
"total": 156,
"totalPages": 13,
"hasNext": true,
"hasPrev": false
}
},
"meta": {
"timestamp": "2025-09-21T18:00:00Z",
"version": "1.0.0"
}
}

```

---

## 📊 Monitoring & Observability

### Metrics Collected

#### Application Metrics
- **Request Duration**: Response time histograms
- **Request Rate**: Requests per second by endpoint
- **Error Rate**: 4xx/5xx errors by endpoint
- **A/B Test Metrics**: Conversion rates by variant
- **Database Metrics**: Query performance and connection pool stats

#### Business Metrics
- **Order Conversion Rate**: Purchase funnel performance
- **Product View Metrics**: Popular products and categories
- **User Engagement**: Session duration and page views
- **Revenue Tracking**: Sales performance over time

#### System Metrics
- **CPU & Memory Usage**: Resource utilization
- **Network I/O**: Bandwidth and connection stats
- **Disk Usage**: Storage consumption and I/O performance
- **Container Health**: Docker container status and resource usage

### Grafana Dashboards

1. **Application Performance**: Response times, throughput, errors
2. **Business KPIs**: Conversion rates, revenue, user engagement
3. **Infrastructure**: System resources, container health
4. **A/B Testing**: Variant performance comparison

### Alerting Rules

- Response time P95 > 500ms for 5 minutes
- Error rate > 1% for 2 minutes  
- CPU usage > 85% for 10 minutes
- Memory usage > 90% for 5 minutes
- Database connection pool exhaustion

---

## 🧪 Testing Strategy

### Load Testing

**Artillery Configuration** for realistic user scenarios:
```bash

config:
phases:
- duration: 300
arrivalRate: 167  \# ~1000 concurrent users
scenarios:
- name: "Complete E-commerce Journey"
weight: 70
flow:
- get: "/"                    \# Homepage visit
- get: "/api/products"        \# Browse products
- post: "/api/analytics/track" \# Track interaction
- post: "/api/orders"         \# Place order

```

**Performance Targets:**
- Support 1000+ concurrent users
- Maintain <200ms response times (P95)
- Achieve 0% error rate
- Handle traffic spikes up to 2000 users

### Testing Environments

- **Development**: Local with hot reloading
- **Staging**: Docker environment with monitoring
- **Load Testing**: Dedicated environment with realistic data
- **Production**: Full infrastructure with auto-scaling

---

## 🚢 Deployment

### Development Deployment
```bash
# Local development with hot reloading
pnpm dev

# Development with monitoring
docker compose -f docker-compose.dev.yml up -d

```

### Production Deployment

#### Option 1: Single Server (Small Scale)
```bash


# Build and deploy with Docker
docker compose -f docker-compose.prod.yml up --build -d

```

#### Option 2: Cloud Platforms

**Vercel (Frontend)**
```bash
# Automatic deployment on git push

vercel --prod

```

**Railway/Heroku (Full Stack)**
```bash
# Deploy with database and Redis
railway deploy

```

**AWS/GCP (Enterprise Scale)**
```bash
# Kubernetes deployment
kubectl apply -f k8s/

```

### Environment Configuration

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=postgresql://...
UPSTASH_REDIS_REST_URL=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...

# Security
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=100

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_URL=https://monitoring.yourdomain.com

```

---

## 📈 Scaling to 100k+ Users

### Immediate Optimizations (1k → 10k users)

1. **Database Optimization**
   - Connection pooling (PgBouncer)
   - Read replicas for GET endpoints
   - Query optimization and indexing
   - Database connection limits

2. **Caching Strategy**
   - Multi-layer caching (CDN → Redis → App)
   - Cache warming for popular content
   - Intelligent cache invalidation
   - Browser caching optimization

3. **Load Balancing**
   - NGINX with health checks
   - Session affinity for stateful operations
   - Geographic load balancing
   - Auto-scaling based on metrics

### Enterprise Scale (10k → 100k+ users)

#### Architecture Evolution
```bash

Internet → CDN → Load Balancer → API Gateway
↓
┌─────────────────────┐
│   Microservices     │
│  ┌───────────────┐  │
│  │ Auth Service  │  │
│  │ Product API   │  │
│  │ Order API     │  │
│  │ Analytics     │  │
│  │ Notification  │  │
│  └───────────────┘  │
└─────────────────────┘
↓
┌─────────────────────┐
│   Data Layer        │
│  ┌───────────────┐  │
│  │ PostgreSQL    │  │
│  │ Redis Cluster │  │
│  │ Search (ES)   │  │
│  │ File Storage  │  │
│  └───────────────┘  │
└─────────────────────┘

```

#### Infrastructure Components

1. **Microservices Architecture**
   - Service decomposition by domain
   - API Gateway with routing
   - Service mesh for communication
   - Independent scaling and deployment

2. **Container Orchestration**
   - Kubernetes cluster management
   - Horizontal Pod Autoscaler (HPA)
   - Vertical Pod Autoscaler (VPA)
   - Custom metrics scaling

3. **Database Scaling**
   - Master-slave replication
   - Read replicas by region
   - Database sharding strategies
   - CQRS pattern implementation

4. **Event-Driven Architecture**
   - Message queues (RabbitMQ/Kafka)
   - Event sourcing for analytics
   - Asynchronous processing
   - Saga pattern for transactions

5. **Global Distribution**
   - Multi-region deployment
   - CDN with edge caching
   - Database replication across regions
   - Latency optimization

#### Technology Suggestions 

```bash

Infrastructure:
- Kubernetes (EKS/GKE)
- Istio Service Mesh
- ArgoCD for GitOps
- Terraform for IaC

Data & Search:

- Elasticsearch for search
- Apache Kafka for events
- ClickHouse for analytics
- TimescaleDB for metrics

Monitoring & Security:

- Jaeger for distributed tracing
- ELK stack for logging
- HashiCorp Vault for secrets
- WAF and DDoS protection

```

### Cost Optimization Strategies

- **Auto-scaling**: Scale down during low traffic
- **Spot instances**: Use for non-critical workloads
- **Reserved instances**: For predictable base load
- **Edge caching**: Reduce origin server load
- **Database optimization**: Query optimization and indexing
- **Container rightsizing**: Optimal resource allocation

---

## 👨‍💻 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create PR → Review → Merge → Deploy

```

### Code Quality
- **Pre-commit hooks**: Lint, format, type-check
- **PR requirements**: Tests, documentation, reviews
- **Automated CI/CD**: Testing, building, deployment
- **Code coverage**: Minimum 80% coverage requirement

### Monitoring Development Impact
- **Performance budgets**: Bundle size limits
- **Performance monitoring**: Core Web Vitals tracking  
- **Error tracking**: Real-time error monitoring
- **User feedback**: Integrated feedback collection

---



**© 2025 Eco-Hydrate. Built with ❤️ for sustainable e-commerce.**

