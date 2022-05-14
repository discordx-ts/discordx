import glob from "glob";
import path from "path";
import { fileURLToPath } from "url";

export const isESM = true;

export function dirname(url: string): string {
  return path.dirname(fileURLToPath(url));
}

export function resolve(...paths: string[]): string[] {
  const imports: string[] = [];

  paths.forEach((ps) => {
    const files = glob.sync(ps);

    files.forEach((file) => {
      if (!imports.includes(file)) {
        imports.push("file://" + file);
      }
    });
  });

  return imports;
}

export async function importx(...paths: string[]): Promise<void> {
  const files = resolve(...paths);
  await Promise.all(files.map((file) => import(file)));
}
