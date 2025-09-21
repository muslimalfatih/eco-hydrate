#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping Eco-Hydrate Monitoring Stack${NC}"
echo "======================================="

cd "$(dirname "$0")/../tools/docker"

# Stop and remove containers
docker-compose -f docker-compose.monitoring.yml down

echo -e "${GREEN}✅ All monitoring services stopped${NC}"
echo ""
echo -e "${YELLOW}💡 To remove volumes (delete all data):${NC}"
echo "docker-compose -f docker-compose.monitoring.yml down -v"

cd ../../
