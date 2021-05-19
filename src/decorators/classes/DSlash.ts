import {} from "../..";
import { DOn } from "./DOn";

export class DSlash extends DOn {
  private _command: string;

  get command() {
    return this.command;
  }

  static createSlash(command: string) {
    const slash = new DSlash();
    slash._command = command;

    return slash;
  }
}
