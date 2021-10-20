import { Category } from "../../../src/category";
import { Discord } from "discordx";

@Discord()
@Category("Admin Commands", "cate description")
@Category("Admin Commands", [
  { description: " kick a user", name: "kick", options: [], type: "SLASH" },
  { description: " ban a user", name: "ban", options: [], type: "SLASH" },
])
export abstract class SlashExample {
  // commands
}
