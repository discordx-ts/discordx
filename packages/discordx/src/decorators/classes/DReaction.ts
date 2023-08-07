import type { Client, IGuild } from "../../index.js";
import { resolveIGuilds } from "../../index.js";
import { Method } from "./Method.js";

type CreateStructure = {
  aliases?: string[];
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  emoji: string;
  guilds?: IGuild[];
  partial?: boolean;
  remove?: boolean;
};

/**
 * @category Decorator
 */
export class DReaction extends Method {
  private _emoji: string;
  private _description: string;
  private _directMessage: boolean;
  private _guilds: IGuild[];
  private _botIds: string[];
  private _aliases: string[];
  private _remove: boolean;
  private _partial: boolean;

  get aliases(): string[] {
    return this._aliases;
  }
  set aliases(value: string[]) {
    this._aliases = value;
  }

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get guilds(): IGuild[] {
    return this._guilds;
  }
  set guilds(value: IGuild[]) {
    this._guilds = value;
  }

  get directMessage(): boolean {
    return this._directMessage;
  }
  set directMessage(value: boolean) {
    this._directMessage = value;
  }

  get emoji(): string {
    return this._emoji;
  }
  set emoji(value: string) {
    this._emoji = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get remove(): boolean {
    return this._remove;
  }
  set remove(value: boolean) {
    this._remove = value;
  }

  get partial(): boolean {
    return this._partial;
  }
  set partial(value: boolean) {
    this._partial = value;
  }

  protected constructor(data: CreateStructure) {
    super();
    this._emoji = data.emoji;
    this._description = data.description ?? this.emoji;
    this._directMessage = data.directMessage ?? true;
    this._guilds = data.guilds ?? [];
    this._botIds = data.botIds ?? [];
    this._aliases = data.aliases ?? [];
    this._remove = data.remove ?? false;
    this._partial = data.partial ?? false;
  }

  static create(data: CreateStructure): DReaction {
    return new DReaction(data);
  }

  isBotAllowed(botId: string): boolean {
    if (!this.botIds.length) {
      return true;
    }

    return this.botIds.includes(botId);
  }

  async getGuilds(client: Client): Promise<string[]> {
    const guilds = await resolveIGuilds(client, this, [
      ...client.botGuilds,
      ...this.guilds,
    ]);

    return guilds;
  }

  async isGuildAllowed(
    client: Client,
    guildId: string | null,
  ): Promise<boolean> {
    if (!guildId) {
      return true;
    }

    const guilds = await this.getGuilds(client);

    if (!guilds.length) {
      return true;
    }

    return guilds.includes(guildId);
  }

  parseParams(): never[] {
    return [];
  }
}
