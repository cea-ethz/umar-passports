import hre from "hardhat";

/*
 * Run this script using the following command:
 * npx hardhat run scripts/mintNFTs.ts --network <network>
 */
async function main() {
  const signers = await hre.ethers.getSigners();

  const to = signers[0].address;

  const NFTs = [
    {
      name: "Gemma Curtain",
      uri: "ipfs://bafkreib3bwh7fwldegpsqtuzwjggw5jkafdli4mhctdiyud4iv63i3d6ni",
    },
    {
      name: "Cooper",
      uri: "ipfs://bafkreifwhnqocglfsg7e6g35mjyiuzpmx5bv5yckgwsnlyrikbgixtmqmu",
    },
  ];

  for (const nft of NFTs) {
    const { uri } = nft;
    await hre.run("mint-nft", { to, uri });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
