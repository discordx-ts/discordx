import { Client, Next } from "../..";

export type GuardFunction<Type, DatasType = unknown> = (
  params: Type,
  client: Client,
  next: Next,
  datas: DatasType
) => any;
