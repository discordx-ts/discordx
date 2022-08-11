<div>
  <p align="center">
    <a href="https://discord-ts.js.org" target="_blank" rel="nofollow">
      <img src="https://discord-ts.js.org/discord-ts.svg" width="546" />
    </a>
  </p>
  <p align="center">
    <a href="https://discord-ts.js.org/discord"
      ><img
        src="https://img.shields.io/discord/874802018361950248?color=5865F2&logo=discord&logoColor=white"
        alt="Discord server"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/lava-player"
      ><img
        src="https://img.shields.io/npm/v/@discordx/lava-player.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/lava-player"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/lava-player.svg?maxAge=3600"
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

# 📖 Introduction

A powerful lava link player library written in [TypeScript](https://www.typescriptlang.org) for [Node.js](https://nodejs.org). Support youtube links.

# 💻 Installation

Version 16.6.0 or newer of Node.js is required

```
npm install @discordx/lava-player
yarn add @discordx/lava-player
```

Note: Required [lavalink](https://github.com/freyacodes/Lavalink) up and running

# 🤖 Bot Examples

None

**Note:** Create a pull request to include your bot in the example list.

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

# ☎️ Need help?

- [Check frequently asked questions](https://discord-ts.js.org/docs/faq)
- [Check examples](https://github.com/oceanroleplay/discord.ts/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discord-ts.js.org/discord)

# 💖 Thank you

You can support [Discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/oceanroleplay/discord.ts) star.
