/* eslint-disable @typescript-eslint/no-explicit-any */
import { DecoratorUtils } from "../../index.js";

/**
 * @category Decorator
 */
export class Decorator {
  protected _classRef!: Record<string, any>;
  protected _from!: Record<string, any>;
  protected _key!: string;
  protected _method?: Record<string, any>;
  protected _index?: number = undefined;

  get index(): number | undefined {
    return this._index;
  }

  get classRef(): Record<string, any> {
    return this._classRef;
  }
  set classRef(value: Record<string, any>) {
    this._classRef = value;
    this.from = value;
  }

  get from(): Record<string, any> {
    return this._from;
  }
  set from(value: Record<string, any>) {
    this._from = value;
  }

  get key(): string {
    return this._key;
  }

  get method(): Record<string, any> | undefined {
    return this._method;
  }

  get isClass(): boolean {
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
  ): this {
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
  ): this {
    this._from = from ?? classRef;
    this._classRef = classRef;
    this._key = key;
    this._method = method;
    this._index = index as number;
    return this;
  }
}
