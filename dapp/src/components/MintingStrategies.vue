<template>
  <!-- <v-table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Pre-defined V1: Standard Way</th>
        <th>Pre-defined V2: Lazy Minting</th>
        <th>Customized: Lazy Minting</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Door</td>
        <td>
          <v-btn
            href="https://testnets.opensea.io/assets/sepolia/0xb27fe598c87fb6e7e1ca440b2e08f001389a768d/0"
            target="_blank"
            variant="outlined"
            color="primary"
            size="small"
          >
            Buy NFT via OpenSea
          </v-btn>
          <br />
          <v-btn
            href="https://testnets.opensea.io/assets/sepolia/0xb27fe598c87fb6e7e1ca440b2e08f001389a768d/0"
            target="_blank"
            variant="outlined"
            color="primary"
            size="small"
          >
            View NFT on OpenSea
          </v-btn>
          <p>Initial price set by contract owner through OpenSea listing.</p>
          <p>No backend server or signatures required.</p>
        </td>
        <td>
          <v-btn
            v-if="isConnected"
            @click="lazyMintNFT"
            variant="outlined"
            color="primary"
            size="small"
            :loading="isLoading"
          >
            Lazy Mint & Buy NFT via COMPAS WebViewer
          </v-btn>
          <p v-else>Connect wallet to mint NFT.</p>
          <br />
          <v-btn
            href="https://testnets.opensea.io/assets/sepolia/0x9262A74a9A3EDDdea8B40071409A1C596dFF1e0d/1"
            target="_blank"
            variant="outlined"
            color="primary"
            size="small"
          >
            View NFT on OpenSea
          </v-btn>
          <p>Initial price set via NFT voucher signatures by contract owner.</p>
          <p>
            No backend required: signatures can be hardcoded into this website.
          </p>
        </td>
        <td><v-checkbox></v-checkbox></td>
      </tr>
      <tr>
        <td>Door Frame</td>
        <td></td>
        <td></td>
        <td><v-checkbox></v-checkbox></td>
      </tr>
      <tr>
        <td>Window</td>
        <td></td>
        <td></td>
        <td><v-checkbox></v-checkbox></td>
      </tr>
      <tr>
        <td>Wall</td>
        <td></td>
        <td></td>
        <td><v-checkbox></v-checkbox></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>
          <v-btn
            v-if="isConnected"
            @click="lazyMintNFT"
            variant="outlined"
            color="primary"
            size="small"
            :loading="isLoading"
          >
            Lazy Mint & Buy NFT via COMPAS WebViewer
          </v-btn>
          <p v-else>Connect wallet to mint NFT.</p>
          <br />
          <v-btn
            href="https://testnets.opensea.io/assets/sepolia/0x9262A74a9A3EDDdea8B40071409A1C596dFF1e0d/2"
            target="_blank"
            variant="outlined"
            color="primary"
            size="small"
          >
            View NFT on OpenSea
          </v-btn>
          <p>Initial price set by contract owner via backend server.</p>
          <p>
            Backend required for price calculation and NFT voucher signatures.
          </p>
          <p>Alternative: users can pay what they want.</p>
        </td>
      </tr>
    </tbody>
  </v-table> -->
</template>

<script>
import { useWallet } from "@/composables/useWallet";
const { isConnected, account, signer } = useWallet();

import { LazyMintService } from "@/services/lazyMintService";
import { ref, watch } from "vue";
import { ethers } from "ethers";

export default {
  name: "MintingStrategies",

  setup() {
    const isLoading = ref(false);
    const contractAddress = "0x9262A74a9A3EDDdea8B40071409A1C596dFF1e0d";
    let lazyMintService;

    watch(
      () => signer.value,
      (newSigner) => {
        lazyMintService = new LazyMintService(contractAddress, newSigner);
      }
    );

    async function lazyMintNFT() {
      try {
        if (!lazyMintService) {
          throw new Error("LazyMintService not set");
        }

        isLoading.value = true;

        const redeemer = account.value;

        const dummyDoorDataURI =
          "ipfs://Qmdbb89D4KbjxKebHLpyQP1EvMKgE2JK2xXM267Vhjy6Tx";

        const voucher = {
          tokenId: 2,
          minPrice: ethers.utils.parseEther("0.000001"), // Convert minprice to wei
          uri: dummyDoorDataURI,
        };

        const domain = {
          name: "UmarPassportLazyMint",
          version: "1.0.0",
          chainId: 11155111,
          verifyingContract: contractAddress,
        };

        const types = {
          NFTVoucher: [
            { name: "tokenId", type: "uint256" },
            { name: "minPrice", type: "uint256" },
            { name: "uri", type: "string" },
          ],
        };
        const ownerPrivateKey =
          "0x1656db30668e666855b314ea1c7fd6b1624d1396d92ac11883508d427c7cb43a";
        const owner = new ethers.Wallet(ownerPrivateKey);
        const signature = await owner._signTypedData(domain, types, voucher);

        const tx = await lazyMintService.redeem(redeemer, voucher, signature);
        console.log("Minting successful:", tx.blockHash);
      } catch (error) {
        console.error("Minting failed:", error);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      isConnected,
      isLoading,
      lazyMintNFT,
    };
  },
};
</script>
