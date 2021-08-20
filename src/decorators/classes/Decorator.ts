import { DecoratorUtils } from "../..";

export class Decorator {
  protected _classRef!: Record<string, any>;
  protected _from!: Record<string, any>;
  protected _key!: string;
  protected _method?: Record<string, any>;
  protected _index?: number = undefined;

  get index() {
    return this._index;
  }

  get classRef() {
    return this._classRef;
  }
  set classRef(value: Record<string, any>) {
    this._classRef = value;
    this.from = value;
  }

  get from() {
    return this._from;
  }
  set from(value: Record<string, any>) {
    this._from = value;
  }

  get key() {
    return this._key;
  }

  get method() {
    return this._method;
  }

  get isClass() {
    return !!this._method;
  }

  protected constructor() {
    // protected constructor
  }

  decorateUnknown(
    classRef: Record<string, any>,
    key?: string,
    method?: PropertyDescriptor,
    index?: number
  ) {
    const decorateAClass =
      DecoratorUtils.decorateAClass(method) && index === undefined;

    const finalClassRef: Record<string, any> = decorateAClass
      ? classRef
      : classRef.constructor;
    const finalKey = decorateAClass ? finalClassRef.name : key;
    const finalMethod = decorateAClass ? finalClassRef : method?.value;

    return this.decorate(
      finalClassRef,
      finalKey,
      finalMethod,
      finalClassRef,
      index
    );
  }

  decorate(
    classRef: Record<string, any>,
    key: string,
    method?: Record<string, any>,
    from?: Record<string, any>,
    index?: number
  ) {
    this._from = from ?? classRef;
    this._classRef = classRef;
    this._key = key;
    this._method = method;
    this._index = index as number;
    return this;
  }
}
