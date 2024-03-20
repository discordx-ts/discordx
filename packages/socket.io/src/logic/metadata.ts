/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { DIService } from "@discordx/di";
import type { Decorator } from "@discordx/internal";
import { Modifier } from "@discordx/internal";

import type { DEvent } from "../decorators/classes/DEvent.js";
import type { DWs } from "../decorators/classes/DWs.js";
import type { Server } from "../index.js";

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
    DIService.engine.addService(router.classRef);
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
    this.ons
      .filter((on) => on.name === "connection")
      .filter((on) => !on.appId || on.appId === server.appId)
      .forEach((on) => server.on("connection", on.handler(server)));

    this.onces
      .filter((once) => once.name === "connection")
      .filter((once) => !once.appId || once.appId === server.appId)
      .forEach((once) => server.once("connection", once.handler(server)));

    server.on("connection", (sk) => {
      this.ons
        .filter((on) => on.name !== "connection")
        .filter((on) => !on.appId || on.appId === server.appId)
        .forEach((on) => sk.on(on.name, on.handler(server, sk)));

      this.onces
        .filter((once) => once.name !== "connection")
        .filter((once) => !once.appId || once.appId === server.appId)
        .forEach((once) => sk.once(once.name, once.handler(server, sk)));
    });
  }
}
