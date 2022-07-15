import type { InstanceOf } from "../index.js";
import type { IDependencyRegistryEngine } from "./IDependencyRegistryEngine.js";

export abstract class AbstractConfigurableDependencyInjector<I>
  implements IDependencyRegistryEngine
{
  protected injector: I | undefined;

  public setInjector(injector: I): this {
    this.injector = injector;
    return this;
  }

  public abstract addService<T>(classType: T): void;

  public abstract getAllServices(): Set<unknown>;

  public abstract getService<T>(classType: T): InstanceOf<T> | null;
}
