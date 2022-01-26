/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Client, Next } from "../../index.js";

export type GuardFunction<Type = any, DatasType = any> = (
  params: Type,
  client: Client,
  next: Next,
  datas: DatasType
) => any;
