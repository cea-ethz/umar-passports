import { ethers } from "ethers";

const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "redeemer",
        type: "address",
      },
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "minPrice", type: "uint256" },
          { internalType: "string", name: "uri", type: "string" },
        ],
        internalType: "struct UmarPassportLazyMint.NFTVoucher",
        name: "voucher",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "redeem",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
];

export class LazyMintService {
  constructor(contractAddress, signer) {
    if (!signer || !contractAddress) {
      throw new Error("Signer and contractAddress are required.");
    }

    // const rawSigner = JSON.parse(JSON.stringify(signer));
    // toRaw(reactive(signer));

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = provider.getSigner();

    this.contract = new ethers.Contract(contractAddress, ABI, newSigner);
  }

  async redeem(redeemer, voucher, signature) {
    console.log("Redeem method called with:", { redeemer, voucher, signature });
    const tx = await this.contract.redeem(redeemer, voucher, signature, {
      value: voucher.minPrice,
    });
    console.log("transaction prepared");
    return await tx.wait();
  }
}
