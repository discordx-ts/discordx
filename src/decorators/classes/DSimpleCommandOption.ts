import { Decorator } from "./Decorator.js";
import { SimpleCommandType } from "../../index.js";

/**
 * @category Decorator
 */
export class DSimpleCommandOption extends Decorator {
  private _name: string;
  private _description: string;
  private _type: SimpleCommandType;

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get type(): SimpleCommandType {
    return this._type;
  }
  set type(value: SimpleCommandType) {
    this._type = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  protected constructor(
    name: string,
    type?: SimpleCommandType,
    description?: string
  ) {
    super();
    this._name = name;
    this._description = description ?? `${type ?? "STRING"}`;
    this._type = type ?? "STRING";
  }

  static create(
    name: string,
    type?: SimpleCommandType,
    description?: string
  ): DSimpleCommandOption {
    return new DSimpleCommandOption(name, type, description);
  }
}
