import { MetadataStorage, DDiscord } from "../..";

// required comment fix
/**
 * Import the commands when using @Discord({ imports: [...] })
 * command.hidden / on.hidden is set to true of the command was imported this way
 * @param classType The class of the imported command / on
 * @param target The class of the destination (the class that is decorated by @Discord)
 */

export function Discord() {
  return (target: Function) => {
    const instance = DDiscord.create(target.name).decorate(target, target.name);
    MetadataStorage.instance.addDiscord(instance);
  };
}
