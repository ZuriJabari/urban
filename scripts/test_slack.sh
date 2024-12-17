#!/bin/bash
source .env

curl -X POST -H 'Content-type: application/json'     --data '{"text":"🔧 Test notification from Urban Herb Monitoring"}'     "${SLACK_WEBHOOK_URL}"
