/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { decorateAClass } from "../util.js";

/**
 * Represents a base decorator class.
 * @category Decorator
 */
export class Decorator {
  protected _classRef!: Record<string, any>;
  protected _from!: Record<string, any>;
  protected _key!: string;
  protected _method?: Record<string, any>;
  protected _index?: number;

  /**
   * Gets the index of the parameter being decorated, if applicable.
   */
  get index(): number | undefined {
    return this._index;
  }

  /**
   * Gets or sets the class reference being decorated.
   */
  get classRef(): Record<string, any> {
    return this._classRef;
  }
  set classRef(value: Record<string, any>) {
    this._classRef = value;
    this.from = value;
  }

  /**
   * Gets or sets the originating class reference.
   */
  get from(): Record<string, any> {
    return this._from;
  }
  set from(value: Record<string, any>) {
    this._from = value;
  }

  /**
   * Gets the key of the property or method being decorated.
   */
  get key(): string {
    return this._key;
  }

  /**
   * Gets the method descriptor if the target is a method.
   */
  get method(): Record<string, any> | undefined {
    return this._method;
  }

  /**
   * Determines if the target is a class.
   */
  get isClass(): boolean {
    return !!this._method;
  }

  /**
   * Decorates an unknown type (class, method, or property).
   * @param classRef - The class reference.
   * @param key - The property key.
   * @param method - The method descriptor.
   * @param index - The parameter index.
   * @returns The current instance.
   */
  decorateUnknown(
    classRef: Record<string, any>,
    key?: string,
    method?: PropertyDescriptor,
    index?: number,
  ): this {
    const decoratedClass = decorateAClass(method) && index === undefined;
    const finalClassRef: Record<string, any> = decoratedClass
      ? classRef
      : classRef.constructor;
    const finalKey = decoratedClass ? finalClassRef.name : key;
    const finalMethod = decoratedClass ? finalClassRef : method?.value;

    return this.decorate(
      finalClassRef,
      finalKey,
      finalMethod,
      finalClassRef,
      index,
    );
  }

  /**
   * Applies the decoration to the specified target.
   * @param classRef - The class reference.
   * @param key - The property key.
   * @param method - The method descriptor.
   * @param from - The originating class reference.
   * @param index - The parameter index.
   * @returns The current instance.
   */
  decorate(
    classRef: Record<string, any>,
    key: string,
    method?: Record<string, any>,
    from?: Record<string, any>,
    index?: number,
  ): this {
    this._from = from ?? classRef;
    this._classRef = classRef;
    this._key = key;
    this._method = method;
    this._index = index;
    return this;
  }
}
