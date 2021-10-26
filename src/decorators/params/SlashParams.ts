import { IGuild } from "../..";

export interface ApplicationCommandParams {
  botIds?: string[];
  defaultPermission?: boolean;
  description?: string;
  guilds?: IGuild[];
}
