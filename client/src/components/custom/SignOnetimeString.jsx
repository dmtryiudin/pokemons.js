import { useRequest } from "../../hooks/useRequest";
import { AuthService } from "../../services/authService";
import { useEffect } from "react";
import { toaster } from "../ui/toaster";
import { Button, Center } from "@chakra-ui/react";
import { useUserStore } from "../../store/user";
import { useNavigate, useSearchParams } from "react-router";
import { ClientEndpoints } from "../../types/endpoints";

export const SignOnetimeString = () => {
  const { setUser } = useUserStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const authenticate = async () => {
    const user = await AuthService.authenticate();
    setUser(user);

    const callback = searchParams.get("callback");
    navigate(callback || ClientEndpoints.ROOT);
  };

  const {
    request: authHandler,
    isLoading: authLoading,
    isError: authError,
  } = useRequest(authenticate);

  useEffect(() => {
    if (authError) {
      toaster.create({
        title: "Failed to authenticate user",
        description: "Something went wrong. Try again later",
        type: "error",
      });
    }
  }, [authError]);

  return (
    <Center h="100vh">
      <Button onClick={authHandler} loading={authLoading}>
        Sign one time string to authenticate
      </Button>
    </Center>
  );
};
