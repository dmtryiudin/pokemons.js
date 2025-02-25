import { createRecipeContext } from "@chakra-ui/react";

const { withContext } = createRecipeContext({ key: "button" });

export const LinkButton = withContext("a");

LinkButton.displayName = "LinkButton";
