#!/bin/bash

echo "🔥 Apache Benchmark - 1000 Concurrent Users Stress Test"
echo "======================================================="

# Test configuration
CONCURRENT_USERS=1000
TOTAL_REQUESTS=10000
TARGET_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Testing Target: ${TARGET_URL}${NC}"
echo -e "${YELLOW}Concurrent Users: ${CONCURRENT_USERS}${NC}"
echo -e "${YELLOW}Total Requests: ${TOTAL_REQUESTS}${NC}"
echo ""

# Create results directory
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="ab-results-${TIMESTAMP}"
mkdir -p $RESULTS_DIR

echo -e "${YELLOW}🏠 Test 1: Homepage Performance${NC}"
ab -n $TOTAL_REQUESTS -c $CONCURRENT_USERS -g "${RESULTS_DIR}/homepage.tsv" \
   -e "${RESULTS_DIR}/homepage.csv" \
   -H "User-Agent: ApacheBench-LoadTest" \
   ${TARGET_URL}/ > "${RESULTS_DIR}/homepage-report.txt"

echo -e "${YELLOW}📦 Test 2: Products API Performance${NC}"  
ab -n $TOTAL_REQUESTS -c $CONCURRENT_USERS -g "${RESULTS_DIR}/products-api.tsv" \
   -e "${RESULTS_DIR}/products-api.csv" \
   -H "Accept: application/json" \
   ${TARGET_URL}/api/products > "${RESULTS_DIR}/products-api-report.txt"

echo -e "${YELLOW}🔍 Test 3: Individual Product API${NC}"
ab -n 5000 -c 500 -g "${RESULTS_DIR}/product-detail.tsv" \
   -e "${RESULTS_DIR}/product-detail.csv" \
   ${TARGET_URL}/api/products/test-id > "${RESULTS_DIR}/product-detail-report.txt"

echo -e "${YELLOW}📊 Test 4: Metrics Endpoint${NC}"
ab -n 2000 -c 200 -g "${RESULTS_DIR}/metrics.tsv" \
   ${TARGET_URL}/api/metrics > "${RESULTS_DIR}/metrics-report.txt"

# Generate summary report
echo -e "${GREEN}📋 Generating Summary Report...${NC}"
cat > "${RESULTS_DIR}/SUMMARY.md" << EOF
# Apache Benchmark Stress Test Results

**Test Configuration:**
- Target: ${TARGET_URL}
- Concurrent Users: ${CONCURRENT_USERS}
- Total Requests: ${TOTAL_REQUESTS}
- Test Date: $(date)

## Test Results Summary

### 1. Homepage Performance
\`\`\`
$(grep -E "(Requests per second|Time per request|Transfer rate)" "${RESULTS_DIR}/homepage-report.txt")
\`\`\`

### 2. Products API Performance  
\`\`\`
$(grep -E "(Requests per second|Time per request|Transfer rate)" "${RESULTS_DIR}/products-api-report.txt")
\`\`\`

### 3. Response Time Analysis
- 50%: $(grep "50%" "${RESULTS_DIR}/homepage-report.txt" | awk '{print $2}')ms
- 95%: $(grep "95%" "${RESULTS_DIR}/homepage-report.txt" | awk '{print $2}')ms
- 99%: $(grep "99%" "${RESULTS_DIR}/homepage-report.txt" | awk '{print $2}')ms

### 4. Error Analysis
- Failed Requests: $(grep "Failed requests" "${RESULTS_DIR}/homepage-report.txt" | awk '{print $3}')
- Error Rate: $(grep "Failed requests" "${RESULTS_DIR}/homepage-report.txt" | awk '{print $3/10000*100}')%

## SLA Compliance
- ✅ Response Time < 200ms: $(if [ $(grep "95%" "${RESULTS_DIR}/homepage-report.txt" | awk '{print $2}' | cut -d. -f1) -lt 200 ]; then echo "PASS"; else echo "FAIL"; fi)
- ✅ Error Rate < 1%: $(if [ $(grep "Failed requests" "${RESULTS_DIR}/homepage-report.txt" | awk '{print $3}') -eq 0 ]; then echo "PASS"; else echo "FAIL"; fi)
- ✅ Concurrent Users: 1000 ✓
EOF

echo -e "${GREEN}✅ Apache Benchmark Tests Complete!${NC}"
echo -e "${GREEN}📊 Results saved to: ${RESULTS_DIR}/SUMMARY.md${NC}"
echo -e "${GREEN}📈 View detailed reports in: ${RESULTS_DIR}/${NC}"
