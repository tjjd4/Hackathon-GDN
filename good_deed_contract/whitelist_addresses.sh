#!/bin/bash

source .env

# Check if the addresses array is provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <address1> <address2> ... <addressN>"
  exit 1
fi

# Read the addresses into an array
ADDRESSES_ARRAY=("$@")

# Format the addresses array into JSON format
ADDRESSES_JSON=$(printf ',"%s"' "${ADDRESSES_ARRAY[@]}")
ADDRESSES_JSON="[${ADDRESSES_JSON:1}]"

WHITELIST_ADDRESSES=$(sui client call --json \
    --package $PKG --module gooddeedtoken --function add_approve_address_from_cap \
    --gas-budget 100000000 \
    --args $POLICY $POLICY_CAP "$ADDRESSES_JSON" \
    --type-args $PKG::gooddeedtoken::GOODDEEDTOKEN)

echo "$WHITELIST_ADDRESSES"