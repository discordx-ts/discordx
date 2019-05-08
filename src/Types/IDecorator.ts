export interface IDecorator<Type> {
  class: Object;
  key: string;
  params: Type;
}
