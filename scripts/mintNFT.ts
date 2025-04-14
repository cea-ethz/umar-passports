import hre from "hardhat";

// can be retrieved via https://ipfs.io/ipfs/Qmdbb89D4KbjxKebHLpyQP1EvMKgE2JK2xXM267Vhjy6Tx
const dummyDoorDataURI =
  "ipfs://Qmdbb89D4KbjxKebHLpyQP1EvMKgE2JK2xXM267Vhjy6Tx";
const dummyDuckDataURI =
  "ipfs://QmUBmWJUQtdMCtPEP95Dx8CTJR2CieSa9vbUh5ijsuSe1N";

/*
 * Run this script using the following command:
 * npx hardhat run scripts/mintNFT.ts --network <network>
 */
async function main() {
  const signers = await hre.ethers.getSigners();

  const to = signers[0].address;
  const uri = dummyDoorDataURI;

  await hre.run("mint-nft", { to, uri });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
