import { TypeOrPromise } from "../../types/core/TypeOrPromise";

export type DecoratorParamFunction<ArgType, ReturnType> = (
  arg?: ArgType
) => TypeOrPromise<ReturnType>;
