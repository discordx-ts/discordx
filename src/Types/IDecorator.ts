export interface IDecorator<Type> {
  class: any;
  key: string;
  params: Type;
}
