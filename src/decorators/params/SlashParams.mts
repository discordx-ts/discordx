import { IGuild } from "../../index.mjs";

export interface ApplicationCommandParams {
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  guilds?: IGuild[];
}
