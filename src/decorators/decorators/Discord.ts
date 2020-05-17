import * as Glob from "glob";
import {
  MetadataStorage,
  DiscordParams,
  DDiscord,
  Expression,
  DiscordParamsLimited,
  DIService,
  DCommand,
  DOn,
  DCommandNotFound,
  ExpressionFunction
} from "../..";

function importCommand(classType: Function, target: Function) {
  DIService.instance.addService(classType);

  const ons = MetadataStorage.instance.events.filter((on) => {
    return on.classRef === classType;
  });

  ons.map((event) => {
    event.hidden = true;
    if (event instanceof DCommand) {
      const newCommand = (
        DCommand
        .createCommand(
          event.commandName
        )
        .decorate(
          target,
          event.key,
          event.method,
          classType
        )
      );
      MetadataStorage.instance.addCommand(newCommand);
    } else if (event instanceof DCommandNotFound) {
      const newCommand = (
        DCommandNotFound
        .createCommandNotFound()
        .decorate(
          target,
          event.key,
          event.method,
          classType
        )
      );
      MetadataStorage.instance.addCommandNotFound(newCommand);
    } else {
      const newCommand = (
        DOn
        .createOn(
          event.event,
          event.once
        )
        .decorate(
          target,
          event.key,
          event.method,
          classType
        )
      );
      MetadataStorage.instance.addOn(newCommand);
    }
  });
}

export function Discord();
export function Discord(prefix: Expression);
export function Discord(prefix: Expression, params: DiscordParamsLimited);
export function Discord(prefix: ExpressionFunction);
export function Discord(prefix: ExpressionFunction, params: DiscordParamsLimited);
export function Discord(prefix?: Expression | ExpressionFunction, params?: DiscordParams) {
  const finalParams = params  || {};

  return (target: Function) => {
    if (finalParams?.import) {
      let importCommands = finalParams?.import || [];
      if (!Array.isArray(importCommands)) {
        importCommands = [importCommands];
      }

      importCommands.map((cmd) => {
        if (typeof cmd === "string") {
          const files = Glob.sync(cmd);
          files.map((file) => {
            let classType;
            const classImport = require(file);
            if (classImport.default) {
              classType = classImport.default;
            } else {
              const key = Object.keys(classImport)[0];
              classType = classImport[key];
            }
            importCommand(classType, target);
          });
        } else {
          importCommand((cmd as any).execute, target);
        }
      });
    }

    const instance = (
      DDiscord
      .createDiscord(
        prefix
      )
      .decorate(
        target,
        target.constructor.name,
        target
      )
    );

    MetadataStorage.instance.addDiscord(instance);
  };
}
