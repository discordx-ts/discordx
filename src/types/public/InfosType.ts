export type InfosType<T = { [key: string]: any }> = {
  description?: string
} & { [key: string]: any } & T;
