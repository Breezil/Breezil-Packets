# Getting Started

`@breezil/packet-defs` is a fully typed description of every Minecraft 1.8.9 (protocol version 47) packet, organized by protocol state and direction. It gives the Breezil ecosystem one shared, honest source of truth for what is on the wire.

## Install

```bash
npm install @breezil/packet-defs
```

Node.js `>=20` and npm `>=10` are recommended.

## Usage

This package is type definitions, not runtime logic. There are no functions or classes to call. You import the interfaces you need and use them to type the packets you decode or build, then pair them with whatever encoder or decoder you already use.

Because the imports are types, they add no runtime weight to your bundle.

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

Everything is exported from the single entry point `@breezil/packet-defs`. Head to the [API Reference](/api/) to see how the exports are grouped.

