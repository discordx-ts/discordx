<div>
  <p align="center">
    <a href="https://discordx.js.org" target="_blank" rel="nofollow">
      <img src="https://discordx.js.org/discordx.svg" width="546" />
    </a>
  </p>
  <div align="center" class="badge-container">
    <a href="https://discordx.js.org/discord"
      ><img
        src="https://img.shields.io/discord/874802018361950248?color=5865F2&logo=discord&logoColor=white"
        alt="Discord server"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/music"
      ><img
        src="https://img.shields.io/npm/v/@discordx/music.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/music"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/music.svg?maxAge=3600"
        alt="NPM downloads"
    /></a>
    <a href="https://github.com/discordx-ts/discordx/actions"
      ><img
        src="https://github.com/discordx-ts/discordx/workflows/Build/badge.svg"
        alt="Build status"
    /></a>
    <a href="https://www.paypal.me/vijayxmeena"
      ><img
        src="https://img.shields.io/badge/donate-paypal-F96854.svg"
        alt="paypal"
    /></a>
  </div>
  <p align="center">
    <b> Create a discord bot with TypeScript and Decorators! </b>
  </p>
</div>

# 📖 Introduction

A powerful discord music library written in [TypeScript](https://www.typescriptlang.org) for [Node.js](https://nodejs.org). Support youtube links.

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

> Ensure that [discord.js](https://www.npmjs.com/package/discord.js) and [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice) have been installed before installing this library

```
npm install @discordx/music
yarn add @discordx/music
```

# 🤖 Bot Examples

> **[discord-music-bot](https://github.com/discordx-ts/templates/tree/main/4-music-player-ytdl)** from [@samarmeena](https://github.com/samarmeena)

**Note:** Create a pull request to include your bot in the example list.

# Define new player

```ts
const player = new Player();
```

# Get queue for guild

```ts
const queue = player.queue(interaction.guild);
```

# Join voice server

```ts
await queue.join(interaction.member.voice.channel);
```

# Play youtube song

```ts
const status = await queue.play(songName);
if (!status) {
  interaction.followUp("The song could not be found");
} else {
  interaction.followUp("The requested song is being played");
}
```

# Play youtube playlist

```ts
const status = await queue.playlist(playlistLink);
if (!status) {
  interaction.followUp("The playlist could not be found");
} else {
  interaction.followUp("playing requested playlist");
}
```

# Get voice config data

```ts
const audioPlayer = queue.audioPlayer;
const voiceConnection = queue.voiceConnection;
const voiceChannelId = queue.voiceChannelId;
const voiceGroup = queue.voiceGroup;
const voiceGuildId = queue.voiceGuildId;
```

# Get tracks

```ts
const tracks = queue.tracks;
```

# Get loop mode

```ts
const state = queue.loop;
```

# Set loop mode

```ts
queue.setLoop(true | false);
```

# Get repeat mode

```ts
const state = queue.repeat;
```

# Set repeat mode

```ts
queue.setRepeat(true | false);
```

# Pause music

```ts
queue.pause();
```

# Resume music

```ts
queue.resume();
```

# Skip music

```ts
queue.skip();
```

# Leave voice channel

```ts
queue.leave();
```

# Mix/Shuffle tracks

```ts
queue.mix();
```

# Get playback duration

```ts
queue.playbackDuration;
```

# Get volume

```ts
queue.volume;
```

# Set volume

```ts
queue.setVolume(volume: number);
```

# Seek current track

```ts
queue.seek(time: number);
```

# Clear queue

```ts
queue.clearTracks();
```

# Remove specific tracks

```ts
queue.removeTracks([1, 3, 5]);
```

# Get total tracks

```ts
const total = queue.size;
```

# Events

```ts
this.player.on("onError", console.log);
this.player.on("onFinish", console.log);
this.player.on("onStart", console.log);
this.player.on("onLoop", console.log);
this.player.on("onFinishPlayback", console.log);
this.player.on("onRepeat", console.log);
this.player.on("onSkip", console.log);
this.player.on("onPause", console.log);
this.player.on("onResume", console.log);
this.player.on("onTrackAdd", console.log);
this.player.on("onLoopEnabled", console.log);
this.player.on("onLoopDisabled", console.log);
this.player.on("onRepeatEnabled", console.log);
this.player.on("onRepeatDisabled", console.log);
this.player.on("onMix", console.log);
this.player.on("onVolumeUpdate", console.log);
this.player.on("onSeek", console.log);
this.player.on("onJoin", console.log);
this.player.on("onLeave", console.log);
```

# Custom queue

```ts
class MyQueue extends Queue {
  customProp = "custom queue";
}
```

Tell the player to use this custom queue

```ts
class MyQueue extends Queue {}
this.player.queue(guild, () => new MyQueue(this.player, guild));
```

# Custom player

```ts
class MyPlayer extends Player {
  // custom player
}
```

Let your queue know about custom player

```ts
const myQueue: Queue<MyPlayer> = new Queue(this, guild);
```

# Lava Player

# Getting Started

```ts
const node = new Lava.Node({
  host: {
    address: process.env.LAVA_HOST ?? "",
    port: Number(process.env.LAVA_PORT) ?? 2333,
  },

  // your Lavalink password
  password: process.env.LAVA_PASSWORD ?? "",

  send(guildId, packet) {
    const guild = client.guilds.cache.get(guildId);
    if (guild) {
      guild.shard.send(packet);
    }
  },
  shardCount: 0, // the total number of shards that your bot is running (optional, useful if you're load balancing)
  userId: client.user?.id ?? "", // the user id of your bot
});

client.ws.on("VOICE_STATE_UPDATE", (data: Lava.VoiceStateUpdate) => {
  node.voiceStateUpdate(data);
});

client.ws.on("VOICE_SERVER_UPDATE", (data: Lava.VoiceServerUpdate) => {
  node.voiceServerUpdate(data);
});
```

# Get Guild Player

```ts
const player = node.players.get("guild id");
```

# Join Voice Channel

```ts
await player.join("channel id");
```

# Play Track

```ts
const res = await voice.load("ytsearch:monstercat");
await player.play(res.tracks[0]);
```

# Stop Music

```ts
await player.stop();
// or, to destroy the player entirely
await player.destroy();
```

# Clustering

```ts
const cluster = new Lava.Cluster({
  nodes: [
    // node options here; see above
  ],
  send(guildId, packet) {
    // send to gateway; same as for single node usage
  },
  filter(node, guildId) {
    // optional
    // return a boolean indicating whether the given guild can be run on the given node
    // useful for limiting guilds to specific nodes (for instance, if you setup lavalink edge servers to minimize latency)
    // this must return true at least once for a given set of nodes, otherwise some methods may error
  },
});
```

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/samarmeena/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
