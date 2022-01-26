import type { IGuild } from "../../index.js";

export interface ApplicationCommandParams {
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  guilds?: IGuild[];
}
