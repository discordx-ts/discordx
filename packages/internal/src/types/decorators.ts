export type ClassDecoratorEx = (
  target: Record<string, any>,
  propertyKey?: undefined,
  descriptor?: undefined
) => void;

export type PropertyDecorator = (
  target: Record<string, any>,
  propertyKey: string,
  descriptor?: undefined
) => void;

export type MethodDecoratorEx = <T>(
  target: Record<string, any>,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) => void;

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
