# Errors

The most common errors we hear everyday are listed here to help everyone. If you can't find a common error or its solution, please make a pull request or issue.

## ERR_MODULE_NOT_FOUND

```
CustomError: Cannot find module '/project/secret' imported from '/project/index.ts'
```

#### Solution

[Read here](/docs/guides/FAQ/esm-vs-cjs#import-in-cjs-vs-esm)

## Missing Access

```
      throw new DiscordAPIError(data, res.status, request);
            ^
DiscordAPIError: Missing Access
```

#### Solution

[Authorize your bot to use application commands](/docs/decorators/commands/slash#authorize-your-bot-to-use-application-commands)

## SyntaxError: The requested module does not provide an export named

```ts
import { ArgsOf, Client } from 'discordx';
         ^^^^^
SyntaxError: The requested module 'discordx' does not provide an export named 'ArgsOf'
```

#### Solution

Use import type. [Read it in depth](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports).

```ts
import type { ArgsOf } from "discordx";
import { Client } from "discordx";
```
