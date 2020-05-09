import {
  MetadataStorage,
  DiscordParams
} from "..";
import * as Glob from "glob";

function importCommand(classType: Function, target: Object) {
  const ons = MetadataStorage.instance.ons.filter((on) => {
    return on.class === classType;
  });
  ons.map((on) => {
    on.class = target;
    on.params.commandName = on.params.originalParams.commandName || classType.name;
    on.params.from = classType;
  });
}

export function Discord();
export function Discord(params: DiscordParams);
export function Discord(params?: DiscordParams) {
  const definedParams = params || {};
  return (target: Object) => {
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

    MetadataStorage.instance.addInstance({
      class: target,
      key: target.constructor.name,
      params: {
        prefix: definedParams.prefix || "",
        commandCaseSensitive: definedParams.commandCaseSensitive || false
      }
    });
  };
}
