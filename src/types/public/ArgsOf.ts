import { ClientEvents } from "discord.js";

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://oceanroleplay.github.io/discord.ts/docs/general/argsof)
 */
export type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];
