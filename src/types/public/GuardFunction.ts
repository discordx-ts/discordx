import { Client, Next } from "../..";

export type GuardFunction<Type = unknown, DatasType = unknown> = (
  params: Type,
  client: Client,
  next: Next,
  datas: DatasType
) => unknown;
