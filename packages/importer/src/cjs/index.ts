import { fileURLToPath } from "url";
import glob from "glob";
import path from "path";

export const isESM = false;

export function dirname(url: string): string {
  return path.dirname(fileURLToPath(url));
}

export function resolve(...paths: string[]): string[] {
  const imports: string[] = [];
  paths.forEach((pathx) => {
    const files = glob.sync(pathx).filter((file) => typeof file === "string");
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
