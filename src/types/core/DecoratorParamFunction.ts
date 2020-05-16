import { TypeOrPromise } from "./TypeOrPromise";

export type DecoratorParamFunction<ArgType, ReturnType> = (arg?: ArgType) => TypeOrPromise<ReturnType>;
