import { DApplicationCommand, DApplicationCommandOption } from "../index.mjs";
import { Decorator } from "./Decorator.mjs";

/**
 * @category Decorator
 */
export class DApplicationCommandGroup<
  InfoType = DApplicationCommand | DApplicationCommandOption
> extends Decorator {
  name: string;
  infos: Partial<InfoType>;

  protected constructor(name: string, infos?: Partial<InfoType>) {
    super();
    this.name = name;
    this.infos = infos ?? {};
  }

  static create<InfoTypeEx = DApplicationCommand | DApplicationCommandOption>(
    name: string,
    infos?: Partial<InfoTypeEx>
  ): DApplicationCommandGroup<InfoTypeEx> {
    return new DApplicationCommandGroup<InfoTypeEx>(name, infos);
  }
}
