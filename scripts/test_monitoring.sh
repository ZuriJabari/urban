#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔍 Testing Monitoring Stack..."

# 1. Test Prometheus
echo "Testing Prometheus..."
if curl -s "http://localhost:9090/-/healthy" > /dev/null; then
    echo -e "${GREEN}✓ Prometheus is healthy${NC}"
else
    echo -e "${RED}✗ Prometheus health check failed${NC}"
    exit 1
fi

# 2. Test Grafana
echo "Testing Grafana..."
if curl -s "http://localhost:3000/api/health" > /dev/null; then
    echo -e "${GREEN}✓ Grafana is healthy${NC}"
else
    echo -e "${RED}✗ Grafana health check failed${NC}"
    exit 1
fi

# 3. Test Metrics Collection
echo "Testing metrics collection..."
curl -s "http://localhost:9090/api/v1/query" \
    --data-urlencode "query=up" | grep -q "value"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Metrics are being collected${NC}"
else
    echo -e "${RED}✗ Metrics collection failed${NC}"
    exit 1
fi

# 4. Test Node Exporter
echo "Testing Node Exporter..."
if curl -s "http://localhost:9100/metrics" > /dev/null; then
    echo -e "${GREEN}✓ Node Exporter is healthy${NC}"
else
    echo -e "${RED}✗ Node Exporter health check failed${NC}"
    exit 1
fi

# 5. Test Pushgateway
echo "Testing Pushgateway..."
if curl -s "http://localhost:9091/-/healthy" > /dev/null; then
    echo -e "${GREEN}✓ Pushgateway is healthy${NC}"
else
    echo -e "${RED}✗ Pushgateway health check failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}✅ All tests completed successfully!${NC}" 