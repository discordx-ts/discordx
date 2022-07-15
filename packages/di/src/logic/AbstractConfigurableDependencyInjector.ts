export abstract class AbstractConfigurableDependencyInjector<T> {
  protected injector: T | undefined;

  public setInjector(injector: T): this {
    this.injector = injector;
    return this;
  }
}
