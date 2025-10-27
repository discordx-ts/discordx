/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Events } from "discord.js";
import { Discord, On } from "discordx";

enum PriorityLevel {
  High,
  Moderate,
  Low,
}

@Discord()
export class Example {
  @On({ event: Events.ClientReady, priority: PriorityLevel.Low })
  onReady(): void {
    console.log(PriorityLevel[PriorityLevel.Low]);
  }

  @On({ event: Events.ClientReady, priority: PriorityLevel.High })
  onReady3(): void {
    console.log(PriorityLevel[PriorityLevel.High]);
  }

  @On({ event: Events.ClientReady, priority: PriorityLevel.Moderate })
  onReady2(): void {
    console.log(PriorityLevel[PriorityLevel.Moderate]);
  }
}
