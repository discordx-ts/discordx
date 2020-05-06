import { GuardFunction } from "..";

export interface DGuard {
  fn: GuardFunction;
  method: Function;
}
