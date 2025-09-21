/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { DIService } from "@discordx/di";
import { Modifier, type Decorator } from "@discordx/internal";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import findIndex from "lodash/findIndex.js";

import type { Method } from "../../decorators/classes/Method.js";
import {
  ComponentType,
  DApplicationCommand,
  DApplicationCommandOption,
  DComponent,
  DOn,
  DReaction,
  DSimpleCommand,
  EventManager,
  toStringArray,
  type DApplicationCommandGroup,
  type DDiscord,
  type DGuard,
  type DSimpleCommandOption,
  type ISimpleCommandByName,
} from "../../index.js";

/**
 * @category Internal
 */
export class MetadataStorage {
  // internal
  private static _isBuilt = false;
  private static _instance: MetadataStorage | undefined;

  private _discords: DDiscord[] = [];
  private _guards: DGuard[] = [];
  private _modifiers: Modifier[] = [];

  // events
  private _events: DOn[] = [];

  private _eventManager = new EventManager();

  // custom Handlers
  private _buttonComponents: DComponent[] = [];
  private _modalComponents: DComponent[] = [];
  private _selectMenuComponents: DComponent[] = [];

  // reactions
  private _reactions: DReaction[] = [];

  // simple command
  private _simpleCommandOptions: DSimpleCommandOption[] = [];
  private _simpleCommands: DSimpleCommand[] = [];
  private _simpleCommandsByName: ISimpleCommandByName[] = [];
  private _simpleCommandMappedPrefix = new Set<string>();

  // discord commands
  private _applicationCommandMessages: DApplicationCommand[] = [];
  private _applicationCommandSlashes: DApplicationCommand[] = [];
  private _applicationCommandSlashesFlat: DApplicationCommand[] = [];
  private _applicationCommandSlashOptions: DApplicationCommandOption[] = [];
  private _applicationCommandUsers: DApplicationCommand[] = [];

  // groups
  private _applicationCommandSlashGroups: DApplicationCommandGroup<
    Partial<DApplicationCommand>
  >[] = [];
  private _applicationCommandSlashSubGroups: DApplicationCommandGroup<
    Partial<DApplicationCommandOption>
  >[] = [];

  // static getters

  static clear(): void {
    this._isBuilt = false;
    this._instance = new MetadataStorage();
  }

  static get isBuilt(): boolean {
    return this._isBuilt;
  }

  static get instance(): MetadataStorage {
    this._instance ??= new MetadataStorage();
    return this._instance;
  }
  static set instance(value: MetadataStorage) {
    this._instance = value;
  }

  // getters

  get applicationCommandSlashes(): readonly DApplicationCommand[] {
    return this._applicationCommandSlashes;
  }

  get applicationCommandSlashesFlat(): readonly DApplicationCommand[] {
    return this._applicationCommandSlashesFlat;
  }

  get applicationCommandSlashOptions(): readonly DApplicationCommandOption[] {
    return this._applicationCommandSlashOptions;
  }

  get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[] {
    return this._applicationCommandSlashGroups;
  }

  get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[] {
    return this._applicationCommandSlashSubGroups;
  }

  get applicationCommandUsers(): readonly DApplicationCommand[] {
    return this._applicationCommandUsers;
  }

  get applicationCommandMessages(): readonly DApplicationCommand[] {
    return this._applicationCommandMessages;
  }

  get applicationCommands(): readonly DApplicationCommand[] {
    return [
      ...this.applicationCommandSlashes,
      ...this.applicationCommandMessages,
      ...this.applicationCommandUsers,
    ];
  }

  get buttonComponents(): readonly DComponent[] {
    return this._buttonComponents;
  }

  get discords(): readonly DDiscord[] {
    return this._discords;
  }

  private get discordMembers(): readonly Method[] {
    return [
      ...this._applicationCommandSlashes,
      ...this._applicationCommandUsers,
      ...this._applicationCommandMessages,
      ...this._reactions,
      ...this._simpleCommands,
      ...this._events,
      ...this._buttonComponents,
      ...this._modalComponents,
      ...this._selectMenuComponents,
    ];
  }

  get events(): readonly DOn[] {
    return this._events;
  }

  get eventManager(): EventManager {
    return this._eventManager;
  }

  get isBuilt(): boolean {
    return MetadataStorage._isBuilt;
  }

  get modalComponents(): readonly DComponent[] {
    return this._modalComponents;
  }

  get reactions(): readonly DReaction[] {
    return this._reactions;
  }

  get selectMenuComponents(): readonly DComponent[] {
    return this._selectMenuComponents;
  }

  get simpleCommandsByName(): readonly ISimpleCommandByName[] {
    return this._simpleCommandsByName;
  }

  get simpleCommandMappedPrefix(): readonly string[] {
    return Array.from(this._simpleCommandMappedPrefix);
  }

  get simpleCommands(): readonly DSimpleCommand[] {
    return this._simpleCommands;
  }

