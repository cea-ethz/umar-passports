import { ref, computed } from "vue";
import { ethers } from "ethers";

// global state
const isConnected = ref(false);
const account = ref("");
const provider = ref(null);
const signer = ref(null);

export function useWallet() {
  const buttonText = computed(() => {
    return isConnected.value
      ? `${account.value.slice(0, 6)}...${account.value.slice(-4)}`
      : "Connect Wallet";
  });

  const buttonColor = computed(() => {
    return isConnected.value ? "success" : "primary";
  });

  async function connectWallet() {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this feature");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      establishConnection(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting wallet. Please try again.");
      disconnectWallet();
    }
  }

  function establishConnection(walletAddress) {
    isConnected.value = true;
    account.value = walletAddress;
    provider.value = new ethers.providers.Web3Provider(window.ethereum);
    signer.value = provider.value.getSigner();
    localStorage.setItem("walletAutoConnect", "true");
    setupListeners();

    // console.log("useWallet establishConnection: isConnected", isConnected.value);
    // console.log("useWallet establishConnection: account", account.value);
    // console.log("useWallet establishConnection: provider", provider.value);
    // console.log("useWallet establishConnection: signer", signer.value);
  }

  function disconnectWallet() {
    isConnected.value = false;
    account.value = "";
    provider.value = null;
    signer.value = null;
    localStorage.setItem("walletAutoConnect", "false");

    // console.log("useWallet disconnectWallet: account", account.value);
    // console.log("useWallet disconnectWallet: provider", provider.value);
    // console.log("useWallet disconnectWallet: signer", signer.value);
    // console.log("useWallet disconnectWallet: isConnected", isConnected.value);
  }

  function setupListeners() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          account.value = accounts[0];
        }
      });

      window.ethereum.on("chainChanged", () => {
        const shouldAutoConnect = isConnected.value;
        localStorage.setItem("walletAutoConnect", shouldAutoConnect.toString());
        window.location.reload();
      });

      window.ethereum.on("disconnect", () => {
        disconnectWallet();
      });
    }
  }

  async function checkConnection() {
    const shouldAutoConnect =
      localStorage.getItem("walletAutoConnect") === "true";

    if (shouldAutoConnect && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          establishConnection(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
        disconnectWallet();
      }
    }
  }

  function cleanup() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
      window.ethereum.removeAllListeners("disconnect");
    }
  }

  return {
    isConnected,
    account,
    provider,
    signer,
    buttonText,
    buttonColor,
    connectWallet,
    disconnectWallet,
    checkConnection,
    cleanup,
  };
}
