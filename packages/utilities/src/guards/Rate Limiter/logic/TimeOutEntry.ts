/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
export class TimeOutEntry {
  private _currentCallAmount = 0;

  public constructor(
    public userId: string,
    public guildId: string,
    private _rateValue = 1,
  ) {
    this._currentCallAmount++;
  }

  public hasLimitReached(): boolean {
    return !(this._currentCallAmount <= this._rateValue);
  }

  public incrementCallCount(): void {
    this._currentCallAmount++;
  }
}
