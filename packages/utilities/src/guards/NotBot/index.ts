/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { IsGuildUser } from "../IsGuildUser/index.js";

/**
 * Guard to prevent bot from executing discordx methods
 */
export const NotBot = IsGuildUser(({ user }) => !user?.bot);
