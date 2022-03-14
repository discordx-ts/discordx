import type { Client, ComponentType, IGuild } from "../../index.js";
import { resolveIGuilds } from "../../index.js";
import { Method } from "./Method.js";

/**
 * @category Decorator
 */
export class DComponent extends Method {
  private _type: ComponentType;
  private _id: string | RegExp;
  private _guilds: IGuild[];
  private _botIds: string[];

  get type(): ComponentType {
    return this._type;
  }

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get id(): string | RegExp {
    return this._id;
  }
  set id(value: string | RegExp) {
    this._id = value;
  }

  get guilds(): IGuild[] {
    return this._guilds;
  }
  set guilds(value: IGuild[]) {
    this._guilds = value;
  }

  protected constructor(
    type: ComponentType,
    id: string | RegExp,
    guilds?: IGuild[],
    botIds?: string[]
  ) {
    super();
    this._type = type;
    this._id = id;
    this._guilds = guilds ?? [];
    this._botIds = botIds ?? [];
  }

  static create(
    type: ComponentType,
    id: string | RegExp,
    guilds?: IGuild[],
    botIds?: string[]
  ): DComponent {
    return new DComponent(type, id, guilds, botIds);
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
    guildId: string | null
  ): Promise<boolean> {
    if (!guildId) {
      return true;
    }

    const guilds = await this.getGuilds(client);

    return guilds.includes(guildId);
  }

  isId(text: string): boolean {
    return typeof this.id === "string" ? this.id === text : this.id.test(text);
  }

  parseParams(): never[] {
    return [];
  }
}
