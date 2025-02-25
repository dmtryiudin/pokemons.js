import { useRequest } from "../../hooks/useRequest";
import { WalletService } from "../../services/walletService";
import { useEffect } from "react";
import { toaster } from "../ui/toaster";
import { Button, Center } from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";

export const ConnectMetaMask = ({ next }) => {
  const connectWallet = async () => {
    await WalletService.connectWallet();
    next();
  };

  const {
    request: connectWalletHandler,
    isLoading: connectWalletLoading,
    error: connectWalletError,
  } = useRequest(connectWallet);

  useEffect(() => {
    if (connectWalletError) {
      toaster.create({
        title: "Failed to connect wallet",
        description: connectWalletError,
        type: "error",
      });
    }
  }, [connectWalletError]);

  const {
    request: getConnectedWalletsList,
    isLoading: connectWalletsListLoading,
    data: connectWalletsList,
  } = useRequest(WalletService.getConnectedWallets);

  useEffect(() => {
    getConnectedWalletsList();
  }, []);

  useEffect(() => {
    if (connectWalletsList?.length) {
      next();
    }
  }, [connectWalletsList]);

  return (
    <Center h="100vh">
      <Button
        onClick={connectWalletHandler}
        loading={connectWalletLoading || connectWalletsListLoading}
      >
        <FaEthereum /> Connect MetaMask wallet
      </Button>
    </Center>
  );
};
