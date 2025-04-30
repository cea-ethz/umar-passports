import { task } from "hardhat/config";

const ABI = [
  "function nextTokenId(uint256 tokenId) public view returns (string)",
  "function safeMint(address to, string memory uri) public",
];

/**
 Example:
 npx hardhat mint-nft \
   --contractaddress "0x5FbDB2315678afecb367f032d93F642f64180aa3" \
   --to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
   --uri ipfs://Qmdbb89D4KbjxKebHLpyQP1EvMKgE2JK2xXM267Vhjy6Tx \
   --network localhost
 */
task("mint-nft", "Mints an NFT")
  .addParam<String>("contractaddress", "The address of the NFT contract")
  .addParam<String>("to", "The address to mint the NFT to")
  .addParam<String>("uri", "The URI of the NFT")
  .setAction(async (taskArgs, hre) => {
    try {
      console.log("Running mint-nft task with args:", taskArgs);
      const { to, uri, contractaddress } = taskArgs;

      const signers = await hre.ethers.getSigners();
      const contractRunner = signers[0];

      const contract = new hre.ethers.Contract(
        contractaddress,
        ABI,
        contractRunner
      );

      const tokenId = await contract.nextTokenId();
      await contract.safeMint(to, uri);

      console.log(`Minted NFT to ${to} with tokenId ${tokenId}`);
    } catch (error) {
      console.error(error);
    }
  });
