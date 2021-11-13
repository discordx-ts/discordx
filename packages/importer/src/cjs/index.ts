import glob from "glob";

export const isESM = false;

export function resolve(paths: string[]): string[] {
  const imports: string[] = [];
  paths.forEach((path) => {
    const files = glob.sync(path).filter((file) => typeof file === "string");
    files.forEach((file) => {
      if (!imports.includes(file)) {
        imports.push(file);
      }
    });
  });

  return imports;
}

export function importx(paths: string[]): void {
  const files = resolve(paths);
  files.map((path) => require(path));
}
