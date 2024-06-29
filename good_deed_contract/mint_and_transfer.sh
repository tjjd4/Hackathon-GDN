#!/bin/bash

# Function to display usage
usage() {
  echo "Usage: $0 <recipient> <amount>"
  echo "  <recipient>  The recipient address starting with '0x'."
  echo "  <amount>     The amount to transfer."
  exit 1
}

# Check if the correct number of arguments is provided
if [ $# -ne 2 ]; then
  usage
fi

# Read the arguments into variables
RECIPIENT=$1
AMOUNT=$2

# Check if the recipient address starts with 0x
if [[ ! $RECIPIENT =~ ^0x ]]; then
  echo "Error: The recipient address must start with '0x'."
  usage
fi

# Source environment variables
source .env

# Call the SUI client with the provided arguments
MINT_AND_TRANSFER=$(sui client call --json \
    --package $PKG --module gooddeedtoken --function mint_and_transfer_with_cap \
    --gas-budget 100000000 \
    --args $POLICY $TREASURY_CAP $AMOUNT $RECIPIENT \
    --type-args $PKG::gooddeedtoken::GOODDEEDTOKEN)

# Print the result of the transaction
echo "$MINT_AND_TRANSFER"
