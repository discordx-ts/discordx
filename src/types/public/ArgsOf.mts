import { ClientEvents } from "discord.js";

/**
 * Type the arguments of an event
 * ___
 * [View Documentation](https://discord-ts.mjs.org/docs/general/argsof)
 */
export type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];
