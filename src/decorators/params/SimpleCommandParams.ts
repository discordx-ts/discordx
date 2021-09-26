import { IGuild } from "../..";

export interface SimpleCommandParams {
  argSplitter?: string | RegExp;
  description?: string;
  directMessage?: boolean;
  defaultPermission?: boolean;
  guilds?: IGuild[];
  botIds?: string[];
  aliases?: string[];
}
