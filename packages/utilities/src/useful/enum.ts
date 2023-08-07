import type { SlashChoiceType } from "discordx";

export function EnumChoice(
  choices: Record<string, string>,
): SlashChoiceType<string, string>[] {
  return Object.keys(choices).map((key) => ({
    name: key,
    value: choices[key],
  }));
}
