import { ContextMenu, Discord } from "../../../src";

@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "Hello from discord.ts")
  async messageHandler(): Promise<void> {
    console.log("I am message");
  }

  @ContextMenu("USER", "Hello from discord.ts")
  async userHandler(): Promise<void> {
    console.log("I am user");
  }
}
