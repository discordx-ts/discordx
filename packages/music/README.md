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

> **[discord-music-bot](https://github.com/discordx-ts/templates/tree/main/4-music-player-ytdl)** from [@vijayymmeena](https://github.com/vijayymmeena)

**Note:** Create a pull request to include your bot in the example list.

# What is QueueNode?

`QueueNode` is a service that oversees the management of a worker service responsible for handling audio nodes and the corresponding audio node managers. Its primary purpose is to provide music functionality within a system. By utilizing `QueueNode`, multiple workers can be spawned as needed to enable concurrent music playback across multiple guilds. The `QueueNode` service ensures efficient coordination and distribution of music playback tasks, allowing for seamless and synchronized playback across different guilds.

# What is TrackQueue?

`TrackQueue` is a service specifically designed to offer playlist-like functionality within a music system. It provides a range of functions such as queuing songs, playing tracks, skipping, repeating, pausing/unpausing, and more. By creating a `TrackQueue` instance per guild, you can seamlessly integrate playlist functionality into your music system. This allows users to manage and enjoy their own personalized playlists within their respective guilds, enhancing the overall music experience. With `TrackQueue`, users can easily control the playback flow, manage track order, and apply various playlist-related operations to curate their desired musical journey.

# Quick Example

```ts
// Create a queue node
const queueNode = new QueueNode(client);

// Create a track queue for guild
const trackQueue = new TrackQueue({
  client: client,
  guildId: guildId,
  queueNode: queueNode,
});

// Join voice channel
queue.join({
  channelId: channelId,
  guildId: guildId,
});

// Add and play track
queue.addTrack({
  url: "VIDEO_URL",
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
