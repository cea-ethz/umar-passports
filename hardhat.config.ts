import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import "./tasks/check-token";
import "./tasks/mint-nft";
import "./tasks/lazy-mint-nft";

if (!process.env.ACCOUNT_PRIVATE_KEY) {
  throw new Error("ACCOUNT_PRIVATE_KEY is required");
}

if (!process.env.ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is required");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: process.env.ACCOUNT_PRIVATE_KEY,
          balance: "10000000000000000000000",
        },
      ],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
};

export default config;
