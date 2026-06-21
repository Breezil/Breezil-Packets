<div align="center">

<img src="docs/logo.png" alt="Breezil-Packets logo" width="120" />

# Breezil-Packets

**Fully typed Minecraft 1.8.9 packet definitions and shared protocol interfaces for the Breezil ecosystem.**

[![Build](https://img.shields.io/github/actions/workflow/status/Breezil/Breezil-Packets/ci.yml?branch=main&style=flat-square)](https://github.com/Breezil/Breezil-Packets/actions)
[![Release](https://img.shields.io/github/v/release/Breezil/Breezil-Packets?style=flat-square)](https://github.com/Breezil/Breezil-Packets/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Discord](https://img.shields.io/discord/1460052855389159527?style=flat-square&logo=discord&logoColor=white&label=discord)](https://discord.gg/wYs3cnsYeX)

[Report a bug](https://github.com/Breezil/Breezil-Packets/issues/new?labels=bug)
&nbsp;&nbsp;|&nbsp;&nbsp;
[Request a feature](https://github.com/Breezil/Breezil-Packets/issues/new?labels=enhancement)
&nbsp;&nbsp;|&nbsp;&nbsp;
[Join the Discord](https://discord.gg/wYs3cnsYeX)

</div>

---

## Table of Contents

1. [About](#about)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
5. [Quick Start](#quick-start)
6. [API Reference](#api-reference)
7. [Project Structure](#project-structure)
8. [Deployment](#deployment)
9. [Roadmap](#roadmap)
10. [Contributing](#contributing)
11. [Code of Conduct](#code-of-conduct)
12. [License](#license)
13. [Support &amp; Community](#support--community)
14. [Acknowledgements](#acknowledgements)

---

## About

Breezil-Packets is a fully open-source TypeScript library that describes every Minecraft 1.8.9 (protocol version 47) packet as a typed interface, organized by protocol state and direction. It gives the rest of the Breezil ecosystem one shared, honest source of truth for what is on the wire.

It helps tools like the [Breezil proxy](https://github.com/Breezil/Breezil-Proxy) decode raw network frames by numeric packet id straight into typed, well-documented shapes, so you never have to guess what a field means or shape it by hand. The package ships type definitions plus a handful of helper enums and constants, with no runtime protocol logic of its own.

> Part of [**Breezil**](https://github.com/Breezil), an open-source org building clean,
> well-documented projects, tools, and bots. No closed blobs, no sketchy builds. Every line
> is here to read.

> **Using a third-party API or platform?** Breezil-Packets follows the terms of service of
> anything it integrates with. We do not ship anything designed to abuse a platform or get
> accounts banned.

## Features

- 🧩 Complete packet coverage for every 1.8.9 protocol state: handshake, status, login, and play (clientbound and serverbound)
- 🏷️ Every packet is a documented TypeScript interface, with per-field notes on the values you can expect
- 🔢 Built for id-based decoding, so consumers like the proxy map a numeric packet id to a typed shape
- 🛰️ Bonus coverage for custom Hypixel ModAPI packets and channels
- 📦 Ships as a typed library, with `.d.ts` declarations published alongside the build

## Tech Stack

| Layer       | Choice                                        |
| ----------- | --------------------------------------------- |
| Language    | TypeScript                                    |
| Build       | `tsc -b` (TypeScript project references)      |
| Types       | `@types/node` (some fields use Node `Buffer`) |
| Package mgr | npm                                           |

## Getting Started

### Prerequisites

Make sure you have these installed before you start.

| Requirement | Version | Notes                            |
| ----------- | ------- | -------------------------------- |
| Node.js     | `>=20`  | [nodejs.org](https://nodejs.org) |
| npm         | `>=10`  | Ships with Node.js               |

### Installation

```bash
# Clone the repo
git clone https://github.com/Breezil/Breezil-Packets.git
cd Breezil-Packets

# Install dependencies and build
npm install
npm run build
```

Prefer it as a dependency in your own project?

```bash
npm install @breezil/packet-defs
```

## Quick Start

```ts
import type {
  SetProtocolServerbound,
  ChatClientbound,
} from "@breezil/packet-defs";

// Read a decoded chat packet with a known, typed shape.
function describeChat(packet: ChatClientbound): string {
  return `[pos ${packet.position}] ${packet.message}`;
}

// Build a handshake to send to the server.
const handshake: SetProtocolServerbound = {
  protocolVersion: 47, // Minecraft 1.8.9
  serverHost: "mc.hypixel.net",
  serverPort: 25565,
  nextState: 2, // Login
};
```

Because this package is type definitions, the imports above add no runtime weight. You pair them with whatever encoder or decoder you already use, and the shapes keep both sides honest.

## API Reference

This package exports interfaces, enums, and a few constants, all from the single entry point `@breezil/packet-defs`. There are no functions or classes to call. Everything is grouped by protocol state and direction so it lines up with how packets actually flow.

### Export categories

| Category                         | What's inside                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| Handshake                        | `SetProtocolServerbound`, `LegacyServerListPingServerbound` and helpers                   |
| Login                            | `LoginStartServerbound`, `LoginSuccessClientbound`, `EncryptionBegin*` and more           |
| Status                           | `ServerInfoClientbound`, `PingClientbound`, `ServerStatusResponse` and more               |
| Hypixel (ModAPI)                 | `HypixelLocationPacket`, `HypixelPartyInfoPacket`, `HYPIXEL_CHANNELS` and more            |
| Play / clientbound — connection  | `KeepAliveClientbound`, `LoginClientbound`, `RespawnClientbound` and more                 |
| Play / clientbound — player      | `PositionClientbound`, `UpdateHealthClientbound`, `AbilitiesClientbound` and more         |
| Play / clientbound — chat & UI   | `ChatClientbound`, `TitleClientbound`, `PlayerInfoClientbound` and more                   |
| Play / clientbound — scoreboard  | `ScoreboardObjectiveClientbound`, `ScoreboardTeamClientbound` and more                    |
| Play / clientbound — entity      | `SpawnEntityClientbound`, `EntityTeleportClientbound`, `EntityMetadata` and more          |
| Play / clientbound — inventory   | `OpenWindowClientbound`, `SetSlotClientbound`, `WindowItemsClientbound` and more          |
| Play / clientbound — world       | `MapChunkClientbound`, `BlockChangeClientbound`, `ExplosionClientbound` and more          |
| Play / serverbound — connection  | `KeepAliveServerbound`, `SettingsServerbound`, `CustomPayloadServerbound` and more        |
| Play / serverbound — movement    | `PositionServerbound`, `LookServerbound`, `PositionLookServerbound` and more              |
| Play / serverbound — interaction | `UseEntityServerbound`, `BlockDigServerbound`, `BlockPlaceServerbound` and more           |
| Play / serverbound — inventory   | `WindowClickServerbound`, `SetCreativeSlotServerbound`, `EnchantItemServerbound` and more |
| Play / serverbound — chat        | `ChatServerbound`, `TabCompleteServerbound`, `UpdateSignServerbound`                      |

Many categories also export supporting enums and value unions (for example `NextProtocolState`, `ChatMessagePosition`, `DiggingStatus`, `ScoreboardScoreAction`) and shared structures reused across packets, like `Slot`, `Position`, and `PlayerProperty`.

### Representative interfaces

Each packet interface carries its numeric id and a description in the doc comment, and every field documents the values you can expect. For example, the first packet a client sends:

```ts
/**
 * Packet: SetProtocol
 * ID: 0x00
 */
export interface SetProtocolServerbound {
  /** The protocol version used by the client. 47 for Minecraft 1.8.9. */
  protocolVersion: number;
  /** Server hostname used to connect. */
  serverHost: string;
  /** Server port used to connect. 0-65535. */
  serverPort: number;
  /** Next state to transition to. 1 (Status), 2 (Login). */
  nextState: NextProtocolState;
}
```

Some fields carry raw bytes and use Node's `Buffer` type, which is why the package depends on `@types/node`:

```ts
/**
 * Packet: EncryptionBegin (Clientbound)
 * ID: 0x01
 */
export interface EncryptionBeginClientbound {
  /** Server ID string. Empty for 1.7+ servers. */
  serverId: string;
  /** Server's public key, ASN.1 DER encoded. */
  publicKey: Buffer;
  /** Random verify token bytes. */
  verifyToken: Buffer;
}
```

## Project Structure

```text
Breezil-Packets/
├─ src/
│  ├─ index.ts                  # Public entry point, re-exports everything
│  ├─ handshake/                # Handshake state (index.ts + types.ts)
│  ├─ login/                    # Login state packets
│  ├─ status/                   # Server list ping / status
│  ├─ hypixel/                  # Custom Hypixel ModAPI packets and channels
│  └─ play/
│     ├─ clientbound/           # Server -> client packets
│     │  ├─ connection/
│     │  ├─ player/
│     │  ├─ chat/
│     │  ├─ scoreboard/
│     │  ├─ entity/
│     │  ├─ inventory/
│     │  └─ world/
│     └─ serverbound/           # Client -> server packets
│        ├─ connection/
│        ├─ movement/
│        ├─ interaction/
│        ├─ inventory/
│        └─ chat/
├─ docs/                        # Logo and assets
└─ package.json
```

Each leaf folder typically holds an `index.ts` with the packet interfaces and, where needed, a `types.ts` with the enums and value unions those packets reference.

## Deployment

Breezil-Packets is published to npm as [`@breezil/packet-defs`](https://www.npmjs.com/package/@breezil/packet-defs). Releases follow [Semantic Versioning](https://semver.org).

```bash
# Build the type declarations and JS output
npm run build

# Publish (maintainers)
npm publish
```

See the [Releases](https://github.com/Breezil/Breezil-Packets/releases) page for changelogs.

## Roadmap

- [ ] Keep packet shapes in sync with the proxy's decoder as it evolves
- [ ] Expand inline value documentation on the larger play packets
- [ ] Broaden Hypixel ModAPI packet coverage

Have an idea? [Open a feature request](https://github.com/Breezil/Breezil-Packets/issues/new?labels=enhancement).

## Contributing

Contributions are welcome and genuinely appreciated, first timers included. 💙

1. Fork the repo and create your branch: `git checkout -b feat/my-feature`
2. Make your changes, keeping field docs accurate and ids correct
3. Run `npm run build` to make sure the types still compile cleanly
4. Commit using [Conventional Commits](https://www.conventionalcommits.org): `feat: add combat event packet`
5. Open a Pull Request and describe what changed and why

New to the project? Look for issues labeled
[`good first issue`](https://github.com/Breezil/Breezil-Packets/labels/good%20first%20issue).
See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## Code of Conduct

This project follows the Breezil [Code of Conduct](CODE_OF_CONDUCT.md). By taking part you
agree to uphold it. Be kind, be welcoming.

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for the full text.

## Support &amp; Community

- 💬 **Discord:** [Join the Breezil community](https://discord.gg/wYs3cnsYeX)
- 🐛 **Issues:** [github.com/Breezil/Breezil-Packets/issues](https://github.com/Breezil/Breezil-Packets/issues)
- 💡 **Discussions:** [github.com/Breezil/Breezil-Packets/discussions](https://github.com/Breezil/Breezil-Packets/discussions)

## Acknowledgements

- The Minecraft 1.8.9 protocol (version 47) as documented by the wiki.vg community
- [`minecraft-protocol`](https://github.com/PrismarineJS/node-minecraft-protocol) for protocol reference
- Everyone in the [Breezil Discord](https://discord.gg/wYs3cnsYeX)

---

<div align="center">
<sub>Built with 💙 by <a href="https://github.com/Breezil">Breezil</a>.</sub>
</div>

