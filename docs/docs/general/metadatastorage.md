# MetadataStorage

MetadataStorage stores all the information about your decorators. You can get the information you need by using `MetadataStorage.instance`.

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
