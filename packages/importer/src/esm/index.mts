import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";

export const isESM = true;

export function dirname(url: string): string {
  return path.dirname(fileURLToPath(url));
}

export async function resolve(...paths: string[]): Promise<string[]> {
  const imports: string[] = [];

  await Promise.all(
    paths.map(async (ps) => {
      const files = await glob(ps.split(path.sep).join("/"));

      files.forEach((file) => {
        if (!imports.includes(file)) {
          imports.push("file://" + file);
        }
      });
    })
  );

  return imports;
}

export async function importx(...paths: string[]): Promise<void> {
  const files = await resolve(...paths);
  await Promise.all(files.map((file) => import(file)));
}
