import type { ApplicationGuildMixin, SimpleCommandMessage } from "../index.js";

export class DefaultPermissionResolver {
  constructor(
    public resolver: (
      command?: SimpleCommandMessage | ApplicationGuildMixin
    ) => boolean | Promise<boolean>
  ) {}
}
