import { MetadataStorage, DCommandNotFound } from "../..";

export function CommandNotFound();
export function CommandNotFound();
export function CommandNotFound() {
  return (
    target: Object,
    key: string,
    descriptor: PropertyDescriptor
  ): void => {
    const commandNotFound = DCommandNotFound.createCommandNotFound().decorate(
      target.constructor,
      key,
      descriptor.value
    );

    MetadataStorage.instance.addCommandNotFound(commandNotFound);
  };
}
