import {
  CommandInteraction,
  MessageButton,
  MessageActionRow,
  ButtonInteraction,
  EmojiIdentifierResolvable,
} from "discord.js";
import {
  Discord,
  Slash,
  Button,
  Option,
  Description,
  Choices,
} from "../../../src";
import { randomInt } from "crypto";

enum spcChoice {
  Stone = "Stone",
  Paper = "Paper",
  Scissor = "Scissor",
}

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
  public buttonCustomID: "spc-stone" | "spc-paper" | "spc-scissor";

  constructor(
    choice: spcChoice,
    emoji: EmojiIdentifierResolvable,
    buttonCustomID: "spc-stone" | "spc-paper" | "spc-scissor"
  ) {
    this.choice = choice;
    this.emoji = emoji;
    this.buttonCustomID = buttonCustomID;
  }

  public static nameToClass(choice: string) {
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

@Discord()
export abstract class StonePaperScissor {
  @Slash("stonepaperscissor")
  @Description(
    "What could be more fun than play Rock Paper Scissor with a bot?"
  )
  private async spc(
    @Choices(spcChoice)
    @Option("Choice", {
      description:
        "Your choose. If empty, it will send a message with buttons to choose and play instead.",
      required: false,
    })
    choice: spcChoice,
    interaction: CommandInteraction
  ) {
    await interaction.defer();

    if (choice) {
      const playerChoice = spcProposition.nameToClass(choice);
      const botChoice = StonePaperScissor.spcPlayBot();
      const result = StonePaperScissor.isWinPfc(playerChoice, botChoice);

      interaction.editReply(
        StonePaperScissor.spcResultProcess(
          playerChoice,
          botChoise,
          result
        )
      );
    } else {
      const buttonStone = new MessageButton()
        .setLabel("Stone")
        .setEmoji("💎")
        .setStyle("PRIMARY")
        .setCustomID("spc-stone");

      const buttonPaper = new MessageButton()
        .setLabel("Paper")
        .setEmoji("🧻")
        .setStyle("PRIMARY")
        .setCustomID("spc-paper");

      const buttonScissor = new MessageButton()
        .setLabel("Scissor")
        .setEmoji("✂️")
        .setStyle("PRIMARY")
        .setCustomID("spc-scissor");

      const buttonWell = new MessageButton()
        .setLabel("Well")
        .setEmoji("❓")
        .setStyle("DANGER")
        .setCustomID("spc-well")
        .setDisabled(true);

      const buttonRow = new MessageActionRow().addComponents(
        buttonStone,
        buttonPaper,
        buttonScissor,
        buttonWell
      );

      interaction.editReply({
        content: "Ok let's go. 1v1 Stone Paper Scissor. Go choose!",
        components: [buttonRow],
      });

      setTimeout(
        (interaction) => interaction.deleteReply(),
        10 * 60 * 1000,
        interaction
      );
    }
  }

  @Button("spc-stone")
  @Button("spc-paper")
  @Button("spc-scissor")
  private async spcButton(interaction: ButtonInteraction) {
    await interaction.defer();

    const playerChoice = spcProposition.buttonCustomIDToClass(interaction.customID);
    const botChoice = StonePaperScissor.spcPlayBot();
    const result = StonePaperScissor.isWinSpc(playerChoice, botChoice);

    interaction.editReply(
      StonePaperScissor.spcResultProcess(playerChoice, botChoice, result)
    );

    setTimeout(
      (interaction) => {
        try {
          interaction.deleteReply();
        } catch (err) {
          console.error(err);
        }
      },
      30000,
      interaction
    );
  }

  private static isWinPfc(
    player: spcProposition,
    bot: spcProposition
  ): spcResult {
    switch (player.choice) {
      case spcChoice.Stone:
        if (bot.choice === spcChoice.Scissor) return spcResult.WIN;
        if (bot.choice === spcChoice.Paper) return spcResult.LOSS;
        return spcResult.DRAW;
      case spcChoice.Paper:
        if (bot.choice === spcChoice.Stone) return spcResult.WIN;
        if (bot.choice === spcChoice.Scissor) return spcResult.LOSS;
        return spcResult.DRAW;
      case spcChoice.Scissor:
        if (bot.choice === spcChoice.Paper) return spcResult.WIN;
        if (bot.choice === spcChoice.Stone) return spcResult.LOSS;
        return spcResult.DRAW;
    }
  }

  private static spcPlayBot(): spcProposition {
    return spcProposition.propositions[randomInt(3)];
  }

  private static spcResultProcess(
    choice: spcProposition,
    BotChoice: spcProposition,
    resultat: spcResult
  ) {
    switch (resultat) {
      case spcResult.WIN:
        return {
          content: `${BotChoice.emoji} ${BotChoice.choice} ! Well, noob ${choice.emoji} ${choice.choice} need nerf plz...`,
        };
      case spcResult.LOSS:
        return {
          content: `${BotChoice.emoji} ${BotChoice.choice} ! Okay bye, Easy!`,
        };
      case spcResult.DRAW:
        return {
          content: `${BotChoice.emoji} ${BotChoice.choice} ! Ha... Draw...`,
        };
    }
  }
}
