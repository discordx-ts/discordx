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
const nodeInstance = new Node({
  host: {
    address: process.env.LAVA_HOST ?? "localhost",
    connectionOptions: { sessionId: "discordx" },
    port: process.env.LAVA_PORT ? Number(process.env.LAVA_PORT) : 2333,
  },

  // your Lavalink password
  password: process.env.LAVA_PASSWORD ?? "youshallnotpass",

  send(guildId, packet) {
    const guild = client.guilds.cache.get(guildId);
    if (guild) {
      guild.shard.send(packet);
    }
  },
  userId: client.user?.id ?? "", // the user id of your bot
});

nodeInstance.connection.ws.on("message", (data) => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const raw = JSON.parse(data.toString()) as OpResponse;
  console.log("ws>>", raw);
});

nodeInstance.on("error", (e) => {
  console.log(e);
});

client.ws.on(
  GatewayDispatchEvents.VoiceStateUpdate,
  (data: VoiceStateUpdate) => {
    void nodeInstance.voiceStateUpdate(data);
  },
);

client.ws.on(
  GatewayDispatchEvents.VoiceServerUpdate,
  (data: VoiceServerUpdate) => {
    void nodeInstance.voiceServerUpdate(data);
  },
);
```

# Get Guild Player

```ts
const player = node.players.get("guild id");
```

# Join Voice Channel

```ts
await player.join({ channel: "channel id" });
```

# Play Track

```ts
const res = await this.node.rest.loadTracks(`ytsearch:${song}`);
if (res.loadType !== LoadType.SEARCH || !res.data[0]) {
  await interaction.followUp("No track found");
  return;
}

const track = res.data[0];
await player.update({
  track,
});
await interaction.followUp(`playing ${track.info.title}`);
```

# Stop Music

```ts
await player.leave();
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
- [Tutorials (dev.to)](https://dev.to/vijayymmeena/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
