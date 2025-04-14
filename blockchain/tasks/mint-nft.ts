import { task } from "hardhat/config";
import UmarPassportTraditionalModule from "../ignition/modules/UmarPassportTraditional";

/**
 Example:
 npx hardhat mint-nft \
   --to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
   --uri ipfs://Qmdbb89D4KbjxKebHLpyQP1EvMKgE2JK2xXM267Vhjy6Tx \
   --network localhost
 */
task("mint-nft", "Mints an NFT")
  .addParam<string>("tokenId", "The token ID of the NFT")
  .addParam<string>("to", "The address to mint the NFT to")
  .addParam<String>("uri", "The URI of the NFT")
  .setAction(async (taskArgs, hre) => {
    try {
      console.log("Running mint-nft task with args:", taskArgs);
      const { tokenId, to, uri } = taskArgs;

      const { umarPassportTraditional } = await hre.ignition.deploy(
        UmarPassportTraditionalModule
      );
      console.log(
        "Using UmarPassportTraditional deployed to:",
        await umarPassportTraditional.getAddress()
      );

      await umarPassportTraditional.safeMint(tokenId, to, uri);
      console.log("Minted NFT to:", to);
    } catch (error) {
      console.error(error);
    }
  });
