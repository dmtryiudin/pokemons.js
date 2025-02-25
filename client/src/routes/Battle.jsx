import { BattleLogs } from "../components/custom/BattleLogs.jsx";
import { PokemonBattleCard } from "../components/custom/PokemonBattleCard.jsx";
import { useBattle } from "../hooks/useBattle.js";
import {
  Alert,
  Button,
  Center,
  Container,
  Flex,
  Link,
  Separator,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router";
import { ClientEndpoints } from "../types/endpoints.js";

export const Battle = () => {
  const { data, isError, isLoading, attack } = useBattle();

  const ErrorAlert = (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Something went wrong</Alert.Title>
        <Alert.Description>Try to continue your battle later</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );

  const UserWinAlert = (
    <Alert.Root status="success">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Victory!</Alert.Title>
        <Alert.Description>
          Congratulations! You have won this battle.{" "}
          <Link to={ClientEndpoints.ROOT} as={ReactRouterLink}>
            Go to main page
          </Link>
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );

  const UserLostAlert = (
    <Alert.Root status="info">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Defeat!</Alert.Title>
        <Alert.Description>
          You have lost this battle. Go to{" "}
          <Link to={ClientEndpoints.ROOT} as={ReactRouterLink}>
            Go to main page
          </Link>
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );

  const WinnerAlert =
    data?.winner && data?.winner === "bot" ? UserLostAlert : UserWinAlert;

  return (
    <>
      <Container>
        <Center minH="100vh" py={20}>
          {isError ? (
            ErrorAlert
          ) : (
            <>
              {data ? (
                data.winner ? (
                  WinnerAlert
                ) : (
                  <Flex gap={10} flexDirection="column">
                    <Flex
                      alignItems="center"
                      gap={{ base: 4, sm: 10 }}
                      flexDirection={{ base: "column", sm: "row" }}
                    >
                      <PokemonBattleCard
                        battleData={data.battle}
                        playerType="user"
                      />
                      <Text fontSize={{ base: "4xl", lg: "9xl" }}>VS</Text>
                      <PokemonBattleCard
                        battleData={data.battle}
                        playerType="bot"
                      />
                    </Flex>
                    <Separator />
                    <Flex
                      justify="space-between"
                      alignItems="center"
                      gap={4}
                      flexDirection={{ base: "column", sm: "row" }}
                    >
                      <BattleLogs battleData={data.battle} />
                      <Button
                        size="2xl"
                        disabled={!!data?.winner}
                        onClick={attack}
                        loading={isLoading}
                      >
                        Attack
                      </Button>
                      <Button
                        to={ClientEndpoints.ROOT}
                        as={ReactRouterLink}
                        variant="outline"
                      >
                        Leave battle
                      </Button>
                    </Flex>
                  </Flex>
                )
              ) : (
                <Spinner size="xl" />
              )}
            </>
          )}
        </Center>
      </Container>
    </>
  );
};
