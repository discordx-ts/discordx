import {
  MetadataStorage,
  DiscordParams,
  DDiscord
} from "..";
import * as Glob from "glob";

function importCommand(classType: Function, target: Function) {
  const ons = MetadataStorage.instance.events.filter((on) => {
    return on.classRef === classType;
  });

  ons.map((on) => {
    on.classRef = target;
    on.from = classType;
  });
}

export function Discord();
export function Discord(params: DiscordParams);
export function Discord(params?: DiscordParams) {
  const definedParams = params || {};

  return (target: Function) => {
    if (definedParams.importCommands) {
      definedParams.importCommands.map((cmd) => {
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
        definedParams.message,
        definedParams.prefix,
        definedParams.argsRules,
        definedParams.argsSeparator
      )
      .decorate(
        target,
        target.constructor.name
      )
    );

    MetadataStorage.instance.addDiscord(instance);
  };
}
