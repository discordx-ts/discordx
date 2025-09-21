/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

/**
 * Base decorator class that tracks metadata about where decorators are applied.
 *
 * This class serves as the foundation for all decorator implementations in the framework,
 * providing a consistent way to track and link decorators across classes, methods, and parameters.
 *
 * @category Decorator
 */
export class Decorator {
  protected _targetClass!: Record<string, any>;
  protected _sourceClass!: Record<string, any>;
  protected _propertyName!: string;
  protected _methodReference?: Record<string, any>;
  protected _parameterIndex?: number;

  /**
   * The zero-based index of the parameter being decorated (parameter decorators only).
   */
  get index(): number | undefined {
    return this._parameterIndex;
  }

  /**
   * The class constructor where this decorator was applied.
   */
  get classRef(): Record<string, any> {
    return this._targetClass;
  }
  set classRef(value: Record<string, any>) {
    this._targetClass = value;
    this.from = value;
  }

  /**
   * The original class where the decoration was first applied.
   * May differ from `classRef` in inheritance scenarios.
   */
  get from(): Record<string, any> {
    return this._sourceClass;
  }
  set from(value: Record<string, any>) {
    this._sourceClass = value;
  }

  /**
   * The name of the property or method being decorated.
   */
  get key(): string {
    return this._propertyName;
  }

  /**
   * The actual method function reference (for method decorators).
   */
  get method(): Record<string, any> | undefined {
    return this._methodReference;
  }

  /**
   * Determines if this decorator was applied to a class constructor.
   */
  get isClass(): boolean {
    return !!this._methodReference;
  }

  /**
   * Automatically detects the decoration target type and applies appropriate metadata.
   *
   * This method handles the complexity of TypeScript's decorator signatures and
   * normalizes them into a consistent internal representation.
   *
   * @param classConstructor - The class constructor
   * @param propertyKey - Property/method name (undefined for class decorators)
   * @param methodDescriptor - Method descriptor (undefined for parameter decorators)
   * @param parameterIndex - Parameter index (undefined for class/method decorators)
   * @returns This instance for method chaining
   */
  attachToTarget(
    classConstructor: Record<string, any>,
    propertyKey?: string,
    methodDescriptor?: PropertyDescriptor,
    parameterIndex?: number,
  ): this {
    const isClassDecoration =
      methodDescriptor === undefined && parameterIndex === undefined;

    const resolvedClass: Record<string, any> = isClassDecoration
      ? classConstructor
      : classConstructor.constructor;

    const resolvedPropertyName = isClassDecoration
      ? resolvedClass.name
      : propertyKey;

    const resolvedMethod = isClassDecoration
      ? resolvedClass
      : methodDescriptor?.value;

    return this.decorate(
      resolvedClass,
      resolvedPropertyName,
      resolvedMethod,
      resolvedClass,
      parameterIndex,
    );
  }

  /**
   * Manually sets all metadata properties for this decorator.
   *
   * @param targetClass - The class being decorated
   * @param propertyName - The property/method name
   * @param methodRef - The method function reference
   * @param sourceClass - The originating class (defaults to targetClass)
   * @param parameterIndex - The parameter position
   * @returns This instance for method chaining
   */
  decorate(
    targetClass: Record<string, any>,
    propertyName: string,
    methodRef?: Record<string, any>,
    sourceClass?: Record<string, any>,
    parameterIndex?: number,
  ): this {
    this._sourceClass = sourceClass ?? targetClass;
    this._targetClass = targetClass;
    this._propertyName = propertyName;
    this._methodReference = methodRef;
    this._parameterIndex = parameterIndex;
    return this;
  }
}
