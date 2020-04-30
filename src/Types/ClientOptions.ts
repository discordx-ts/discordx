import { ClientOptions } from "discord.js";

export interface IClientOptions extends ClientOptions {
  silent?: boolean;
}
