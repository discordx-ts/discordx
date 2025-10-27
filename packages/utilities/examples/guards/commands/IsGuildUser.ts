/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { IsGuildUser, type IsGuardUserCallback } from "@discordx/utilities";
import { Events } from "discord.js";
import {
  Discord,
  Guard,
  On,
  SimpleCommand,
  type ArgsOf,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message([message]: ArgsOf<Events.MessageCreate>) {
    //...
  }

  @SimpleCommand({ name: "wave" })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wave(command: SimpleCommandMessage) {
    //...
  }
}
