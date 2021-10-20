import { ApplicationCommandPermissionData, Guild } from "discord.js";
import {
  DApplicationCommand,
  DComponentButton,
  DComponentSelectMenu,
  DGuard,
  DIService,
  DOn,
  DSimpleCommand,
  IGuild,
  IPermissions,
  resolveIPermission,
} from "../..";
import { Decorator } from "./Decorator";

/**
 * @category Decorator
 */
export class DDiscord extends Decorator {
  private _name: string;
  private _description: string;
  private _guards: DGuard[] = [];
  private _buttonComponents: DComponentButton[] = [];
  private _selectMenus: DComponentSelectMenu[] = [];
  private _applicationCommands: DApplicationCommand[] = [];
  private _simpleCommands: DSimpleCommand[] = [];
  private _events: DOn[] = [];
  private _defaultPermission = true;
  private _permissions: IPermissions[] = [];
  private _guilds: IGuild[] = [];
  private _botIds: string[] = [];

  get permissions(): IPermissions[] {
    return this._permissions;
  }
  set permissions(value: IPermissions[]) {
    this._permissions = value;
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

  get defaultPermission(): boolean {
    return this._defaultPermission;
  }
  set defaultPermission(value: boolean) {
    this._defaultPermission = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get guards(): DGuard[] {
    return this._guards;
  }
  set guards(value: DGuard[]) {
    this._guards = value;
  }

  get applicationCommands(): DApplicationCommand[] {
    return this._applicationCommands;
  }
  set applicationCommands(value: DApplicationCommand[]) {
    this._applicationCommands = value;
  }

  get simpleCommands(): DSimpleCommand[] {
    return this._simpleCommands;
  }
  set simpleCommands(value: DSimpleCommand[]) {
    this._simpleCommands = value;
  }

  get buttons(): DComponentButton[] {
    return this._buttonComponents;
  }
  set buttons(value: DComponentButton[]) {
    this._buttonComponents = value;
  }

  get selectMenus(): DComponentSelectMenu[] {
    return this._selectMenus;
  }
  set selectMenus(value: DComponentSelectMenu[]) {
    this._selectMenus = value;
  }

  get events(): DOn[] {
    return this._events;
  }
  set events(value: DOn[]) {
    this._events = value;
  }

  get instance(): unknown {
    return DIService.instance.getService(this.from);
  }

  protected constructor(name: string, description?: string) {
    super();
    this._name = name;
    this._description = description ?? name;
  }

  static create(name: string, description?: string): DDiscord {
    return new DDiscord(name, description);
  }

  permissionsPromise(
    guild: Guild
  ): Promise<ApplicationCommandPermissionData[]> {
    return resolveIPermission(guild, this.permissions);
  }
}
