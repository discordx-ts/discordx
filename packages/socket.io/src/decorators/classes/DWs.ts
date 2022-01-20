import { DGuard } from "../index.js";
import { DIService } from "@discordx/di";
import { Decorator } from "@discordx/internal";

type Args = {
  appId?: string;
};

export class DWs extends Decorator {
  private _appId?: string;
  protected _guards: DGuard[] = [];

  get appId(): string | undefined {
    return this._appId;
  }
  set appId(value: string | undefined) {
    this._appId = value;
  }

  get guards(): DGuard[] {
    return this._guards;
  }
  set guards(value: DGuard[]) {
    this._guards = value;
  }

  get instance(): unknown {
    return DIService.instance.getService(this.from);
  }

  protected constructor(data: Args) {
    super();
    this._appId = data.appId;
  }

  static create(data: Args): DWs {
    return new DWs(data);
  }
}
