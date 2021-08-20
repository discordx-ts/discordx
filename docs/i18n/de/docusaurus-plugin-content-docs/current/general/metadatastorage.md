# MetadataStorage

The MetadataStorage store all the informations about your decorators, you can get the informations related to them by using `MetadataStorage.instance`

```ts
import { MetadataStorage } from "discordx";

MetadataStorage.instance.applicationCommands;
MetadataStorage.instance.simpleCommands;
MetadataStorage.instance.events;
MetadataStorage.instance.discords;
MetadataStorage.instance.buttonComponents;
MetadataStorage.instance.selectMenuComponents;
// ...
```
