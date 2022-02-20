import type { ArgsOf, Client } from "../../../src/index.js";
import { Discord, On } from "../../../src/index.js";

@Discord()
export abstract class AppDiscord {
  @On("messageCreate")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMessage([message]: ArgsOf<"messageCreate">, client: Client): void {
    console.log(message.content);
  }

  @On("messageReactionAdd")
  emoji([reaction, user]: ArgsOf<"messageReactionAdd">): void {
    const member = reaction.message.guild?.members.resolve(user.id);
    if (member) {
      console.log(member.roles.cache.map((r) => r.name));
      // member.roles.add("role-id");
    }
  }
}
