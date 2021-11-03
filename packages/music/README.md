<div>
  <p align="center">
    <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
  </p>
  <p align="center">
    <a href="https://discord.gg/yHQY9fexH9"
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
    <a href="https://github.com/oceanroleplay/discord.ts/actions"
      ><img
        src="https://github.com/oceanroleplay/discord.ts/workflows/Build/badge.svg"
        alt="Build status"
    /></a>
    <a href="https://www.paypal.me/vijayxmeena"
      ><img
        src="https://img.shields.io/badge/donate-paypal-F96854.svg"
        alt="paypal"
    /></a>
  </p>
  <p align="center">
    <b> Create a discord bot with TypeScript and Decorators! </b>
  </p>
</div>

# @discordx/music - Music Player

> You can use this library without discordx

A powerful discord music library written in [TypeScript](https://www.typescriptlang.org) for [Node.Js](https://nodejs.org). Support youtube/spotify songs and playlist.

- [Lava Player](#lava-player)
- [YTDL Player](#ytdl-player)

# Lava Player

## Getting Started

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
  userId: client.user?.id ?? "", // the user ID of your bot
});

client.ws.on("VOICE_STATE_UPDATE", (data: Lava.VoiceStateUpdate) => {
  node.voiceStateUpdate(data);
});

client.ws.on("VOICE_SERVER_UPDATE", (data: Lava.VoiceServerUpdate) => {
  node.voiceServerUpdate(data);
});
```

## Get Guild Player

```ts
const player = node.players.get("guild id");
```

## Join Voice Channel

```ts
await player.join("channel id");
```

## Play Track

```ts
const res = await voice.load("ytsearch:monstercat");
await player.play(res.tracks[0]);
```

## Stop Music

```ts
await player.stop();
// or, to destroy the player entirely
await player.destroy();
```

## Clustering

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

# YTDL Player

## Define new player

```ts
const player = new Player();
```

## Get queue for guild

```ts
const queue = player.queue(interaction.guild);
```

## Join voice server

```ts
await queue.join(interaction.member.voice.channel);
```

## Play youtube song

```ts
const status = await queue.play(songName);
if (!status) {
  interaction.followUp("The song could not be found");
} else {
  interaction.followUp("The requested song is being played");
}
```

## Play youtube playlist

```ts
const status = await queue.playlist(playlistLink);
if (!status) {
  interaction.followUp("The playlist could not be found");
} else {
  interaction.followUp("playing requested playlist");
}
```

## Play spotify song/playlist

```ts
const status = await queue.spotify(spotifyLink);
if (!status) {
  interaction.followUp("The spotify song/playlist could not be found");
} else {
  interaction.followUp("The requested spotify song/playlist is being played");
}
```

## Get voice config data

```ts
const audioPlayer = queue.audioPlayer;
const voiceConnection = queue.voiceConnection;
const voiceChannelId = queue.voiceChannelId;
const voiceGroup = queue.voiceGroup;
const voiceGuildId = queue.voiceGuildId;
```

## Get tracks

```ts
const tracks = queue.tracks;
```

## Get loop mode

```ts
const state = queue.loop;
```

## Set loop mode

```ts
queue.setLoop(true | false);
```

## Get repeat mode

```ts
const state = queue.repeat;
```

## Set repeat mode

```ts
queue.setRepeat(true | false);
```

## Pause music

```ts
queue.pause();
```

## Resume music

```ts
queue.resume();
```

## Skip music

```ts
queue.skip();
```

## Leave voice channel

```ts
queue.leave();
```

## Mix/Shuffle tracks

```ts
queue.mix();
```

## Get playback duration

```ts
queue.playbackDuration;
```

## Get volume

```ts
queue.volume;
```

## Set volume

```ts
queue.setVolume(volume: number);
```

## Seek current track

```ts
queue.seek(time: number);
```

## Clear queue

```ts
queue.clearTracks();
```

## Remove specific tracks

```ts
queue.removeTracks([1, 3, 5]);
```

## Get total tracks

```ts
const total = queue.size;
```

## Events

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

## Custom queue

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

## Custom player

```ts
class MyPlayer extends Player {
  // custom player
}
```

Let your queue know about custom player

```ts
const myQueue: Queue<MyPlayer> = new Queue(this, guild);
```
