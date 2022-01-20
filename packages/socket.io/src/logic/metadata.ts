import { Decorator, Modifier } from "@discordx/internal";
import { DEvent } from "../decorators/classes/DEvent.js";
import { DIService } from "@discordx/di";
import { DWs } from "../decorators/classes/DWs.js";
import { Server } from "../index.js";

export class MetadataStorage {
  // internal

  private static _isBuilt = false;
  private static _instance: MetadataStorage;
  private _modifiers: Array<Modifier<Decorator>> = [];

  // storage

  private _sockets: DWs[] = [];
  private _ons: DEvent[] = [];
  private _onces: DEvent[] = [];

  // internal getters

  static get instance(): MetadataStorage {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }
  static set instance(value: MetadataStorage) {
    this._instance = value;
  }

  static get isBuilt(): boolean {
    return this._isBuilt;
  }

  // storage getter

  get sockets(): readonly DWs[] {
    return this._sockets;
  }

  get ons(): readonly DEvent[] {
    return this._ons;
  }

  get onces(): readonly DEvent[] {
    return this._onces;
  }

  // methods

  adDWs(router: DWs): void {
    this._sockets.push(router);
    DIService.instance.addService(router.classRef);
  }

  addOn(handler: DEvent): void {
    this._ons.push(handler);
  }

  addOnce(handler: DEvent): void {
    this._onces.push(handler);
  }

  addModifier<T extends Decorator = Decorator>(modifier: Modifier<T>): void {
    this._modifiers.push(modifier as Modifier<Decorator>);
  }

  async build(server: Server): Promise<void> {
    // build the instance if not already built
    if (MetadataStorage.isBuilt) {
      return;
    }
    MetadataStorage._isBuilt = true;

    await Modifier.applyFromModifierListToList(this._modifiers, this._sockets);
    await Modifier.applyFromModifierListToList(this._modifiers, this._ons);

    // bind classes
    this.sockets.forEach((sck) => {
      [...this.ons, ...this.onces].forEach((on) => {
        if (on.from === sck.from) {
          on.socket = sck;
        }
      });
    });

    // bind all on calls
    this.ons.forEach((on) => {
      if (!on.appId || on.appId === server.appId) {
        if (on.name === "connection") {
          server.on("connection", on.handler(server));
        } else {
          server.on("connection", (sk) => {
            sk.on(on.name, on.handler(server, sk));
          });
        }
      }
    });

    // bind all once calls
    this.onces.forEach((once) => {
      if (!once.appId || once.appId === server.appId) {
        if (once.name === "connection") {
          server.once("connection", once.handler(server));
        } else {
          server.on("connection", (sk) => {
            sk.once(once.name, once.handler(server, sk));
          });
        }
      }
    });
  }
}
