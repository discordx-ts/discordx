export type ForbidCharacter<
  S extends string,
  Character extends string
> = S extends `${string}${Character}${string}` ? never : unknown;

export type WhitelistWords<S, D extends string> = S extends ""
  ? unknown
  : S extends `${D}${infer Tail}`
  ? WhitelistWords<Tail, D>
  : never;

type ValidChars =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "0"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

export type VName<S extends string> = S & WhitelistWords<S, ValidChars>;

export type VerifyName<T extends string> = T extends VName<T>
  ? T
  : VName<T> extends never
  ? "Name must only be lowercase with no space as per Discord guidelines"
  : VName<T>;
