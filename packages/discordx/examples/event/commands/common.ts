import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class Example {
  @On()
  messageCreate([message]: ArgsOf<"messageCreate">): void {
    console.log(message.content);
  }

  @On()
  messageReactionAdd([reaction, user]: ArgsOf<"messageReactionAdd">): void {
    const member = reaction.message.guild?.members.resolve(user.id);
    if (member) {
      console.log(member.roles.cache.map((r) => r.name));
      // member.roles.add("role-id");
    }
  }
}
