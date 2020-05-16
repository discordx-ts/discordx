export type InstanceOf<T> = T extends new (...args: any[]) => infer R ? R : any;
