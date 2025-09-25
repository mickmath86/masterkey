#!/bin/bash

# Test script for Zillow Images API endpoint
# Usage: ./test-zillow-images-curl.sh

echo "Testing Zillow Images API endpoint..."
echo "======================================"

# Test 1: POST with zpid
echo -e "\n1. Testing POST /api/zillow/images with zpid..."
curl -X POST http://localhost:3000/api/zillow/images \
  -H "Content-Type: application/json" \
  -d '{"zpid": "61975204"}' \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  | if command -v jq &> /dev/null; then jq .; else cat; fi

echo -e "\n" 

# Test 2: POST with different zpid
echo -e "\n2. Testing POST /api/zillow/images with different zpid..."
curl -X POST http://localhost:3000/api/zillow/images \
  -H "Content-Type: application/json" \
  -d '{"zpid": "2077753692"}' \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  | if command -v jq &> /dev/null; then jq .; else cat; fi

echo -e "\n"

# Test 3: POST with invalid zpid
echo -e "\n3. Testing POST /api/zillow/images with invalid zpid..."
curl -X POST http://localhost:3000/api/zillow/images \
  -H "Content-Type: application/json" \
  -d '{"zpid": "invalid"}' \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  | if command -v jq &> /dev/null; then jq .; else cat; fi

echo -e "\n"

# Test 4: POST without zpid (should fail)
echo -e "\n4. Testing POST /api/zillow/images without zpid..."
curl -X POST http://localhost:3000/api/zillow/images \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  | if command -v jq &> /dev/null; then jq .; else cat; fi

echo -e "\n"
echo "Testing complete!"
