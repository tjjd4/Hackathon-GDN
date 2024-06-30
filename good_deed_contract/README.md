# GoodDeed Contract

This is a Sui Move package for the GoodDeed Token.

## Table of Contents

- [GoodDeed Contract](#gooddeed-contract)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Setup](#setup)
    - [Install Sui CLI](#install-sui-cli)
    - [Clone the GoodDeed Contract](#clone-the-gooddeed-contract)
  - [Scripts](#scripts)
    - [Publish the Contract](#publish-the-contract)
    - [Mint \& Transfer Tokens to verified authority](#mint--transfer-tokens-to-verified-authority)
    - [Add verified authorities to sender whitelist](#add-verified-authorities-to-sender-whitelist)

## Overview

The GoodDeed Contract is a Sui Move package that implements a fungible token with a fixed supply. The contract allows users to join and split the token, and allows the contract owner to mint new tokens.

## Setup

### Install Sui CLI

To interact with Sui, you need to install the Sui CLI. Follow the instructions in the [Sui CLI repository](https://github.com/MystenLabs/sui/tree/main/tools/sui-cli#installation) to install the Sui CLI.

### Clone the GoodDeed Contract

Clone the GoodDeed Contract repository to your local machine:

```bash
git clone https://github.com/MystenLabs/sui-contracts-package.git
```

## Scripts

### Publish the Contract

```bash
./publish.sh
```

This will publish the GoodDeed Contract to the Sui testnet. And all the necessary addresses will be saved in the `.env` file.

### Mint & Transfer Tokens to verified authority

```bash
./mint_and_transfer.sh <recipient_address> <amount>
```

This will mint and transfer tokens to the specified recipient address.

### Add verified authorities to sender whitelist

```bash
./whitelist_addresses.sh <sender_address 1> <sender_address 2> ...
```

This will add the specified addresses to the sender whitelist. Only these addresses will be able to transfer the tokens from the contract.
