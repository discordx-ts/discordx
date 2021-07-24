import { Decorator } from "./Decorator";

export class DCommandOption extends Decorator {
  private _name!: string;
  private _description!: string;
  private _type!: "string" | "number" | "boolean";

  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }

  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
  }

  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }

  protected constructor() {
    super();
  }

  static create(
    name: string,
    type?: "string" | "number" | "boolean",
    description?: string
  ) {
    const option = new DCommandOption();

    option._name = name.toLowerCase();
    option._type = type ?? "string";
    option._description = description ?? `${name} - ${option.type}`;

    return option;
  }
}
