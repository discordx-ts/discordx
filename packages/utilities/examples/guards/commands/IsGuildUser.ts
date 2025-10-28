/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { type IsGuardUserCallback, IsGuildUser } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  type ArgsOf,
  Discord,
  Guard,
  On,
  SimpleCommand,
  type SimpleCommandMessage,
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
  message([_message]: ArgsOf<Events.MessageCreate>) {
    //...
  }

  @SimpleCommand({ name: "wave" })
  wave(_command: SimpleCommandMessage) {
    //...
  }
}
