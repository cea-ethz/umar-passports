# Umar Passports

This repository contains the complete implementation of the Umar Passport project, which includes both the decentralized application (DApp) and the smart contract system for minting and interacting with Umar Passport NFTs.

## Repository Structure

- **`/dapp`**  
  Contains the frontend and backend of the web application, built with Vue, Three.js, and FastAPI. This component is forked from the [COMPAS WebViewer](https://github.com/compas-dev/compas-webviewer).

- **`/blockchain`**  
  Contains the Hardhat environment for developing, testing, and deploying the Umar Passport NFT smart contracts. This includes scripts, tasks, and deployment configurations.

---

## Running the Prototype

To run the full prototype and reproduce the results, follow the two main phases: **minting NFTs** and **interacting with them via the DApp**.

### Phase 1: Minting NFTs

Before interacting with the application, you must mint NFTs. This process is detailed in the `/blockchain` directory, but here is a high-level overview:

1. **Upload Metadata to IPFS using Pinata**  
   Either upload your own metadata files or use the provided sample uploads for testing.

2. **Deploy the Smart Contract**  
   Deploy the NFT contract to the Sepolia testnet.

3. **Mint NFTs**  
   Mint tokens using the uploaded metadata and the deployed contract.

---

### Phase 2: Interacting with NFTs in the DApp

Once the NFTs are minted, you can launch the DApp to visualize and interact with them. This process is detailed in the `/dapp` directory, but here is a high-level overview:

1. **Prepare Data**  
   Add or modify `.obj` and `.json` files in the `/data` directory to represent the NFT assets.

2. **Configure the Backend**  
   Update `server.py` to return the appropriate 3D mesh from your `.obj` file.

3. **Start the Backend Server**

4. **Update Contract Info**  
   In the frontend code, set the correct contract address and token IDs for your deployed NFTs.

5. **Launch the Frontend**

6. **Interact with Your NFTs**  
   With the server and frontend running, you can now view and interact with your Umar Passport NFTs in the browser.
