import * as Glob from "glob";
import {
  MetadataStorage,
  DiscordParams,
  DDiscord,
  DIService,
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
export function Discord(params: DiscordParams);
export function Discord(params?: DiscordParams) {
  return (target: Function, key: string) => {
    if (params?.import) {
      let importCommands = params?.import || [];
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

    const instance = DDiscord.create(target.name).decorate(
      target,
      target.name
    );

    MetadataStorage.instance.addDiscord(instance);
  };
}
