/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import {
  Client as ClientJS,
  type Interaction,
  type Message,
  type MessageReaction,
  type PartialMessageReaction,
  type PartialUser,
  type Snowflake,
  type User,
} from "discord.js";

import {
  ApplicationCommandManager,
  type ClientOptions,
  type DApplicationCommand,
  type DApplicationCommandGroup,
  type DApplicationCommandOption,
  type DComponent,
  type DDiscord,
  DebugManager,
  type DOn,
  type DReaction,
  type DSimpleCommand,
  type EventConfig,
  type GuardFunction,
  type IGuild,
  type ILogger,
  InteractionHandler,
  type IPrefixResolver,
  type ISimpleCommandByName,
  MetadataStorage,
  ReactionManager,
  resolveIGuilds,
  type SimpleCommandConfig,
  SimpleCommandManager,
  type SimpleCommandMessage,
  type SimpleCommandParseType,
} from "./index.js";

/**
 * Extended Discord.js client with discordx functionality
 *
 * @param options - Client options
 * ___
 *
 * [View Documentation](https://discordx.js.org/docs/discordx/basics/client)
 */
export class Client extends ClientJS {
  // Core properties
  private _botId: string;
  private _isBuilt = false;
  private _prefix: IPrefixResolver;
  private _simpleCommandConfig?: SimpleCommandConfig;
  private _silent: boolean;
  private _botGuilds: IGuild[] = [];
  private _guards: GuardFunction[] = [];
  public logger: ILogger;

  // Managers
  public applicationCommandManager: ApplicationCommandManager;
  public interactionHandler: InteractionHandler;
  public simpleCommandManager: SimpleCommandManager;
  public reactionManager: ReactionManager;
  public debugManager: DebugManager;

  // Core getters/setters
  get botId(): string {
    return this._botId;
  }
  set botId(value: string) {
    this._botId = value;
  }

  get silent(): boolean {
    return this._silent;
  }
  set silent(value: boolean) {
    this._silent = value;
  }

  get guards(): GuardFunction[] {
    return this._guards;
  }
  set guards(value: GuardFunction[]) {
    this._guards = value;
  }

  get prefix(): IPrefixResolver {
    return this._prefix;
  }
  set prefix(value: IPrefixResolver) {
    this._prefix = value;
  }

  get simpleCommandConfig(): SimpleCommandConfig | undefined {
    return this._simpleCommandConfig;
  }
  set simpleCommandConfig(value: SimpleCommandConfig | undefined) {
    this._simpleCommandConfig = value;
  }

  get botGuilds(): IGuild[] {
    return this._botGuilds;
  }
  set botGuilds(value: IGuild[]) {
    this._botGuilds = value;
  }

  get botResolvedGuilds(): Promise<string[]> {
    return resolveIGuilds(this, undefined, this._botGuilds);
  }

  get instance(): MetadataStorage {
    return MetadataStorage.instance;
  }

  // Proxy getters to MetadataStorage (static)
  static get applicationCommands(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommands;
  }
  static get applicationCommandSlashes(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandSlashes;
  }
  static get applicationCommandSlashesFlat(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandSlashesFlat;
  }
  static get applicationCommandSlashOptions(): readonly DApplicationCommandOption[] {
    return MetadataStorage.instance.applicationCommandSlashOptions;
  }
  static get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[] {
    return MetadataStorage.instance.applicationCommandSlashGroups;
  }
  static get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[] {
    return MetadataStorage.instance.applicationCommandSlashSubGroups;
  }
  static get applicationCommandUsers(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandUsers;
  }
  static get applicationCommandMessages(): readonly DApplicationCommand[] {
    return MetadataStorage.instance.applicationCommandMessages;
  }
  static get events(): readonly DOn[] {
    return MetadataStorage.instance.events;
  }
  static get discords(): readonly DDiscord[] {
    return MetadataStorage.instance.discords;
  }
  static get buttonComponents(): readonly DComponent[] {
    return MetadataStorage.instance.buttonComponents;
  }
  static get modalComponents(): readonly DComponent[] {
    return MetadataStorage.instance.modalComponents;
  }
  static get selectMenuComponents(): readonly DComponent[] {
    return MetadataStorage.instance.selectMenuComponents;
  }
  static get reactions(): readonly DReaction[] {
    return MetadataStorage.instance.reactions;
  }
  static get simpleCommands(): readonly DSimpleCommand[] {
    return MetadataStorage.instance.simpleCommands;
  }
  static get simpleCommandsByName(): readonly ISimpleCommandByName[] {
    return MetadataStorage.instance.simpleCommandsByName;
  }
  static get simpleCommandMappedPrefix(): readonly string[] {
    return MetadataStorage.instance.simpleCommandMappedPrefix;
  }
  static get instance(): MetadataStorage {
    return MetadataStorage.instance;
  }

