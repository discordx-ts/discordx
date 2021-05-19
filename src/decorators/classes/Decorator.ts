import { DecoratorUtils } from "../../logic";

export class Decorator {
  protected _classRef: Function;
  protected _from: Function;
  protected _key: string;
  protected _method: Function;
  protected _index: number = undefined;

  get index() {
    return this._index;
  }

  get classRef() {
    return this._classRef;
  }
  set classRef(value: Function) {
    this._classRef = value;
    this.from = value;
  }

  get from() {
    return this._from;
  }
  set from(value: Function) {
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

  protected constructor() {}

  static create(...params: any[]) {}

  decorateUnknown(
    classRef: Function | Object,
    key?: string,
    method?: PropertyDescriptor,
    index?: number
  ) {
    const decorateAClass = DecoratorUtils.decorateAClass(method) && index === undefined;

    const finalClassRef: Function = decorateAClass
      ? (classRef as Function)
      : classRef.constructor;
    const finalKey = decorateAClass ? finalClassRef.name : key;
    const finalMethod = decorateAClass ? finalClassRef : method?.value;

    return this.decorate(finalClassRef, finalKey, finalMethod, finalClassRef, index);
  }

  decorate(
    classRef: Function,
    key: string,
    method?: Function,
    from?: Function,
    index?: number
  ) {
    this._from = from || classRef;
    this._classRef = classRef;
    this._key = key;
    this._method = method;
    this._index = index;

    this.update();

    return this;
  }

  update() {}
}
