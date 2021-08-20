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
    this.name = name.toLowerCase();
    this.infos = infos ?? {};
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static create<InfoType = DApplicationCommand | DApplicationCommandOption>(
    name: string,
    infos?: Partial<InfoType>
  ) {
    return new DApplicationCommandGroup<InfoType>(name, infos);
  }
}
