import { IGuild, IPrefix, SimpleCommandMessage } from "../../index.mjs";

export type ArgSplitter =
  | string
  | RegExp
  | ((command: SimpleCommandMessage) => string[]);

export interface SimpleCommandParams {
  aliases?: string[];
  argSplitter?: ArgSplitter;
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  directMessage?: boolean;
  guilds?: IGuild[];
  prefix?: IPrefix;
}
