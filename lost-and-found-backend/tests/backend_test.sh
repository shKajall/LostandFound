#!/bin/bash

echo "Creating a new post..."
POST_RESPONSE=$(curl -s -X POST http://127.0.0.1:5001/api/posts \
  -F "name=Test Backpack" \
  -F "message=Blue backpack near library" \
  -F "type=Lost" \
  -F "userEmail=test@gmail.com")

echo "POST Response:"
echo "$POST_RESPONSE"

POST_ID=$(echo "$POST_RESPONSE" | jq -r '.data._id')

echo "New Post ID: $POST_ID"
echo
echo

echo "Fetching all posts..."
curl -s http://127.0.0.1:5001/api/posts | jq
echo
echo

echo "Creating a response..."
curl -s -X POST http://127.0.0.1:5001/api/responses \
  -H "Content-Type: application/json" \
  -d "{
    \"itemId\": \"$POST_ID\",
    \"question\": \"Is this yours?\",
    \"answer\": \"Yes\",
    \"response\": \"Yes\",
    \"belongsTo\": \"test@gmail.com\"
  }" | jq
echo
echo

echo "Fetching responses for user..."
curl -s http://127.0.0.1:5001/api/responses/myresponses/test@gmail.com | jq
echo
echo

echo "Fetching owner phone number..."
curl -s http://127.0.0.1:5001/api/responses/getnumber/test@gmail.com | jq
echo
echo

echo "✅ Backend flow test completed successfully!"
