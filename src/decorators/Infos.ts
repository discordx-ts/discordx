import {
  MetadataStorage,
  DCommand,
  Modifier,
  DDiscord,
  InfosType,
  TypeOrPromise
} from "..";

export function Infos<Type = any>(infos: InfosType<Type>);
export function Infos<Type = any>(
  infos: ((command: DCommand) => TypeOrPromise<InfosType<Type>>)
);
export function Infos<Type = any>(
  infos: InfosType<Type> | ((command: DCommand) => TypeOrPromise<InfosType<Type>>)
) {
  const normalizedInfos = typeof infos === "function" ? infos as Function : () => infos;

  return (target: Function, key?: string, descriptor?: PropertyDescriptor): void => {
    MetadataStorage.instance.addModifier(
      Modifier
      .createModifier<DCommand | DDiscord>(
        async (original) => {
          original.infos = {
            ...original.infos,
            ...(await normalizedInfos(original as any))
          };
        }
      )
      .decorateUnknown(
        target,
        key,
        descriptor
      )
    );
  };
}
