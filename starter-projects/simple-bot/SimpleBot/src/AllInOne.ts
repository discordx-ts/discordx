import {
  Discord,
  CommandMessage,
  Command,
  Description,
  On,
  ArgsOf,
  Guard,
} from "@typeit/discord";
import { NotBot } from './NotABot';

@Discord("!")
@Description("Example of having everything in one file!")
export abstract class AllInOne {

  @Command("ping")
  @Guard(NotBot)
  ping(command: CommandMessage): void {
    command.reply("pong!");
  }

  @Command("hellothere")
  hello(command: CommandMessage): void {
    command.author.send("General Kenobi!");
  }

  @On("ready")
  initialize(): void {
    console.log("Bot logged in.");
  }

  @On("message")
  recievedMessage([message]: ArgsOf<"message">): void {
    console.log("Got message", message.content);
  }

  @On("messageDelete")
  messageDeleted([message]: ArgsOf<"messageDelete">): void {
    console.log(`${message.id}:${message.content} was deleted.`);
  }

  @On("guildMemberAdd")
  memberJoin([member]: ArgsOf<"guildMemberAdd">): void {
    console.log(`User : ${member.user.username} has joined the Discord Server.`);
  }

  @On("guildCreate")
  guildJoin([guild]: ArgsOf<"guildCreate">): void {
    console.log(`Bot added to the Discord Server : ${guild.name}`);
  }

}
