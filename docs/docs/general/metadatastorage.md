# MetadataStorage

MetadataStorage stores all the information about your decorators. You can get the information you need by using `MetadataStorage.instance`.

```ts
import { MetadataStorage } from "discordx";

MetadataStorage.instance.applicationCommandSlashes;
MetadataStorage.instance.applicationCommandUsers;
MetadataStorage.instance.applicationCommandMessages;
MetadataStorage.instance.reactions;
MetadataStorage.instance.simpleCommands;
MetadataStorage.instance.events;
MetadataStorage.instance.buttonComponents;
MetadataStorage.instance.modalComponents;
MetadataStorage.instance.selectMenuComponents;
// ...
```
