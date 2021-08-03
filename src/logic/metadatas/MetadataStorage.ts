import {
  DOn,
  DDiscord,
  DGuard,
  Client,
  ArgsOf,
  DiscordEvents,
  Modifier,
  DIService,
  DSlash,
  DOption,
  Method,
} from "../..";
import { DButton, DGroup } from "../../decorators";
import { DSelectMenu } from "../../decorators/classes/DSelectMenu";
import * as glob from "glob";
import { DCommand } from "../../decorators/classes/DCommand";
import { DCommandOption } from "../../decorators/classes/DCommandOption";

export class MetadataStorage {
  private static isBuilt = false;
  private static _classesToLoad: string[] = [];
  private static _instance: MetadataStorage;
  private _events: DOn[] = [];
  private _guards: DGuard[] = [];
  private _slashes: DSlash[] = [];
  private _allSlashes: DSlash[] = [];
  private _buttons: DButton[] = [];
  private _selectMenu: DSelectMenu[] = [];
  private _options: DOption[] = [];
  private _discords: DDiscord[] = [];
  private _modifiers: Modifier<any>[] = [];
  private _commands: DCommand[] = [];
  private _commandsOptions: DCommandOption[] = [];

  private _groups: DGroup<DSlash>[] = [];
  private _subGroups: DGroup<DOption>[] = [];

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

  get slashes() {
    return this._slashes as readonly DSlash[];
  }

  get commands() {
    return this._commands as readonly DCommand[];
  }

  get buttons() {
    return this._buttons as readonly DButton[];
  }

  get selectMenus() {
    return this._selectMenu as readonly DSelectMenu[];
  }

  get allSlashes() {
    return this._allSlashes as readonly DSlash[];
  }

  get groups() {
    return this._groups as readonly DGroup[];
  }

  get subGroups() {
    return this._subGroups as readonly DGroup[];
  }

  private get discordMembers(): readonly Method[] {
    return [
      ...this._slashes,
      ...this._commands,
      ...this._events,
      ...this._buttons,
      ...this._selectMenu,
    ];
  }

  addModifier(modifier: Modifier<any>) {
    this._modifiers.push(modifier);
  }

  addOn(on: DOn) {
    this._events.push(on);
  }

  addSlash(slash: DSlash) {
    this._slashes.push(slash);
  }

  addCommand(cmd: DCommand) {
    this._commands.push(cmd);
  }

  addCommandOption(cmdOption: DCommandOption) {
    this._commandsOptions.push(cmdOption);
  }

  addButton(button: DButton) {
    this._buttons.push(button);
  }

  addSelectMenu(selectMenu: DSelectMenu) {
    this._selectMenu.push(selectMenu);
  }

  addOption(option: DOption) {
    this._options.push(option);
  }

  addGroup(group: DGroup<DSlash>) {
    this._groups.push(group);
  }

  addSubGroup(subGroup: DGroup<DOption>) {
    this._subGroups.push(subGroup);
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

      // You can get the @Discord that wrap a @Command/@On by using
      // on.discord or slash.discord
      member.discord = discord;

      if (member instanceof DSlash) {
        discord.slashes.push(member);
      }

      if (member instanceof DCommand) {
        discord.commands.push(member);
      }

      if (member instanceof DOn) {
        discord.events.push(member);
      }

      if (member instanceof DButton) {
        discord.buttons.push(member);
      }

      if (member instanceof DSelectMenu) {
        discord.selectMenus.push(member);
      }
    });

    await Modifier.applyFromModifierListToList(this._modifiers, this._discords);
    await Modifier.applyFromModifierListToList(this._modifiers, this._events);
    await Modifier.applyFromModifierListToList(this._modifiers, this._slashes);
    await Modifier.applyFromModifierListToList(this._modifiers, this._commands);
    await Modifier.applyFromModifierListToList(this._modifiers, this._buttons);
    await Modifier.applyFromModifierListToList(this._modifiers, this._options);
    await Modifier.applyFromModifierListToList(
      this._modifiers,
      this._selectMenu
    );

    // Set the class level "group" property of all @Slash
    // Cannot achieve it using modifiers
    this._groups.forEach((group) => {
      this._slashes.forEach((slash) => {
        if (group.from !== slash.from) {
          return;
        }

        slash.group = group.name;
      });
    });

    this._allSlashes = this._slashes;
    this._slashes = this.groupSlashes();
  }

  private groupSlashes() {
    const groupedSlashes: Map<string, DSlash> = new Map();

    // Create Slashes from class groups that will wraps the commands
    //
    // "name": "permissions",
    // "description": "Get or edit permissions for a user or a role",
    // "options": [
    //    ...comands
    // ]
    //
    this._groups.forEach((group) => {
      const slashParent = DSlash.create(
        group.name,
        group.infos?.description
      ).decorate(group.classRef, group.key, group.method);

      const discord = this._discords.find((instance) => {
        return instance.from === slashParent.from;
      });

      if (!discord) return;

      slashParent.discord = discord;

      slashParent.guilds = [
        ...Client.slashGuilds,
        ...slashParent.discord.guilds,
      ];
      slashParent.botIds = [...slashParent.discord.botIds];
      slashParent.permissions = [
        ...slashParent.permissions,
        ...slashParent.discord.permissions,
      ];
      slashParent.defaultPermission = slashParent.discord.defaultPermission;

      groupedSlashes.set(group.name, slashParent);

      const slashes = this._slashes.filter((slash) => {
        return slash.group === slashParent.name && !slash.subgroup;
      });

      slashes.forEach((slash) => {
        slashParent.options.push(slash.toSubCommand());
      });
    });

    // Create for each subgroup (@Group on methods) create an SlashOption based on Slash
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
      const option = DOption.create(
        subGroup.name,
        "SUB_COMMAND_GROUP",
        subGroup.infos?.description
      ).decorate(subGroup.classRef, subGroup.key, subGroup.method);

      // Get the slashes that are in this subgroup
      const slashes = this._slashes.filter((slash) => {
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
      ...this._slashes.filter((s) => !s.group && !s.subgroup),
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
