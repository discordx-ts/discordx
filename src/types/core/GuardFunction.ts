import { Client, Next } from "../..";

export type GuardFunction<Type = any> = (params: Type, client: Client, next: Next, datas: any) => any;