  /**
   * Get the list of used events without duplications
   */
  get usedEvents(): readonly DOn[] {
    return this.events.reduce<DOn[]>((prev, event, index) => {
      const found = this.events.find((event2) => event.event === event2.event);
      const foundIndex = found ? this.events.indexOf(found) : -1;

      if (foundIndex === index || found?.once !== event.once) {
        prev.push(event);
      }

      return prev;
    }, []);
  }

  addApplicationCommandSlash(slash: DApplicationCommand): void {
    this._applicationCommandSlashes.push(slash);
  }

  addApplicationCommandUser(slash: DApplicationCommand): void {
    this._applicationCommandUsers.push(slash);
  }

  addApplicationCommandMessage(slash: DApplicationCommand): void {
    this._applicationCommandMessages.push(slash);
  }

  addApplicationCommandSlashOption(option: DApplicationCommandOption): void {
    this._applicationCommandSlashOptions.push(option);
  }

  addApplicationCommandSlashGroups(
    group: DApplicationCommandGroup<Partial<DApplicationCommand>>,
  ): void {
    this._applicationCommandSlashGroups.push(group);
  }

  addApplicationCommandSlashSubGroups(
    subGroup: DApplicationCommandGroup<Partial<DApplicationCommandOption>>,
  ): void {
    this._applicationCommandSlashSubGroups.push(subGroup);
  }

  addComponentButton(button: DComponent): void {
    this._buttonComponents.push(button);
  }

  addComponentModal(selectMenu: DComponent): void {
    this._modalComponents.push(selectMenu);
  }

  addComponentSelectMenu(selectMenu: DComponent): void {
    this._selectMenuComponents.push(selectMenu);
  }

  addDiscord(discord: DDiscord): void {
    this._discords.push(discord);
    DIService.engine.addService(discord.classRef);
  }

  addGuard(guard: DGuard): void {
    this._guards.push(guard);
    DIService.engine.addService(guard.classRef);
  }

  addModifier<T extends Decorator = Decorator>(modifier: Modifier<T>): void {
    this._modifiers.push(modifier);
  }

  addOn(on: DOn): void {
    this._events.push(on);
    this._eventManager.add(on);
  }

  addReaction(reaction: DReaction): void {
    this._reactions.push(reaction);
  }

  addSimpleCommand(cmd: DSimpleCommand): void {
    this._simpleCommands.push(cmd);
  }

  addSimpleCommandOption(cmdOption: DSimpleCommandOption): void {
    this._simpleCommandOptions.push(cmdOption);
  }

  async build(): Promise<void> {
    // build the instance if not already built
    if (MetadataStorage.isBuilt) {
      return;
    }

    MetadataStorage._isBuilt = true;

    // Link the events with @Discord class instances
    this.discordMembers.forEach((member) => {
      // Find the linked @Discord of an event
      const discord = this._discords.find((instance) => {
        return instance.from === member.from;
      });

      if (!discord) {
        throw Error(
          `Did you forget to use the @discord decorator on your class: ${String(member.from.name)}\n` +
            "read more at https://discordx.js.org/docs/discordx/decorators/general/discord\n\n",
        );
      }

      // You can get the @Discord that wrap a @SimpleCommand/@On by using
      // on.discord or slash.discord
      member.discord = discord;

      if (member instanceof DApplicationCommand) {
        discord.applicationCommands.push(member);
      }

      if (member instanceof DSimpleCommand) {
        discord.simpleCommands.push(member);
      }

      if (member instanceof DReaction) {
        discord.reactions.push(member);
      }

      if (member instanceof DOn) {
        discord.events.push(member);
      }

      if (member instanceof DComponent) {
        if (member.type === ComponentType.Button) {
          discord.buttons.push(member);
        } else if (member.type === ComponentType.SelectMenu) {
          discord.selectMenus.push(member);
        }
      }
    });

    await Modifier.modify(this._modifiers, this._discords);
    await Modifier.modify(this._modifiers, this._events);
    await Modifier.modify(this._modifiers, this._applicationCommandSlashes);
    await Modifier.modify(
      this._modifiers,
      this._applicationCommandSlashOptions,
    );
    await Modifier.modify(this._modifiers, this._applicationCommandMessages);
    await Modifier.modify(this._modifiers, this._applicationCommandUsers);
    await Modifier.modify(this._modifiers, this._simpleCommands);
    await Modifier.modify(this._modifiers, this._simpleCommandOptions);
    await Modifier.modify(this._modifiers, this._buttonComponents);
    await Modifier.modify(this._modifiers, this._modalComponents);
    await Modifier.modify(this._modifiers, this._reactions);
    await Modifier.modify(this._modifiers, this._selectMenuComponents);

    this._applicationCommandSlashesFlat = this._applicationCommandSlashes;
    this._applicationCommandSlashes = this.groupSlashes();

    this.buildSimpleCommands();
  }

