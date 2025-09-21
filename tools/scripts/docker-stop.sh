#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping Eco-Hydrate Docker Stack${NC}"
echo "====================================="

# Stop all services
docker-compose down

echo -e "${GREEN}✅ All services stopped${NC}"
echo ""
echo -e "${YELLOW}💡 Options:${NC}"
echo "• Remove volumes (delete data): docker-compose down -v"
echo "• Remove images: docker-compose down --rmi all"
echo "• Clean everything: docker system prune -af --volumes"
