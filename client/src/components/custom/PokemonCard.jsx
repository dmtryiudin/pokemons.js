import { Button, Card, Flex } from "@chakra-ui/react";
import { Skeleton } from "../../components/ui/skeleton";
import { Image } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { List } from "@chakra-ui/react";
import { useRequest } from "../../hooks/useRequest.js";
import { BattleService } from "../../services/battleService.js";
import { useNavigate } from "react-router";
import { ClientEndpoints } from "../../types/endpoints.js";
import { useEffect } from "react";
import { toaster } from "../ui/toaster";
import { useBattleStore } from "../../store/battle.js";

export const PokemonCard = ({
  id,
  name,
  isLoading,
  image,
  type,
  HP,
  Attack,
  Defense,
  Speed,
}) => {
  const navigate = useNavigate();
  const { setActiveBattle } = useBattleStore();

  const startBattle = async () => {
    const battle = await BattleService.startBattle(id);
    setActiveBattle(battle);

    navigate(ClientEndpoints.BATTLE);
  };

  const {
    request: startBattleHandler,
    isLoading: startBattleLoading,
    error: startBattleError,
  } = useRequest(startBattle);

  useEffect(() => {
    if (startBattleError) {
      toaster.create({
        title: "Failed to start a new battle",
        description: "Failed to start a new battle",
        type: "error",
      });
    }
  }, [startBattleError]);

  return (
    <>
      <Skeleton loading={isLoading}>
        <Card.Root>
          <Card.Header>
            <Text fontWeight="semibold" textStyle="xl">
              {name}
            </Text>
          </Card.Header>
          <Card.Body>
            <Image
              height="200px"
              width="200px"
              objectFit="cover"
              src={image}
              loading="eager"
            />
          </Card.Body>
          <Card.Footer>
            <Flex justifyContent="space-between" w="100%">
              <DialogRoot placement="center">
                <DialogTrigger asChild>
                  <Button variant="outline">Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pokemon details</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <List.Root>
                      <List.Item>
                        <Text>Name: {name}</Text>
                      </List.Item>
                      <List.Item>
                        <Text>Type: {type.join(", ")}</Text>
                      </List.Item>
                      <List.Item>
                        <Text>HP: {HP}</Text>
                      </List.Item>
                      <List.Item>
                        <Text>Attack: {Attack}</Text>
                      </List.Item>
                      <List.Item>
                        <Text>Defense: {Defense}</Text>
                      </List.Item>
                      <List.Item>
                        <Text>Speed: {Speed}</Text>
                      </List.Item>
                    </List.Root>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">OK</Button>
                    </DialogActionTrigger>
                  </DialogFooter>
                  <DialogCloseTrigger />
                </DialogContent>
              </DialogRoot>
              <DialogRoot placement="center">
                <DialogTrigger asChild>
                  <Button>Choose</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Are you ready to start a new battle?
                    </DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <Text>
                      If you start a new battle, your previous battle will be
                      lost.
                    </Text>
                  </DialogBody>
                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogActionTrigger>
                    <Button
                      onClick={startBattleHandler}
                      loading={startBattleLoading}
                    >
                      Start
                    </Button>
                  </DialogFooter>
                  <DialogCloseTrigger />
                </DialogContent>
              </DialogRoot>
            </Flex>
          </Card.Footer>
        </Card.Root>
      </Skeleton>
    </>
  );
};
