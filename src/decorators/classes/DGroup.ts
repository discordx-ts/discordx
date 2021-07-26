import { Decorator } from "./Decorator";
import { DOption } from "./DOption";
import { DSlash } from "./DSlash";

export class DGroup<InfoType = DSlash | DOption> extends Decorator {
  name: string;
  infos: Partial<InfoType>;

  protected constructor(name: string, infos?: Partial<InfoType>) {
    super();
    this.name = name.toLowerCase();
    this.infos = infos ?? {};
  }

  static create<InfoType = DSlash | DOption>(
    name: string,
    infos?: Partial<InfoType>
  ) {
    return new DGroup<InfoType>(name, infos);
  }
}
