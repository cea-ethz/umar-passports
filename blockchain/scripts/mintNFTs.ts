import hre from "hardhat";

/*
 * Run this script using the following command:
 * npx hardhat run scripts/mintNFT.ts --network <network>
 */
async function main() {
  const signers = await hre.ethers.getSigners();

  const to = signers[0].address;

  const NFTs = [
    {
      name: "Gemma Curtain",
      tokenId: "8e4cad1e-0923-4c2c-8085-acab89a50d41",
      uri: "ipfs://bafkreiecwqzj45kzbacfwykhnloabhnjk4nevw3qjlflhjbguossfj4rau",
    },
    {
      name: "Cooper",
      tokenId: "964ef4c6-bb31-423e-944f-16e3f46d6f88",
      uri: "ipfs://bafkreia5km5h3jjp4urxa6l7bn3kavegp6n2h2xnf7cu5uxhvm6u3c2nvq",
    },
  ];

  for (const nft of NFTs) {
    const { tokenId, uri } = nft;
    await hre.run("mint-nft", { tokenId, to, uri });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
