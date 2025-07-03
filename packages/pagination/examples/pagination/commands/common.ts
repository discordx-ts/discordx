/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Pagination, PaginationResolver } from "@discordx/pagination";
import type {
  CommandInteraction,
  MessageActionRowComponentBuilder,
} from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On, Slash } from "discordx";

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

  // example: simple slash with button pagination
  @Slash({ description: "Simple slash with button pagination", name: "demo-a" })
  async demoA(interaction: CommandInteraction): Promise<void> {
    const embedX = new PaginationResolver((page, pagination) => {
      if (page === 3) {
        // example to replace pagination with another pagination data
        pagination.currentPage = 0; // reset current page, because this is gonna be first page
        pagination.maxLength = 5; // new max length for new pagination
        pagination.pages = [
          { content: "1" },
          { content: "2" },
          { content: "3" },
          { content: "4" },
          { content: "5" },
        ]; // page reference can be resolver as well

        return (
          pagination.pages[pagination.currentPage] ?? { content: "unknown" }
        ); // the first page, must select ourselves
      }
      return { content: `page v2 ${page}` };
    }, 25);

    const pagination = new Pagination(interaction, embedX, {
      onTimeout: () => {
        void interaction.deleteReply().catch(null);
      },
      buttons: {
        backward: {
          emoji: { name: "🙂" },
        },
      },
      time: 60_000,
      enableExit: true,
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
      Array.from(Array(200).keys()).map((i) => ({
        content: (i + 1).toString(),
      })),
      {
        enableExit: true,
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
