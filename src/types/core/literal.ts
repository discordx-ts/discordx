export type ForbidCharacter<
  S extends string,
  Character extends string
> = S extends `${string}${Character}${string}` ? never : unknown;

export type WhitelistWords<S, D extends string> = S extends ""
  ? unknown
  : S extends `${D}${infer Tail}`
  ? WhitelistWords<Tail, D>
  : never;

type SpecialCharacters =
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
  | "-"
  | "_"
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
  // eslint-disable-next-line @typescript-eslint/quotes
  | '"'
  | "'"
  | "<"
  | ">"
  | ","
  | "."
  | "?"
  | " ";

type TruncateTo32<T extends string> = T extends ""
  ? never
  : T extends `${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}${infer R}`
  ? T extends `${infer F}${R}`
    ? F
    : never
  : T;

export type VName<S extends string> = S &
  Lowercase<S> &
  Required<S> &
  TruncateTo32<S> &
  ForbidCharacter<S, SpecialCharacters>;

export type VerifyName<T extends string> = T extends VName<T>
  ? T
  : VName<T> extends never
  ? "Name must only be lowercase with no space as per Discord guidelines"
  : VName<T>;
