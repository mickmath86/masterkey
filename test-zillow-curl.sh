#!/bin/bash

echo "🚀 Testing Zillow Property API with curl..."
echo ""

# Test 1: Address lookup
echo "============================================================"
echo "Test 1: Address lookup"
echo "============================================================"
curl -X POST http://localhost:3000/api/zillow/property \
  -H "Content-Type: application/json" \
  -d '{"address": "3332 Mountain Trail Ave Newbury Park CA 91320"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (install jq for formatted output)"

echo ""
echo ""

# Test 2: ZPID lookup  
echo "============================================================"
echo "Test 2: ZPID lookup"
echo "============================================================"
curl -X POST http://localhost:3000/api/zillow/property \
  -H "Content-Type: application/json" \
  -d '{"zpid": "16470107"}' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (install jq for formatted output)"

echo ""
echo ""

# Test 3: GET endpoint
echo "============================================================"
echo "Test 3: GET endpoint with address"
echo "============================================================"
curl "http://localhost:3000/api/zillow/property?address=3332%20Mountain%20Trail%20Ave%20Newbury%20Park%20CA%2091320" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || echo "Response received (install jq for formatted output)"

echo ""
echo "✨ Tests completed!"
