---
layout: home

hero:
  name: "@breezil/packet-defs"
  text: "Typed Minecraft protocol packets"
  tagline: "Fully typed packet definitions for the Breezil ecosystem. Minecraft 1.8.9 is ready today, with every version on the way."
  image:
    src: /logo.png
    alt: packet-defs
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: View on GitHub
      link: https://github.com/Breezil/Breezil-Packets

features:
  - icon: 🧩
    title: Typed packet defs
    details: Every Minecraft 1.8.9 (protocol version 47) packet described as a documented TypeScript interface, with per-field notes on the values you can expect. 1.8.9 is complete today, and the same treatment is planned for every Minecraft version.
  - icon: 🗂️
    title: Organized by state and direction
    details: Definitions are grouped by protocol state and direction (handshake, login, status, play clientbound and serverbound) so they line up with how packets flow on the wire.
  - icon: 🔢
    title: Buffer-typed binary fields
    details: Raw byte fields use Node's Buffer type, so encryption keys, tokens, and chunk data stay honest. That is why the package depends on @types/node.
  - icon: 🛰️
    title: Shared across Breezil
    details: One source of truth for what is on the wire, used by the Breezil proxy to decode raw network frames by numeric packet id straight into typed shapes.
  - icon: 📦
    title: Full type declarations
    details: Ships as a typed library with .d.ts declarations published alongside the build, so consumers get autocompletion and type safety out of the box.
---

