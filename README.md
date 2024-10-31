# Umar Passports

Written in [Solidity](https://docs.soliditylang.org) and developed using [Hardhat](https://hardhat.org), the Umar Passport smart contract can currently be deployed on a local Hardhat node or the public Sepolia Testnet.

## Local Deployment

Install the Node dependencies first:

```bash
yarn
```

Next, copy `.env.example` to `.env` and fill in the missing values. Get an ALCHEMY_API_KEY by signing up at [Alchemy](https://www.alchemy.com/). Get your ACCOUNT_PRIVATE_KEY from your wallet provider, such as MetaMask.

Now, start a local Hardhat node:

```bash
npx hardhat node
```

With the node running, you can deploy the Umar Passport contract in a separate terminal window:

```bash
npx hardhat ignition deploy ignition/modules/UmarPassport.ts --network localhost
```

## Deployment on Sepolia

First, make sure that your account has enough Sepolia ETH to deploy the contract. You can grab free SepoliaETH here:

- [Sepolia Faucet](https://www.sepoliafaucet.io/)

You can also estimate the deployment gas fees by running:

```bash
npx hardhat run scripts/estimateDeploymentGas.ts --network sepolia
```

Finally, deploy the Umar Passport contract using an arbitrary deployment id:

```bash
npx hardhat ignition deploy ignition/modules/UmarPassport.ts --network sepolia --deployment-id <arbitrary-deployment-id>
```
