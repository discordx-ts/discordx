/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { Method } from "./Method.js";

type Args = {
  appId?: string;
  name: string;
};

export class DEvent extends Method {
  private _appId?: string;
  private _name: string;

  get appId(): string | undefined {
    return this._appId;
  }
  set appId(value: string | undefined) {
    this._appId = value;
  }

  get name(): string {
    return this._name;
  }

  protected constructor(data: Args) {
    super();
    this._name = data.name;
    this._appId = data.appId;
  }

  setName(value: string): void {
    this._name = value;
  }

  static create(data: Args): DEvent {
    return new DEvent(data);
  }
}
