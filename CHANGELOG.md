## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Types of changes

> `Added` - for new features.

> `Changed` - for changes in existing functionality.

> `Deprecated` - for soon-to-be removed features.

> `Removed` - for now removed features.

> `Fixed` - for any bug fixes.

> `Security` - in case of vulnerabilities.

`[FULL CHANGELOG](https://github.com/oceanroleplay/discord.ts/blob/main/CHANGELOG.md#700---2021-10-20)`

## [7.0.0] - 2021-10-20

### Changed

- moved `prefix` from `ClientOptions` to `SimpleCommandConfig`

### Fixed

- Removed null from `@permission` resolver type, because guild is always defined
- Fixed permission check issue with simple command, where allowed permission was considered unauthorized

## [6.2.0] - 2021-10-13

### Changed

- `Client` options, added simpleCommand options, check doc for more info

### Added

- resolver for `argSplitter`
- `DIService.allServices`: get all the services from the DI container

## [6.1.2] - 2021-10-06

### Fixed

- `parseOption` array issue

## [6.1.1] - 2021-10-06

### Changed

- upgraded `parseOptions` for DApplicationCommand

### Removed

- lint disables

## [6.1.0] - 2021-10-06

### Added

- tsyringe support

### Changed

- updated format of simple command usage
- Updated type literal (length validation)
- Disabled interaction not found logs, when silent mode is enabled.

### Fixed

- simple command execution with different case (With case sensitive mode disabled)

## [6.0.5] - 2021-09-29

### Changed

- Updated type literal (length validation)

## [6.0.4] - 2021-09-29

### Changed

- Updated type literal (from whitelist to blacklist)

## [6.0.3] - 2021-09-29

### Added

- type validation for application command name/options.

## [6.0.2] - 2021-09-29

### Added

- Show names in the update log for global application commands

## [6.0.1] - 2021-09-29

### Fixed

- update issue of context menu in `initApplicationCommands`

## [6.0.0] - 2021-09-29

### Added

- options for `initApplicationCommands`
- added `initApplicationPermissions`
- accept permission resolvers in `@Permission` decorator
- accept guild resolvers in `@Guild` decorator

### Changed

- `toObject` > `toJSON`
- command permission update is not part of `initApplicationCommands`

## [5.9.4] - 2021-09-22

### Added

- `caseSensitive` option in `client.executeCommand` and `client.parseCommand`

### Changed

- Migrated `@Permission` with `@DefaultPermission`
- Improved code with lint

### Deprecated

- `@DefaultPermission` use `@Permission` instead

### Fixed

- simple command execution where uppercase commands are not executed.

## [5.9.3] - 2021-09-16

### Fixed

- Issue where, guild commands not deleted (Issue with multi bot)

## [5.9.2] - 2021-09-15

### Changed

- Improved code with lint

### Fixed

- Init application commands for global (Issue with multi bot)

## [5.9.1] - 2021-09-15

### Fixed

- Issue where, choices are set to all applicaiton options.

## [5.9.0] - 2021-09-15

### Changed

- client botGuilds executed dynamically, before this property was static.
- client guards executed dynamically, before this property was static.

### Fixed

- Issue where, `@SlashGroup` apply on `@ContextMenu`
- Issue where, Bot crash while running `initApplicationCommands` because of 403

### Removed

- `requiredByDefault` from client options

## [5.8.2] - 2021-09-08

### Changed

- readme

## [5.8.1] - 2021-09-01

### Added

- `@SimpleCommandOption` - added option type `INTEGER`, `MENTIONABLE`
- expose `initGuildApplicationCommands` and `initGlobalApplicationCommands` from client

### Fixed

- `@SimpleCommandOption` - option parsing

### Removed

- `@Name` - deprecated decorator
- `@Description` - deprecated decorator
- `CommandOption` - deprecated function
- `Command` - deprecated function
- `SelectMenu` - deprecated function
- `Button` - deprecated function
- `Group` - deprecated function
- `Choices` - deprecated function
- `Choice` - deprecated function
- `Option` - deprecated function
- `clearSlashes` - deprecated function
- `fetchSlash` - deprecated function
- `initSlashes` - deprecated function

## [5.7.0] - 2021-08-25

### Added

- added `command.isValid()` for simple command (false, if any option is undefined)

### Changed

- improved documentation

### Fixed

- `argSplitter` issue, where option output was not trimmed.
- `@SlashOption` now resolve objects for option like `USER, ROLE, CHANNEL, MENTIONABLE`, it will now not return snowflake id.

## [5.6.0] - 2021-08-18

### Added

- type `USER | ROLE | CHANNEL` added for [@SimpleCommandOption](https://discord-ts.js.org/docs/decorators/commands/simplecommandoption)
- [API docs](https://discord-ts.js.org/docs/api)

### Changed

- simple command name regex to `0-9a-z A-Z`
- improved documentation

### Fixed

- simple command execution
