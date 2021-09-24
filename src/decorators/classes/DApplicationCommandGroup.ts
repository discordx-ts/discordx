import { DApplicationCommand, DApplicationCommandOption } from "..";
import { Decorator } from "./Decorator";

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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static create<InfoTypeEx = DApplicationCommand | DApplicationCommandOption>(
    name: string,
    infos?: Partial<InfoTypeEx>
  ) {
    return new DApplicationCommandGroup<InfoTypeEx>(name, infos);
  }
}
