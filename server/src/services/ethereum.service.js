import Web3 from "web3";
import { EnvService } from "./env.service.js";

export class EthereumService {
  static async getAccountBallance(ethereumIdentifier) {
    const web3Instance = new Web3(EnvService.getValues().ETHEREUM_RPC);

    const balanceWei = await web3Instance.eth.getBalance(ethereumIdentifier);
    const balanceEther = web3Instance.utils.fromWei(balanceWei, "ether");

    return balanceEther;
  }
}
