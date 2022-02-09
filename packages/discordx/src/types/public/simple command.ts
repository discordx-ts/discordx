import type { SimpleCommandMessage } from "../../index.js";
import type { IGuild, IPrefix } from "../index.js";

export type ArgSplitter =
  | string
  | RegExp
  | ((command: SimpleCommandMessage) => string[]);

export type SimpleCommandParams = {
  aliases?: string[];
  argSplitter?: ArgSplitter;
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  directMessage?: boolean;
  guilds?: IGuild[];
  prefix?: IPrefix;
};
