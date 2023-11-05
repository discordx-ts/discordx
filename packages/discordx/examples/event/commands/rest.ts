import type { RestArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class Example {
  @On.rest()
  rateLimited([data]: RestArgsOf<"rateLimited">): void {
    console.log(data.limit);
  }
}
