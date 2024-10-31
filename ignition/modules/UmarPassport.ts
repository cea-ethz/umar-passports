// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// can be retrieved via https://ipfs.io/ipfs/Qmdbb89D4KbjxKebHLpyQP1EvMKgE2JK2xXM267Vhjy6Tx
// const dummyDoorDataURI = "ipfs://Qmdbb89D4KbjxKebHLpyQP1EvMKgE2JK2xXM267Vhjy6Tx";
const dummyDuckDataURI =
  "ipfs://QmUBmWJUQtdMCtPEP95Dx8CTJR2CieSa9vbUh5ijsuSe1N";

const UmarPassportModule = buildModule("UmarPassportModule", (m) => {
  // deploy contract
  const owner = m.getAccount(0);
  const umarPassport = m.contract("UmarPassport", [owner]);

  // mint one dummy token
  m.call(umarPassport, "safeMint", [owner, dummyDuckDataURI]);

  return { umarPassport };
});

export default UmarPassportModule;
