import { DApplicationCommand, SimpleCommandMessage } from "..";

export class DefaultPermissionResolver {
  resolver: (
    command?: SimpleCommandMessage | DApplicationCommand
  ) => boolean | Promise<boolean>;
  constructor(
    resolver: (
      guild?: SimpleCommandMessage | DApplicationCommand
    ) => boolean | Promise<boolean>
  ) {
    this.resolver = resolver;
  }
}
