import { Center, Stack, Text } from "@chakra-ui/react";

export const NotFound = () => {
  return (
    <Center h="100vh" w="100vw">
      <Stack align="center" gap={0}>
        <Text textTransform="uppercase" fontWeight="bolder" fontSize="7xl">
          404
        </Text>
        <Text textTransform="uppercase" fontSize="xl">
          not found
        </Text>
      </Stack>
    </Center>
  );
};