  // Proxy getters to MetadataStorage (instance)
  get applicationCommands(): readonly DApplicationCommand[] {
    return Client.applicationCommands;
  }
  get applicationCommandSlashes(): readonly DApplicationCommand[] {
    return Client.applicationCommandSlashes;
  }
  get applicationCommandSlashesFlat(): readonly DApplicationCommand[] {
    return Client.applicationCommandSlashesFlat;
  }
  get applicationCommandSlashOptions(): readonly DApplicationCommandOption[] {
    return Client.applicationCommandSlashOptions;
  }
  get applicationCommandSlashGroups(): readonly DApplicationCommandGroup[] {
    return Client.applicationCommandSlashGroups;
  }
  get applicationCommandSlashSubGroups(): readonly DApplicationCommandGroup[] {
    return Client.applicationCommandSlashSubGroups;
  }
  get applicationCommandUsers(): readonly DApplicationCommand[] {
    return Client.applicationCommandUsers;
  }
  get applicationCommandMessages(): readonly DApplicationCommand[] {
    return Client.applicationCommandMessages;
  }
  get events(): readonly DOn[] {
    return Client.events;
  }
  get discords(): readonly DDiscord[] {
    return Client.discords;
  }
  get buttonComponents(): readonly DComponent[] {
    return Client.buttonComponents;
  }
  get modalComponents(): readonly DComponent[] {
    return Client.modalComponents;
  }
  get selectMenuComponents(): readonly DComponent[] {
    return Client.selectMenuComponents;
  }
  get reactions(): readonly DReaction[] {
    return Client.reactions;
  }
  get simpleCommands(): readonly DSimpleCommand[] {
    return Client.simpleCommands;
  }
  get simpleCommandsByName(): readonly ISimpleCommandByName[] {
    return Client.simpleCommandsByName;
  }
  get simpleCommandMappedPrefix(): readonly string[] {
    return Client.simpleCommandMappedPrefix;
  }

  constructor(options: ClientOptions) {
    super(options);

    // Initialize core properties
    this._silent = options.silent ?? true;
    this._guards = options.guards ?? [];
    this._botGuilds = options.botGuilds ?? [];
    this._botId = options.botId ?? "bot";
    this._prefix = options.simpleCommand?.prefix ?? ["!"];
    this._simpleCommandConfig = options.simpleCommand;
    this.logger = options.logger ?? console;

    // Initialize managers
    this.applicationCommandManager = new ApplicationCommandManager(this);
    this.interactionHandler = new InteractionHandler(this);
    this.simpleCommandManager = new SimpleCommandManager(this);
    this.reactionManager = new ReactionManager(this);
    this.debugManager = new DebugManager(this);
  }

  /**
   * Start bot
   */
  async login(token: string): Promise<string> {
    await this.build();

    if (!this.silent) {
      this.logger.log(
        `${this.user?.username ?? this.botId} >> connecting discord...\n`,
      );
    }

    return super.login(token);
  }

  /**
   * Build the client and initialize all systems
   */
  async build(): Promise<void> {
    if (this._isBuilt) return;
    this._isBuilt = true;

    // Build metadata storage
    await this.instance.build();

    // Initialize event system
    this.instance.eventManager.initEvents(this);

    // Print debug info
    if (!this.silent) {
      this.debugManager.printDebug();
    }
  }

  // === Application Command Management ===
  async initApplicationCommands(retainDeleted = false): Promise<void> {
    return this.applicationCommandManager.initApplicationCommands(
      retainDeleted,
    );
  }

  async clearApplicationCommands(...guilds: Snowflake[]): Promise<void> {
    return this.applicationCommandManager.clearApplicationCommands(...guilds);
  }

  // === Interaction Handling ===
  executeInteraction(interaction: Interaction): Awaited<unknown> {
    return this.interactionHandler.executeInteraction(interaction);
  }

  // === Simple Command Management ===
  async parseCommand(
    message: Message,
    caseSensitive = false,
  ): Promise<SimpleCommandParseType | SimpleCommandMessage> {
    return this.simpleCommandManager.parseCommand(message, caseSensitive);
  }

  async executeCommand(
    message: Message,
    caseSensitive?: boolean,
  ): Promise<unknown> {
    return this.simpleCommandManager.executeCommand(message, caseSensitive);
  }

  // === Reaction Management ===
  async executeReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ): Promise<unknown> {
    return this.reactionManager.executeReaction(reaction, user);
  }

  // === Event Management ===
  trigger(options: EventConfig, params: any): Promise<any[]> {
    const triggerFn = this.instance.eventManager.trigger(this, options);
    return triggerFn(params);
  }

  /**
   * Bind discordx events to client
   */
  initEvents(): void {
    this.instance.eventManager.initEvents(this);
  }

  /**
   * Unbind all discordx events initialized by the initEvents method.
   */
  removeEvents(): void {
    this.instance.eventManager.removeEvents();
  }

  // === Debug ===
  printDebug(): void {
    this.debugManager.printDebug();
  }
}
