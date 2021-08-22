export type SubCommand = {
  [key: string]: string;
};

export const SlashOptionTypes = <const>[
  "STRING",
  "BOOLEAN",
  "INTEGER",
  "NUMBER",
  "CHANNEL",
  "ROLE",
  "USER",
  "MENTIONABLE",
  "SUB_COMMAND",
  "SUB_COMMAND_GROUP",
];

export type SlashOptionType = typeof SlashOptionTypes[number];
