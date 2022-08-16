import type { RestArgsOf } from "../../../src/index.js";
import { Discord, On } from "../../../src/index.js";

@Discord()
export class Example {
  @On.rest()
  rateLimited([data]: RestArgsOf<"rateLimited">): void {
    console.log(data.limit);
  }
}
