import { InstanceOf, ToInterface } from "../../types";
import { Decorator } from "./Decorator";

export class DGroup<InfoType = any> extends Decorator {
  name: string;
  infos: Partial<InfoType>;

  protected constructor() {
    super();
  }

  static create<InfoType = any>(name: string, infos?: Partial<InfoType>) {
    const group = new DGroup<InfoType>();

    group.name = name.toLocaleLowerCase();
    group.infos = infos || {} as any;

    return group;
  }
}
