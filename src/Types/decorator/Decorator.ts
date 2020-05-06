export interface Decorator<Type> {
  class: any;
  key: string;
  params: Type;
}
