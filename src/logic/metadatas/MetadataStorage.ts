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
  Method
} from "../..";
import { DGroup } from "../../decorators";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _events: DOn[] = [];
  private _guards: DGuard[] = [];
  private _slashes: DSlash[] = [];
  private _allSlashes: DSlash[] = [];
  private _options: DOption[] = [];
  private _discords: DDiscord[] = [];
  private _modifiers: Modifier<any>[] = [];

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
    return this.events.reduce<DOn[]>(
      (prev, event, index) => {
        const found = this.events.find(
          (event2) => event.event === event2.event
        );
        const foundIndex = this.events.indexOf(found);

        if (foundIndex === index || found.once !== event.once) {
          prev.push(event);
        }

        return prev;
      },
      []
    ) as readonly DOn[];
  }

  get discords() {
    return this._discords as readonly DDiscord[];
  }

  get slashes() {
    return this._slashes as readonly DSlash[];
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
      ...this._events,
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

  async build() {
    // Link the events with @Discord class instances
    this.discordMembers.filter((member) => {
      // Find the linked @Discord of an event
      const discord = this._discords.find((instance) => {
        return instance.from === member.from;
      });

      // You can get the @Discord that wrap a @Command/@On by using
      // on.discord or slash.discord
      member.discord = discord;

      if (member instanceof DSlash) {
        discord.slashes.push(member);
      }

      if (member instanceof DOn) {
        discord.events.push(member);
      }
    });
    
    await Modifier.applyFromModifierListToList(this._modifiers, this._discords);
    await Modifier.applyFromModifierListToList(this._modifiers, this._events);
    await Modifier.applyFromModifierListToList(this._modifiers, this._slashes);
    await Modifier.applyFromModifierListToList(this._modifiers, this._options);

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
        group.infos.description
      ).decorate(
        group.classRef,
        group.key,
        group.method
      );

      slashParent.discord = this._discords.find((instance) => {
        return instance.from === slashParent.from;
      });

      slashParent.guilds = [
        ...Client.slashGuilds,
        ...slashParent.discord.guilds
      ];
      slashParent.permissions = slashParent.discord.permissions;

      groupedSlashes.set(group.name, slashParent);

      const slashes = this._slashes.filter((slash) => {
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
        subGroup.infos.description
      ).decorate(
        subGroup.classRef,
        subGroup.key,
        subGroup.method
      );

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
      const groupSlash = groupedSlashes.get(slashes[0].group);
      if (groupSlash) {
        groupSlash.options.push(option);
      }
    });

    return [
      ...this._slashes.filter((s) => !s.group && !s.subgroup),
      ...Array.from(groupedSlashes.values())
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
  ): ((...params: ArgsOf<Event>) => Promise<any>) {
    const responses: any[] = [];

    const eventsToExecute = this._events.filter((on) => {
      return (
        on.event === event &&
        on.once === once
      );
    });

    return async (...params: ArgsOf<Event>) => {
      for (const on of eventsToExecute) {
        const res = await on.execute(params, client);
        responses.push(res);
      }
      return responses;
    };
  }
}
