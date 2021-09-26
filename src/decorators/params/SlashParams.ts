import { IGuild } from "../..";

export interface ApplicationCommandParams {
  description?: string;
  defaultPermission?: boolean;
  guilds?: IGuild[];
  botIds?: string[];
}
