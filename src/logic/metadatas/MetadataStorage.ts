import {
  DOn,
  DDiscord,
  DGuard,
  Client,
  ArgsOf,
  DiscordEvents,
  Modifier,
  DecoratorUtils,
  DIService,
  DSlash,
  DOption
} from "../..";

type DiscordMember = DSlash | DOn;

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

  private get discordMembers(): readonly DiscordMember[] {
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
    this.discordMembers.filter((on) => {
      // Find the linked @Discord of an event
      const discord = this._discords.find((instance) => {
        return instance.from === on.from;
      });

      // You can get the @Discord that wrap a @Command/@On by using
      // on.discord or slash.discord
      on.discord = discord;
    });

    await Modifier.applyFromModifierListToList(this._modifiers, this._discords);
    await Modifier.applyFromModifierListToList(this._modifiers, this._options);
    await Modifier.applyFromModifierListToList(this._modifiers, this._slashes);

    this.discordMembers.map((on) => {
      on.discord.guards = DecoratorUtils.getLinkedObjects(
        on.discord,
        this._guards
      );

      on.guards = DecoratorUtils.getLinkedObjects(on, this._guards);
      // on.compileGuardFn();
    });
  }

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
      const paramsToInject: any = params;

      for (const on of eventsToExecute) {
        const injectedParams = paramsToInject;

        const res = await on.getMainFunction<Event>()(injectedParams, client);

        if (res.executed) {
          responses.push(res.res);
        }
      }
      return responses;
    };
  }
}
