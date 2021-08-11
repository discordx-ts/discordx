import { Decorator } from "./Decorator";
import { DSlashOption } from "./DSlashOption";
import { DApplicationCommand } from "./DApplicationCommand";

export class DSlashGroup<InfoType = DApplicationCommand | DSlashOption> extends Decorator {
  name: string;
  infos: Partial<InfoType>;

  protected constructor(name: string, infos?: Partial<InfoType>) {
    super();
    this.name = name.toLowerCase();
    this.infos = infos ?? {};
  }

  static create<InfoType = DApplicationCommand | DSlashOption>(
    name: string,
    infos?: Partial<InfoType>
  ) {
    return new DSlashGroup<InfoType>(name, infos);
  }
}
