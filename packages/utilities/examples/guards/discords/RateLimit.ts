import type {CommandInteraction} from "discord.js";
import {Discord, Guard, SimpleCommand, SimpleCommandMessage, Slash} from "discordx";
import {RateLimit, TIME_UNIT} from "../../../src";

@Discord()
export abstract class RateLimitExample {

    @Slash("rate_limit_1")
    @Guard(RateLimit(TIME_UNIT.seconds, 30))
    rateLimit1(interaction: CommandInteraction): void {
        interaction.reply("It worked!");
    }

    @Slash("rate_limit_2")
    @Guard(RateLimit(TIME_UNIT.seconds, 30, "Please wait 30 seconds!"))
    rateLimit2(interaction: CommandInteraction): void {
        interaction.reply("It worked!");
    }


    @SimpleCommand("rateLimit")
    @Guard(RateLimit(TIME_UNIT.seconds, 10))
    private async rateLimitSimpleCommand({message}: SimpleCommandMessage): Promise<void> {
        message.reply("It worked!");
    }
}