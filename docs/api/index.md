# API Reference

This package exports interfaces, enums, and a few constants, all from the single entry point `@breezil/packet-defs`. These are type definitions, not runtime functions or classes, so there is nothing to call. Everything is grouped by protocol state and direction so it lines up with how packets actually flow.

## Export categories

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

## Representative interfaces

Each packet interface carries its numeric id and a description in the doc comment, and every field documents the values you can expect. For example, the first packet a client sends, the handshake:

```ts
/**
 * Packet: SetProtocol
 * Description: First packet sent by the client to initiate the connection handshake.
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
 * Description: Initiates the encryption handshake for online-mode servers.
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

Pair these shapes with your own encoder or decoder, map a numeric packet id to the matching interface, and both sides of the connection stay honest.

