# List of the discord.js events

Here is all the [`DiscordEvents`](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events) and their parameters ([`discord.js`](https://discord.js.org/#/docs/main/stable/class/Client))

### applicationCommandCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-applicationCommandCreate)
`[command: ApplicationCommand]`

### applicationCommandDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-applicationCommandDelete)
`[command: ApplicationCommand]`

### applicationCommandUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-applicationCommandUpdate)
`[oldCommand: ApplicationCommand | null, newCommand: ApplicationCommand]`

### channelCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate)
`[channel: GuildChannel]`

### channelDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete)
`[channel: DMChannel | GuildChannel]`

### channelPinsUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelPinsUpdate)
`[channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date]`

### channelUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelUpdate)
`[oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel]`

### debug

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-debug)
`[message: string]`

### warn

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-warn)
`[message: string]`

### emojiCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-emojiCreate)
`[emoji: GuildEmoji]`

### emojiDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-emojiDelete)
`[emoji: GuildEmoji]`

### emojiUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-emojiUpdate)
`[oldEmoji: GuildEmoji, newEmoji: GuildEmoji]`

### error

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-error)
`[error: Error]`

### guildBanAdd

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanAdd)
`[ban: GuildBan]`

### guildBanRemove

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove)
`[ban: GuildBan]`

### guildCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate)
`[guild: Guild]`

### guildDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete)
`[guild: Guild]`

### guildUnavailable

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildUnavailable)
`[guild: Guild]`

### guildIntegrationsUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildIntegrationsUpdate)
`[guild: Guild]`

### guildMemberAdd

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd)
`[member: GuildMember]`

### guildMemberAvailable

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAvailable)
`[member: GuildMember | PartialGuildMember]`

### guildMemberRemove

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove)
`[member: GuildMember | PartialGuildMember]`

### guildMembersChunk

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMembersChunk)
`[ members: Collection<Snowflake, GuildMember>, guild: Guild, data: { count: number; index: number; nonce: string | undefined } ]`

### guildMemberUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate)
`[oldMember: GuildMember | PartialGuildMember, newMember: GuildMember]`

### guildUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildUpdate)
`[oldGuild: Guild, newGuild: Guild]`

### inviteCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-inviteCreate)
`[invite: Invite]`

### inviteDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-inviteDelete)
`[invite: Invite]`

### message

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-message)
`[message: Message]`

:::warning
`message` event is deprecated, use `messageCreate` instead
:::

### messageCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageCreate)
`[message: Message]`

### messageDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete)
`[message: Message | PartialMessage]`

### messageReactionRemoveAll

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionRemoveAll)
`[message: Message | PartialMessage]`

### messageReactionRemoveEmoji

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionRemoveEmoji)
`[reaction: MessageReaction | PartialMessageReaction]`

### messageDeleteBulk

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDeleteBulk)
`[messages: Collection<Snowflake, Message | PartialMessage>]`

### messageReactionAdd

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionAdd)
`[message: MessageReaction | PartialMessageReaction, user: User | PartialUser]`

### messageReactionRemove

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionRemove)
`[reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser]`

### messageUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate)
`[oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage]`

### presenceUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-presenceUpdate)
`[oldPresence: Presence | null, newPresence: Presence]`

### rateLimit

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-rateLimit)
`[rateLimitData: RateLimitData]`

### invalidRequestWarning

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-invalidRequestWarning)
`[invalidRequestWarningData: InvalidRequestWarningData]`

### ready

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-ready)
`[]`

### invalidated

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-invalidated)
`[]`

### roleCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleCreate)
`[role: Role]`

### roleDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleDelete)
`[role: Role]`

### roleUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleUpdate)
`[oldRole: Role, newRole: Role]`

### threadCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-threadCreate)
`[thread: ThreadChannel]`

### threadDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-threadDelete)
`[thread: ThreadChannel]`

### threadListSync

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-threadListSync)
`[threads: Collection<Snowflake, ThreadChannel>]`

### threadMemberUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-threadMemberUpdate)
`[oldMember: ThreadMember, newMember: ThreadMember]`

### threadMembersUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-threadMembersUpdate)
`[oldMembers: Collection<Snowflake, ThreadMember>, mewMembers: Collection<Snowflake, ThreadMember>]`

### threadUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-threadUpdate)
`[oldThread: ThreadChannel, newThread: ThreadChannel]`

### typingStart

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-typingStart)
`[channel: Channel | PartialDMChannel, user: User | PartialUser]`

### userUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-userUpdate)
`[oldUser: User | PartialUser, newUser: User]`

### voiceStateUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate)
`[oldState: VoiceState, newState: VoiceState]`

### webhookUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-webhookUpdate)
`[channel: TextChannel]`

### interaction

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interaction)
`[interaction: Interaction]`

:::warning
`interaction` event is deprecated, use `interactionCreate` instead
:::

### interactionCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate)
`[interaction: Interaction]`

### shardDisconnect

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-shardDisconnect)
`[closeEvent: CloseEvent, shardId: number]`

### shardError

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-shardError)
`[error: Error, shardId: number]`

### shardReady

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-shardReady)
`[shardId: number, unavailableGuilds: Set<Snowflake> | undefined]`

### shardReconnecting

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-shardReconnecting)
`[shardId: number]`

### shardResume

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-shardResume)
`[shardId: number, replayedEvents: number]`

### stageInstanceCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-stageInstanceCreate)
`[stageInstance: StageInstance]`

### stageInstanceUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-stageInstanceUpdate)
`[oldStageInstance: StageInstance | null, newStageInstance: StageInstance]`

### stageInstanceDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-stageInstanceDelete)
`[stageInstance: StageInstance]`

### stickerCreate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-stickerCreate)
`[sticker: Sticker]`

### stickerDelete

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-stickerDelete)
`[sticker: Sticker]`

### stickerUpdate

[🔗](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-stickerUpdate)
`[oldSticker: Sticker, newSticker: Sticker]`

:::note
If you notice any changes to the events list, please edit the page
:::
