import { useEffect, useState } from "react";
import { ConnectMetaMask } from "../components/custom/ConnectMetaMask";
import { SignOnetimeString } from "../components/custom/SignOnetimeString";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router";
import { ClientEndpoints } from "../types/endpoints";

export const AuthPage = () => {
  const [authStep, setAuthStep] = useState("1");

  const setAuthStepHandler = (step) => {
    return () => {
      setAuthStep(step);
    };
  };

  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(ClientEndpoints.ROOT);
    }
  }, [user]);

  if (authStep === "1") {
    return <ConnectMetaMask next={setAuthStepHandler("2")} />;
  }

  if (authStep === "2") {
    return <SignOnetimeString />;
  }

  return null;
};
