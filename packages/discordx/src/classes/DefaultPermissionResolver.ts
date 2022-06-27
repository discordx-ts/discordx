import type { SimpleCommandMessage } from "../index.js";

export class DefaultPermissionResolver {
  constructor(
    public resolver: (
      command?: SimpleCommandMessage
    ) => boolean | Promise<boolean>
  ) {
    // empty constructor
  }
}
