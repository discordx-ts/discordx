import { ApplicationCommand } from "discord.js";
import { DApplicationCommand } from "..";

export class ApplicationCommandMixin {
  command: ApplicationCommand;
  instance: DApplicationCommand;
  constructor(command: ApplicationCommand, instance: DApplicationCommand) {
    this.command = command;
    this.instance = instance;
  }

  get name(): string {
    return this.command.name;
  }

  get description(): string {
    return this.command.description;
  }
}
