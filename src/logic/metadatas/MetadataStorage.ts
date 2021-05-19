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

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _events: DOn[] = [];
  private _guards: DGuard[] = [];
  private _slashes: DSlash[] = [];
  private _options: DOption[] = [];
  private _discords: DDiscord[] = [];
  private _modifiers: Modifier<any>[] = [];

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

  get discords() {
    return this._discords as readonly DDiscord[];
  }

  get slashes() {
    return this._slashes as readonly DSlash[];
  }

  private get discordMembers(): readonly Method[] {
    return [
      ...this._slashes,
      ...this._events
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
    });

    await Modifier.applyFromModifierListToList(this._modifiers, this._discords);
    await Modifier.applyFromModifierListToList(this._modifiers, this._events);
    await Modifier.applyFromModifierListToList(this._modifiers, this._options);
    await Modifier.applyFromModifierListToList(this._modifiers, this._slashes);
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
    once: boolean = false
  ) {
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
