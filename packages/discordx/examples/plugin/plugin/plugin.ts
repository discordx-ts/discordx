import { dirname, importx } from "@discordx/importer";
import { Plugin } from "discordx";

export class HelperPlugin extends Plugin {
  async init(): Promise<void> {
    await importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);
  }
}
