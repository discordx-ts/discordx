# Plugin

Develop plugins for discordx. You can publish your plugin on NPM. Maintain a single codebase while using them on different bots.

## Create a Plugin

```ts
import { dirname, importx } from "@discordx/importer";
import { Plugin } from "discordx";

export class HelperPlugin extends Plugin {
  async init(): Promise<void> {
    // This section is similar to the bot login section. However, here we are doing this for a plugin.
    await importx(`${dirname(import.meta.url)}/commands/**/*.{js,ts}`);
  }
}
```

## Use a plugin with discordx client

```ts
import { Client, MetadataStorage } from "discordx";

// Initialize the plugin
const helperPlugin = new HelperPlugin({ metadata: MetadataStorage.instance });

// Provide plugins to client
new Client({ plugins: [helperPlugin] });
```
