import { task } from "hardhat/config";

const ERC721_ABI = [
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
];

/**
 Example:
 npx hardhat check-token \
   --contractaddress "0x5FbDB2315678afecb367f032d93F642f64180aa3" \
   --tokenid "0" \
   --network localhost
 */
task("check-token", "Fetches the URI of an NFT")
  .addParam<string>("contractaddress", "The address to mint the NFT to")
  .addParam<String>("tokenid", "The token ID of the NFT")
  .setAction(async (taskArgs, hre) => {
    console.log("Running check-token task with args:", taskArgs);
    const { contractaddress, tokenid } = taskArgs;

    const signers = await hre.ethers.getSigners();
    const contractRunner = signers[0];

    const contract = new hre.ethers.Contract(
      contractaddress,
      ERC721_ABI,
      contractRunner
    );

    const uri = await contract.tokenURI(tokenid);
    console.log("Token URI:", uri);

    const owner = await contract.ownerOf(tokenid);
    console.log("Token Owner:", owner);
  });
