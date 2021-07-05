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

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private static _events: DOn[] = [];
  private static _guards: DGuard[] = [];
  private static _slashes: DSlash[] = [];
  private static _allSlashes: DSlash[] = [];
  private static _buttons: DButton[] = [];
  private static _selectMenu: DSelectMenu[] = [];
  private static _options: DOption[] = [];
  private static _discords: DDiscord[] = [];
  private static _modifiers: Modifier<any>[] = [];

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
    return MetadataStorage._events as readonly DOn[];
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

  get discords() {
    return MetadataStorage._discords as readonly DDiscord[];
  }

  get slashes() {
    return MetadataStorage._slashes as readonly DSlash[];
  }

  get buttons() {
    return MetadataStorage._buttons as readonly DButton[];
  }

  get selectMenus() {
    return MetadataStorage._selectMenu as readonly DSelectMenu[];
  }

  get allSlashes() {
    return MetadataStorage._allSlashes as readonly DSlash[];
  }

  get groups() {
    return this._groups as readonly DGroup[];
  }

  get subGroups() {
    return this._subGroups as readonly DGroup[];
  }

  private get discordMembers(): readonly Method[] {
    return [
      ...MetadataStorage._slashes,
      ...MetadataStorage._events,
      ...MetadataStorage._buttons,
      ...MetadataStorage._selectMenu,
    ];
  }

  addModifier(modifier: Modifier<any>) {
    MetadataStorage._modifiers.push(modifier);
  }

  addOn(on: DOn) {
    MetadataStorage._events.push(on);
  }

  addSlash(slash: DSlash) {
    MetadataStorage._slashes.push(slash);
  }

  addButton(button: DButton) {
    MetadataStorage._buttons.push(button);
  }

  addSelectMenu(selectMenu: DSelectMenu) {
    MetadataStorage._selectMenu.push(selectMenu);
  }

  addOption(option: DOption) {
    MetadataStorage._options.push(option);
  }

  addGroup(group: DGroup<DSlash>) {
    this._groups.push(group);
  }

  addSubGroup(subGroup: DGroup<DOption>) {
    this._subGroups.push(subGroup);
  }

  addGuard(guard: DGuard) {
    MetadataStorage._guards.push(guard);
    DIService.instance.addService(guard.classRef);
  }

  addDiscord(discord: DDiscord) {
    MetadataStorage._discords.push(discord);
    DIService.instance.addService(discord.classRef);
  }

  async build() {
    // Link the events with @Discord class instances
    this.discordMembers.forEach((member) => {
      // Find the linked @Discord of an event
      const discord = MetadataStorage._discords.find((instance) => {
        return instance.from === member.from;
      });

      if (!discord) return;

      // You can get the @Discord that wrap a @Command/@On by using
      // on.discord or slash.discord
      member.discord = discord;

      if (member instanceof DSlash) {
        discord.slashes.push(member);
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

    await Modifier.applyFromModifierListToList(
      MetadataStorage._modifiers,
      MetadataStorage._discords
    );
    await Modifier.applyFromModifierListToList(
      MetadataStorage._modifiers,
      MetadataStorage._events
    );
    await Modifier.applyFromModifierListToList(
      MetadataStorage._modifiers,
      MetadataStorage._slashes
    );
    await Modifier.applyFromModifierListToList(
      MetadataStorage._modifiers,
      MetadataStorage._buttons
    );
    await Modifier.applyFromModifierListToList(
      MetadataStorage._modifiers,
      MetadataStorage._options
    );
    await Modifier.applyFromModifierListToList(
      MetadataStorage._modifiers,
      MetadataStorage._selectMenu
    );

    // Set the class level "group" property of all @Slash
    // Cannot achieve it using modifiers
    this._groups.forEach((group) => {
      MetadataStorage._slashes.forEach((slash) => {
        if (group.from !== slash.from) {
          return;
        }

        slash.group = group.name;
      });
    });

    MetadataStorage._allSlashes = MetadataStorage._slashes;
    MetadataStorage._slashes = this.groupSlashes();
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

      const discord = MetadataStorage._discords.find((instance) => {
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

      const slashes = MetadataStorage._slashes.filter((slash) => {
        return slash.group === slashParent.name && !slash.subgroup;
      });

      slashes.forEach((slash) => {
        slashParent.options.push(slash.toSubCommand());
      });
    });

    // Create for each subgroup (@Group on methods) create an Option based on Slash
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
      const slashes = MetadataStorage._slashes.filter((slash) => {
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
      ...MetadataStorage._slashes.filter((s) => !s.group && !s.subgroup),
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

    const eventsToExecute = MetadataStorage._events.filter((on) => {
      return on.event === event && on.once === once;
    });

    return async (...params: ArgsOf<Event>) => {
      for (const on of eventsToExecute) {
        const botIDs = [...on.botIds, ...on.discord.botIds];
        if (botIDs.length && !botIDs.includes(client.botId)) return;
        const res = await on.execute(params, client);
        responses.push(res);
      }
      return responses;
    };
  }
}
