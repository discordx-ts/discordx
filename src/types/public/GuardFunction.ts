import { Client, Next } from "../..";

export type GuardFunction<Type = any, DatasType = any> = (params: Type, client: Client, next: Next, datas: DatasType) => any;

