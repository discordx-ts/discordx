/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { IsGuildUser } from "../IsGuildUser/index.js";

/**
 * Guard to prevent bot from executing discordx methods
 */
export const DevOnly = IsGuildUser(({ user, client }) => {
  if (!user) {
    return false;
  }

  if (client.devs.length === 0) {
    throw new TypeError("Cannot use DevOnly guard, client devs array is empty");
  }

  return client.devs.includes(user.id);
});
