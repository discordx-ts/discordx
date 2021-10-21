import { Guild } from "discord.js";

export class DefaultPermissionResolver {
  resolver: (guild?: Guild) => boolean | Promise<boolean>;
  constructor(resolver: (guild?: Guild) => boolean | Promise<boolean>) {
    this.resolver = resolver;
  }
}
