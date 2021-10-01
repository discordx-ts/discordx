import { Category } from "../../../src/category/client";
import { Discord } from "discordx";

@Discord()
@Category("Admin Commands")
@Category("Admin Commands", [
  { description: " kick a user", name: "kick", type: "SLASH" },
  { description: " ban a user", name: "ban", type: "SLASH" },
])
export abstract class SlashExample {
  // commands
}
