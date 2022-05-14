import * as glob from "glob";
import * as path from "path";
import { fileURLToPath } from "url";

export const isESM = false;

export function dirname(url: string): string {
  return path.dirname(fileURLToPath(url));
}

export function resolve(...paths: string[]): string[] {
  const imports: string[] = [];

  paths.forEach((ps) => {
    const files: string[] = glob.sync(ps);

    files.forEach((file) => {
      if (!imports.includes(file)) {
        imports.push(file);
      }
    });
  });

  return imports;
}

export async function importx(...paths: string[]): Promise<void> {
  const files = resolve(...paths);
  await Promise.all(files.map((file) => require(file)));
}
