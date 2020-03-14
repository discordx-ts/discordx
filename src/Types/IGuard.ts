import { GuardFunction } from ".";

export interface IGuard {
  fn: GuardFunction;
  method: Function;
}
