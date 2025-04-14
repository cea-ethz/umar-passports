// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UmarPassportTraditionalModule = buildModule(
  "UmarPassportTraditionalModule",
  (m) => {
    // deploy contract
    const owner = m.getAccount(0);
    const umarPassportTraditional = m.contract("UmarPassportTraditional", [
      owner,
    ]);

    return { umarPassportTraditional };
  }
);

export default UmarPassportTraditionalModule;
