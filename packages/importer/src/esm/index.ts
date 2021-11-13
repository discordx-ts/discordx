import glob from "glob";

export const isESM = true;

export function resolve(paths: string[]): string[] {
  const imports: string[] = [];
  paths.forEach((path) => {
    const files = glob.sync(path).filter((file) => typeof file === "string");
    files.forEach((file) => {
      if (!imports.includes(file)) {
        imports.push("file://" + file);
      }
    });
  });

  return imports;
}

export function importx(paths: string[]): Promise<void> {
  const files = resolve(paths);

  return Promise.all(files.map((path) => import(path))).then();
}
