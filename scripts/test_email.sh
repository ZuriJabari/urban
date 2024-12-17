#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔧 Testing Email Configuration..."

# Load environment variables
source .env

# Test SMTP connection
echo "Testing SMTP connection..."
nc -zv $SMTP_HOST $SMTP_PORT 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SMTP connection successful${NC}"
else
    echo -e "${RED}✗ SMTP connection failed${NC}"
    exit 1
fi

# Test Grafana email
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Alert",
    "message": "This is a test email from Grafana",
    "severity": "critical"
  }' \
  "http://admin:${GRAFANA_ADMIN_PASSWORD}@localhost:3000/api/alerts/test"

echo -e "\n${GREEN}✅ Email test completed! Check your inbox.${NC}" 