/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as glob from "glob";
import {
  ArgsOf,
  Client,
  DApplicationCommand,
  DApplicationCommandGroup,
  DApplicationCommandOption,
  DComponentButton,
  DComponentSelectMenu,
  DDiscord,
  DGuard,
  DIService,
  DOn,
  DSimpleCommand,
  DSimpleCommandOption,
  DiscordEvents,
  Method,
  Modifier,
} from "../..";

export class MetadataStorage {
  private static isBuilt = false;
  private static _classesToLoad: string[] = [];
  private static _instance: MetadataStorage;
  private _events: DOn[] = [];
  private _guards: DGuard[] = [];
  private _applicationCommands: DApplicationCommand[] = [];
  private _AllApplicationCommands: DApplicationCommand[] = [];
  private _buttonComponents: DComponentButton[] = [];
  private _selectMenuComponents: DComponentSelectMenu[] = [];
  private _slashOptions: DApplicationCommandOption[] = [];
  private _discords: DDiscord[] = [];
  private _modifiers: Modifier<any>[] = [];
  private _simpleCommands: DSimpleCommand[] = [];
  private _allSimpleCommands: { name: string; command: DSimpleCommand }[] = [];
  private _commandsOptions: DSimpleCommandOption[] = [];

  private _groups: DApplicationCommandGroup<DApplicationCommand>[] = [];
  private _subGroups: DApplicationCommandGroup<DApplicationCommandOption>[] =
    [];

  static get instance() {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }

  static clear() {
    this._instance = new MetadataStorage();
  }

  get events() {
    return this._events as readonly DOn[];
  }

  /**
   * Get the list of used events without duplications
   */
  get usedEvents() {
    return this.events.reduce<DOn[]>((prev, event, index) => {
      const found = this.events.find((event2) => event.event === event2.event);
      const foundIndex = found ? this.events.indexOf(found) : -1;

      if (foundIndex === index || found?.once !== event.once) {
        prev.push(event);
      }

      return prev;
    }, []) as readonly DOn[];
  }

  static get classes() {
    return this._classesToLoad;
  }

  static set classes(files: string[]) {
    this._classesToLoad = files;
  }

  get discords() {
    return this._discords as readonly DDiscord[];
  }

  get applicationCommands() {
    return this._applicationCommands as readonly DApplicationCommand[];
  }

  get simpleCommands() {
    return this._simpleCommands as readonly DSimpleCommand[];
  }
  get allSimpleCommands() {
    return this._allSimpleCommands as readonly {
      name: string;
      command: DSimpleCommand;
    }[];
  }

  get buttonComponents() {
    return this._buttonComponents as readonly DComponentButton[];
  }

  get selectMenuComponents() {
    return this._selectMenuComponents as readonly DComponentSelectMenu[];
  }

  get allApplicationCommands() {
    return this._AllApplicationCommands as readonly DApplicationCommand[];
  }

  get slashGroups() {
    return this._groups as readonly DApplicationCommandGroup[];
  }

  get slashSubGroups() {
    return this._subGroups as readonly DApplicationCommandGroup[];
  }

  private get discordMembers(): readonly Method[] {
    return [
      ...this._applicationCommands,
      ...this._simpleCommands,
      ...this._events,
      ...this._buttonComponents,
      ...this._selectMenuComponents,
    ];
  }

  addModifier(modifier: Modifier<any>) {
    this._modifiers.push(modifier);
  }

  addOn(on: DOn) {
    this._events.push(on);
  }

  addApplicationCommand(slash: DApplicationCommand) {
    this._applicationCommands.push(slash);
  }

  addApplicationCommandOption(option: DApplicationCommandOption) {
    this._slashOptions.push(option);
  }

  addApplicationCommandGroup(
    group: DApplicationCommandGroup<DApplicationCommand>
  ) {
    this._groups.push(group);
  }

  addApplicationCommandSubGroup(
    subGroup: DApplicationCommandGroup<DApplicationCommandOption>
  ) {
    this._subGroups.push(subGroup);
  }

  addSimpleCommand(cmd: DSimpleCommand) {
    this._simpleCommands.push(cmd);
  }

  addSimpleCommandOption(cmdOption: DSimpleCommandOption) {
    this._commandsOptions.push(cmdOption);
  }

  addComponentButton(button: DComponentButton) {
    this._buttonComponents.push(button);
  }

  addComponentSelectMenu(selectMenu: DComponentSelectMenu) {
    this._selectMenuComponents.push(selectMenu);
  }

  addGuard(guard: DGuard) {
    this._guards.push(guard);
    DIService.instance.addService(guard.classRef);
  }

  addDiscord(discord: DDiscord) {
    this._discords.push(discord);
    DIService.instance.addService(discord.classRef);
  }

