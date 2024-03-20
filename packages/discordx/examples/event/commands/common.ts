/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
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
