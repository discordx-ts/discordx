/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { dirname, importx } from "@discordx/importer";
import { Plugin } from "discordx";

export class HelperPlugin extends Plugin {
  async init(): Promise<void> {
    await importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);
  }
}
