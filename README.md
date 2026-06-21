<div align="center">

<img src="docs/logo.png" alt="Breezil-Packets logo" width="120" />

# Breezil-Packets

**Fully typed Minecraft protocol packet definitions for the Breezil ecosystem. Minecraft 1.8.9 is ready today, with every version on the way.**

[![npm](https://img.shields.io/npm/v/@breezil/packet-defs?style=flat-square&logo=npm)](https://www.npmjs.com/package/@breezil/packet-defs)
[![Docs](https://img.shields.io/github/actions/workflow/status/Breezil/Breezil-Packets/docs.yml?branch=main&style=flat-square&label=docs)](https://breezil.github.io/Breezil-Packets/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Discord](https://img.shields.io/discord/1460052855389159527?style=flat-square&logo=discord&logoColor=white&label=discord)](https://discord.gg/7SxbNMYQNa)

[Documentation](https://breezil.github.io/Breezil-Packets/)
&nbsp;&nbsp;|&nbsp;&nbsp;
[Report a bug](https://github.com/Breezil/Breezil-Packets/issues/new?labels=bug)
&nbsp;&nbsp;|&nbsp;&nbsp;
[Request a feature](https://github.com/Breezil/Breezil-Packets/issues/new?labels=enhancement)
&nbsp;&nbsp;|&nbsp;&nbsp;
[Join the Discord](https://discord.gg/7SxbNMYQNa)

</div>

---

## Table of Contents

1. [About](#about)
2. [Versions](#versions)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
6. [Quick Start](#quick-start)
7. [Documentation](#documentation)
8. [API Reference](#api-reference)
9. [Project Structure](#project-structure)
10. [Releases and Deployment](#releases-and-deployment)
11. [Roadmap](#roadmap)
12. [Contributing](#contributing)
13. [Code of Conduct](#code-of-conduct)
14. [License](#license)
15. [Support and Community](#support-and-community)
16. [Acknowledgements](#acknowledgements)

---

## About

Breezil-Packets describes Minecraft protocol packets as typed TypeScript interfaces, organized by protocol state and direction. It gives the rest of the Breezil ecosystem one shared, honest source of truth for what is on the wire.

Today it ships complete coverage of Minecraft 1.8.9 (protocol version 47). The goal is to bring every Minecraft version under the same roof, each one fully typed and documented the same way 1.8.9 is. The package is pure type definitions plus a handful of helper enums and constants, with no runtime protocol logic of its own, so tools like the [Breezil proxy](https://github.com/Breezil/Breezil-Proxy) can decode raw network frames by numeric packet id straight into typed, well documented shapes.

> Part of [**Breezil**](https://github.com/Breezil), an open-source org building clean,
> well-documented projects, tools, and bots. No closed blobs, no sketchy builds. Every line
> is here to read.

> **Using a third-party API or platform?** Breezil-Packets follows the terms of service of
> anything it integrates with. We do not ship anything designed to abuse a platform or get
> accounts banned.

## Versions

| Minecraft version | Protocol | Status    |
| ----------------- | -------- | --------- |
| 1.8.9             | 47       | Available |
| Other versions    | various  | Planned   |

Every new version targets the same bar: complete coverage of all states and directions, every packet a documented interface, every field annotated with the values you can expect.

## Features

- 🧩 Complete packet coverage for every 1.8.9 protocol state: handshake, status, login, and play (clientbound and serverbound)
- 🏷️ Every packet is a documented TypeScript interface, with per-field notes on the values you can expect
- 🔢 Built for id-based decoding, so consumers like the proxy map a numeric packet id to a typed shape
- 🛰️ Bonus coverage for custom Hypixel ModAPI packets and channels
- 🧭 Designed to grow across Minecraft versions, each one held to the same complete, documented standard
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

## Documentation

The full reference and guides live at **[breezil.github.io/Breezil-Packets](https://breezil.github.io/Breezil-Packets/)**.

This README covers the essentials. The docs site is the complete reference: every packet across every state and direction, with its numeric id and every field documented. Start there when you need the exact shape of something on the wire.

| Page                                                                               | What is inside                                |
| ---------------------------------------------------------------------------------- | --------------------------------------------- |
| [Getting Started](https://breezil.github.io/Breezil-Packets/guide/getting-started) | Install, import, and use the type definitions |
| [API Reference](https://breezil.github.io/Breezil-Packets/api/)                    | The complete, per-packet, per-field reference |

## API Reference

Everything is exported from the single entry point `@breezil/packet-defs`. There are no functions or classes to call, only interfaces, enums, and a few constants, grouped by protocol state and direction so they line up with how packets flow on the wire.

| Category                       | What is inside                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Handshake                      | `SetProtocolServerbound`, `LegacyServerListPingServerbound`, and helpers                   |
| Login                          | `LoginStartServerbound`, `LoginSuccessClientbound`, `EncryptionBegin*`, and more           |
| Status                         | `ServerInfoClientbound`, `PingClientbound`, `ServerStatusResponse`, and more               |
| Hypixel (ModAPI)               | `HypixelLocationPacket`, `HypixelPartyInfoPacket`, `HYPIXEL_CHANNELS`, and more            |
| Play, clientbound, connection  | `KeepAliveClientbound`, `LoginClientbound`, `RespawnClientbound`, and more                 |
| Play, clientbound, player      | `PositionClientbound`, `UpdateHealthClientbound`, `AbilitiesClientbound`, and more         |
| Play, clientbound, chat and UI | `ChatClientbound`, `TitleClientbound`, `PlayerInfoClientbound`, and more                   |
| Play, clientbound, scoreboard  | `ScoreboardObjectiveClientbound`, `ScoreboardTeamClientbound`, and more                    |
| Play, clientbound, entity      | `SpawnEntityClientbound`, `EntityTeleportClientbound`, `EntityMetadata`, and more          |
| Play, clientbound, inventory   | `OpenWindowClientbound`, `SetSlotClientbound`, `WindowItemsClientbound`, and more          |
| Play, clientbound, world       | `MapChunkClientbound`, `BlockChangeClientbound`, `ExplosionClientbound`, and more          |
| Play, serverbound, connection  | `KeepAliveServerbound`, `SettingsServerbound`, `CustomPayloadServerbound`, and more        |
| Play, serverbound, movement    | `PositionServerbound`, `LookServerbound`, `PositionLookServerbound`, and more              |
| Play, serverbound, interaction | `UseEntityServerbound`, `BlockDigServerbound`, `BlockPlaceServerbound`, and more           |
| Play, serverbound, inventory   | `WindowClickServerbound`, `SetCreativeSlotServerbound`, `EnchantItemServerbound`, and more |
| Play, serverbound, chat        | `ChatServerbound`, `TabCompleteServerbound`, `UpdateSignServerbound`                       |

Many categories also export supporting enums and value unions (for example `NextProtocolState`, `ChatMessagePosition`, `DiggingStatus`, `ScoreboardScoreAction`) and shared structures reused across packets, like `Slot`, `Position`, and `PlayerProperty`.

For the complete list, with every interface, its numeric id, and every field documented, see the [full API Reference](https://breezil.github.io/Breezil-Packets/api/).

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
│     ├─ clientbound/           # Server to client packets
│     │  ├─ connection/
│     │  ├─ player/
│     │  ├─ chat/
│     │  ├─ scoreboard/
│     │  ├─ entity/
│     │  ├─ inventory/
│     │  └─ world/
│     └─ serverbound/           # Client to server packets
│        ├─ connection/
│        ├─ movement/
│        ├─ interaction/
│        ├─ inventory/
│        └─ chat/
├─ docs/                        # VitePress docs site, logo, assets
└─ package.json
```

Each leaf folder typically holds an `index.ts` with the packet interfaces and, where needed, a `types.ts` with the enums and value unions those packets reference.

## Releases and Deployment

Two things ship automatically from this repo, so there is no manual deploy step.

**Documentation.** The docs site rebuilds and deploys to GitHub Pages on every push to `main`, via [`.github/workflows/docs.yml`](.github/workflows/docs.yml). Merge to `main` and the site updates on its own.

**npm package.** Publishing to npm is automated by [`.github/workflows/publish.yml`](.github/workflows/publish.yml), which runs when a GitHub Release is published. Releases follow [Semantic Versioning](https://semver.org). To cut one:

1. Bump `version` in `package.json` (for example `1.0.1`).
2. Commit that change to `main`.
3. On GitHub, go to **Releases**, choose **Draft a new release**, create a tag like `v1.0.1`, write the notes, and click **Publish release**.

Publishing the release triggers the workflow, which builds the package and runs `npm publish` with provenance. The first publish is done once by a maintainer (`npm publish` locally) so the package exists, after which the Trusted Publisher setup lets the Action handle every release with no token to manage.

## Roadmap

- [x] Complete Minecraft 1.8.9 (protocol version 47) coverage, all states and directions, fully typed and documented
- [ ] Additional Minecraft versions, each given the same complete, per-field treatment
- [ ] Per-version exports so you can pin the protocol you target
- [ ] Wider Hypixel ModAPI packet coverage
- [ ] Keep packet shapes in sync with the Breezil proxy decoder as it evolves

Want a particular version prioritized? [Open a feature request](https://github.com/Breezil/Breezil-Packets/issues/new?labels=enhancement).

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

## Support and Community

- 💬 **Discord:** [Join the Breezil community](https://discord.gg/7SxbNMYQNa)
- 🐛 **Issues:** [github.com/Breezil/Breezil-Packets/issues](https://github.com/Breezil/Breezil-Packets/issues)
- 💡 **Discussions:** [github.com/Breezil/Breezil-Packets/discussions](https://github.com/Breezil/Breezil-Packets/discussions)

## Acknowledgements

- The Minecraft 1.8.9 protocol (version 47) as documented by the wiki.vg community
- [`minecraft-protocol`](https://github.com/PrismarineJS/node-minecraft-protocol) for protocol reference
- Everyone in the [Breezil Discord](https://discord.gg/7SxbNMYQNa)

---

<div align="center">
<sub>Built with 💙 by <a href="https://github.com/Breezil">Breezil</a>.</sub>
</div>

