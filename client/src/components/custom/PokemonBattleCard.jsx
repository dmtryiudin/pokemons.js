import { Card, Text, Image, Flex, Button, List } from "@chakra-ui/react";
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

export const PokemonBattleCard = ({ battleData, playerType }) => {
  const pokemon =
    playerType === "user" ? battleData.userPokemon : battleData.botPokemon;
  const isStarter = battleData.starts === playerType;

  const calculateHp = () => {
    const damageSum = battleData.attacks
      .map((el, index) => {
        const skip = isStarter ? index % 2 === 0 : index % 2 !== 0;

        if (skip) {
          return 0;
        }

        return el.damage;
      })
      .reduce((el1, el2) => el1 + el2, 0);

    return pokemon.HP - damageSum;
  };

  return (
    <Card.Root>
      <Card.Header>
        <Text fontWeight="semibold" textStyle="xl">
          {pokemon.name}
        </Text>
      </Card.Header>
      <Card.Body>
        <Image
          height={{ base: "100px", md: "200px" }}
          width={{ base: "100px", md: "200px" }}
          objectFit="cover"
          src={pokemon.image}
          loading="eager"
        />
      </Card.Body>
      <Card.Footer>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          gap={2}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Text>HP: {calculateHp().toFixed(2)}</Text>

          <DialogRoot placement="center">
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pokemon details</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <List.Root>
                  <List.Item>
                    <Text>Name: {pokemon.name}</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Type: {pokemon.type.join(", ")}</Text>
                  </List.Item>
                  <List.Item>
                    <Text>HP: {pokemon.HP}</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Attack: {pokemon.Attack}</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Defense: {pokemon.Defense}</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Speed: {pokemon.Speed}</Text>
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
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
};
