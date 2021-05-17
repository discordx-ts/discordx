export type InfosType<T = { [key: string]: any }> = {
  description?: string;
  name?: string;
} & { [key: string]: any } & T;
