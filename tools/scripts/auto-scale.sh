#!/bin/bash
# Auto Scale Script

set -e

# Configuration
PROMETHEUS_URL="http://localhost:9090/api/v1/query"
COMPOSE_FILE="tools/docker/docker-compose.yml"
SERVICE_NAME="frontend"

# Thresholds
CPU_SCALE_UP=80      # Scale up when CPU > 80%
CPU_SCALE_DOWN=30    # Scale down when CPU < 30%
RESPONSE_TIME_MAX=1  # Scale up when response time > 1s
MIN_REPLICAS=2
MAX_REPLICAS=8

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

get_metric() {
    local query=$1
    curl -s "${PROMETHEUS_URL}?query=${query}" | \
    jq -r '.data.result[0].value[1] // "0"' 2>/dev/null || echo "0"
}

get_current_replicas() {
    docker compose -f "$COMPOSE_FILE" ps "$SERVICE_NAME" --format json 2>/dev/null | \
    jq length 2>/dev/null || echo "1"
}

scale_service() {
    local target_replicas=$1
    log "Scaling $SERVICE_NAME to $target_replicas replicas..."
    
    docker compose -f "$COMPOSE_FILE" up \
        --scale "${SERVICE_NAME}=${target_replicas}" \
        --no-recreate -d
    
    if [ $? -eq 0 ]; then
        log "✅ Successfully scaled to $target_replicas replicas"
    else
        log "❌ Failed to scale service"
        return 1
    fi
}

check_and_scale() {
    # Get current metrics
    local cpu_usage=$(get_metric 'avg(100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100))')
    local avg_response_time=$(get_metric 'histogram_quantile(0.95, rate(eco_hydrate_http_request_duration_seconds_bucket[5m]))')
    local current_replicas=$(get_current_replicas)
    local error_rate=$(get_metric 'rate(eco_hydrate_errors_total[5m])')
    
    log "📊 Metrics: CPU=${cpu_usage}%, ResponseTime=${avg_response_time}s, Replicas=${current_replicas}, Errors=${error_rate}/s"
    
    # Decision logic
    local should_scale_up=false
    local should_scale_down=false
    
    # Scale up conditions
    if (( $(echo "$cpu_usage > $CPU_SCALE_UP" | bc -l 2>/dev/null || echo "0") )); then
        log "🔥 High CPU usage detected: ${cpu_usage}%"
        should_scale_up=true
    fi
    
    if (( $(echo "$avg_response_time > $RESPONSE_TIME_MAX" | bc -l 2>/dev/null || echo "0") )); then
        log "🐌 High response time detected: ${avg_response_time}s"
        should_scale_up=true
    fi
    
    if (( $(echo "$error_rate > 5" | bc -l 2>/dev/null || echo "0") )); then
        log "🚨 High error rate detected: ${error_rate} errors/s"
        should_scale_up=true
    fi
    
    # Scale down conditions
    if (( $(echo "$cpu_usage < $CPU_SCALE_DOWN" | bc -l 2>/dev/null || echo "0") )); then
        if (( $(echo "$avg_response_time < 0.1" | bc -l 2>/dev/null || echo "0") )); then
            log "📉 Low resource usage detected"
            should_scale_down=true
        fi
    fi
    
    # Execute scaling decisions
    if [ "$should_scale_up" = true ] && [ "$current_replicas" -lt "$MAX_REPLICAS" ]; then
        scale_service $((current_replicas + 1))
    elif [ "$should_scale_down" = true ] && [ "$current_replicas" -gt "$MIN_REPLICAS" ]; then
        scale_service $((current_replicas - 1))
    else
        log "✅ No scaling needed"
    fi
}

main() {
    log "🚀 Starting auto-scaler for eco-hydrate"
    log "Thresholds: CPU_UP=${CPU_SCALE_UP}%, CPU_DOWN=${CPU_SCALE_DOWN}%, Response=${RESPONSE_TIME_MAX}s"
    log "Replica limits: MIN=${MIN_REPLICAS}, MAX=${MAX_REPLICAS}"
    
    while true; do
        check_and_scale
        sleep 30  # Check every 30 seconds
    done
}

# Handle signals gracefully
trap 'log "🛑 Auto-scaler stopped"; exit 0' SIGTERM SIGINT

main
