#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Eco-Hydrate Full Stack (Docker)${NC}"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Load environment variables
if [ -f .env.docker ]; then
    export $(cat .env.docker | sed 's/#.*//g' | xargs)
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
else
    echo -e "${YELLOW}⚠️  .env.docker not found, using defaults${NC}"
fi

echo -e "${YELLOW}🐳 Building and starting all services...${NC}"

# Build and start all services
docker-compose up --build -d

echo -e "${YELLOW}⏳ Waiting for services to initialize...${NC}"
sleep 45

echo -e "${YELLOW}🔍 Checking service health...${NC}"

# Check each service
services=(
    "nginx:80:Load Balancer"
    "localhost:3000:Frontend-1"
    "localhost:3001:Frontend-2" 
    "localhost:3002:Frontend-3"
    "localhost:5432:PostgreSQL"
    "localhost:6379:Redis"
    "localhost:9090:Prometheus"
    "localhost:3100:Grafana"
)

for service in "${services[@]}"; do
    IFS=':' read -r host port name <<< "$service"
    if timeout 5 bash -c "</dev/tcp/$host/$port"; then
        echo -e "${GREEN}✅ $name is running ($host:$port)${NC}"
    else
        echo -e "${RED}❌ $name is not responding ($host:$port)${NC}"
    fi
done

echo ""
echo -e "${GREEN}🎉 Eco-Hydrate Stack Started Successfully!${NC}"
echo "============================================="
echo -e "${GREEN}🌐 Application: http://localhost${NC} (Load balanced)"
echo -e "${GREEN}📊 Grafana: http://localhost:3100${NC} (admin/eco2025)"
echo -e "${GREEN}📈 Prometheus: http://localhost:9090${NC}"
echo -e "${GREEN}🐳 Container Stats: http://localhost:8080${NC}"
echo ""
echo -e "${BLUE}📱 Individual Frontend Instances:${NC}"
echo -e "${BLUE}   • Frontend-1: http://localhost:3000${NC}"
echo -e "${BLUE}   • Frontend-2: http://localhost:3001${NC}"
echo -e "${BLUE}   • Frontend-3: http://localhost:3002${NC}"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "1. Test the application: curl http://localhost/api/health"
echo "2. View Grafana dashboards: http://localhost:3100"
echo "3. Run load tests: cd load-testing && artillery run stress-test.yml"
echo "4. Check logs: docker-compose logs -f frontend-1"
echo ""

# Show running containers
docker-compose ps
