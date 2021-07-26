export interface CommandParams {
  argSplitter?: string;
  description?: string;
  directMessage?: boolean;
  defaultPermission?: boolean;
  guilds?: string[];
  botIds?: string[];
  aliases?: string[];
}
