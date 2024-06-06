/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { ApplicationCommandOptionType } from "discord.js";

export class FakeOption {
  name: string;
  type: ApplicationCommandOptionType;
  options: FakeOption[] | undefined;
  value: string | number;

  constructor(
    name: string,
    type: ApplicationCommandOptionType,
    value: string | number,
    options?: FakeOption[],
  ) {
    this.type = type;
    this.name = name;
    this.options = options ?? undefined;
    this.value = value;
  }
}

export class SlashOptionResolver {
  data: FakeOption[];

  constructor(options: FakeOption[]) {
    this.data = options;
  }

  getLastNestedOption(options: readonly FakeOption[]): readonly FakeOption[] {
    const arrOptions = options;

    if (!arrOptions?.[0]?.options) {
      return arrOptions;
    }

    return this.getLastNestedOption(arrOptions?.[0].options);
  }

  get(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getString(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getBoolean(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getNumber(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getInteger(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getRole(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getChannel(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getMentionable(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getMember(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }

  getUser(name: string) {
    const options = this.getLastNestedOption(this.data);
    return options.find((op) => op.name === name)?.value;
  }
}

export enum InteractionType {
  AutoComplete,
  Button,
  Command,
  ContextMenu,
  SelectMenu,
  Modal,
}

export interface FakeInteractionOption {
  commandName?: string;
  customId?: string;
  guildId?: string;
  options?: FakeOption[];
  type: InteractionType;
}

export class FakeInteraction {
  commandName?: string;
  customId?: string;
  options: SlashOptionResolver;
  type: InteractionType;
  guildId?: string;

  constructor(options: FakeInteractionOption) {
    this.commandName = options.commandName;
    this.customId = options.customId;
    this.guildId = options.guildId;
    this.options = new SlashOptionResolver(options.options ?? []);
    this.type = options.type;
  }

  isCommand() {
    return this.type === InteractionType.Command;
  }

  isButton() {
    return this.type === InteractionType.Button;
  }

  isContextMenuCommand() {
    return this.type === InteractionType.ContextMenu;
  }

  isAnySelectMenu() {
    return this.type === InteractionType.SelectMenu;
  }

  isAutocomplete() {
    return this.type === InteractionType.AutoComplete;
  }

  isModalSubmit() {
    return this.type === InteractionType.Modal;
  }
}
