/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { ApplicationCommandOptionType } from "discord.js";

import {
  SimpleCommandOptionType,
  type Client,
  type DApplicationCommandOption,
  type DComponent,
  type DSimpleCommandOption,
} from "../../index.js";

export class DebugManager {
  constructor(private client: Client) {}

  printDebug(): void {
    if (!this.client.instance.isBuilt) {
      this.client.logger.error(
        "Build the app before running this method with client.build()",
      );
      return;
    }

    this.printEvents();
    this.printComponents();
    this.printReactions();
    this.printContextMenus();
    this.printApplicationCommands();
    this.printSimpleCommands();

    this.client.logger.log("\n");
  }

  private printEvents(): void {
    this.client.logger.log("client >> Events");
    if (this.client.events.length) {
      this.client.events.forEach((event) => {
        const eventName = event.event;
        const className: string = event.classRef.name;
        const key: string = event.key;
        this.client.logger.log(`>> ${eventName} (${className}.${key})`);
      });
    } else {
      this.client.logger.log("\tNo event detected");
    }
    this.client.logger.log("");
  }

  private printComponents(): void {
    this.printComponentType("buttons", this.client.buttonComponents);
    this.printComponentType("select menu's", this.client.selectMenuComponents);
    this.printComponentType("modals", this.client.modalComponents);
  }

  private printComponentType(
    name: string,
    components: readonly DComponent[],
  ): void {
    this.client.logger.log(`client >> ${name}`);

    if (components.length) {
      components.forEach((component) => {
        const className: string = component.classRef.name;
        const key: string = component.key;
        this.client.logger.log(
          `>> ${component.id.toString()} (${className}.${key})`,
        );
      });
    } else {
      this.client.logger.log(`\tNo ${name.slice(0, -1)} detected`);
    }
    this.client.logger.log("");
  }

  private printReactions(): void {
    this.client.logger.log("client >> reactions");

    if (this.client.reactions.length) {
      this.client.reactions.forEach((reaction) => {
        const className: string = reaction.classRef.name;
        const key: string = reaction.key;
        this.client.logger.log(`>> ${reaction.emoji} (${className}.${key})`);
      });
    } else {
      this.client.logger.log("\tNo reaction detected");
    }
    this.client.logger.log("");
  }

  private printContextMenus(): void {
    this.client.logger.log("client >> context menu's");

    const contexts = [
      ...this.client.applicationCommandUsers,
      ...this.client.applicationCommandMessages,
    ];

    if (contexts.length) {
      contexts.forEach((menu) => {
        const type = menu.type.toString();
        const className: string = menu.classRef.name;
        const key: string = menu.key;
        this.client.logger.log(
          `>> ${menu.name} (${type}) (${className}.${key})`,
        );
      });
    } else {
      this.client.logger.log("\tNo context menu detected");
    }
    this.client.logger.log("");
  }

  private printApplicationCommands(): void {
    this.client.logger.log("client >> application commands");
    if (this.client.applicationCommands.length) {
      this.client.applicationCommands.forEach((command, index) => {
        if (
          command.botIds.length &&
          !command.botIds.includes(this.client.botId)
        ) {
          return;
        }

        const line = index !== 0 ? "\n" : "";
        const className: string = command.classRef.name;
        const key: string = command.key;
        this.client.logger.log(
          `${line}\t>> ${command.name} (${className}.${key})`,
        );

        this.printOptions(command.options, 2);
      });
    } else {
      this.client.logger.log("\tNo application command detected");
    }
    this.client.logger.log("");
  }

  private printOptions(
    options: DApplicationCommandOption[],
    depth: number,
  ): void {
    const tab = Array(depth).join("\t\t");

    options.forEach((option, optionIndex) => {
      const className: string = option.classRef.name;
      const key: string = option.key;

      this.client.logger.log(
        `${
          (option.type === ApplicationCommandOptionType.Subcommand ||
            option.type === ApplicationCommandOptionType.SubcommandGroup) &&
          optionIndex !== 0
            ? "\n"
            : ""
        }${tab}>> ${option.name}: ${ApplicationCommandOptionType[option.type].toLowerCase()} (${
          className
        }.${key})`,
      );
      this.printOptions(option.options, depth + 1);
    });
  }

  private printSimpleCommands(): void {
    this.client.logger.log("client >> simple commands");
    if (this.client.simpleCommands.length) {
      this.client.simpleCommands.forEach((cmd) => {
        const className: string = cmd.classRef.name;
        const key: string = cmd.key;
        this.client.logger.log(`\t>> ${cmd.name} (${className}.${key})`);
        if (cmd.aliases.length) {
          this.client.logger.log(`\t\taliases:`, cmd.aliases.join(", "));
        }

        this.printSimpleOptions(cmd.options, 2);
        this.client.logger.log("");
      });
    } else {
      this.client.logger.log("\tNo simple command detected");
    }
  }

  private printSimpleOptions(
    options: DSimpleCommandOption[],
    depth: number,
  ): void {
    const tab = Array(depth).join("\t\t");
    options.forEach((option) => {
      const type = SimpleCommandOptionType[option.type];
      const className: string = option.classRef.name;
      const key: string = option.key;
      this.client.logger.log(
        `${tab}${option.name}: ${type} (${className}.${key})`,
      );
    });
  }
}
