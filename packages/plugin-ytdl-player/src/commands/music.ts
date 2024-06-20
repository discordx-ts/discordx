/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { Discord, SlashGroup } from "discordx";

@Discord()
@SlashGroup({ description: "music", name: "music" })
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Command {
  //
}
