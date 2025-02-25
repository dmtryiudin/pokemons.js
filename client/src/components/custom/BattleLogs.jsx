import { Flex, Stack, Button } from "@chakra-ui/react";
import React from "react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer.jsx";
import { useState } from "react";

export const BattleLogs = ({ battleData }) => {
  const [open, setOpen] = useState(false);

  const pokemonBotName = battleData.botPokemon.name;
  const pokemonUserName = battleData.userPokemon.name;

  const formatBattleLogs = () => {
    const res = [];

    let turn = battleData.starts;

    const switchTurn = () => {
      switch (turn) {
        case "bot":
          turn = "user";
          break;

        case "user":
          turn = "bot";
          break;
      }
    };

    for (const attack of battleData.attacks) {
      res.push({
        damage: attack.damage,
        name: turn === "user" ? pokemonUserName : pokemonBotName,
        id: attack.id,
      });

      switchTurn();
    }

    return res;
  };

  return (
    <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="outline">Battle logs</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Battle logs</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Stack>
            {formatBattleLogs().map((el, i) => (
              <React.Fragment key={el.id}>
                {i === 0 ? (
                  <Flex>
                    {battleData.starts === "user"
                      ? pokemonUserName
                      : pokemonBotName}{" "}
                    attacks first!
                  </Flex>
                ) : null}
                <Flex>
                  {el.name} attacks! Damage is: {el.damage.toFixed(2)}
                </Flex>
              </React.Fragment>
            ))}
          </Stack>
        </DrawerBody>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};
