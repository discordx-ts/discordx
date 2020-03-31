import {
  IOn,
  IDecorator,
  IInstance,
  IGuard,
  Client
} from "..";
import { Prefix } from "../Guards";
import { CommandMessage } from "../Types/CommandMessage";
import { IDiscordParams, ICommandParams, ICommandInfos } from "../Types";

export class MetadataStorage {
  private static _instance: MetadataStorage;
  private _ons: IDecorator<IOn>[] = [];
  private _guards: IDecorator<IGuard>[] = [];
  private _instances: IDecorator<IInstance>[] = [];

  static get Instance() {
    if (!this._instance) {
      this._instance = new MetadataStorage();
    }
    return this._instance;
  }

  get Ons() {
    return this.getReadonlyArray(this._ons);
  }

  AddOn(on: IDecorator<IOn>) {
    this._ons.push(on);
  }

  AddGuard(guard: IDecorator<IGuard>) {
    this._guards.push(guard);
  }

  AddInstance(classType: IDecorator<IInstance>) {
    this._instances.push({
      ...classType,
      params: {
        instance: new classType.class(),
        ...classType.params
      }
    });
  }

  Build(client: Client) {
    const commands = this._ons.reduce<string[]>((prev, on) => {
      if (on.params.commandName) {
        prev.push(on.params.commandName);
      }
      return prev;
    }, []);

    this._ons.map((on) => {
      on.params.guards = this._guards.reverse().filter((guard) => {
        return (
          guard.class === on.class &&
          guard.params.method === on.params.method
        );
      }, []);

      on.params.guardFn = async (client: Client, ...params: any) => {
        let res = true;
        for (const fn of on.params.guards) {
          if (res) {
            res = await fn.params.fn(...params, client);
          } else {
            break;
          }
        }
        return res;
      };

      const instance = this._instances.find((instance) => instance.class === on.class);
      if (instance) {
        on.params.linkedInstance = instance;
      }

      on.params.compiledMethod = async (...params: any[]) => {
        let command: IDecorator<IOn> = on;
        let execute = true;

        if (on.params.event === "message") {
          if (on.params.commandName !== undefined) {
            execute = false;
            const message = params[0] as CommandMessage;
            const prefix = on.params.prefix || on.params.linkedInstance.params.prefix;
            if (Prefix(prefix)(message)) {
              if (message.author.id !== client.user.id) {
                const params = message.content.split(" ");

                let testedCommand = params[0].replace(prefix, "");
                let commandName = on.params.commandName;
                let allCommands = commands;
                const lowerCommands = allCommands.map((command) => command.toLowerCase());
                const notFoundFn = this._ons.find((cmd) => {
                  return (
                    (cmd.params.prefix || cmd.params.linkedInstance.params.prefix) === prefix &&
                    cmd.params.commandName === ""
                  );
                });

                if (testedCommand.toLowerCase() === commandName.toLowerCase()) {
                  const originalCommand = testedCommand;

                  message.prefix = prefix;
                  message.command = testedCommand;
                  message.commandWithPrefix = prefix + testedCommand;
                  message.originalCommand = originalCommand;
                  message.originalCommandWithPrefix = prefix + originalCommand;
                  message.params = params;
                  message.params.splice(0, 1);

                  if (
                    !on.params.linkedInstance.params.commandCaseSensitive &&
                    !on.params.commandCaseSensitive &&
                    on.params.commandCaseSensitive !== undefined
                  ) {
                    testedCommand = testedCommand.toLowerCase();
                    commandName = commandName.toLowerCase();
                    allCommands = lowerCommands;
                  }

                  if (allCommands.indexOf(testedCommand) === -1) {
                    if (notFoundFn) {
                      command = notFoundFn;
                      execute = true;
                    }
                  }
                } else {
                  if (lowerCommands.indexOf(testedCommand.toLowerCase()) === -1) {
                    testedCommand = "";
                  }
                }

                if (testedCommand === commandName) {
                  execute = true;
                  command = on;
                }
              }
            }
          }
        }

        if (execute) {
          const executeMain = await command.params.guardFn(client, ...params);
          if (executeMain) {
            return await this.executeBindedOn(command, params, client);
          }
        }
      };
    });
  }

  setDiscordParams(discordInstance: InstanceType<any>, params: IDiscordParams): boolean {
    const discord = this._instances.find((instance) => instance.params.instance === discordInstance);

    if (discord) {
      discord.params = {
        ...discord.params,
        ...params
      };
      return true;
    }

    return false;
  }

  getCommands<InfoType = any>(forPrefix?: string) {
    return this.getCommandsIntrospection(forPrefix).map<ICommandInfos<InfoType>>((command) => {
      return {
        prefix: command.prefix || command.linkedInstance.params.prefix,
        commandName: command.commandName,
        description: command.description,
        infos: command.infos
      };
    });
  }

  getCommandsIntrospection(forPrefix?: string) {
    return this._ons.reduce<IOn[]>((prev, on) => {
      if (on.params.commandName) {
        if (forPrefix) {
          const prefix = on.params.prefix || on.params.linkedInstance.params.prefix;
          if (forPrefix === prefix) {
            prev.push(on.params);
          }
        } else {
          prev.push(on.params);
        }
      }
      return prev;
    }, []);
  }

  setCommandParams(discordInstance: InstanceType<any>, instanceMethod: Function, params: ICommandParams): boolean {
    const on = this._ons.find((on) => (
      on.params.linkedInstance.params.instance === discordInstance &&
      on.params.method === instanceMethod
    ));

    if (on) {
      on.params = {
        ...on.params,
        ...params
      };
      return true;
    }

    return false;
  }

  compileOnForEvent(
    event: string,
    client: Client,
    once: boolean = false
  ) {
    const ons = this._ons.filter(on => (
      on.params.event === event &&
      on.params.once === once
    ));

    return async (...params: any[]) => {
      for (const on of ons) {
        await on.params.compiledMethod(...params, client);
      }
    };
  }

  private executeBindedOn(on: IDecorator<IOn>, params: any[], client: Client) {
    if (on.params.linkedInstance && on.params.linkedInstance.params.instance) {
      return on.params.method.bind(on.params.linkedInstance.params.instance)(...params, client);
    } else {
      return on.params.method(...params, client);
    }
  }

  private getReadonlyArray<Type>(array: Type[]) {
    return array as ReadonlyArray<Type>;
  }
}
