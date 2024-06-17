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
    <a href="https://www.npmjs.com/package/@discordx/plugin-lava-player"
      ><img
        src="https://img.shields.io/npm/v/@discordx/plugin-lava-player.svg?maxAge=3600"
        alt="NPM version"
    /></a>
    <a href="https://www.npmjs.com/package/@discordx/plugin-lava-player"
      ><img
        src="https://img.shields.io/npm/dt/@discordx/plugin-lava-player.svg?maxAge=3600"
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
        alt="PayPal"
    /></a>
  </div>
  <p align="center">
    <b> Create a discord bot with TypeScript and Decorators! </b>
  </p>
</div>

# 📖 Introduction

lava player plugin for discordx bots.

# 💻 Installation

```
npm install @discordx/plugin-lava-player
```

# ⚠️ Prerequisites

To use this plugin, You will need to have a running Lavalink instance as well as fill the following variables in with the correct information:

- `LAVA_HOST` - Either a Domain or IP pointing to the host of the Lavalink instance. Is optional, Default is `localhost`.
- `LAVA_PORT` - Port on the host the Lavalink instance is running on. Is optional, Default is `2333`.
- `LAVA_PASSWORD` - Lavalink instance password. Is optional.

# 📄 Usage

```ts
import "@discordx/plugin-lava-player";
```

# 🛠️ Additional plugin support

## LavaLyrics

```ts
import "@discordx/plugin-lava-player/dist/plugins/lavalyrics/index.js";
```

- Add `/music lyrics` command
- Require [LavaLyrics](https://github.com/topi314/LavaLyrics) and [LavaSrc](https://github.com/topi314/LavaSrc) plugin

# 📜 Documentation

- [discordx.js.org](https://discordx.js.org)
- [Tutorials (dev.to)](https://dev.to/samarmeena/series/14317)

# ☎️ Need help?

- [Check frequently asked questions](https://discordx.js.org/docs/faq)
- [Check examples](https://github.com/discordx-ts/discordx/tree/main/packages/discordx/examples)
- Ask in the community [Discord server](https://discordx.js.org/discord)

# 💖 Thank you

You can support [discordx](https://www.npmjs.com/package/discordx) by giving it a [GitHub](https://github.com/discordx-ts/discordx) star.
