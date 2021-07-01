import { Decorator } from "./Decorator";

export class DGroup<InfoType = any> extends Decorator {
  name: string | undefined;
  infos: Partial<InfoType> | undefined;

  protected constructor() {
    super();
  }

  static create<InfoType = any>(name: string, infos?: Partial<InfoType>) {
    const group = new DGroup<InfoType>();

    group.name = name.toLowerCase();
    group.infos = infos;

    return group;
  }
}
