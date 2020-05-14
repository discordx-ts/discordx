export type CommandName = ((params: any) => Promise<string> | string) | RegExp | string;
