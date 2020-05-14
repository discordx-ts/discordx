import { DOn } from "./DOn";

export class DCommandNotFound extends DOn {
  static createCommandNotFound(
  ) {
    const cnf = new DCommandNotFound();
    cnf.event = "message";
    cnf.once = false;
    return cnf;
  }
}

