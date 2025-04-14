import { task } from "hardhat/config";
import UmarPassportLazyMint from "../ignition/modules/UmarPassportLazyMint";

/**
 Example:
 npx hardhat lazy-mint-nft \
   --redeemer 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
   --tokenid 0 \
   --minprice 0.01 \
   --uri ipfs://QmUBmWJUQtdMCtPEP95Dx8CTJR2CieSa9vbUh5ijsuSe1N \
   --network localhost
 */
task("lazy-mint-nft", "Lazily mints an NFT")
  .addParam<string>("redeemer", "The address to mint the NFT to")
  .addParam<string>("tokenid", "The token ID of the NFT")
  .addParam<String>("minprice", "The min price of the NFT")
  .addParam<String>("uri", "The URI of the NFT")
  .setAction(async (taskArgs, hre) => {
    try {
      console.log("Running lazy-mint-nft task with args:", taskArgs);
      const { redeemer, tokenid, minprice, uri } = taskArgs;

      const { umarPassportLazyMint } = await hre.ignition.deploy(
        UmarPassportLazyMint
      );
      console.log(
        "Using UmarPassportLazyMintModule deployed to:",
        await umarPassportLazyMint.getAddress()
      );

      const voucher = {
        tokenId: tokenid,
        minPrice: hre.ethers.parseEther(minprice), // Convert minprice to wei
        uri,
      };

      const [signer] = await hre.ethers.getSigners();
      const domain = {
        name: "UmarPassportLazyMint",
        version: "1.0.0",
        chainId: hre.config.networks.hardhat.chainId,
        verifyingContract: await umarPassportLazyMint.getAddress(),
      };

      const types = {
        NFTVoucher: [
          { name: "tokenId", type: "uint256" },
          { name: "minPrice", type: "uint256" },
          { name: "uri", type: "string" },
        ],
      };
      const signature = await signer.signTypedData(domain, types, voucher);

      await umarPassportLazyMint.redeem(redeemer, voucher, signature, {
        value: voucher.minPrice,
      });

      console.log("Lazy minted NFT to:", redeemer);
      console.log("Token ID:", tokenid);
      console.log("Min Price:", minprice);
      console.log("URI:", uri);
      console.log("Signature:", signature);
    } catch (error) {
      console.error(error);
    }
  });
