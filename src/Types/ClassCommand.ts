import { Client, CommandMessage } from "..";

export interface ClassCommand {
  execute(command: CommandMessage, client: Client): Promise<any> | any;
}
