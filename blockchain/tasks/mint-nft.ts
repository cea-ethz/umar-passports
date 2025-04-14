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
  .addParam<String>("to", "The address to mint the NFT to")
  .addParam<String>("uri", "The URI of the NFT")
  .setAction(async (taskArgs, hre) => {
    try {
      console.log("Running mint-nft task with args:", taskArgs);
      const { to, uri } = taskArgs;

      const { umarPassportTraditional } = await hre.ignition.deploy(
        UmarPassportTraditionalModule
      );
      console.log(
        "Using UmarPassportTraditional deployed to:",
        await umarPassportTraditional.getAddress()
      );

      const tokenIdBefore = await umarPassportTraditional.nextTokenId();
      await umarPassportTraditional.safeMint(to, uri);

      console.log(`Minted NFT to ${to} with tokenId ${tokenIdBefore}`);
    } catch (error) {
      console.error(error);
    }
  });
