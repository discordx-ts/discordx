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
  ExpressionFunction,
} from "../..";

/**
 * Import the commands when using @Discord({ imports: [...] })
 * command.hidden / on.hidden is set to true of the command was imported this way
 * @param classType The class of the imported command / on
 * @param target The class of the destination (the class that is decorated by @Discord)
 */
function importCommand(classType: Function, target: Function) {
  DIService.instance.addService(classType);

  const ons = MetadataStorage.instance.events.filter((on) => {
    return on.classRef === classType;
  });

  ons.map((event) => {
    // Set the property hidden to true when
    // it's imported
    event.hidden = true;
    event.from = target;
  });
}

export function Discord();
export function Discord(prefix: Expression);
export function Discord(prefix: Expression, params: DiscordParamsLimited);
export function Discord(prefix: ExpressionFunction);
export function Discord(
  prefix: ExpressionFunction,
  params: DiscordParamsLimited
);
export function Discord(
  prefix?: Expression | ExpressionFunction,
  params?: DiscordParams
) {
  const finalParams = params || {};

  return (target: Function, key: string) => {
    if (finalParams?.import) {
      let importCommands = finalParams?.import || [];
      if (!Array.isArray(importCommands)) {
        importCommands = [importCommands];
      }

      // For the commands that were imported like @Discord({ import: [...] })
      importCommands.map((cmd) => {
        if (typeof cmd === "string") {
          // For the commands that were imported like @Discord({ import: ["*.ts"] })
          const files = Glob.sync(cmd);
          files.map((file) => {
            let classType;
            const classImport = require(file);
            if (classImport.default) {
              // If the class was exported by default it sets
              // the classType to the default export
              // export default MyClass
              classType = classImport.default;
            } else {
              // If the class was exported inside a file it sets
              // the classType to the first export
              // export MyClass
              const key = Object.keys(classImport)[0];
              classType = classImport[key];
            }
            importCommand(classType, target);
          });
        } else {
          // For the commands that were imported like @Discord({ import: [MyClass] })
          importCommand(cmd, target);
        }
      });
    }

    const instance = DDiscord.createDiscord(prefix, target.name).decorate(
      target,
      target.name
    );

    MetadataStorage.instance.addDiscord(instance);
  };
}
