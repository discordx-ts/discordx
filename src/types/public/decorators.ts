/* eslint-disable @typescript-eslint/no-explicit-any */
export type ClassDecoratorEx = <
  TFunction extends Record<string, FunctionConstructor>
>(
  target: TFunction
) => void | TFunction;

export type PropertyDecorator = (
  target: Record<string, any>,
  propertyKey: string
) => void;

export type MethodDecoratorEx = <T>(
  target: Record<string, any>,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export type ParameterDecoratorEx = (
  target: Record<string, any>,
  propertyKey: string,
  parameterIndex: number
) => void;

export type ClassMethodDecorator = <T>(
  target: Record<string, any>,
  propertyKey?: string,
  descriptor?: TypedPropertyDescriptor<T>
) => void;
