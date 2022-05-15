import { DIService } from "@discordx/di";
import { Decorator } from "@discordx/internal";

import type {
  DApplicationCommand,
  DComponent,
  DGuard,
  DOn,
  DSimpleCommand,
  IGuild,
  IPermissions,
} from "../../index.js";

/**
 * @category Decorator
 */
export class DDiscord extends Decorator {
  private _applicationCommands: DApplicationCommand[] = [];
  private _botIds: string[] = [];
  private _buttonComponents: DComponent[] = [];
  private _defaultPermission = true;
  private _description: string;
  private _events: DOn[] = [];
  private _guards: DGuard[] = [];
  private _guilds: IGuild[] = [];
  private _modalComponents: DComponent[] = [];
  private _name: string;
  private _permissions: IPermissions[] = [];
  private _selectMenuComponents: DComponent[] = [];
  private _simpleCommands: DSimpleCommand[] = [];

  get applicationCommands(): DApplicationCommand[] {
    return this._applicationCommands;
  }
  set applicationCommands(value: DApplicationCommand[]) {
    this._applicationCommands = value;
  }

  get botIds(): string[] {
    return this._botIds;
  }
  set botIds(value: string[]) {
    this._botIds = value;
  }

  get buttons(): DComponent[] {
    return this._buttonComponents;
  }
  set buttons(value: DComponent[]) {
    this._buttonComponents = value;
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

  get events(): DOn[] {
    return this._events;
  }
  set events(value: DOn[]) {
    this._events = value;
  }

  get guards(): DGuard[] {
    return this._guards;
  }
  set guards(value: DGuard[]) {
    this._guards = value;
  }

  get guilds(): IGuild[] {
    return this._guilds;
  }
  set guilds(value: IGuild[]) {
    this._guilds = value;
  }

  get instance(): unknown {
    return DIService.instance.getService(this.from);
  }

  get modal(): DComponent[] {
    return this._modalComponents;
  }
  set modal(value: DComponent[]) {
    this._modalComponents = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get permissions(): IPermissions[] {
    return this._permissions;
  }
  set permissions(value: IPermissions[]) {
    this._permissions = value;
  }

  get selectMenus(): DComponent[] {
    return this._selectMenuComponents;
  }
  set selectMenus(value: DComponent[]) {
    this._selectMenuComponents = value;
  }

  get simpleCommands(): DSimpleCommand[] {
    return this._simpleCommands;
  }
  set simpleCommands(value: DSimpleCommand[]) {
    this._simpleCommands = value;
  }

  protected constructor(name: string, description?: string) {
    super();
    this._name = name;
    this._description = description ?? name;
  }

  static create(name: string, description?: string): DDiscord {
    return new DDiscord(name, description);
  }
}
