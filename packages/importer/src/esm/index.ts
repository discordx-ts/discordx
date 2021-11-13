import { createRequire } from "module";
import { fileURLToPath } from "url";
import glob from "glob";
import path from "path";

const require = createRequire(import.meta.url);

export const isESM = true;

export function dirname(url: string): string {
  return path.dirname(fileURLToPath(url));
}

export function resolve(...paths: string[]): string[] {
  const imports: string[] = [];
  paths.forEach((ps) => {
    const resolvedPath = ps.startsWith("./")
      ? ps.replace(/^\.\//, path.resolve() + "/")
      : ps;

    const files = glob
      .sync(resolvedPath)
      .filter((file) => typeof file === "string");

    files.forEach((file) => {
      if (!imports.includes(file)) {
        imports.push(file);
      }
    });
  });

  return imports;
}

export function importx(...paths: string[]): void {
  const files = resolve(...paths);
  files.forEach((file) => require(file));
}
