import { IGuild, SimpleCommandMessage } from "../..";

export type ArgSplitter =
  | string
  | RegExp
  | ((command: SimpleCommandMessage) => string[]);

export interface SimpleCommandParams {
  argSplitter?: ArgSplitter;
  description?: string;
  directMessage?: boolean;
  defaultPermission?: boolean;
  guilds?: IGuild[];
  botIds?: string[];
  aliases?: string[];
}
