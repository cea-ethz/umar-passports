// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UmarPassportModule = buildModule("UmarPassportModule", (m) => {
  const owner = m.getAccount(0);
  const UmarPassport = m.contract("UmarPassport", [owner]);

  return { UmarPassport };
});

export default UmarPassportModule;
