import { ApplicationCommand } from "discord.js";
import { DApplicationCommand } from "..";

export class ApplicationCommandMixin {
  constructor(
    public command: ApplicationCommand,
    public instance: DApplicationCommand
  ) {}

  get name(): string {
    return this.command.name;
  }

  get description(): string {
    return this.command.description;
  }
}
