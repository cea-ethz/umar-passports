<template>
  <div>
    <v-btn
      v-if="!isConnected"
      @click="connectWallet"
      variant="elevated"
      class="mx-1"
      :color="buttonColor"
    >
      <v-icon left class="mr-2">mdi-wallet</v-icon>
      Connect Wallet
    </v-btn>

    <v-menu v-else location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="elevated"
          class="mx-1"
          :color="buttonColor"
        >
          <v-icon left class="mr-2">mdi-wallet</v-icon>
          {{ buttonText }}
          <v-icon right class="ml-2">mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title class="text-caption text-grey">
            Connected as
          </v-list-item-title>
          <v-list-item-subtitle class="font-weight-medium">
            {{ account }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="copyAddress">
          <v-list-item-title>
            <v-icon left class="mr-2">mdi-content-copy</v-icon>
            Copy Address
          </v-list-item-title>
        </v-list-item>

        <v-list-item @click="disconnectWallet" color="error">
          <v-list-item-title class="text-error">
            <v-icon left class="mr-2">mdi-logout</v-icon>
            Disconnect
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Snackbar for copy notification -->
    <v-snackbar v-model="showCopyNotification" :timeout="2000" color="success">
      Address copied to clipboard!
    </v-snackbar>
  </div>
</template>

<script>
import { useWallet } from "@/composables/useWallet";

export default {
  name: "WalletConnector",

  setup() {
    const {
      isConnected,
      account,
      signer,
      buttonText,
      buttonColor,
      connectWallet,
      disconnectWallet,
      checkConnection,
      cleanup,
    } = useWallet();

    return {
      isConnected,
      account,
      buttonText,
      buttonColor,
      connectWallet,
      disconnectWallet,
      checkConnection,
      cleanup,
    };
  },

  data() {
    return {
      showCopyNotification: false,
    };
  },

  methods: {
    async copyAddress() {
      try {
        await navigator.clipboard.writeText(this.account);
        this.showCopyNotification = true;
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    },
  },

  async mounted() {
    await this.checkConnection();
  },

  beforeUnmount() {
    this.cleanup();
  },
};
</script>

<style scoped>
.v-list-item {
  min-height: 40px;
}
</style>
