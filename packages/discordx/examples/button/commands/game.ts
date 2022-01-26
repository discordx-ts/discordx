import { randomInt } from "crypto";
import type {
  ButtonInteraction,
  CommandInteraction,
  EmojiIdentifierResolvable,
} from "discord.js";
import { MessageActionRow, MessageButton } from "discord.js";

import {
  Bot,
  ButtonComponent,
  Discord,
  Slash,
  SlashChoice,
  SlashOption,
} from "../../../src/index.js";

enum spcChoice {
  Paper = "Paper",
  Scissor = "Scissor",
  Stone = "Stone",
}

type spcTypes = "spc-stone" | "spc-paper" | "spc-scissor";

enum spcResult {
  WIN,
  LOSS,
  DRAW,
}

class spcProposition {
  public static propositions = [
    new spcProposition(spcChoice.Stone, "💎", "spc-stone"),
    new spcProposition(spcChoice.Paper, "🧻", "spc-paper"),
    new spcProposition(spcChoice.Scissor, "✂️", "spc-scissor"),
  ];

  public choice: spcChoice;
  public emoji: EmojiIdentifierResolvable;
  public buttonCustomID: spcTypes;

  constructor(
    choice: spcChoice,
    emoji: EmojiIdentifierResolvable,
    buttonCustomID: spcTypes
  ) {
    this.choice = choice;
    this.emoji = emoji;
    this.buttonCustomID = buttonCustomID;
  }

  public static nameToClass(choice: spcChoice) {
    return this.propositions.find(
      (proposition) => choice === proposition.choice
    );
  }

  public static buttonCustomIDToClass(buttonCustomID: string) {
    return this.propositions.find(
      (proposition) => buttonCustomID === proposition.buttonCustomID
    );
  }
}

const defaultChoice = new spcProposition(spcChoice.Stone, "💎", "spc-stone");

@Discord()
@Bot("alexa")
export abstract class StonePaperScissor {
  @Slash("stonepaperscissor", {
    description:
      "What could be more fun than play Rock Paper Scissor with a bot?",
  })
  private async spc(
    @SlashChoice(spcChoice)
    @SlashOption("choice", {
      description:
        "Your choose. If empty, it will send a message with buttons to choose and play instead.",
      required: false,
      type: "STRING",
    })
    choice: spcChoice | undefined,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (choice) {
      const playerChoice = spcProposition.nameToClass(choice);
      const botChoice = StonePaperScissor.spcPlayBot();
      const result = StonePaperScissor.isWinSpc(
        playerChoice ?? defaultChoice,
        botChoice
      );

      interaction.followUp(
        StonePaperScissor.spcResultProcess(
          playerChoice ?? defaultChoice,
          botChoice,
          result
        )
      );
    } else {
      const buttonStone = new MessageButton()
        .setLabel("Stone")
        .setEmoji("💎")
        .setStyle("PRIMARY")
        .setCustomId("spc-stone");

      const buttonPaper = new MessageButton()
        .setLabel("Paper")
        .setEmoji("🧻")
        .setStyle("PRIMARY")
        .setCustomId("spc-paper");

      const buttonScissor = new MessageButton()
        .setLabel("Scissor")
        .setEmoji("✂️")
        .setStyle("PRIMARY")
        .setCustomId("spc-scissor");

      const buttonWell = new MessageButton()
        .setLabel("Well")
        .setEmoji("❓")
        .setStyle("DANGER")
        .setCustomId("spc-well")
        .setDisabled(true);

      const buttonRow = new MessageActionRow().addComponents(
        buttonStone,
        buttonPaper,
        buttonScissor,
        buttonWell
      );

      interaction.followUp({
        components: [buttonRow],
        content: "Ok let's go. 1v1 Stone Paper Scissor. Go choose!",
      });

      setTimeout((inx) => inx.deleteReply(), 10 * 60 * 1000, interaction);
    }
  }

  @ButtonComponent("spc-stone")
  @ButtonComponent("spc-paper")
  @ButtonComponent("spc-scissor")
  private async spcButton(interaction: ButtonInteraction) {
    await interaction.deferReply();

    const playerChoice = spcProposition.buttonCustomIDToClass(
      interaction.customId
    );
    const botChoice = StonePaperScissor.spcPlayBot();
    const result = StonePaperScissor.isWinSpc(
      playerChoice ?? defaultChoice,
      botChoice
    );

    interaction.followUp(
      StonePaperScissor.spcResultProcess(
        playerChoice ?? defaultChoice,
        botChoice,
        result
      )
    );

    setTimeout(
      (inx) => {
        try {
          inx.deleteReply();
        } catch (err) {
          console.error(err);
        }
      },
      30000,
      interaction
    );
  }

  private static isWinSpc(
    player: spcProposition,
    bot: spcProposition
  ): spcResult {
    switch (player.choice) {
      case spcChoice.Stone: {
        if (bot.choice === spcChoice.Scissor) {
          return spcResult.WIN;
        }
        if (bot.choice === spcChoice.Paper) {
          return spcResult.LOSS;
        }
        return spcResult.DRAW;
      }

      case spcChoice.Paper: {
        if (bot.choice === spcChoice.Stone) {
          return spcResult.WIN;
        }
        if (bot.choice === spcChoice.Scissor) {
          return spcResult.LOSS;
        }
        return spcResult.DRAW;
      }

      case spcChoice.Scissor: {
        if (bot.choice === spcChoice.Paper) {
          return spcResult.WIN;
        }
        if (bot.choice === spcChoice.Stone) {
          return spcResult.LOSS;
        }
        return spcResult.DRAW;
      }
    }
  }

  private static spcPlayBot(): spcProposition {
    return spcProposition.propositions[randomInt(3)] ?? defaultChoice;
  }

  private static spcResultProcess(
    playerChoice: spcProposition,
    botChoice: spcProposition,
    result: spcResult
  ) {
    switch (result) {
      case spcResult.WIN:
        return {
          content: `${botChoice.emoji} ${botChoice.choice} ! Well, noob ${playerChoice.emoji} ${playerChoice.choice} need nerf plz...`,
        };
      case spcResult.LOSS:
        return {
          content: `${botChoice.emoji} ${botChoice.choice} ! Okay bye, Easy!`,
        };
      case spcResult.DRAW:
        return {
          content: `${botChoice.emoji} ${botChoice.choice} ! Ha... Draw...`,
        };
    }
  }
}
