import { ethers } from "hardhat";
import { BigNumberish } from "ethers";

async function main() {
  const UmarPassport = await ethers.getContractFactory("UmarPassport");

  console.log("Estimating gas for deploying UmarPassport...");

  const signers = await ethers.getSigners();
  const initialOwner = signers[0];

  // estimate amount of gas units required for deployment
  const gasEstimate = await ethers.provider.estimateGas(
    await UmarPassport.getDeployTransaction(initialOwner)
  );

  // estimate price for one unit of gas
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;

  if (!gasPrice) {
    throw new Error("Gas price is undefined");
  }

  // calculate estimated cost of deployment
  const estimatedCost: BigNumberish = gasEstimate * gasPrice;

  console.log(`
      Gas Estimate: ${gasEstimate.toString()} units
      Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei
      Estimated Deployment Cost: ${ethers.formatEther(estimatedCost)} ETH
    `);

  // check balance of the deployer
  const balance = await ethers.provider.getBalance(initialOwner.address);
  console.log("Balance: ", ethers.formatEther(balance));
}

// Main execution
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
