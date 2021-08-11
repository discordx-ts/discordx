import { Decorator } from "./Decorator";

export class DSimpleCommandOption extends Decorator {
  private _name: string;
  private _description: string;
  private _type: "string" | "number" | "boolean";

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

  protected constructor(
    name: string,
    type?: "string" | "number" | "boolean",
    description?: string
  ) {
    super();
    this._name = name;
    this._description = description ?? `${name} - ${this.type}`;
    this._type = type ?? "string";
  }

  static create(
    name: string,
    type?: "string" | "number" | "boolean",
    description?: string
  ) {
    return new DSimpleCommandOption(name, type, description);
  }
}
