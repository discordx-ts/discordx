import { ApplicationGuildMixin, SimpleCommandMessage } from "..";

export class DefaultPermissionResolver {
  constructor(
    public resolver: (
      command?: SimpleCommandMessage | ApplicationGuildMixin
    ) => boolean | Promise<boolean>
  ) {}
}
