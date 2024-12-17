#!/bin/bash
set -eo pipefail

# Configuration
SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL:-""}
EMAIL_RECIPIENT=${EMAIL_RECIPIENT:-""}
MAX_RETRIES=3
RETRY_DELAY=5
LOG_DIR="./logs"
LOG_FILE="${LOG_DIR}/monitoring_health.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ensure log directory exists
mkdir -p "${LOG_DIR}"

log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

send_notification() {
    local service=$1
    local status=$2
    local message=$3

    # Log the notification
    log "ALERT" "Service: ${service}, Status: ${status}, Message: ${message}"

    # Send Slack notification if webhook is configured
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -s -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 Monitoring Alert\nService: ${service}\nStatus: ${status}\nMessage: ${message}\"}" \
            "$SLACK_WEBHOOK_URL"
    fi

    # Send email if recipient is configured
    if [ -n "$EMAIL_RECIPIENT" ]; then
        echo "Monitoring Alert - ${service}: ${status}" | \
        mail -s "Monitoring Alert: ${service}" "$EMAIL_RECIPIENT"
    fi
}

check_service() {
    local service=$1
    local url=$2
    local retry_count=0

    while [ $retry_count -lt $MAX_RETRIES ]; do
        log "INFO" "Checking ${service} (Attempt $((retry_count + 1))/${MAX_RETRIES})"
        
        if curl -sf --max-time 10 "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ ${service} is healthy${NC}"
            log "SUCCESS" "${service} is healthy"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $MAX_RETRIES ]; then
                echo -e "${YELLOW}⚠ ${service} check failed, retrying in ${RETRY_DELAY}s...${NC}"
                log "WARN" "${service} check failed, retrying..."
                sleep $RETRY_DELAY
            fi
        fi
    done

    echo -e "${RED}✗ ${service} is not responding${NC}"
    send_notification "$service" "CRITICAL" "Service is not responding after ${MAX_RETRIES} attempts"
    return 1
}

check_metrics_freshness() {
    local service=$1
    local query=$2
    local threshold=$3

    local result=$(curl -s "http://localhost:9090/api/v1/query" \
        --data-urlencode "query=time() - ${query} > ${threshold}" || echo "")

    if [ -z "$result" ] || ! echo "$result" | grep -q '"result":\[\]'; then
        echo -e "${RED}✗ ${service} metrics are stale${NC}"
        send_notification "$service" "WARNING" "Metrics are stale (older than ${threshold}s)"
        return 1
    else
        echo -e "${GREEN}✓ ${service} metrics are fresh${NC}"
        return 0
    fi
}

check_disk_space() {
    local threshold=90
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ "$usage" -gt "$threshold" ]; then
        echo -e "${RED}✗ Disk usage critical: ${usage}%${NC}"
        send_notification "Disk Space" "CRITICAL" "Usage: ${usage}%"
        return 1
    else
        echo -e "${GREEN}✓ Disk usage normal: ${usage}%${NC}"
        return 0
    fi
}

main() {
    local exit_code=0

    echo "Starting monitoring health check..."
    log "INFO" "Starting health check"

    # Check core services
    services=(
        "Prometheus|http://localhost:9090/-/healthy"
        "Grafana|http://localhost:3000/api/health"
        "Node Exporter|http://localhost:9100/metrics"
        "Pushgateway|http://localhost:9091/-/healthy"
    )

    for service in "${services[@]}"; do
        IFS="|" read -r name url <<< "$service"
        if ! check_service "$name" "$url"; then
            exit_code=1
        fi
    done

    # Check metrics freshness
    metrics=(
        "React Native|last_react_native_metric|300"
        "Django Backend|last_django_metric|300"
        "Node Metrics|node_exporter_build_info|300"
    )

    for metric in "${metrics[@]}"; do
        IFS="|" read -r name query threshold <<< "$metric"
        if ! check_metrics_freshness "$name" "$query" "$threshold"; then
            exit_code=1
        fi
    done

    # Check disk space
    if ! check_disk_space; then
        exit_code=1
    fi

    # Final status
    if [ $exit_code -eq 0 ]; then
        echo -e "\n${GREEN}All systems operational${NC}"
        log "INFO" "Health check completed successfully"
    else
        echo -e "\n${RED}Some checks failed${NC}"
        log "ERROR" "Health check completed with failures"
    fi

    return $exit_code
}

# Run main function
main "$@"