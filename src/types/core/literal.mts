export type SpecialCharacters =
  | "~"
  | "`"
  | "!"
  | "@"
  | "#"
  | "$"
  | "%"
  | "^"
  | "&"
  | "*"
  | "("
  | ")"
  | "+"
  | "="
  | "{"
  | "}"
  | "["
  | "]"
  | "|"
  | "\\"
  | "/"
  | ":"
  | ";"
  | '"'
  | "'"
  | "<"
  | ">"
  | ","
  | "."
  | "?"
  | " ";

export type ForbidCharacter<
  S extends string,
  Character extends string
> = S extends `${string}${Character}${string}` ? never : S;

export type WhitelistWords<S, D extends string> = S extends ""
  ? unknown
  : S extends `${D}${infer Tail}`
  ? WhitelistWords<Tail, D>
  : never;

export type TruncateTo32<T extends string> = T extends ""
  ? unknown
  : T extends `${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}`
  ? T extends `${infer F}${R}`
    ? F
    : never
  : T;

export type NotEmpty<T> = T extends "" ? never : unknown;

export type VName<S extends string> = NotEmpty<S> &
  Lowercase<S> &
  TruncateTo32<S> &
  ForbidCharacter<S, SpecialCharacters>;

export type VerifyName<T extends string> = T extends VName<T>
  ? T
  : VName<T> extends never
  ? "Name must only be lowercase with no space as per Discord guidelines"
  : VName<T>;
