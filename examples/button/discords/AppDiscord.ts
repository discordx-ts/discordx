import {
  ButtonComponent,
  Discord,
  Slash,
  SlashChoice,
  SlashOption,
} from "../../../build/cjs/index.js";
import {
  ButtonInteraction,
  CommandInteraction,
  EmojiIdentifierResolvable,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { randomInt } from "crypto";

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
    return (
      this.propositions.find((proposition) => choice === proposition.choice) ??
      this.propositions[0]
    );
  }

  public static buttonCustomIDToClass(buttonCustomID: string) {
    return (
      this.propositions.find(
        (proposition) => buttonCustomID === proposition.buttonCustomID
      ) ?? this.propositions[0]
    );
  }
}

@Discord()
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
    })
    choice: spcChoice,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (choice) {
      const playerChoice = spcProposition.nameToClass(choice);
      const botChoice = StonePaperScissor.spcPlayBot();
      const result = StonePaperScissor.isWinSpc(playerChoice, botChoice);

      interaction.editReply(
        StonePaperScissor.spcResultProcess(playerChoice, botChoice, result)
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

      interaction.editReply({
        components: [buttonRow],
        content: "Ok let's go. 1v1 Stone Paper Scissor. Go choose!",
      });

      setTimeout(() => interaction.deleteReply(), 6e4);
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
    const result = StonePaperScissor.isWinSpc(playerChoice, botChoice);

    interaction.editReply(
      StonePaperScissor.spcResultProcess(playerChoice, botChoice, result)
    );

    setTimeout(() => {
      try {
        interaction.deleteReply();
      } catch (err) {
        console.error(err);
      }
    }, 3e4);
  }

  private static isWinSpc(
    player: spcProposition,
    bot: spcProposition
  ): spcResult {
    switch (player.choice) {
      case spcChoice.Stone:
        if (bot.choice === spcChoice.Scissor) {
          return spcResult.WIN;
        }

        if (bot.choice === spcChoice.Paper) {
          return spcResult.LOSS;
        }

        return spcResult.DRAW;
      case spcChoice.Paper:
        if (bot.choice === spcChoice.Stone) {
          return spcResult.WIN;
        }

        if (bot.choice === spcChoice.Scissor) {
          return spcResult.LOSS;
        }

        return spcResult.DRAW;
      case spcChoice.Scissor:
        if (bot.choice === spcChoice.Paper) {
          return spcResult.WIN;
        }

        if (bot.choice === spcChoice.Stone) {
          return spcResult.LOSS;
        }

        return spcResult.DRAW;
    }
  }

  private static spcPlayBot(): spcProposition {
    return spcProposition.propositions[randomInt(3)];
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
