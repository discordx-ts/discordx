import { ApplicationGuildMixin, SimpleCommandMessage } from "..";

export class DefaultPermissionResolver {
  resolver: (
    command?: SimpleCommandMessage | ApplicationGuildMixin
  ) => boolean | Promise<boolean>;

  constructor(
    resolver: (
      command?: SimpleCommandMessage | ApplicationGuildMixin
    ) => boolean | Promise<boolean>
  ) {
    this.resolver = resolver;
  }
}
