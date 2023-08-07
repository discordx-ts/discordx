import { SpecialCharactersList } from "../types/index.js";

/**
 * Slash name validator
 * @param name - name
 * @returns
 */
export function SlashNameValidator(name: string): true {
  const isNotValid =
    name.length === 0 ||
    name.length > 32 ||
    name.toLowerCase() !== name ||
    SpecialCharactersList.some((c) => name.includes(c));

  if (isNotValid) {
    throw Error(
      `Invalid slash name: ${name}\nName must only be lowercase with no space as per Discord guidelines (https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-naming)\n`,
    );
  }

  return true;
}
