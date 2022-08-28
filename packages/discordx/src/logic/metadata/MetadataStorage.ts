import { DIService } from "@discordx/di";
import type { Decorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import _ from "lodash";

import type { Method } from "../../decorators/classes/Method.js";
import type {
  DApplicationCommandGroup,
  DDiscord,
  DGuard,
  DSimpleCommandOption,
  ISimpleCommandByName,
  ITriggerEventData,
} from "../../index.js";
import {
  ComponentType,
  DApplicationCommand,
  DApplicationCommandOption,
  DComponent,
  DOn,
  DReaction,
  DSimpleCommand,
} from "../../index.js";

/**
 * @category Internal
 */
export class MetadataStorage {
  // internal
  private static _isBuilt = false;
  private static _instance: MetadataStorage;

  private _discords: Array<DDiscord> = [];
  private _guards: Array<DGuard> = [];
  private _modifiers: Array<Modifier<Decorator>> = [];

  // events
  private _events: Array<DOn> = [];

  // custom Handlers
  private _buttonComponents: Array<DComponent> = [];
  private _modalComponents: Array<DComponent> = [];
  private _selectMenuComponents: Array<DComponent> = [];

  // reactions
  private _reactions: Array<DReaction> = [];

  // simple command
  private _simpleCommandOptions: Array<DSimpleCommandOption> = [];
  private _simpleCommands: Array<DSimpleCommand> = [];
  private _simpleCommandsByName: Array<ISimpleCommandByName> = [];
  private _simpleCommandsByPrefix = new Map<string, ISimpleCommandByName[]>();

  // discord commands
  private _applicationCommandMessages: Array<DApplicationCommand> = [];
  private _applicationCommandSlashes: Array<DApplicationCommand> = [];
  private _applicationCommandSlashesFlat: Array<DApplicationCommand> = [];
  private _applicationCommandSlashOptions: Array<DApplicationCommandOption> =
    [];
  private _applicationCommandUsers: Array<DApplicationCommand> = [];

  // groups
  private _applicationCommandSlashGroups: Array<
    DApplicationCommandGroup<Partial<DApplicationCommand>>
  > = [];
  private _applicationCommandSlashSubGroups: DApplicationCommandGroup<
    Partial<DApplicationCommandOption>
  >[] = [];

  // static getters

  static clear(): void {
    this._instance = new MetadataStorage();
  }

  static get isBuilt(): boolean {
    return this._isBuilt;
  }

  static get instance(): MetadataStorage {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
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

  get simpleCommandsByPrefix(): Map<string, ISimpleCommandByName[]> {
    return this._simpleCommandsByPrefix;
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
    group: DApplicationCommandGroup<Partial<DApplicationCommand>>
  ): void {
    this._applicationCommandSlashGroups.push(group);
  }

  addApplicationCommandSlashSubGroups(
    subGroup: DApplicationCommandGroup<Partial<DApplicationCommandOption>>
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
    DIService.instance.addService(discord.classRef);
  }

  addGuard(guard: DGuard): void {
    this._guards.push(guard);
    DIService.instance.addService(guard.classRef);
  }

  addModifier<T extends Decorator = Decorator>(modifier: Modifier<T>): void {
    this._modifiers.push(modifier as Modifier<Decorator>);
  }

  addOn(on: DOn): void {
    this._events.push(on);
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
          `Did you forget to use the @discord decorator on your class: ${member.from.name}\n` +
            "read more at https://discordx.js.org/docs/discordx/decorators/general/discord\n\n"
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

    await Modifier.applyFromModifierListToList(this._modifiers, this._discords);
    await Modifier.applyFromModifierListToList(this._modifiers, this._events);

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._applicationCommandSlashes
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._applicationCommandSlashOptions
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._applicationCommandMessages
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._applicationCommandUsers
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._simpleCommands
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._simpleCommandOptions
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._buttonComponents
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._modalComponents
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._reactions
    );

    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._selectMenuComponents
    );

    this._applicationCommandSlashesFlat = this._applicationCommandSlashes;
    this._applicationCommandSlashes = this.groupSlashes();

    this.buildSimpleCommands();
  }

  private buildSimpleCommands(): void {
    this._simpleCommands.forEach((cmd) => {
      // Separately map special prefix commands
      if (cmd.prefix) {
        [...cmd.prefix].forEach((pfx) => {
          const commands = this._simpleCommandsByPrefix.get(pfx) ?? [];
          const mapCmd: ISimpleCommandByName[] = [
            { command: cmd, name: cmd.name },
          ];

          cmd.aliases.forEach((al) => {
            mapCmd.push({ command: cmd, name: al });
          });

          mapCmd.forEach((mapCommand) => {
            if (_.findIndex(commands, { name: mapCommand.name }) !== -1) {
              throw Error(
                `Duplicate simple command name: ${mapCommand.name} (of: ${mapCommand.command.name})`
              );
            }
          });

          this._simpleCommandsByPrefix.set(
            pfx,
            [...commands, ...mapCmd].sort(
              (a, b) => b.name.length - a.name.length
            )
          );
        });
        return;
      }

      // To improve search performance, map all commands together
      if (_.findIndex(this._simpleCommandsByName, { name: cmd.name }) !== -1) {
        throw Error(`Duplicate simple command name: ${cmd.name}`);
      }

      this._simpleCommandsByName.push({ command: cmd, name: cmd.name });
      cmd.aliases.forEach((al) => {
        if (_.findIndex(this._simpleCommandsByName, { name: al }) !== -1) {
          throw Error(
            `Duplicate simple command name: ${al} (alias of command: ${cmd.name})`
          );
        }
        this._simpleCommandsByName.push({ command: cmd, name: al });
      });
    });

    // sort simple commands
    this._simpleCommandsByName = this._simpleCommandsByName.sort(function (
      a,
      b
    ) {
      // ASC  -> a.length - b.length
      // DESC -> b.length - a.length
      return b.name.length - a.name.length;
    });
  }

  private groupSlashes() {
    const groupedSlashes: Map<string, DApplicationCommand> = new Map();

    // Create Slashes from class groups that will wraps the commands
    //
    // "name": "permissions",
    // "description": "Get or edit permissions for a user or a role",
    // "options": [
    //    ...commands
    // ]
    //
    this._applicationCommandSlashGroups.forEach((group) => {
      const slashParent = DApplicationCommand.create({
        defaultMemberPermissions: group.infos.defaultMemberPermissions,
        description: group.infos.description,
        descriptionLocalizations: group.infos.descriptionLocalizations,
        dmPermission: group.infos.dmPermission,
        name: group.name,
        nameLocalizations: group.infos.nameLocalizations,
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
      const option = DApplicationCommandOption.create({
        description: subGroup.infos.description,
        descriptionLocalizations: subGroup.infos.descriptionLocalizations,
        name: subGroup.name,
        nameLocalizations: subGroup.infos.nameLocalizations,
        type: ApplicationCommandOptionType.SubcommandGroup,
      }).decorate(subGroup.classRef, subGroup.key, subGroup.method);

      // Get the slashes that are in this subgroup
      const slashes = this._applicationCommandSlashes.filter((slash) => {
        return slash.subgroup === option.name;
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
      const groupSlash = slashes[0]?.group
        ? groupedSlashes.get(slashes[0].group)
        : undefined;

      if (groupSlash) {
        groupSlash.options.push(option);
      }
    });

    return [
      ...this._applicationCommandSlashes.filter((s) => !s.group && !s.subgroup),
      ...Array.from(groupedSlashes.values()),
    ];
  }

  /**
   * Trigger a discord event
   *
   * @param options - Even data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger(options: ITriggerEventData): (...params: any[]) => Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responses: Array<any> = [];

    const eventsToExecute = this._events.filter((on) => {
      return (
        on.event === options.event &&
        on.once === options.once &&
        on.rest === options.rest
      );
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (...params: any[]) => {
      await Promise.all(
        eventsToExecute.map(async (ev) => {
          if (!ev.isBotAllowed(options.client.botId)) {
            return;
          }

          const res = await ev.execute(options.guards, params, options.client);
          responses.push(res);
        })
      );

      return responses;
    };
  }
}
