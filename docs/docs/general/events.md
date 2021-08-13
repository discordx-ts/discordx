# List of the discord.js events

Here is all the `DiscordEvents` and their parameters (`discord.js`)

- **applicationCommandCreate**  
  `[command: ApplicationCommand]`

- **applicationCommandDelete**  
  `[command: ApplicationCommand]`

- **applicationCommandUpdate**  
  `[oldCommand: ApplicationCommand | null, newCommand: ApplicationCommand]`

- **channelCreate**  
  `[channel: GuildChannel]`

- **channelDelete**  
  `[channel: DMChannel | GuildChannel]`

- **channelPinsUpdate**  
  `[channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date]`

- **channelUpdate**  
  `[oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel]`

- **debug**  
  `[message: string]`

- **warn**  
  `[message: string]`

- **emojiCreate**  
  `[emoji: GuildEmoji]`

- **emojiDelete**  
  `[emoji: GuildEmoji]`

- **emojiUpdate**  
  `[oldEmoji: GuildEmoji, newEmoji: GuildEmoji]`

- **error**  
  `[error: Error]`

- **guildBanAdd**  
  `[ban: GuildBan]`

- **guildBanRemove**  
  `[ban: GuildBan]`

- **guildCreate**  
  `[guild: Guild]`

- **guildDelete**  
  `[guild: Guild]`

- **guildUnavailable**  
  `[guild: Guild]`

- **guildIntegrationsUpdate**  
  `[guild: Guild]`

- **guildMemberAdd**  
  `[member: GuildMember]`

- **guildMemberAvailable**  
  `[member: GuildMember | PartialGuildMember]`

- **guildMemberRemove**  
  `[member: GuildMember | PartialGuildMember]`

- **guildMembersChunk**  
  `[members: Collection<Snowflake, GuildMember>, guild: Guild, data: { count: number; index: number; nonce: string | undefined }]`

- **guildMemberUpdate**  
  `[oldMember: GuildMember | PartialGuildMember, newMember: GuildMember]`

- **guildUpdate**  
  `[oldGuild: Guild, newGuild: Guild]`

- **inviteCreate**  
  `[invite: Invite]`

- **inviteDelete**  
  `[invite: Invite]`

  ```ts
  // @deprecated Use messageCreate instead
  ```

- **message**  
  `[message: Message]`

- **messageCreate**  
  `[message: Message]`

- **messageDelete**  
  `[message: Message | PartialMessage]`

- **messageReactionRemoveAll**  
  `[message: Message | PartialMessage]`

- **messageReactionRemoveEmoji**  
  `[reaction: MessageReaction | PartialMessageReaction]`

- **messageDeleteBulk**  
  `[messages: Collection<Snowflake, Message | PartialMessage>]`

- **messageReactionAdd**  
  `[message: MessageReaction | PartialMessageReaction, user: User | PartialUser]`

- **messageReactionRemove**  
  `[reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser]`

- **messageUpdate**  
  `[oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage]`

- **presenceUpdate**  
  `[oldPresence: Presence | null, newPresence: Presence]`

- **rateLimit**  
  `[rateLimitData: RateLimitData]`

- **invalidRequestWarning**  
  `[invalidRequestWarningData: InvalidRequestWarningData]`

- **ready**  
  `[]`

- **invalidated**  
  `[]`

- **roleCreate**  
  `[role: Role]`

- **roleDelete**  
  `[role: Role]`

- **roleUpdate**  
  `[oldRole: Role, newRole: Role]`

- **threadCreate**  
  `[thread: ThreadChannel]`

- **threadDelete**  
  `[thread: ThreadChannel]`

- **threadListSync**  
  `[threads: Collection<Snowflake, ThreadChannel>]`

- **threadMemberUpdate**  
  `[oldMember: ThreadMember, newMember: ThreadMember]`

- **threadMembersUpdate**  
  `[oldMembers: Collection<Snowflake, ThreadMember>, mewMembers: Collection<Snowflake, ThreadMember>]`

- **threadUpdate**  
  `[oldThread: ThreadChannel, newThread: ThreadChannel]`

- **typingStart**  
  `[channel: Channel | PartialDMChannel, user: User | PartialUser]`

- **userUpdate**  
  `[oldUser: User | PartialUser, newUser: User]`

- **voiceStateUpdate**  
  `[oldState: VoiceState, newState: VoiceState]`

- **webhookUpdate**  
  `[channel: TextChannel]`

  ```ts
  // @deprecated Use interactionCreate instead
  ```

- **interaction**  
  `[interaction: Interaction]`

- **interactionCreate**  
  `[interaction: Interaction]`

- **shardDisconnect**  
  `[closeEvent: CloseEvent, shardId: number]`

- **shardError**  
  `[error: Error, shardId: number]`

- **shardReady**  
  `[shardId: number, unavailableGuilds: Set<Snowflake> | undefined]`

- **shardReconnecting**  
  `[shardId: number]`

- **shardResume**  
  `[shardId: number, replayedEvents: number]`

- **stageInstanceCreate**  
  `[stageInstance: StageInstance]`

- **stageInstanceUpdate**  
  `[oldStageInstance: StageInstance | null, newStageInstance: StageInstance]`

- **stageInstanceDelete**  
  `[stageInstance: StageInstance]`
