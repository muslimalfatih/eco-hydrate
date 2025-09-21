#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Eco-Hydrate Monitoring Stack${NC}"
echo "========================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📊 Starting monitoring services...${NC}"

# Navigate to Docker directory
cd "$(dirname "$0")/../tools/docker"

# Start monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

echo -e "${YELLOW}⏳ Waiting for services to initialize...${NC}"
sleep 30

# Check service health
echo -e "${YELLOW}🔍 Checking service health...${NC}"

# Check Prometheus
if curl -f -s "http://localhost:9090/api/v1/status/config" > /dev/null; then
    echo -e "${GREEN}✅ Prometheus is running (http://localhost:9090)${NC}"
else
    echo -e "${RED}❌ Prometheus is not responding${NC}"
fi

# Check Grafana
if curl -f -s "http://localhost:3001/api/health" > /dev/null; then
    echo -e "${GREEN}✅ Grafana is running (http://localhost:3001)${NC}"
else
    echo -e "${RED}❌ Grafana is not responding${NC}"
fi

# Check Node Exporter
if curl -f -s "http://localhost:9100/metrics" > /dev/null; then
    echo -e "${GREEN}✅ Node Exporter is running (http://localhost:9100)${NC}"
else
    echo -e "${RED}❌ Node Exporter is not responding${NC}"
fi

# Check cAdvisor
if curl -f -s "http://localhost:8080/metrics" > /dev/null; then
    echo -e "${GREEN}✅ cAdvisor is running (http://localhost:8080)${NC}"
else
    echo -e "${RED}❌ cAdvisor is not responding${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Monitoring Stack Started Successfully!${NC}"
echo "========================================="
echo -e "${GREEN}📊 Grafana Dashboard: http://localhost:3001${NC} (admin/eco2025)"
echo -e "${GREEN}📈 Prometheus: http://localhost:9090${NC}"
echo -e "${GREEN}🖥️  Node Exporter: http://localhost:9100${NC}"
echo -e "${GREEN}🐳 cAdvisor: http://localhost:8080${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Start your Next.js app: cd apps/frontend && pnpm dev"
echo "2. Check metrics endpoint: http://localhost:3000/api/metrics"
echo "3. View Grafana dashboards at http://localhost:3001"
echo "4. Run load tests to see metrics in action"
echo ""

# Show running containers
echo -e "${BLUE}🐳 Running containers:${NC}"
docker-compose -f docker-compose.monitoring.yml ps

cd ../../
