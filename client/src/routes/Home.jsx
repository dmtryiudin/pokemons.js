import { usePagination } from "../hooks/usePagination";
import { PokemonsService } from "../services/pokemonsService";
import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  HStack,
  Separator,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../components/ui/pagination";
import { PokemonCard } from "../components/custom/PokemonCard";
import { useRequest } from "../hooks/useRequest.js";
import { BattleService } from "../services/battleService.js";
import { useNavigate } from "react-router";
import { ClientEndpoints } from "../types/endpoints.js";
import { useEffect } from "react";
import { toaster } from "../components/ui/toaster.jsx";
import { useBattleStore } from "../store/battle.js";

export const HomePage = () => {
  const { setActiveBattle } = useBattleStore();
  const pageSize = 12;

  const { setPage, currentPage, data, maxCount, isLoading, isError } =
    usePagination(PokemonsService.getPokemonsList, pageSize);

  const navigate = useNavigate();

  const restoreBattle = async () => {
    const battle = await BattleService.restoreBattle();
    setActiveBattle(battle);
    navigate(ClientEndpoints.BATTLE);
  };

  const {
    request: getBattleData,
    isLoading: battleDataLoading,
    error: battleDataError,
  } = useRequest(restoreBattle);

  useEffect(() => {
    if (battleDataError) {
      toaster.create({
        title: "Failed to restore a battle",
        description: battleDataError,
        type: "error",
      });
    }
  }, [battleDataError]);

  return (
    <Container>
      <Center
        minH="100vh"
        py={20}
        flexDirection="column"
        justifyContent={data ? "space-between" : "center"}
        gap="12"
      >
        {isLoading && !data ? <Spinner size="xl" /> : null}
        {data && (
          <Stack alignItems="center">
            <Text textTransform="uppercase" fontWeight="bold" fontSize="2xl">
              Start new battle
            </Text>
            <Flex w="100%" alignItems="center" gap={3}>
              <Separator w="100%" />
              <Text textTransform="uppercase">Or</Text>
              <Separator w="100%" />
            </Flex>
            <Button
              w="100%"
              onClick={getBattleData}
              loading={battleDataLoading}
            >
              Restore previous battle
            </Button>
          </Stack>
        )}
        {data && (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap="6"
          >
            {data.map((el) => (
              <PokemonCard isLoading={isLoading} key={el.id} {...el} />
            ))}
          </Grid>
        )}
        {data && (
          <PaginationRoot
            count={maxCount}
            pageSize={pageSize}
            page={currentPage}
            onPageChange={(e) => setPage(e.page)}
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationPageText display={{ base: "block", sm: "none" }} />
              <Box display={{ base: "none", sm: "block" }}>
                <PaginationItems />
              </Box>
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        )}

        {isError ? (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Failed to load data</Alert.Title>
              <Alert.Description>
                Failed to load pokemons list. Try again later
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}
      </Center>
    </Container>
  );
};
