import { DSlash, DOption } from "..";
import { Decorator } from "./Decorator";

export class DGroup<InfoType = DSlash | DOption> extends Decorator {
  name: string | undefined;
  infos: Partial<InfoType> | undefined;

  protected constructor() {
    super();
  }

  static create<InfoType = DSlash | DOption>(
    name: string,
    infos?: Partial<InfoType>
  ) {
    const group = new DGroup<InfoType>();

    group.name = name.toLowerCase();
    group.infos = infos;

    return group;
  }
}
