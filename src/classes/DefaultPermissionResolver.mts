import { ApplicationGuildMixin, SimpleCommandMessage } from "../index.mjs";

export class DefaultPermissionResolver {
  constructor(
    public resolver: (
      command?: SimpleCommandMessage | ApplicationGuildMixin
    ) => boolean | Promise<boolean>
  ) {}
}