  private loadClasses() {
    // collect all import paths
    const imports: string[] = [];
    MetadataStorage.classes.forEach((path) => {
      const files = glob.sync(path).filter((file) => typeof file === "string");
      files.forEach((file) => {
        if (!imports.includes(file)) imports.push(file);
      });
    });

    // import all files
    imports.forEach((file) => require(file));
  }

  async build() {
    // build the instance if not already built
    if (MetadataStorage.isBuilt) return;
    MetadataStorage.isBuilt = true;

    // load the classes
    this.loadClasses();

    // Link the events with @Discord class instances
    this.discordMembers.forEach((member) => {
      // Find the linked @Discord of an event
      const discord = this._discords.find((instance) => {
        return instance.from === member.from;
      });

      if (!discord) return;

      // You can get the @Discord that wrap a @SimpleCommand/@On by using
      // on.discord or slash.discord
      member.discord = discord;

      if (member instanceof DApplicationCommand) {
        discord.applicationCommands.push(member);
      }

      if (member instanceof DSimpleCommand) {
        discord.simpleCommands.push(member);
      }

      if (member instanceof DOn) {
        discord.events.push(member);
      }

      if (member instanceof DComponentButton) {
        discord.buttons.push(member);
      }

      if (member instanceof DComponentSelectMenu) {
        discord.selectMenus.push(member);
      }
    });

    await Modifier.applyFromModifierListToList(this._modifiers, this._discords);
    await Modifier.applyFromModifierListToList(this._modifiers, this._events);
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._applicationCommands
    );
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._simpleCommands
    );
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._buttonComponents
    );
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._slashOptions
    );
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._selectMenuComponents
    );

    // Set the class level "group" property of all @Slash
    // Cannot achieve it using modifiers
    this._groups.forEach((group) => {
      this._applicationCommands.forEach((slash) => {
        if (group.from !== slash.from) {
          return;
        }

        slash.group = group.name;
      });
    });

    this._AllApplicationCommands = this._applicationCommands;
    this._applicationCommands = this.groupSlashes();

    this._simpleCommands.forEach((cmd) => {
      this._allSimpleCommands.push({ name: cmd.name, command: cmd });
      cmd.aliases.forEach((al) => {
        this._allSimpleCommands.push({ name: al, command: cmd });
      });
    });

    // sort simple commands
    this._allSimpleCommands = this._allSimpleCommands.sort(function (a, b) {
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
    //    ...comands
    // ]
    //
    this._groups.forEach((group) => {
      const slashParent = DApplicationCommand.create(
        group.name,
        "CHAT_INPUT",
        group.infos?.description
      ).decorate(group.classRef, group.key, group.method);

      const discord = this._discords.find((instance) => {
        return instance.from === slashParent.from;
      });

      if (!discord) return;

      slashParent.discord = discord;

      slashParent.guilds = [...Client.botGuilds, ...slashParent.discord.guilds];
      slashParent.botIds = [...slashParent.discord.botIds];
      slashParent.permissions = [
        ...slashParent.permissions,
        ...slashParent.discord.permissions,
      ];
      slashParent.defaultPermission = slashParent.discord.defaultPermission;

      groupedSlashes.set(group.name, slashParent);

      const slashes = this._applicationCommands.filter((slash) => {
        return slash.group === slashParent.name && !slash.subgroup;
      });

      slashes.forEach((slash) => {
        slashParent.options.push(slash.toSubCommand());
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
    this._subGroups.forEach((subGroup) => {
      const option = DApplicationCommandOption.create(
        subGroup.name,
        "SUB_COMMAND_GROUP",
        subGroup.infos?.description
      ).decorate(subGroup.classRef, subGroup.key, subGroup.method);

      // Get the slashes that are in this subgroup
      const slashes = this._applicationCommands.filter((slash) => {
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

      // The the root option to the root Slash command
      const groupSlash = slashes?.[0].group
        ? groupedSlashes.get(slashes[0].group)
        : undefined;
      if (groupSlash) {
        groupSlash.options.push(option);
      }
    });

    return [
      ...this._applicationCommands.filter((s) => !s.group && !s.subgroup),
      ...Array.from(groupedSlashes.values()),
    ];
  }

  /**
   * Trigger a discord event
   * @param event The event to trigger
   * @param client The discord.ts client instance
   * @param once Should we execute the event once
   */
  trigger<Event extends DiscordEvents>(
    event: Event,
    client: Client,
    once = false
  ): (...params: ArgsOf<Event>) => Promise<any> {
    const responses: any[] = [];

    const eventsToExecute = this._events.filter((on) => {
      return on.event === event && on.once === once;
    });

    return async (...params: ArgsOf<Event>) => {
      for (const on of eventsToExecute) {
        const botIDs = on.botIds;
        if (botIDs.length && !botIDs.includes(client.botId)) continue;
        const res = await on.execute(params, client);
        responses.push(res);
      }
      return responses;
    };
  }
}
