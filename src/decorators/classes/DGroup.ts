import { Decorator } from "./Decorator";
import { DOption } from "./DOption";
import { DSlash } from "./DSlash";

export class DGroup<InfoType = DSlash | DOption> extends Decorator {
  name!: string;
  infos!: Partial<InfoType>;

  protected constructor() {
    super();
  }

  static create<InfoType = DSlash | DOption>(
    name: string,
    infos?: Partial<InfoType>
  ) {
    const group = new DGroup<InfoType>();

    group.name = name.toLowerCase();
    group.infos = infos ?? {};

    return group;
  }
}
