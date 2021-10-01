import { Category } from "../../../src/category/client";
import { Discord } from "discordx";

@Discord()
@Category("Admin Commands")
@Category("Admin Commands", [
  { description: " kick a user", name: "kick", options: [], type: "SLASH" },
  { description: " ban a user", name: "ban", options: [], type: "SLASH" },
])
export abstract class SlashExample {
  // commands
}
