# MetadataStorage

The MetadataStorage store all the informations about your decorators, you can get the informations related to them by using `MetadataStorage.instance`

```ts
import { MetadataStorage } from "@typeit/discord.ts";

MetadataStorage.instance.slashes;
MetadataStorage.instance.events;
MetadataStorage.instance.discords;
MetadataStorage.instance.buttons;
MetadataStorage.instance.selectMenus;
// ...
```