  private buildSimpleCommands(): void {
    this._simpleCommands.forEach((cmd) => {
      /**
       * Save the customized prefix within the mapped prefix set.
       */
      if (cmd.prefix) {
        toStringArray(cmd.prefix).forEach((pfx) =>
          this._simpleCommandMappedPrefix.add(pfx),
        );
      }

      /**
       * Trigger an error if the command is already registered for this name.
       */
      if (findIndex(this._simpleCommandsByName, { name: cmd.name }) !== -1) {
        throw Error(`Duplicate simple command name: ${cmd.name}`);
      }

      /**
       * Store command by name
       */
      this._simpleCommandsByName.push({ command: cmd, name: cmd.name });

      /**
       * Store command by alias
       */
      cmd.aliases.forEach((alias) => {
        if (findIndex(this._simpleCommandsByName, { name: alias }) !== -1) {
          throw Error(`Duplicate simple command name: ${alias}`);
        }

        this._simpleCommandsByName.push({ command: cmd, name: alias });
      });
    });

    /**
     * Sort simple commands by name in descending order
     */
    this._simpleCommandsByName = this._simpleCommandsByName.sort(
      function (a, b) {
        // ASC  -> a.length - b.length
        // DESC -> b.length - a.length
        return b.name.length - a.name.length;
      },
    );
  }

  private groupSlashes() {
    const groupedSlashes = new Map<string, DApplicationCommand>();

    // Create Slashes from class groups that will wraps the commands
    //
    // "name": "permissions",
    // "description": "Get or edit permissions for a user or a role",
    // "options": [
    //    ...commands
    // ]
    //
    this._applicationCommandSlashGroups.forEach((group) => {
      if (!group.payload.description) {
        throw Error(`Description required for slash group: ${group.name}`);
      }

      const slashParent = DApplicationCommand.create({
        contexts: group.payload.contexts,
        defaultMemberPermissions: group.payload.defaultMemberPermissions,
        description: group.payload.description,
        descriptionLocalizations: group.payload.descriptionLocalizations,
        dmPermission: group.payload.dmPermission,
        integrationTypes: group.payload.integrationTypes,
        name: group.name,
        nameLocalizations: group.payload.nameLocalizations,
        type: ApplicationCommandType.ChatInput,
      }).decorate(group.classRef, group.key, group.method);

      const discord = this._discords.find((instance) => {
        return instance.from === slashParent.from;
      });

      if (!discord) {
        return;
      }

      slashParent.discord = discord;

      slashParent.guilds = [...slashParent.discord.guilds];
      slashParent.botIds = [...slashParent.discord.botIds];

      groupedSlashes.set(group.name, slashParent);

      const slashes = this._applicationCommandSlashes.filter((slash) => {
        return slash.group === slashParent.name && !slash.subgroup;
      });

      slashes.forEach((slash) => {
        slashParent.options.push(slash.toSubCommand());
      });

      this._applicationCommandSlashesFlat.forEach((slash) => {
        if (slash.group === slashParent.name) {
          slash.guilds = slashParent.guilds;
          slash.botIds = slashParent.botIds;
        }
      });
    });

    // Create for each subgroup (@SlashGroup on methods) create an SlashOption based on Slash
    //
    // "name": "permissions",
    // "description": "Get or edit permissions for a user or a role",
    // "options": [
    //    {
    //        "name": "user",
    //        "description": "Get or edit permissions for a user",
    //        "type": "SUB_COMMAND_GROUP"
    //        "options": [
    //            ....
    //        ]
    //     }
    // ]
    this._applicationCommandSlashSubGroups.forEach((subGroup) => {
      if (!subGroup.payload.description) {
        throw Error(
          `Description required for slash sub group: ${subGroup.name} (root: ${
            subGroup.root ?? "unknown"
          })`,
        );
      }

      const option = DApplicationCommandOption.create({
        description: subGroup.payload.description,
        descriptionLocalizations: subGroup.payload.descriptionLocalizations,
        name: subGroup.name,
        nameLocalizations: subGroup.payload.nameLocalizations,
        required: true,
        type: ApplicationCommandOptionType.SubcommandGroup,
      }).decorate(subGroup.classRef, subGroup.key, subGroup.method);

      // Get the slashes that are in this subgroup
      const slashes = this._applicationCommandSlashes.filter((slash) => {
        return (
          slash.group === subGroup.root && slash.subgroup === subGroup.name
        );
      });

      // Convert this slashes into options and add it to the option parent
      // this slashes are the node of the options
      //
      // "name": "permissions",
      // "description": "Get or edit permissions for a user or a role",
      // "options": [
      //     {
      //         "name": "user",
      //         "description": "Get or edit permissions for a user",
      //         "type": "SUB_COMMAND_GROUP"
      //         "options": [
      //             {
      //                 "name": "get",
      //                 "description": "Get permissions for a user",
      //                 "type": "SUB_COMMAND"
      //                 "options": [
      //                 ]
      //              }
      //          ]
      //      }
      // ]
      //
      slashes.forEach((slash) => {
        option.options.push(slash.toSubCommand());
      });

      // Get the first sub command to read root group name
      const groupName = subGroup.root ?? subGroup.name;

      const parentGroup = groupedSlashes.get(groupName);

      if (!parentGroup) {
        throw Error(`A subgroup declared without root: ${groupName}`);
      }

      parentGroup.options.push(option);
    });

    return [
      ...this._applicationCommandSlashes.filter((s) => !s.group && !s.subgroup),
      ...Array.from(groupedSlashes.values()),
    ];
  }
}
