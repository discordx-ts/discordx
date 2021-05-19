import {
  MetadataStorage,
  DCommand,
  Modifier,
  DDiscord,
  InfosType,
  TypeOrPromise,
} from "../..";

export function Infos<Type = any>(infos: InfosType<Type>);
export function Infos<Type = any>(
  infos: (command: DCommand) => TypeOrPromise<InfosType<Type>>
);
export function Infos<Type = any>(
  infos:
    | InfosType<Type>
    | ((command: DCommand) => TypeOrPromise<InfosType<Type>>)
) {
  const normalizedInfos =
    typeof infos === "function" ? (infos as Function) : () => infos;

  return (
    target: Function,
    key?: string,
    descriptor?: PropertyDescriptor
  ): void => {
    MetadataStorage.instance.addModifier(
      Modifier.createModifier<DCommand | DDiscord>(async (original) => {
        const newInfos = await normalizedInfos(original as any);
        original.infos = {
          ...original.infos,
          ...newInfos,
        };
      }).decorateUnknown(target, key, descriptor)
    );
  };
}
