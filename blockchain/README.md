# Umar Passport NFT Smart Contract

This repository contains the Umar Passport NFT smart contract, written in [Solidity](https://docs.soliditylang.org) and developed with [Hardhat](https://hardhat.org). It provides instructions for deploying the contract on a local Hardhat network or the Sepolia Testnet, and minting NFTs with decentralized metadata hosted on IPFS.

## Prerequisites

NFTs consist of two components: the token itself and associated metadata (e.g., name, description, media file). Metadata is linked through the token's URI.

We use [IPFS](https://ipfs.tech/) for decentralized storage of both media and metadata, via [Pinata](https://app.pinata.cloud/). Follow these steps:

1. Create a Pinata account.
2. Upload your media file (e.g., a `.glb` animation file).
3. Copy the returned IPFS hash\*\* and use it as the value of the `animation_url` in your metadata JSON file (e.g., `./metadata/copper.json`).
4. Upload your metadata JSON to Pinata.
5. Use the resulting IPFS hash of the metadata as the token URI.

Example files are provided in the `/metadata` folder. You can use these as-is or create your own.

## Reproducing Results

To reproduce the results, we first need to deploy the Umar Passport NFT smart contract and then mint our NFTs on this contract.

### 1. Install Dependencies

```bash
yarn
```

### 2. Configure Environment

Copy the example environment file and add your values:

```bash
cp .env.example .env
```

- Get an API key from [Alchemy](https://www.alchemy.com/)
- Get your private wallet key from [MetaMask](https://metamask.io)

### 3. Deploying the Contract

#### Local Deployment

Start a local Hardhat node:

```bash
npx hardhat node
```

In a new terminal, deploy the contract:

```bash
npx hardhat ignition deploy ignition/modules/UmarPassport.ts --network localhost
```

#### Sepolia Testnet

Ensure your wallet has SepoliaETH from a faucet like:

- [https://www.sepoliafaucet.io](https://www.sepoliafaucet.io)

Estimate deployment gas cost:

```bash
npx hardhat run scripts/estimateDeploymentGas.ts --network sepolia
```

Deploy the contract:

```bash
npx hardhat ignition deploy ignition/modules/UmarPassport.ts --network sepolia
```

If re-deploying, include a unique deployment ID:

```bash
npx hardhat ignition deploy ignition/modules/UmarPassport.ts --network sepolia --deployment-id <unique-id>
```

### 4. Minting NFTs

After deploying, you can mint NFTs using your contract.

1. Update `/scripts/mintNFTs.ts`:
   - Set `contractAddress` to your deployed address that you can find in `./ignition/deployments/`
   - Update the `nfts` array with your metadata IPFS URIs.

#### Mint Locally

Ensure the local Hardhat node is running in a separate terminal window, then run:

```bash
npx hardhat run scripts/mintNFTs.ts --network localhost
```

#### Mint on Sepolia

Make sure your wallet has enough ETH for gas:

```bash
npx hardhat run scripts/mintNFTs.ts --network sepolia
```
