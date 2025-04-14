// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UmarPassportLazyMintModule = buildModule(
  "UmarPassportLazyMintModule",
  (m) => {
    // deploy contract
    const owner = m.getAccount(0);
    const umarPassportLazyMint = m.contract("UmarPassportLazyMint", [owner]);

    return { umarPassportLazyMint };
  }
);

export default UmarPassportLazyMintModule;
