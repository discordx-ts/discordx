/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { IsGuardUserCallback, IsGuildUser } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  ArgsOf,
  Discord,
  Guard,
  On,
  SimpleCommand,
  SimpleCommandMessage,
} from "discordx";

const OwnerOnly: IsGuardUserCallback = ({ client, user }) => {
  if (!user) {
    return false;
  }

  return client.application?.owner?.id === user.id;
};

@Discord()
@Guard(IsGuildUser(OwnerOnly))
export class Example {
  @On({ event: Events.MessageCreate })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message([message]: ArgsOf<"messageCreate">) {
    //...
  }

  @SimpleCommand({ name: "hello" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hello(command: SimpleCommandMessage) {
    //...
  }
}
