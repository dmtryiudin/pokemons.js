import Web3 from "web3";

export class WalletService {
  static async connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        return accounts[0];
      } catch {
        throw new Error("Failed to connect wallet");
      }
    } else {
      throw new Error("MetaMask is not installed");
    }
  }

  static async getConnectedWallets() {
    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    return accounts;
  }
}
