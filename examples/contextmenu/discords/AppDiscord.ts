import { Discord, ContextMenu } from "../../../src";

@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "Hello from discord.ts")
  async messageHandler() {
    console.log("I am message");
  }

  @ContextMenu("USER", "Hello from discord.ts")
  async userHandler() {
    console.log("I am user");
  }
}
