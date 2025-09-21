/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Pagination, PaginationResolver } from "@discordx/pagination";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type CommandInteraction,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import { Discord, On, Slash, type ArgsOf } from "discordx";

import { GeneratePages } from "../util/common.js";

@Discord()
export class Example {
  // example: message
  @On({ event: "messageCreate" })
  async messageCreate([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated demo") {
      const pagination = new Pagination(message, GeneratePages());
      await pagination.send();
    }
  }

  // example: any text channel
  @On({ event: "messageCreate" })
  async messageCreateChannel([
    message,
  ]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.content === "paginated channel demo") {
      const pagination = new Pagination(message.channel, GeneratePages());
      await pagination.send();
    }
  }

  // Example: simple slash with button pagination
  @Slash({ description: "Simple slash with button pagination", name: "demo-a" })
  async demoA(interaction: CommandInteraction): Promise<void> {
    const resolver = new PaginationResolver((page, paginator) => {
      // Let's update our pagination dynamically
      if (page === 3) {
        // Set current page to first
        paginator.setCurrentPage(0);

        // Set pages, this can can be resolver as well
        paginator.setPages([
          { content: "1" },
          { content: "2" },
          { content: "3" },
          { content: "4" },
          { content: "5" },
        ]);

        return { content: "Pagination updated" };
      }

      return { content: `page v2 ${String(page + 1)}` };
    }, 25);

    const pagination = new Pagination(interaction, resolver, {
      onTimeout: () => {
        interaction.deleteReply().catch(() => null);
      },
      buttons: {
        backward: {
          emoji: { name: "🙂" },
        },
      },
      time: 60_000,
    });

    await pagination.send();
  }

  // example: simple slash with menu pagination
  @Slash({ description: "Simple slash with menu pagination", name: "demo-b" })
  async demoB(interaction: CommandInteraction): Promise<void> {
    const pagination = new Pagination(interaction, GeneratePages(), {
      time: 60_000,
    });

    await pagination.send();
  }

  // example: simple string array
  @Slash({ description: "Simple string array", name: "demo-c" })
  async demoC(interaction: CommandInteraction): Promise<void> {
    const pagination = new Pagination(
      interaction,
      Array.from(Array(1).keys()).map((i) => ({
        content: (i + 1).toString(),
      })),
      {
        debug: true,
        itemsPerPage: 10,
        buttons: {
          skipAmount: 50,
        },
      },
    );

    await pagination.send();
  }

  // example: array of custom message options
  @Slash({ description: "Array of custom message options", name: "demo-d" })
  async demoD(interaction: CommandInteraction): Promise<void> {
    const pagination = new Pagination(interaction, [
      {
        content: "Page 1",
      },
      {
        content: "Page 2",
        embeds: [new EmbedBuilder({ title: "It's me embed 2" })],
      },
      {
        components: [
          new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            [
              new ButtonBuilder({
                customId: "myCustomId",
                label: "My Custom Button",
                style: ButtonStyle.Primary,
              }),
            ],
          ),
        ],
        content: "Page 3",
        embeds: [new EmbedBuilder({ title: "It's me embed 3" })],
      },
    ]);

    await pagination.send();
  }
}
