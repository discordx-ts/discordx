export type GuardFunction =
  ((...params: any[]) => Promise<boolean> | boolean | Promise<undefined> | undefined);

