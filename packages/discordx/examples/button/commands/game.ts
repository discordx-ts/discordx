import { randomInt } from "crypto";
import type {
  ButtonInteraction,
  CommandInteraction,
  EmojiIdentifierResolvable,
} from "discord.js";
import {
  ActionRow,
  ApplicationCommandOptionType,
  ButtonComponent,
  ButtonStyle,
} from "discord.js";

import {
  Button,
  Discord,
  Slash,
  SlashChoice,
  SlashOption,
} from "../../../src/index.js";

enum RPSChoice {
  Rock,
  Paper,
  Scissors,
}

type RPSButtonIdType = `RPS-${RPSChoice}`;

enum RPSResult {
  WIN,
  LOSS,
  DRAW,
}

class RPSProposition {
  public static propositions = [
    new RPSProposition(RPSChoice.Rock, "💎", `RPS-${RPSChoice.Rock}`),
    new RPSProposition(RPSChoice.Paper, "🧻", `RPS-${RPSChoice.Paper}`),
    new RPSProposition(RPSChoice.Scissors, "✂️", `RPS-${RPSChoice.Scissors}`),
  ];

  public choice: RPSChoice;
  public emoji: EmojiIdentifierResolvable;
  public buttonCustomID: RPSButtonIdType;

  constructor(
    choice: RPSChoice,
    emoji: EmojiIdentifierResolvable,
    buttonCustomID: RPSButtonIdType
  ) {
    this.choice = choice;
    this.emoji = emoji;
    this.buttonCustomID = buttonCustomID;
  }

  public static nameToClass(choice: RPSChoice) {
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

const defaultChoice = new RPSProposition(
  RPSChoice.Rock,
  "💎",
  `RPS-${RPSChoice.Rock}`
);

@Discord()
export abstract class RockPaperScissors {
  @Slash("rock-paper-scissors", {
    description:
      "What could be more fun than play Rock Paper Scissors with a bot?",
  })
  private async RPS(
    @SlashChoice(RPSChoice.Paper)
    @SlashChoice(RPSChoice.Rock)
    @SlashChoice(RPSChoice.Scissors)
    @SlashOption("choice", {
      description:
        "Your choose. If empty, it will send a message with buttons to choose and play instead.",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    choice: RPSChoice | undefined,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (choice) {
      const playerChoice = RPSProposition.nameToClass(choice);
      const botChoice = RockPaperScissors.RPSPlayBot();
      const result = RockPaperScissors.isWinRPS(
        playerChoice ?? defaultChoice,
        botChoice
      );

      interaction.followUp(
        RockPaperScissors.RPSResultProcess(
          playerChoice ?? defaultChoice,
          botChoice,
          result
        )
      );
    } else {
      const buttonRock = new ButtonComponent()
        .setLabel("Rock")
        .setEmoji({ name: "💎" })
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`RPS-${RPSChoice.Rock}`);

      const buttonPaper = new ButtonComponent()
        .setLabel("Paper")
        .setEmoji({ name: "🧻" })
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`RPS-${RPSChoice.Paper}`);

      const buttonScissor = new ButtonComponent()
        .setLabel("Scissor")
        .setEmoji({ name: "✂️" })
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`RPS-${RPSChoice.Scissors}`);

      const buttonRow = new ActionRow().addComponents(
        buttonRock,
        buttonPaper,
        buttonScissor
      );

      interaction.followUp({
        components: [buttonRow],
        content: "Ok let's go. 1v1 Rock Paper Scissors. Go choose!",
      });

      setTimeout((inx) => inx.deleteReply(), 10 * 60 * 1000, interaction);
    }
  }

  @Button(`RPS-${RPSChoice.Rock}`)
  @Button(`RPS-${RPSChoice.Paper}`)
  @Button(`RPS-${RPSChoice.Scissors}`)
  private async RPSButton(interaction: ButtonInteraction) {
    await interaction.deferReply();

    const playerChoice = RPSProposition.buttonCustomIDToClass(
      interaction.customId
    );
    const botChoice = RockPaperScissors.RPSPlayBot();
    const result = RockPaperScissors.isWinRPS(
      playerChoice ?? defaultChoice,
      botChoice
    );

    interaction.followUp(
      RockPaperScissors.RPSResultProcess(
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

  private static isWinRPS(
    player: RPSProposition,
    bot: RPSProposition
  ): RPSResult {
    switch (player.choice) {
      case RPSChoice.Rock: {
        if (bot.choice === RPSChoice.Scissors) {
          return RPSResult.WIN;
        }
        if (bot.choice === RPSChoice.Paper) {
          return RPSResult.LOSS;
        }
        return RPSResult.DRAW;
      }

      case RPSChoice.Paper: {
        if (bot.choice === RPSChoice.Rock) {
          return RPSResult.WIN;
        }
        if (bot.choice === RPSChoice.Scissors) {
          return RPSResult.LOSS;
        }
        return RPSResult.DRAW;
      }

      case RPSChoice.Scissors: {
        if (bot.choice === RPSChoice.Paper) {
          return RPSResult.WIN;
        }
        if (bot.choice === RPSChoice.Rock) {
          return RPSResult.LOSS;
        }
        return RPSResult.DRAW;
      }
    }
  }

  private static RPSPlayBot(): RPSProposition {
    return RPSProposition.propositions[randomInt(3)] ?? defaultChoice;
  }

  private static RPSResultProcess(
    playerChoice: RPSProposition,
    botChoice: RPSProposition,
    result: RPSResult
  ) {
    switch (result) {
      case RPSResult.WIN:
        return {
          content: `${botChoice.emoji} ${botChoice.choice} ! Well, noob ${playerChoice.emoji} ${playerChoice.choice} need nerf plz...`,
        };
      case RPSResult.LOSS:
        return {
          content: `${botChoice.emoji} ${botChoice.choice} ! Okay bye, Easy!`,
        };
      case RPSResult.DRAW:
        return {
          content: `${botChoice.emoji} ${botChoice.choice} ! Ha... Draw...`,
        };
    }
  }
}
