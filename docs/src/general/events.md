# List of the discord.js events

Here is all the `DiscordEvents` and their parameters (`discord.js`)

- **channelCreate**  
  `[Channel]`
- **channelDelete**  
  `[Channel | PartialDMChannel]`

- **channelPinsUpdate**  
  `[Channel | PartialDMChannel, Date]`

- **channelUpdate**  
  `[Channel, Channel]`

- **debug**  
  `[string]`
- **warn**  
  `[string]`
- **disconnect**  
  `[any, number]`

- **emojiCreate**  
  `[GuildEmoji]`

- **emojiDelete**  
  `[GuildEmoji]`

- **emojiUpdate**  
  `[GuildEmoji, GuildEmoji]`

- **error**  
  `[Error]`

- **guildBanAdd**  
  `[Guild, User | PartialUser]`

- **guildBanRemove**  
  `[Guild, User | PartialUser]`

- **guildCreate**  
  `[Guild]`

- **guildDelete**  
  `[Guild]`

- **guildUnavailable**  
  `[Guild]`

- **guildIntegrationsUpdate**  
  `[Guild]`

- **guildMemberAdd**  
  `[GuildMember | PartialGuildMember]`

- **guildMemberAvailable**  
  `[GuildMember | PartialGuildMember]`

- **guildMemberRemove**  
  `[GuildMember | PartialGuildMember]`

- **guildMembersChunk**  
  `[Collection<Snowflake, GuildMember | PartialGuildMember>, Guild]`

- **guildMemberSpeaking**  
  `[GuildMember | PartialGuildMember, Readonly<Speaking>]`

- **guildMemberUpdate**  
  `[GuildMember | PartialGuildMember, GuildMember | PartialGuildMember]`

- **guildUpdate**  
  `[Guild, Guild]`

- **inviteCreate**  
  `[Invite]`

- **inviteDelete**  
  `[Invite]`

- **message**  
  `[Message]`

- **messageDelete**  
  `[Message | PartialMessage]`

- **messageReactionRemoveAll**  
  `[Message | PartialMessage]`

- **messageReactionRemoveEmoji**  
  `[MessageReaction]`

- **messageDeleteBulk**  
  `[Collection<Snowflake, Message | PartialMessage>]`

- **messageReactionAdd**  
  `[MessageReaction, User | PartialUser]`

- **messageReactionRemove**  
  `[MessageReaction, User | PartialUser]`

- **messageUpdate**  
  `[Message | PartialMessage, Message | PartialMessage]`

- **presenceUpdate**  
  `[Presence | undefined, Presence]`

- **rateLimit**  
  `[RateLimitData]`

- **ready**  
  `[]`

- **invalidated**  
  `[]`

- **roleCreate**  
  `[Role]`

- **roleDelete**  
  `[Role]`

- **roleUpdate**  
  `[Role, Role]`

- **typingStart**  
  `[Channel | PartialDMChannel, User | PartialUser]`

- **userUpdate**  
  `[User | PartialUser, User | PartialUser]`

- **voiceStateUpdate**  
  `[VoiceState, VoiceState]`

- **webhookUpdate**  
  `[TextChannel]`

- **shardDisconnect**  
  `[CloseEvent, number]`

- **shardError**  
  `[Error, number]`

- **shardReady**  
  `[number]`

- **shardReconnecting**  
  `[number]`

- **shardResume**  
  `[number, number]`
