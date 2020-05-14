# Next release

## Public changes
- Prefix behavior removed, replaced by params function:  
```ts
async function getParams(): CommandParams {
  // async tasks...
  return {
    name: "test",
    caseSensitive: true,
    prefix: "!"
  }
}

// ...

@Command(getParams)

// ...
```

- `CommandParams` accpets regex for `name` and `prefix`

- `@Command` accepts regex for the whole command  
prefix: `"!"`, name: `undefined`, caseSensitive: `false`
```ts
/^!\w*/i
```
prefix: `"-mbd"`, name: `"test"`, caseSensitive: `true`
```ts
/^-mbd/
```

- Possibility to have no command name, just a prefix:  
**-mdb** Hello  

- `@CommandNotFound` only for the commands inside the same class to get a cleaner code. Now warnings will be printed if a class has some command but no `@CommandNotFound`, but you can specify inside Client options if you want to show these warnings.

- `Client.getCommands` returns `@CommandNotFound`s too.

- Can specify infos to `@CommandNotFound`.

## Internal changes  
- `@On` has a type: `"on"` | `"command"` | `"commandNotFound"`
- `@Command` params are compiled into a regex for tests

