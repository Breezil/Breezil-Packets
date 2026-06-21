# API Reference

`@breezil/packet-defs` is a pure type-definition package: a complete, fully documented set of TypeScript interfaces, type unions, and constants describing the Minecraft protocol packet shapes. There are no runtime functions or classes here, only types. Everything is re-exported from the single entry point `@breezil/packet-defs`, so a single import gives you the whole surface:

```ts
import {
  SetProtocolServerbound,
  LoginClientbound,
  ChatServerbound,
  Slot,
  Position,
  HYPIXEL_CHANNELS,
} from "@breezil/packet-defs";
```

## Versions

This package currently ships fully typed packet definitions for **Minecraft 1.8.9 (protocol version 47)**, compatible with `minecraft-protocol ^1.47.0`. Every interface, field, and id documented below describes that version.

The stated goal of the project is to eventually cover **every Minecraft version** with the same complete, per-field treatment. Today only 1.8.9 is available; all other versions are planned and on the way. Nothing below should be read as describing any version other than 1.8.9.

## How to read this reference

Packets are organized by protocol state (Handshake, Status, Login, Play) and, within Play, by direction (clientbound = server to client, serverbound = client to server). Each packet entry lists:

- its exported interface name,
- its numeric packet id (e.g. `0x00`), taken from the source documentation,
- a one-line description,
- the full TypeScript interface with every field's documented meaning.

Packet ids are state-scoped and direction-scoped: the same id can appear in different states or directions. Hypixel ModAPI packets do not have protocol ids; they travel over named plugin-message channels and so list a channel instead.

Shared and supporting types (enums, value unions, and shared structures such as `Slot` and `Position`) are documented in their own section at the end and are referenced throughout the packet interfaces.

## Handshake

The handshake state is the first thing a client sends after connecting; it tells the server which protocol version is in use and whether the client wants to ping status or log in. Both packets are serverbound.

### SetProtocolServerbound

Packet id `0x00`. First packet sent by the client to initiate the connection handshake. Determines whether the client wants to check server status or login.

```ts
export interface SetProtocolServerbound {
  /**
   * The protocol version used by the client
   * Possible values: 47 (Minecraft 1.8.9)
   */
  protocolVersion: number;

  /**
   * Server hostname used to connect
   * Possible values: any valid hostname or IP string
   */
  serverHost: string;

  /**
   * Server port used to connect
   * Possible values: 0-65535
   */
  serverPort: number;

  /**
   * Next state to transition to
   * Possible values: 1 (Status), 2 (Login)
   */
  nextState: NextProtocolState;
}
```

### LegacyServerListPingServerbound

Packet id `0xFE`. Legacy ping request used to query server MOTD and player count.

```ts
export interface LegacyServerListPingServerbound {
  /**
   * Payload marker byte
   * Possible values: 1 (always 0x01)
   */
  payload: LegacyPingPayload;
}
```

See also the shared types `NextProtocolState` and `LegacyPingPayload`.

## Status

The status state powers the server list ping (MOTD, player count, favicon). The shared structure `ServerStatusResponse` describes the JSON the server returns.

### ServerInfoClientbound

Packet id `0x00`. Contains the server's status information for the server list.

```ts
export interface ServerInfoClientbound {
  /**
   * Server status response object
   * Possible values: ServerStatusResponse JSON structure
   */
  response: ServerStatusResponse;
}
```

### PingClientbound

Packet id `0x01`. Response to client's ping packet with the same timestamp for latency calculation.

```ts
export interface PingClientbound {
  /**
   * Timestamp from the client's ping packet
   * Possible values: 64-bit integer (BigInt) echoed from client
   */
  time: bigint;
}
```

### PingStartServerbound

Packet id `0x00`. Requests the server to send its status information. This packet has no fields.

```ts
export interface PingStartServerbound {
  // No fields - empty packet
}
```

### PingServerbound

Packet id `0x01`. Sent by client to measure server latency. Server should respond with the same timestamp.

```ts
export interface PingServerbound {
  /**
   * Timestamp for latency measurement
   * Possible values: 64-bit integer (BigInt), usually current time in milliseconds
   */
  time: bigint;
}
```

The shared `ServerStatusResponse` structure is documented in the shared types section.

## Login

The login state handles authentication and (optionally) encryption and compression negotiation, ending with a transition to the play state. The shared structure `PlayerProperty` (skin/cape profile data) is defined here and reused elsewhere.

### DisconnectLoginClientbound

Packet id `0x00`. Sent when the server refuses the login attempt.

```ts
export interface DisconnectLoginClientbound {
  /**
   * Disconnect reason as JSON text component
   * Possible values: serialized JSON chat component string
   */
  reason: string;
}
```

### EncryptionBeginClientbound

Packet id `0x01`. Initiates the encryption handshake for online-mode servers.

```ts
export interface EncryptionBeginClientbound {
  /**
   * Server ID string
   * Possible values: empty string for 1.7+ servers
   */
  serverId: string;

  /**
   * Server's public key (ASN.1 DER encoded)
   * Possible values: DER-encoded RSA public key bytes
   */
  publicKey: Buffer;

  /**
   * Random verify token bytes
   * Possible values: 4 random bytes
   */
  verifyToken: Buffer;
}
```

### LoginSuccessClientbound

Packet id `0x02`. Signals successful login; the connection transitions to the play state.

```ts
export interface LoginSuccessClientbound {
  /**
   * Player's UUID with hyphens
   * Possible values: UUID string in format "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  uuid: string;

  /**
   * Player's username
   * Possible values: 1-16 character username string
   */
  username: string;
}
```

### CompressClientbound

Packet id `0x03`. Enables packet compression above the specified threshold. Sent before Login Success if compression is enabled.

```ts
export interface CompressClientbound {
  /**
   * Minimum packet size to compress
   * Possible values: -1 (disable) or positive integer threshold in bytes
   */
  threshold: number;
}
```

### LoginStartServerbound

Packet id `0x00`. First packet in the login state; contains the player's username.

```ts
export interface LoginStartServerbound {
  /**
   * Player's username
   * Possible values: 1-16 character username string
   */
  username: string;
}
```

### EncryptionBeginServerbound

Packet id `0x01`. Client's response to the encryption request with encrypted secrets.

```ts
export interface EncryptionBeginServerbound {
  /**
   * Shared secret encrypted with server's public key
   * Possible values: RSA-encrypted shared secret bytes
   */
  sharedSecret: Buffer;

  /**
   * Verify token encrypted with server's public key
   * Possible values: RSA-encrypted verify token bytes
   */
  verifyToken: Buffer;
}
```

The shared `PlayerProperty` structure is documented in the shared types section.

## Hypixel (ModAPI)

These are custom packets used by the Hypixel ModAPI (based on [HypixelDev/ModAPI](https://github.com/HypixelDev/ModAPI)). They are not standard protocol packets and have no numeric ids; instead they travel as plugin messages over named custom-payload channels. Each entry lists its channel. The exported `HYPIXEL_CHANNELS` constant maps channel keys to those names, and the shared type `HypixelChannel` is the union of channel names.

### HypixelLocationPacket

Channel `hyp:location`. Describes the server/lobby context the player is currently in on Hypixel.

```ts
export interface HypixelLocationPacket {
  /**
   * Internal server name
   * Possible values: server identifier string like "mini123A"
   */
  serverName: string;

  /**
   * Top-level server type (game category)
   * Possible values: HypixelServerTypeValue or undefined when not provided
   */
  serverType?: HypixelServerTypeValue;

  /**
   * Lobby name if the player is in a lobby
   * Possible values: lobby identifier string or undefined
   */
  lobbyName?: string;

  /**
   * Game mode identifier
   * Possible values: "solo", "teams", "doubles", etc. or undefined
   */
  mode?: string;

  /**
   * Map name if applicable
   * Possible values: map name string or undefined
   */
  map?: string;
}
```

### HypixelPartyInfoPacket

Channel `hyp:party_info`. Contains the player's current party information on Hypixel. Party members are described by the shared `HypixelPartyMemberData` structure.

```ts
export interface HypixelPartyInfoPacket {
  /**
   * Whether the player is currently in a party
   * Possible values: true or false
   */
  inParty: boolean;

  /**
   * Members in the party
   * Possible values: array of HypixelPartyMemberData, empty if not in a party
   */
  members: HypixelPartyMemberData[];
}
```

### HypixelPartyMemberData

Shared structure. Represents a single member within a Hypixel party.

```ts
export interface HypixelPartyMemberData {
  /**
   * Member UUID with hyphens
   * Possible values: UUID string in format "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  uuid: string;

  /**
   * Member role within the party
   * Possible values: "LEADER", "MOD", or "MEMBER"
   */
  role: HypixelPartyRole;
}
```

### HypixelPingPacket

Channel `hyp:ping`. Hypixel ping/pong packet for connection health checks.

```ts
export interface HypixelPingPacket {
  /**
   * Server response string
   * Possible values: "pong" or other response strings
   */
  response: string;
}
```

### HypixelHelloPacket

Channel `hyp:hello`. Initial handshake packet from the Hypixel ModAPI identifying the environment.

```ts
export interface HypixelHelloPacket {
  /**
   * Environment identifier for the API
   * Possible values: "PRODUCTION", "ALPHA", or "BETA"
   */
  environment: HypixelEnvironment;
}
```

### HYPIXEL_CHANNELS

Exported constant. The custom payload channel names used by the Hypixel ModAPI, declared `as const`.

```ts
export const HYPIXEL_CHANNELS = {
  /** Hello channel - initial handshake */
  HELLO: "hyp:hello",
  /** Location channel - server/lobby context */
  LOCATION: "hyp:location",
  /** Party info channel - party membership */
  PARTY_INFO: "hyp:party_info",
  /** Ping channel - connection health */
  PING: "hyp:ping",
} as const;
```

The Hypixel supporting types (`HypixelServerType`, `HypixelServerTypeValue`, `HypixelPartyRole`, `HypixelEnvironment`, `HypixelChannel`) are documented in the shared types section.

## Play: clientbound

Clientbound play packets are sent from the server to the client. They are grouped here by concern: Connection, Player, Chat and UI, Scoreboard, Entity, Inventory, and World.

### Connection

Lifecycle and session packets: join, respawn, keep-alive, compression, difficulty, resource packs, and plugin messages.

#### KeepAliveClientbound

Packet id `0x00`. Server sends this periodically; the client must respond with the same ID.

```ts
export interface KeepAliveClientbound {
  /**
   * Random ID that must be echoed back by the client
   * Possible values: any integer
   */
  keepAliveId: number;
}
```

#### LoginClientbound

Packet id `0x01`. The JoinGame packet, sent when the player joins the server to establish initial game state.

```ts
export interface LoginClientbound {
  /**
   * The player's entity ID assigned by the server
   * Possible values: any integer entity ID
   */
  entityId: number;

  /**
   * Game mode of the player
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator), +8 for hardcore
   */
  gameMode: number;

  /**
   * Dimension the player is in
   * Possible values: -1 (Nether), 0 (Overworld), 1 (End)
   */
  dimension: number;

  /**
   * Server difficulty setting
   * Possible values: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard)
   */
  difficulty: number;

  /**
   * Maximum players shown in tab list (ignored by client)
   * Possible values: any unsigned byte
   */
  maxPlayers: number;

  /**
   * World type identifier
   * Possible values: "default", "flat", "largeBiomes", "amplified", "customized"
   */
  levelType: string;

  /**
   * Whether to disable some debug information on F3
   * Possible values: true or false
   */
  reducedDebugInfo: boolean;
}
```

#### RespawnClientbound

Packet id `0x07`. Sent to change the player's dimension or respawn after death.

```ts
export interface RespawnClientbound {
  /**
   * The new dimension ID
   * Possible values: -1 (Nether), 0 (Overworld), 1 (End)
   */
  dimension: number;

  /**
   * The server difficulty
   * Possible values: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard)
   */
  difficulty: number;

  /**
   * The player's game mode
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator)
   */
  gamemode: number;

  /**
   * World type string
   * Possible values: "default", "flat", "largeBiomes", "amplified", "customized"
   */
  levelType: string;
}
```

#### KickDisconnectClientbound

Packet id `0x40`. Disconnects the player with a given reason.

```ts
export interface KickDisconnectClientbound {
  /**
   * Disconnect reason as JSON text component
   * Possible values: serialized JSON chat component string
   */
  reason: string;
}
```

#### SetCompressionClientbound

Packet id `0x46`. Enables packet compression above a given threshold during the play state.

```ts
export interface SetCompressionClientbound {
  /**
   * Minimum packet size to compress
   * Possible values: -1 (disable) or positive integer threshold in bytes
   */
  threshold: number;
}
```

#### DifficultyClientbound

Packet id `0x41`. The ServerDifficulty packet, updating the server difficulty shown to the player.

```ts
export interface DifficultyClientbound {
  /**
   * The server difficulty level
   * Possible values: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard)
   */
  difficulty: number;
}
```

#### ResourcePackSendClientbound

Packet id `0x48`. Requests the client to download a resource pack.

```ts
export interface ResourcePackSendClientbound {
  /**
   * URL to download the resource pack from
   * Possible values: valid HTTP/HTTPS URL string
   */
  url: string;

  /**
   * SHA-1 hash of the resource pack file
   * Possible values: 40-character hex string
   */
  hash: string;
}
```

#### CustomPayloadClientbound

Packet id `0x3F`. Sends custom plugin message data on a named channel.

```ts
export interface CustomPayloadClientbound {
  /**
   * The plugin message channel name
   * Possible values: channel identifier string like "MC|Brand", "hyp:location", etc.
   */
  channel: string;

  /**
   * The raw message data
   * Possible values: Buffer of arbitrary bytes
   */
  data: Buffer;
}
```

### Player

Packets that update the local player's own state: position, abilities, held item, experience, health, bed, spawn point, game-state changes, and camera.

#### PositionClientbound

Packet id `0x08`. The PlayerPositionAndLook (clientbound) packet. Updates the player's position and rotation. Can use relative or absolute values.

```ts
export interface PositionClientbound {
  /**
   * X position (absolute or relative based on flags)
   * Possible values: any double-precision floating-point
   */
  x: number;

  /**
   * Y position (feet position, absolute or relative based on flags)
   * Possible values: any double-precision floating-point
   */
  y: number;

  /**
   * Z position (absolute or relative based on flags)
   * Possible values: any double-precision floating-point
   */
  z: number;

  /**
   * Yaw rotation in degrees
   * Possible values: 0.0-360.0
   */
  yaw: number;

  /**
   * Pitch rotation in degrees
   * Possible values: -90.0 to 90.0
   */
  pitch: number;

  /**
   * Relativity flags bitmask
   * Possible values: bit 0=X, 1=Y, 2=Z, 3=yaw, 4=pitch (0 = absolute, 1 = relative)
   */
  flags: number;
}
```

#### AbilitiesClientbound

Packet id `0x39`. The PlayerAbilities (clientbound) packet. Updates the player's ability flags like flying, creative mode, and invulnerability.

```ts
export interface AbilitiesClientbound {
  /**
   * Ability flags bitmask
   * Possible values: bit 0=invulnerable, 1=flying, 2=allow flying, 3=creative mode
   */
  flags: number;

  /**
   * Flying speed multiplier
   * Possible values: floating-point, default 0.05
   */
  flyingSpeed: number;

  /**
   * Walking/FOV speed multiplier
   * Possible values: floating-point, default 0.1
   */
  walkingSpeed: number;
}
```

#### HeldItemSlotClientbound

Packet id `0x09`. The HeldItemChange (clientbound) packet. Updates which hotbar slot is currently selected.

```ts
export interface HeldItemSlotClientbound {
  /**
   * Selected hotbar slot index
   * Possible values: 0-8
   */
  slot: number;
}
```

#### ExperienceClientbound

Packet id `0x1F`. The SetExperience packet. Updates the player's experience bar, level, and total XP.

```ts
export interface ExperienceClientbound {
  /**
   * Experience bar progress
   * Possible values: 0.0-1.0
   */
  experienceBar: number;

  /**
   * Current experience level
   * Possible values: 0 or positive integer
   */
  level: number;

  /**
   * Total accumulated experience points
   * Possible values: 0 or positive integer
   */
  totalExperience: number;
}
```

#### UpdateHealthClientbound

Packet id `0x06`. Updates the player's health, food level, and food saturation.

```ts
export interface UpdateHealthClientbound {
  /**
   * Current health
   * Possible values: 0.0-20.0 (each heart = 2.0), 0.0 = dead
   */
  health: number;

  /**
   * Current food level
   * Possible values: 0-20
   */
  food: number;

  /**
   * Current food saturation
   * Possible values: 0.0-5.0
   */
  foodSaturation: number;
}
```

#### BedClientbound

Packet id `0x0A`. The UseBed packet. Shows a player entity entering a bed. Uses the shared `Position` structure.

```ts
export interface BedClientbound {
  /**
   * The player's entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * The bed's block position
   * Possible values: Position with block coordinates
   */
  location: Position;
}
```

#### SpawnPositionClientbound

Packet id `0x05`. Sets the player's compass target/spawn point position.

```ts
export interface SpawnPositionClientbound {
  /**
   * The world spawn point location
   * Possible values: Position with block coordinates
   */
  location: Position;
}
```

#### GameStateChangeClientbound

Packet id `0x2B`. The ChangeGameState packet. Updates game state like weather, game mode changes, or game events.

```ts
export interface GameStateChangeClientbound {
  /**
   * Reason code for the state change
   * Possible values: 0=invalid bed, 1=end rain, 2=begin rain, 3=change game mode, 4=enter credits, 5=demo msg, 6=arrow hit, 7=fade value, 8=fade time, 10=play guardian effect
   */
  reason: number;

  /**
   * Value associated with the reason
   * Possible values: context-dependent float (e.g., game mode ID for reason 3)
   */
  gameMode: number;
}
```

#### CameraClientbound

Packet id `0x43`. Sets the camera to view from another entity's perspective.

```ts
export interface CameraClientbound {
  /**
   * Entity ID to view from
   * Possible values: any entity ID (own entity ID to reset to first person)
   */
  cameraId: number;
}
```

### Chat and UI

Chat messages, titles, the tab list (player info, header/footer), tab completion, and statistics. Several of these reuse the supporting types `ChatMessagePosition`, `PlayerInfoAction`, and `TitleAction`, and the player-info data variants and `StatisticsEntry` documented as shared structures here.

#### PlayerInfoDataAddPlayer

Shared structure. Player info data for adding a player to the tab list. Uses the shared `PlayerProperty` structure.

```ts
export interface PlayerInfoDataAddPlayer {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * Player username
   * Possible values: 1-16 character username
   */
  name: string;

  /**
   * Skin properties and signatures
   * Possible values: array of PlayerProperty (textures, etc.)
   */
  properties: PlayerProperty[];

  /**
   * Player's game mode
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator)
   */
  gamemode: number;

  /**
   * Latency/ping in milliseconds
   * Possible values: 0 or positive integer
   */
  ping: number;

  /**
   * Display name override (JSON text component)
   * Possible values: serialized JSON chat component string or undefined
   */
  displayName?: string;
}
```

#### PlayerInfoDataUpdateGameMode

Shared structure. Player info data for updating a player's game mode.

```ts
export interface PlayerInfoDataUpdateGameMode {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * New game mode
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator)
   */
  gamemode: number;
}
```

#### PlayerInfoDataUpdateLatency

Shared structure. Player info data for updating a player's latency/ping.

```ts
export interface PlayerInfoDataUpdateLatency {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * New ping in milliseconds
   * Possible values: 0 or positive integer
   */
  ping: number;
}
```

#### PlayerInfoDataUpdateDisplayName

Shared structure. Player info data for updating a player's display name.

```ts
export interface PlayerInfoDataUpdateDisplayName {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * New display name (JSON text component)
   * Possible values: serialized JSON chat component string or undefined
   */
  displayName?: string;
}
```

#### PlayerInfoDataRemovePlayer

Shared structure. Player info data for removing a player from the tab list.

```ts
export interface PlayerInfoDataRemovePlayer {
  /**
   * Player UUID to remove
   * Possible values: UUID string with hyphens
   */
  uuid: string;
}
```

#### StatisticsEntry

Shared structure. Represents a single tracked statistic value.

```ts
export interface StatisticsEntry {
  /**
   * Statistic name
   * Possible values: "stat.playerKills", "stat.mobKills", "stat.deaths", etc.
   */
  name: string;

  /**
   * Statistic value
   * Possible values: 0 or positive integer
   */
  value: number;
}
```

#### ChatClientbound

Packet id `0x02`. The ChatMessage (clientbound) packet. Sends a chat message or system message to the client.

```ts
export interface ChatClientbound {
  /**
   * Message content as JSON text component
   * Possible values: serialized JSON chat component string
   */
  message: string;

  /**
   * Message display position
   * Possible values: 0 (chat box), 1 (system message), 2 (action bar)
   */
  position: ChatMessagePosition;
}
```

#### TitleClientbound

Packet id `0x45`. Displays a title, subtitle, or action bar text, or configures title timing.

```ts
export interface TitleClientbound {
  /**
   * Title action type
   * Possible values: 0 (set title), 1 (set subtitle), 2 (set times), 3 (clear), 4 (reset)
   */
  action: TitleAction;

  /**
   * Text content (JSON text component, for set title/subtitle actions)
   * Possible values: serialized JSON chat component string or undefined
   */
  text?: string;

  /**
   * Fade in duration in ticks (for set times action)
   * Possible values: 0 or positive integer or undefined
   */
  fadeIn?: number;

  /**
   * Stay duration in ticks (for set times action)
   * Possible values: 0 or positive integer or undefined
   */
  stay?: number;

  /**
   * Fade out duration in ticks (for set times action)
   * Possible values: 0 or positive integer or undefined
   */
  fadeOut?: number;
}
```

#### PlayerlistHeaderClientbound

Packet id `0x47`. The PlayerListHeaderAndFooter packet. Sets the header and footer text in the player tab list.

```ts
export interface PlayerlistHeaderClientbound {
  /**
   * Tab list header text
   * Possible values: serialized JSON chat component string
   */
  header: string;

  /**
   * Tab list footer text
   * Possible values: serialized JSON chat component string
   */
  footer: string;
}
```

#### TabCompleteClientbound

Packet id `0x3A`. Provides auto-complete suggestions for a chat command.

```ts
export interface TabCompleteClientbound {
  /**
   * List of completion suggestions
   * Possible values: array of suggestion strings
   */
  matches: string[];
}
```

#### StatisticsClientbound

Packet id `0x37`. Sends the player's tracked statistics data. Each entry is a `StatisticsEntry`.

```ts
export interface StatisticsClientbound {
  /**
   * Array of statistic entries
   * Possible values: array of StatisticsEntry
   */
  entries: StatisticsEntry[];
}
```

#### PlayerInfoClientbound

Packet id `0x38`. Updates the player list (tab list) with player information. The `data` array holds one of the five `PlayerInfoData*` variants matching the `action`.

```ts
export interface PlayerInfoClientbound {
  /**
   * The action type to perform
   * Possible values: "add_player", "update_game_mode", "update_latency", "update_display_name", "remove_player"
   */
  action: PlayerInfoAction;

  /**
   * Player data entries for the action
   * Possible values: array of PlayerInfoData variants matching the action
   */
  data: (
    | PlayerInfoDataAddPlayer
    | PlayerInfoDataUpdateGameMode
    | PlayerInfoDataUpdateLatency
    | PlayerInfoDataUpdateDisplayName
    | PlayerInfoDataRemovePlayer
  )[];
}
```

### Scoreboard

Objectives, scores, display slots, and teams. These reuse the supporting types `ScoreboardObjectiveAction`, `ScoreboardScoreAction`, and `ScoreboardDisplayPosition`.

#### ScoreboardObjectiveClientbound

Packet id `0x3B`. Creates, removes, or updates a scoreboard objective.

```ts
export interface ScoreboardObjectiveClientbound {
  /**
   * Unique objective name
   * Possible values: 1-16 character identifier string
   */
  name: string;

  /**
   * Action to perform
   * Possible values: 0 (create), 1 (remove), 2 (update display text)
   */
  action: ScoreboardObjectiveAction;

  /**
   * Display text (JSON text component, only for create/update actions)
   * Possible values: serialized JSON chat component string or undefined
   */
  displayText?: string;

  /**
   * Render type for the score value
   * Possible values: "integer" or "hearts" or undefined
   */
  type?: string;
}
```

#### ScoreboardScoreClientbound

Packet id `0x3C`. Updates or removes a score entry in a scoreboard objective.

```ts
export interface ScoreboardScoreClientbound {
  /**
   * Score entry name (e.g., player name)
   * Possible values: 1-40 character string
   */
  itemName: string;

  /**
   * Action to perform
   * Possible values: 0 (create/update), 1 (remove)
   */
  action: ScoreboardScoreAction;

  /**
   * Objective name this score belongs to
   * Possible values: objective identifier string
   */
  scoreName: string;

  /**
   * The score value (only for create/update action)
   * Possible values: any integer or undefined
   */
  value?: number;
}
```

#### ScoreboardDisplayObjectiveClientbound

Packet id `0x3D`. Sets which objective to display in which scoreboard slot.

```ts
export interface ScoreboardDisplayObjectiveClientbound {
  /**
   * Display position slot
   * Possible values: 0 (tab list), 1 (sidebar), 2 (below player name)
   */
  position: ScoreboardDisplayPosition;

  /**
   * Objective name to display (empty string to clear)
   * Possible values: objective identifier string or empty string
   */
  name: string;
}
```

#### ScoreboardTeamClientbound

Packet id `0x3E`. The Teams packet. Creates, removes, updates a team, or adds/removes team members.

```ts
export interface ScoreboardTeamClientbound {
  /**
   * Unique team name
   * Possible values: 1-16 character identifier string
   */
  team: string;

  /**
   * Team operation mode
   * Possible values: 0 (create), 1 (remove), 2 (update info), 3 (add players), 4 (remove players)
   */
  mode: number;

  /**
   * Team display name (only for create/update modes)
   * Possible values: display name string or undefined
   */
  name?: string;

  /**
   * Prefix for team members' nametags (only for create/update modes)
   * Possible values: prefix string or undefined
   */
  prefix?: string;

  /**
   * Suffix for team members' nametags (only for create/update modes)
   * Possible values: suffix string or undefined
   */
  suffix?: string;

  /**
   * Friendly fire flags (only for create/update modes)
   * Possible values: 0 (off), 1 (on), 3 (see invisible teammates) or undefined
   */
  friendlyFire?: number;

  /**
   * Name tag visibility rule (only for create/update modes)
   * Possible values: "always", "hideForOtherTeams", "hideForOwnTeam", "never" or undefined
   */
  nameTagVisibility?: string;

  /**
   * Team color index (only for create/update modes)
   * Possible values: 0-15 (chat color codes) or undefined
   */
  color?: number;

  /**
   * Players to add or remove (only for modes 0, 3, 4)
   * Possible values: array of player name strings or undefined
   */
  players?: string[];
}
```

### Entity

Entity spawning, movement, rotation, velocity, destruction, metadata, status, effects, equipment, attachment, attributes, animations, and item collection. These reuse the shared structures `Slot`, `AttributeModifier`, `Attribute`, and the supporting type `EntityMetadata`.

#### Slot

Shared structure. Represents an item stack in any inventory slot. Used widely across entity, inventory, and interaction packets.

```ts
export interface Slot {
  /**
   * Block or item ID
   * Possible values: -1 (empty) or valid item/block ID
   */
  blockId: number;

  /**
   * Stack size
   * Possible values: 1-64 or undefined for empty
   */
  itemCount?: number;

  /**
   * Item damage/durability value
   * Possible values: 0+ or undefined
   */
  itemDamage?: number;

  /**
   * NBT data for item properties
   * Possible values: parsed NBT object or undefined
   */
  nbtData?: any;
}
```

#### AttributeModifier

Shared structure. A multiplicative or additive change applied to an entity attribute.

```ts
export interface AttributeModifier {
  /**
   * Unique identifier for this modifier
   * Possible values: UUID string
   */
  uuid: string;

  /**
   * Amount to modify by
   * Possible values: any floating-point number
   */
  amount: number;

  /**
   * Operation type
   * Possible values: 0 (add), 1 (multiply base), 2 (multiply total)
   */
  operation: number;
}
```

#### Attribute

Shared structure. An entity attribute (health, speed, attack damage, etc.) with optional modifiers.

```ts
export interface Attribute {
  /**
   * Attribute identifier key
   * Possible values: "generic.maxHealth", "generic.movementSpeed", "generic.attackDamage", etc.
   */
  key: string;

  /**
   * Base attribute value
   * Possible values: any floating-point number
   */
  value: number;

  /**
   * Modifiers applied to this attribute
   * Possible values: array of AttributeModifier
   */
  modifiers: AttributeModifier[];
}
```

#### NamedEntitySpawnClientbound

Packet id `0x0C`. Spawns a player entity in the world. Carries `EntityMetadata`.

```ts
export interface NamedEntitySpawnClientbound {
  /**
   * The entity ID assigned to this player
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * The player's UUID
   * Possible values: UUID string with hyphens
   */
  playerUUID: string;

  /**
   * X position (fixed-point: divide by 32 for block position)
   * Possible values: fixed-point integer
   */
  x: number;

  /**
   * Y position (fixed-point: divide by 32 for block position)
   * Possible values: fixed-point integer
   */
  y: number;

  /**
   * Z position (fixed-point: divide by 32 for block position)
   * Possible values: fixed-point integer
   */
  z: number;

  /**
   * Yaw rotation
   * Possible values: 0-255 (maps to 0-360 degrees)
   */
  yaw: number;

  /**
   * Pitch rotation
   * Possible values: 0-255 (maps to 0-360 degrees)
   */
  pitch: number;

  /**
   * Currently held item ID (deprecated in 1.9+)
   * Possible values: item ID or 0
   */
  currentItem: number;

  /**
   * Entity metadata for initial state
   * Possible values: EntityMetadata array
   */
  metadata: EntityMetadata;
}
```

#### SpawnEntityClientbound

Packet id `0x0E`. The SpawnEntity (Object) packet. Spawns an object/vehicle entity (minecart, boat, item, arrow, etc.).

```ts
export interface SpawnEntityClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Entity object type ID
   * Possible values: 1 (boat), 2 (item stack), 10 (minecart), 60 (arrow), 61 (snowball), etc.
   */
  type: number;

  /**
   * X position (fixed-point)
   * Possible values: fixed-point integer
   */
  x: number;

  /**
   * Y position (fixed-point)
   * Possible values: fixed-point integer
   */
  y: number;

  /**
   * Z position (fixed-point)
   * Possible values: fixed-point integer
   */
  z: number;

  /**
   * Pitch rotation
   * Possible values: angle byte (0-255)
   */
  pitch: number;

  /**
   * Yaw rotation
   * Possible values: angle byte (0-255)
   */
  yaw: number;

  /**
   * Entity-specific data field (e.g., block type for falling sand)
   * Possible values: 0 (no additional data) or entity-specific value
   */
  intField: number;

  /**
   * Velocity data (present only if intField > 0)
   * Possible values: velocity object or undefined
   */
  objectData?: {
    /**
     * X velocity
     * Possible values: 1/8000 blocks per tick
     */
    velocityX: number;
    /**
     * Y velocity
     * Possible values: 1/8000 blocks per tick
     */
    velocityY: number;
    /**
     * Z velocity
     * Possible values: 1/8000 blocks per tick
     */
    velocityZ: number;
  };
}
```

#### SpawnEntityLivingClientbound

Packet id `0x0F`. Spawns a mob or other living entity in the world. Carries `EntityMetadata`.

```ts
export interface SpawnEntityLivingClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Mob type ID
   * Possible values: entity type ID (50=creeper, 51=skeleton, etc.)
   */
  type: number;

  /**
   * X position (fixed-point)
   * Possible values: fixed-point integer
   */
  x: number;

  /**
   * Y position (fixed-point)
   * Possible values: fixed-point integer
   */
  y: number;

  /**
   * Z position (fixed-point)
   * Possible values: fixed-point integer
   */
  z: number;

  /**
   * Yaw rotation
   * Possible values: angle byte (0-255)
   */
  yaw: number;

  /**
   * Pitch rotation
   * Possible values: angle byte (0-255)
   */
  pitch: number;

  /**
   * Head pitch rotation
   * Possible values: angle byte (0-255)
   */
  headPitch: number;

  /**
   * X velocity
   * Possible values: 1/8000 blocks per tick
   */
  velocityX: number;

  /**
   * Y velocity
   * Possible values: 1/8000 blocks per tick
   */
  velocityY: number;

  /**
   * Z velocity
   * Possible values: 1/8000 blocks per tick
   */
  velocityZ: number;

  /**
   * Entity metadata for initial state
   * Possible values: EntityMetadata array
   */
  metadata: EntityMetadata;
}
```

#### SpawnEntityPaintingClientbound

Packet id `0x10`. Spawns a painting entity on a wall.

```ts
export interface SpawnEntityPaintingClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Painting title/variant name
   * Possible values: "Kebab", "Aztec", "Alban", "Aztec2", "Bomb", etc. (max 13 chars)
   */
  title: string;

  /**
   * Block location where the painting is attached
   * Possible values: {x, y, z} block coordinates
   */
  location: { x: number; y: number; z: number };

  /**
   * Direction the painting faces
   * Possible values: 0 (south), 1 (west), 2 (north), 3 (east)
   */
  direction: number;
}
```

#### SpawnEntityExperienceOrbClientbound

Packet id `0x11`. Spawns an experience orb entity in the world.

```ts
export interface SpawnEntityExperienceOrbClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * X position (fixed-point)
   * Possible values: fixed-point integer
   */
  x: number;

  /**
   * Y position (fixed-point)
   * Possible values: fixed-point integer
   */
  y: number;

  /**
   * Z position (fixed-point)
   * Possible values: fixed-point integer
   */
  z: number;

  /**
   * Experience point amount
   * Possible values: 1 or greater
   */
  count: number;
}
```

#### SpawnEntityWeatherClientbound

Packet id `0x2C`. Spawns a global entity like a lightning bolt.

```ts
export interface SpawnEntityWeatherClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Entity type
   * Possible values: 1 (thunderbolt)
   */
  type: number;

  /**
   * X position (fixed-point)
   * Possible values: fixed-point integer
   */
  x: number;

  /**
   * Y position (fixed-point)
   * Possible values: fixed-point integer
   */
  y: number;

  /**
   * Z position (fixed-point)
   * Possible values: fixed-point integer
   */
  z: number;
}
```

#### EntityClientbound

Packet id `0x14`. Sent for entities with no position/rotation change (entity keep-alive).

```ts
export interface EntityClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;
}
```

#### RelEntityMoveClientbound

Packet id `0x15`. The EntityRelativeMove packet. Moves an entity relative to its current position.

```ts
export interface RelEntityMoveClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * X delta (fixed-point: divide by 32)
   * Possible values: signed byte
   */
  dX: number;

  /**
   * Y delta (fixed-point: divide by 32)
   * Possible values: signed byte
   */
  dY: number;

  /**
   * Z delta (fixed-point: divide by 32)
   * Possible values: signed byte
   */
  dZ: number;

  /**
   * Whether the entity is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### EntityLookClientbound

Packet id `0x16`. Updates an entity's rotation without movement.

```ts
export interface EntityLookClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * New yaw rotation
   * Possible values: angle byte (0-255)
   */
  yaw: number;

  /**
   * New pitch rotation
   * Possible values: angle byte (0-255)
   */
  pitch: number;

  /**
   * Whether the entity is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### EntityMoveLookClientbound

Packet id `0x17`. The EntityLookAndRelativeMove packet. Updates both position (relative) and rotation of an entity.

```ts
export interface EntityMoveLookClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * X delta (fixed-point)
   * Possible values: signed byte
   */
  dX: number;

  /**
   * Y delta (fixed-point)
   * Possible values: signed byte
   */
  dY: number;

  /**
   * Z delta (fixed-point)
   * Possible values: signed byte
   */
  dZ: number;

  /**
   * New yaw rotation
   * Possible values: angle byte (0-255)
   */
  yaw: number;

  /**
   * New pitch rotation
   * Possible values: angle byte (0-255)
   */
  pitch: number;

  /**
   * Whether the entity is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### EntityTeleportClientbound

Packet id `0x18`. Teleports an entity to an absolute position.

```ts
export interface EntityTeleportClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Absolute X position (fixed-point)
   * Possible values: fixed-point integer
   */
  x: number;

  /**
   * Absolute Y position (fixed-point)
   * Possible values: fixed-point integer
   */
  y: number;

  /**
   * Absolute Z position (fixed-point)
   * Possible values: fixed-point integer
   */
  z: number;

  /**
   * New yaw rotation
   * Possible values: angle byte (0-255)
   */
  yaw: number;

  /**
   * New pitch rotation
   * Possible values: angle byte (0-255)
   */
  pitch: number;

  /**
   * Whether the entity is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### EntityHeadRotationClientbound

Packet id `0x19`. The EntityHeadLook packet. Updates an entity's head yaw rotation.

```ts
export interface EntityHeadRotationClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Head yaw rotation
   * Possible values: angle byte (0-255)
   */
  headYaw: number;
}
```

#### EntityVelocityClientbound

Packet id `0x12`. Sets an entity's velocity (motion).

```ts
export interface EntityVelocityClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * X velocity
   * Possible values: 1/8000 blocks per tick (signed short)
   */
  velocityX: number;

  /**
   * Y velocity
   * Possible values: 1/8000 blocks per tick (signed short)
   */
  velocityY: number;

  /**
   * Z velocity
   * Possible values: 1/8000 blocks per tick (signed short)
   */
  velocityZ: number;
}
```

#### EntityDestroyClientbound

Packet id `0x13`. The DestroyEntities packet. Removes one or more entities from the world.

```ts
export interface EntityDestroyClientbound {
  /**
   * Array of entity IDs to destroy
   * Possible values: array of valid entity ID integers
   */
  entityIds: number[];
}
```

#### EntityMetadataClientbound

Packet id `0x1C`. Updates an entity's metadata entries. Carries the shared `EntityMetadata` type.

```ts
export interface EntityMetadataClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * New metadata entries
   * Possible values: EntityMetadata array
   */
  metadata: EntityMetadata;
}
```

#### EntityStatusClientbound

Packet id `0x1A`. Triggers an entity event/animation or state change.

```ts
export interface EntityStatusClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Entity status code
   * Possible values: 1=reset mob attack timer, 2=take damage, 3=dead, 4=iron golem throw, 6=tame success, 7=tame fail, etc.
   */
  entityStatus: number;
}
```

#### EntityEffectClientbound

Packet id `0x1D`. Applies a potion effect to an entity.

```ts
export interface EntityEffectClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Potion effect ID
   * Possible values: 1 (speed), 2 (slowness), 3 (haste), 4 (mining fatigue), etc.
   */
  effectId: number;

  /**
   * Effect amplifier level (level - 1)
   * Possible values: 0+ (0 = level I)
   */
  amplifier: number;

  /**
   * Duration in ticks
   * Possible values: 0 or positive integer
   */
  duration: number;

  /**
   * Whether to hide effect particles
   * Possible values: true (hide) or false (show)
   */
  hideParticles: boolean;
}
```

#### RemoveEntityEffectClientbound

Packet id `0x1E`. Removes a potion effect from an entity.

```ts
export interface RemoveEntityEffectClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Potion effect ID to remove
   * Possible values: 1-23 (effect IDs)
   */
  effectId: number;
}
```

#### EntityEquipmentClientbound

Packet id `0x04`. Updates an entity's equipment in a specific slot. Uses the shared `Slot` structure.

```ts
export interface EntityEquipmentClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Equipment slot index
   * Possible values: 0 (held item), 1 (boots), 2 (leggings), 3 (chestplate), 4 (helmet)
   */
  slot: number;

  /**
   * The item in the equipment slot
   * Possible values: Slot data (blockId -1 for empty)
   */
  item: Slot;
}
```

#### AttachEntityClientbound

Packet id `0x1B`. Attaches an entity to another (leash, mount).

```ts
export interface AttachEntityClientbound {
  /**
   * The entity being attached
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * The vehicle/holder entity ID
   * Possible values: entity ID or -1 (detach)
   */
  vehicleId: number;

  /**
   * Whether this is a leash attachment
   * Possible values: true (leash) or false (mount)
   */
  leash: boolean;
}
```

#### UpdateAttributesClientbound

Packet id `0x20`. Updates an entity's attributes and their modifiers. Each entry is an `Attribute`.

```ts
export interface UpdateAttributesClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Array of attribute entries with modifiers
   * Possible values: array of Attribute objects
   */
  properties: Attribute[];
}
```

#### AnimationClientbound

Packet id `0x0B`. Plays an entity animation (swing arm, damage, etc.).

```ts
export interface AnimationClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Animation ID
   * Possible values: 0 (swing arm), 1 (take damage), 2 (leave bed), 3 (eat food), 4 (critical effect), 5 (magic critical)
   */
  animation: number;
}
```

#### CollectClientbound

Packet id `0x0D`. The CollectItem packet. Shows an entity picking up an item entity (with fly-toward animation).

```ts
export interface CollectClientbound {
  /**
   * The item entity being collected
   * Possible values: valid entity ID integer
   */
  collectedEntityId: number;

  /**
   * The entity collecting the item
   * Possible values: valid entity ID integer
   */
  collectorEntityId: number;
}
```

#### UpdateEntityNbtClientbound

Packet id `0x49`. The UpdateEntityNBT packet. Updates an entity's NBT tag data.

```ts
export interface UpdateEntityNbtClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * NBT tag compound data
   * Possible values: parsed NBT object
   */
  tag: any;
}
```

### Inventory

Container windows: opening, closing, slot updates, window properties, and transaction confirmations. These reuse the shared `Slot` structure.

#### OpenWindowClientbound

Packet id `0x2D`. Opens a container inventory window for the player.

```ts
export interface OpenWindowClientbound {
  /**
   * Unique window ID (>0, 0 is player inventory)
   * Possible values: 1-255
   */
  windowId: number;

  /**
   * Window type identifier
   * Possible values: "minecraft:chest", "minecraft:crafting_table", "minecraft:furnace", "minecraft:dispenser", "minecraft:enchanting_table", "minecraft:brewing_stand", "minecraft:villager", "minecraft:beacon", "minecraft:anvil", "minecraft:hopper", "minecraft:dropper", "EntityHorse"
   */
  inventoryType: string;

  /**
   * Window title (JSON text component)
   * Possible values: serialized JSON chat component string
   */
  windowTitle: string;

  /**
   * Number of slots in the window (excluding player inventory)
   * Possible values: 0 or positive integer
   */
  slotCount: number;

  /**
   * Entity ID (only for horse/villager windows)
   * Possible values: valid entity ID or undefined
   */
  entityId?: number;
}
```

#### CloseWindowClientbound

Packet id `0x2E`. Closes an inventory window on the client.

```ts
export interface CloseWindowClientbound {
  /**
   * Window ID to close (0 for player inventory)
   * Possible values: 0-255
   */
  windowId: number;
}
```

#### SetSlotClientbound

Packet id `0x2F`. Sets a single slot's item in an inventory window.

```ts
export interface SetSlotClientbound {
  /**
   * Window ID (-1 for cursor item, 0 for player inventory)
   * Possible values: -1, 0, or positive window ID
   */
  windowId: number;

  /**
   * Slot index within the window
   * Possible values: slot index integer
   */
  slot: number;

  /**
   * The item to set in the slot
   * Possible values: Slot data (blockId -1 for empty)
   */
  item: Slot;
}
```

#### WindowItemsClientbound

Packet id `0x30`. Sets all slots in an inventory window at once.

```ts
export interface WindowItemsClientbound {
  /**
   * Window ID
   * Possible values: 0 or positive window ID
   */
  windowId: number;

  /**
   * Array of items for all slots in the window
   * Possible values: array of Slot data
   */
  items: Slot[];
}
```

#### CraftProgressBarClientbound

Packet id `0x31`. The WindowProperty packet. Updates a window property value (e.g., furnace progress, enchanting levels).

```ts
export interface CraftProgressBarClientbound {
  /**
   * Window ID
   * Possible values: 0 or positive window ID
   */
  windowId: number;

  /**
   * Property ID (window-type specific)
   * Possible values: 0+ (depends on window type)
   */
  property: number;

  /**
   * Property value
   * Possible values: integer value
   */
  value: number;
}
```

#### TransactionClientbound

Packet id `0x32`. The ConfirmTransaction (clientbound) packet. Confirms or rejects an inventory transaction.

```ts
export interface TransactionClientbound {
  /**
   * Window ID
   * Possible values: 0 or positive window ID
   */
  windowId: number;

  /**
   * Action number (matches client's request)
   * Possible values: short integer
   */
  action: number;

  /**
   * Whether the transaction was accepted by the server
   * Possible values: true (accepted) or false (rejected)
   */
  accepted: boolean;
}
```

### World

Chunks, block changes, block actions and breaking, time, world events, particles, explosions, sounds, the world border, signs, tile entities, maps, and combat events. These reuse the shared structures `Position`, `ChunkMeta`, `BlockRecord`, `MapIcon`, and `AffectedBlockOffset`, and the supporting type `WorldBorderAction`.

#### Position

Shared structure. A 3D block position in the world (integer block coordinates). Reused across many clientbound and serverbound packets.

```ts
export interface Position {
  /**
   * X coordinate
   * Possible values: any integer block coordinate
   */
  x: number;

  /**
   * Y coordinate
   * Possible values: 0-255 (build height)
   */
  y: number;

  /**
   * Z coordinate
   * Possible values: any integer block coordinate
   */
  z: number;
}
```

#### ChunkMeta

Shared structure. Metadata for a single chunk in a bulk chunk update.

```ts
export interface ChunkMeta {
  /**
   * Chunk X coordinate
   * Possible values: any integer chunk coordinate
   */
  x: number;

  /**
   * Chunk Z coordinate
   * Possible values: any integer chunk coordinate
   */
  z: number;

  /**
   * Bitmask indicating which 16-block-tall sections are included
   * Possible values: 16-bit bitmask (0x0000-0xFFFF)
   */
  bitMap: number;
}
```

#### BlockRecord

Shared structure. A single block change record within a chunk, used in multi-block change packets.

```ts
export interface BlockRecord {
  /**
   * Horizontal position (encoded X and Z within section)
   * Possible values: encoded byte (upper 4 bits = X, lower 4 bits = Z)
   */
  horizontalPos: number;

  /**
   * Y coordinate within the chunk
   * Possible values: 0-255
   */
  y: number;

  /**
   * Block state ID
   * Possible values: (blockId << 4) | metadata
   */
  blockId: number;
}
```

#### MapIcon

Shared structure. A map marker/icon representing a point of interest on a map item.

```ts
export interface MapIcon {
  /**
   * Direction and type encoded as a single byte
   * Possible values: upper 4 bits = direction (0-15), lower 4 bits = type (0-15)
   */
  directionAndType: number;

  /**
   * X pixel position on the map
   * Possible values: 0-127
   */
  x: number;

  /**
   * Z pixel position on the map
   * Possible values: 0-127
   */
  z: number;
}
```

#### AffectedBlockOffset

Shared structure. A single block offset affected by an explosion, relative to the explosion center.

```ts
export interface AffectedBlockOffset {
  /**
   * X offset from explosion center
   * Possible values: signed byte (-128 to 127)
   */
  x: number;

  /**
   * Y offset from explosion center
   * Possible values: signed byte (-128 to 127)
   */
  y: number;

  /**
   * Z offset from explosion center
   * Possible values: signed byte (-128 to 127)
   */
  z: number;
}
```

#### MapChunkClientbound

Packet id `0x21`. The MapChunk packet. Sends chunk column data to the client.

```ts
export interface MapChunkClientbound {
  /**
   * Chunk X coordinate
   * Possible values: any integer chunk coordinate
   */
  x: number;

  /**
   * Chunk Z coordinate
   * Possible values: any integer chunk coordinate
   */
  z: number;

  /**
   * Whether this is a full chunk (ground-up continuous)
   * Possible values: true or false
   */
  groundUp: boolean;

  /**
   * Bitmask of which 16-block sections are included
   * Possible values: 16-bit bitmask
   */
  bitMap: number;

  /**
   * Compressed chunk data
   * Possible values: Buffer of chunk section data
   */
  chunkData: Buffer;
}
```

#### MapChunkBulkClientbound

Packet id `0x26`. The MapChunkBulk packet. Sends multiple chunk columns at once. Each chunk is described by a `ChunkMeta`.

```ts
export interface MapChunkBulkClientbound {
  /**
   * Whether sky light data is included
   * Possible values: true (overworld) or false (nether/end)
   */
  skyLightSent: boolean;

  /**
   * Metadata for each chunk in the bulk update
   * Possible values: array of ChunkMeta
   */
  meta: ChunkMeta[];

  /**
   * Combined chunk data for all chunks
   * Possible values: Buffer of combined chunk section data
   */
  data: Buffer;
}
```

#### BlockChangeClientbound

Packet id `0x23`. Updates a single block in the world.

```ts
export interface BlockChangeClientbound {
  /**
   * Block position in the world
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Block state ID
   * Possible values: (blockId << 4) | metadata
   */
  type: number;
}
```

#### MultiBlockChangeClientbound

Packet id `0x22`. Updates multiple blocks within a single chunk section. Each change is a `BlockRecord`.

```ts
export interface MultiBlockChangeClientbound {
  /**
   * Chunk X coordinate
   * Possible values: any integer chunk coordinate
   */
  chunkX: number;

  /**
   * Chunk Z coordinate
   * Possible values: any integer chunk coordinate
   */
  chunkZ: number;

  /**
   * Array of block change records
   * Possible values: array of BlockRecord
   */
  records: BlockRecord[];
}
```

#### BlockActionClientbound

Packet id `0x24`. Triggers a block action (e.g., chest opening, note block play, piston).

```ts
export interface BlockActionClientbound {
  /**
   * Block position in the world
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Action-specific byte 1
   * Possible values: block-type-dependent value
   */
  byte1: number;

  /**
   * Action-specific byte 2
   * Possible values: block-type-dependent value
   */
  byte2: number;

  /**
   * Block type ID
   * Possible values: valid block ID
   */
  blockId: number;
}
```

#### BlockBreakAnimationClientbound

Packet id `0x25`. Shows block breaking progress overlay.

```ts
export interface BlockBreakAnimationClientbound {
  /**
   * Entity ID of the entity breaking the block
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Block position being broken
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Destroy stage progress
   * Possible values: 0-9 (progressive crack), 255 (reset/remove)
   */
  destroyStage: number;
}
```

#### UpdateTimeClientbound

Packet id `0x03`. Updates the world age and current time of day.

```ts
export interface UpdateTimeClientbound {
  /**
   * World age in ticks (always increasing, not affected by /gamerule)
   * Possible values: 64-bit integer (BigInt)
   */
  age: bigint;

  /**
   * Time of day in ticks
   * Possible values: 0-24000 (positive), negative = frozen daylight cycle
   */
  time: bigint;
}
```

#### WorldEventClientbound

Packet id `0x28`. The Effect (World Event) packet. Plays a sound effect and/or particle effect at a location.

```ts
export interface WorldEventClientbound {
  /**
   * Effect ID (sound + particle combination)
   * Possible values: 1000-2006 (see wiki.vg for full list)
   */
  effectId: number;

  /**
   * Effect location in the world
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Effect-specific data value
   * Possible values: varies by effect ID
   */
  data: number;

  /**
   * Whether to disable relative volume (play at same volume regardless of distance)
   * Possible values: true or false
   */
  global: boolean;
}
```

#### WorldParticlesClientbound

Packet id `0x2A`. The Particle packet. Spawns particles in the world.

```ts
export interface WorldParticlesClientbound {
  /**
   * Particle type ID
   * Possible values: 0-46 (see wiki.vg particle IDs)
   */
  particleId: number;

  /**
   * Whether to render from further away than normal
   * Possible values: true (256 blocks) or false (32 blocks)
   */
  longDistance: boolean;

  /**
   * X center position
   * Possible values: any floating-point
   */
  x: number;

  /**
   * Y center position
   * Possible values: any floating-point
   */
  y: number;

  /**
   * Z center position
   * Possible values: any floating-point
   */
  z: number;

  /**
   * X offset (random variance)
   * Possible values: any floating-point
   */
  offsetX: number;

  /**
   * Y offset (random variance)
   * Possible values: any floating-point
   */
  offsetY: number;

  /**
   * Z offset (random variance)
   * Possible values: any floating-point
   */
  offsetZ: number;

  /**
   * Particle speed/data multiplier
   * Possible values: any floating-point
   */
  particleData: number;

  /**
   * Number of particles to spawn
   * Possible values: 0 or positive integer
   */
  particles: number;

  /**
   * Additional particle-specific data (for iconcrack, blockcrack, blockdust)
   * Possible values: array of VarInt values or undefined
   */
  data?: number[];
}
```

#### ExplosionClientbound

Packet id `0x27`. Creates an explosion effect, removing blocks and pushing entities. Affected blocks are listed as `AffectedBlockOffset` values.

```ts
export interface ExplosionClientbound {
  /**
   * Explosion center X
   * Possible values: any floating-point
   */
  x: number;

  /**
   * Explosion center Y
   * Possible values: any floating-point
   */
  y: number;

  /**
   * Explosion center Z
   * Possible values: any floating-point
   */
  z: number;

  /**
   * Explosion radius
   * Possible values: positive floating-point
   */
  radius: number;

  /**
   * Blocks affected by the explosion (relative offsets)
   * Possible values: array of AffectedBlockOffset
   */
  affectedBlockOffsets: AffectedBlockOffset[];

  /**
   * Player X velocity from the explosion knockback
   * Possible values: any floating-point
   */
  playerMotionX: number;

  /**
   * Player Y velocity from the explosion knockback
   * Possible values: any floating-point
   */
  playerMotionY: number;

  /**
   * Player Z velocity from the explosion knockback
   * Possible values: any floating-point
   */
  playerMotionZ: number;
}
```

#### NamedSoundEffectClientbound

Packet id `0x29`. Plays a named sound effect at a location.

```ts
export interface NamedSoundEffectClientbound {
  /**
   * Sound resource location
   * Possible values: "entity.pig.ambient", "random.explode", etc.
   */
  soundName: string;

  /**
   * X position (fixed-point: value * 8)
   * Possible values: any integer (divide by 8 for block position)
   */
  x: number;

  /**
   * Y position (fixed-point: value * 8)
   * Possible values: any integer (divide by 8 for block position)
   */
  y: number;

  /**
   * Z position (fixed-point: value * 8)
   * Possible values: any integer (divide by 8 for block position)
   */
  z: number;

  /**
   * Volume multiplier
   * Possible values: 0.0-1.0 (1.0 = normal/full volume)
   */
  volume: number;

  /**
   * Pitch multiplier
   * Possible values: 0.5-2.0 (1.0 = normal pitch)
   */
  pitch: number;
}
```

#### WorldBorderClientbound

Packet id `0x44`. Updates world border settings (size, center, warnings). The `action` selects which optional fields apply.

```ts
export interface WorldBorderClientbound {
  /**
   * Border action type
   * Possible values: 0-5 (see WorldBorderAction)
   */
  action: WorldBorderAction;

  /**
   * Border radius (for SET_SIZE action)
   * Possible values: positive double or undefined
   */
  radius?: number;

  /**
   * Border center X coordinate (for INITIALIZE/SET_CENTER actions)
   * Possible values: any double or undefined
   */
  x?: number;

  /**
   * Border center Z coordinate (for INITIALIZE/SET_CENTER actions)
   * Possible values: any double or undefined
   */
  z?: number;

  /**
   * Old border radius before transition (for LERP_SIZE action)
   * Possible values: positive double or undefined
   */
  old_radius?: number;

  /**
   * New border radius after transition (for LERP_SIZE action)
   * Possible values: positive double or undefined
   */
  new_radius?: number;

  /**
   * Transition speed in milliseconds (for LERP_SIZE action)
   * Possible values: 64-bit integer (BigInt) or undefined
   */
  speed?: bigint;

  /**
   * Portal teleport boundary distance
   * Possible values: positive integer or undefined
   */
  portalBoundary?: number;

  /**
   * Warning time in seconds before border damage
   * Possible values: 0 or positive integer or undefined
   */
  warning_time?: number;

  /**
   * Warning distance in blocks from border for visual effect
   * Possible values: 0 or positive integer or undefined
   */
  warning_blocks?: number;
}
```

#### UpdateSignClientbound

Packet id `0x33`. Updates sign text at a given position.

```ts
export interface UpdateSignClientbound {
  /**
   * Sign block position
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Line 1 text
   * Possible values: JSON chat component string
   */
  text1: string;

  /**
   * Line 2 text
   * Possible values: JSON chat component string
   */
  text2: string;

  /**
   * Line 3 text
   * Possible values: JSON chat component string
   */
  text3: string;

  /**
   * Line 4 text
   * Possible values: JSON chat component string
   */
  text4: string;
}
```

#### OpenSignEntityClientbound

Packet id `0x36`. Opens the sign editing GUI for the player.

```ts
export interface OpenSignEntityClientbound {
  /**
   * Sign block position to edit
   * Possible values: Position with block coordinates
   */
  location: Position;
}
```

#### TileEntityDataClientbound

Packet id `0x35`. Updates block entity (tile entity) NBT data at a position.

```ts
export interface TileEntityDataClientbound {
  /**
   * Block entity position
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Action type indicating tile entity kind
   * Possible values: 1 (mob spawner), 2 (command block), 3 (beacon), 4 (skull), 5 (flower pot), 6 (banner)
   */
  action: number;

  /**
   * NBT tag data for the block entity
   * Possible values: parsed NBT object or undefined
   */
  nbtData?: any;
}
```

#### MapClientbound

Packet id `0x34`. The Map packet. Updates a map item's data (icons, pixels). Icons are `MapIcon` values.

```ts
export interface MapClientbound {
  /**
   * Map item damage value (serves as map ID)
   * Possible values: map item damage/data value
   */
  itemDamage: number;

  /**
   * Map scale level
   * Possible values: 0 (1:1) to 4 (1:16)
   */
  scale: number;

  /**
   * Map icons/markers for points of interest
   * Possible values: array of MapIcon
   */
  icons: MapIcon[];

  /**
   * Number of columns being updated
   * Possible values: 0 (no pixel update) or positive integer
   */
  columns: number;

  /**
   * Number of rows being updated
   * Possible values: positive integer or undefined (when columns = 0)
   */
  rows?: number;

  /**
   * X offset of the update region
   * Possible values: 0-127 or undefined
   */
  x?: number;

  /**
   * Y offset of the update region
   * Possible values: 0-127 or undefined
   */
  y?: number;

  /**
   * Map pixel color data
   * Possible values: Buffer of map color bytes or undefined
   */
  data?: Buffer;
}
```

#### CombatEventClientbound

Packet id `0x42`. Sends combat-related events (enter/end combat, entity death). See the supporting type `CombatEventType`.

```ts
export interface CombatEventClientbound {
  /**
   * Combat event type
   * Possible values: 0 (enter combat), 1 (end combat), 2 (entity dead)
   */
  event: number;

  /**
   * Combat duration in ticks (for end combat event)
   * Possible values: positive integer or undefined
   */
  duration?: number;

  /**
   * Player entity ID (for entity dead event)
   * Possible values: valid entity ID or undefined
   */
  playerId?: number;

  /**
   * Killer entity ID (for entity dead event)
   * Possible values: entity ID or -1 (no killer) or undefined
   */
  entityId?: number;

  /**
   * Death message (for entity dead event)
   * Possible values: JSON chat component string or undefined
   */
  message?: string;
}
```

## Play: serverbound

Serverbound play packets are sent from the client to the server. They are grouped here by concern: Connection, Movement, Interaction, Inventory, and Chat.

### Connection

Session and settings packets: keep-alive response, client status, client settings, abilities, plugin messages, and resource pack status. These reuse the supporting types `ClientStatusAction`, `ChatMode`, and `ResourcePackResult`.

#### KeepAliveServerbound

Packet id `0x00`. Client response to the server keep-alive; must echo back the same ID.

```ts
export interface KeepAliveServerbound {
  /**
   * The keep alive ID (must match server's request)
   * Possible values: any integer matching the server's keep_alive packet
   */
  keepAliveId: number;
}
```

#### ClientCommandServerbound

Packet id `0x16`. The ClientStatus packet. Sent when the client respawns, requests stats, or opens the inventory achievement.

```ts
export interface ClientCommandServerbound {
  /**
   * Client action to perform
   * Possible values: 0 (respawn), 1 (request stats), 2 (open inventory)
   */
  payload: ClientStatusAction;
}
```

#### SettingsServerbound

Packet id `0x15`. The ClientSettings packet. Sends the client's configuration and preferences to the server.

```ts
export interface SettingsServerbound {
  /**
   * Client locale setting
   * Possible values: locale string like "en_US", "pt_BR", etc.
   */
  locale: string;

  /**
   * Client render distance in chunks
   * Possible values: 2-16
   */
  viewDistance: number;

  /**
   * Chat visibility mode
   * Possible values: 0 (enabled), 1 (commands only), 2 (hidden)
   */
  chatFlags: ChatMode;

  /**
   * Whether chat colors are enabled
   * Possible values: true or false
   */
  chatColors: boolean;

  /**
   * Displayed skin part flags (bitmask)
   * Possible values: bit 0=cape, 1=jacket, 2=left sleeve, 3=right sleeve, 4=left pants, 5=right pants, 6=hat
   */
  skinParts: number;
}
```

#### AbilitiesServerbound

Packet id `0x13`. The PlayerAbilities (serverbound) packet. Sent when the player toggles flying.

```ts
export interface AbilitiesServerbound {
  /**
   * Ability flags bitmask (only bit 1 = flying is used by server)
   * Possible values: bitmask with bit 1 for flying
   */
  flags: number;

  /**
   * Flying speed (ignored by server)
   * Possible values: any floating-point
   */
  flyingSpeed: number;

  /**
   * Walking speed (ignored by server)
   * Possible values: any floating-point
   */
  walkingSpeed: number;
}
```

#### CustomPayloadServerbound

Packet id `0x17`. The PluginMessage (serverbound) packet. Sends custom plugin data to the server on a named channel.

```ts
export interface CustomPayloadServerbound {
  /**
   * The plugin message channel name
   * Possible values: channel identifier string like "MC|Brand", etc.
   */
  channel: string;

  /**
   * The raw message data
   * Possible values: Buffer of arbitrary bytes
   */
  data: Buffer;
}
```

#### ResourcePackReceiveServerbound

Packet id `0x19`. The ResourcePackStatus packet. Reports the resource pack download/load result to the server.

```ts
export interface ResourcePackReceiveServerbound {
  /**
   * Resource pack hash string
   * Possible values: 40-character hex SHA-1 hash
   */
  hash: string;

  /**
   * Result status
   * Possible values: 0 (loaded), 1 (declined), 2 (failed), 3 (accepted)
   */
  result: ResourcePackResult;
}
```

### Movement

Player position and rotation updates, on-ground state, and vehicle steering.

#### FlyingServerbound

Packet id `0x03`. The Player (Flying) packet. Updates only the player's onGround flag without position or rotation changes.

```ts
export interface FlyingServerbound {
  /**
   * Whether the player is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### PositionServerbound

Packet id `0x04`. The PlayerPosition packet. Updates the player's position without rotation changes.

```ts
export interface PositionServerbound {
  /**
   * X position
   * Possible values: any double-precision floating-point
   */
  x: number;

  /**
   * Y position (feet position)
   * Possible values: any double-precision floating-point
   */
  y: number;

  /**
   * Z position
   * Possible values: any double-precision floating-point
   */
  z: number;

  /**
   * Whether the player is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### LookServerbound

Packet id `0x05`. The PlayerLook packet. Updates the player's rotation without position changes.

```ts
export interface LookServerbound {
  /**
   * Yaw rotation in degrees
   * Possible values: 0.0-360.0
   */
  yaw: number;

  /**
   * Pitch rotation in degrees
   * Possible values: -90.0 to 90.0
   */
  pitch: number;

  /**
   * Whether the player is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### PositionLookServerbound

Packet id `0x06`. The PlayerPositionAndLook (serverbound) packet. Updates both the player's position and rotation.

```ts
export interface PositionLookServerbound {
  /**
   * X position
   * Possible values: any double-precision floating-point
   */
  x: number;

  /**
   * Y position (feet position)
   * Possible values: any double-precision floating-point
   */
  y: number;

  /**
   * Z position
   * Possible values: any double-precision floating-point
   */
  z: number;

  /**
   * Yaw rotation in degrees
   * Possible values: 0.0-360.0
   */
  yaw: number;

  /**
   * Pitch rotation in degrees
   * Possible values: -90.0 to 90.0
   */
  pitch: number;

  /**
   * Whether the player is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}
```

#### SteerVehicleServerbound

Packet id `0x0C`. Controls vehicle movement (horse, boat, pig).

```ts
export interface SteerVehicleServerbound {
  /**
   * Sideways movement input
   * Possible values: -1.0 (left) to 1.0 (right)
   */
  sideways: number;

  /**
   * Forward/backward movement input
   * Possible values: -1.0 (backward) to 1.0 (forward)
   */
  forward: number;

  /**
   * Jump and unmount flags
   * Possible values: bit 0 = jump, bit 1 = unmount
   */
  jump: number;
}
```

### Interaction

Entity use/attack, block digging and placement, arm animation, entity actions, and spectating. These reuse the supporting types `UseEntityType`, `DiggingStatus`, `BlockFace`, and `EntityActionType`, plus the shared `Position` and `Slot` structures.

#### UseEntityServerbound

Packet id `0x02`. Sent when interacting with or attacking an entity.

```ts
export interface UseEntityServerbound {
  /**
   * Target entity ID
   * Possible values: valid entity ID integer
   */
  target: number;

  /**
   * Interaction type
   * Possible values: 0 (interact), 1 (attack), 2 (interact at position)
   */
  mouse: UseEntityType;

  /**
   * Target X position (only for interact_at type)
   * Possible values: floating-point or undefined
   */
  x?: number;

  /**
   * Target Y position (only for interact_at type)
   * Possible values: floating-point or undefined
   */
  y?: number;

  /**
   * Target Z position (only for interact_at type)
   * Possible values: floating-point or undefined
   */
  z?: number;
}
```

#### BlockDigServerbound

Packet id `0x07`. The PlayerDigging packet. Sent when breaking blocks or performing dig-related actions (drop item, finish eating).

```ts
export interface BlockDigServerbound {
  /**
   * Digging status/action
   * Possible values: 0 (started), 1 (cancelled), 2 (finished), 3 (drop stack), 4 (drop item), 5 (finish action)
   */
  status: DiggingStatus;

  /**
   * Block position being interacted with
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Block face being dug
   * Possible values: 0 (bottom), 1 (top), 2 (north), 3 (south), 4 (west), 5 (east)
   */
  face: BlockFace;
}
```

#### BlockPlaceServerbound

Packet id `0x08`. The PlayerBlockPlacement packet. Sent when placing a block or right-clicking with an item.

```ts
export interface BlockPlaceServerbound {
  /**
   * Block position being placed against (-1,-1,-1 for special item use)
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Face direction of the block being placed against
   * Possible values: 0-5 (block face) or 255 (special action)
   */
  direction: number;

  /**
   * The held item being placed/used
   * Possible values: Slot data
   */
  heldItem: Slot;

  /**
   * Cursor X position on the block face
   * Possible values: 0-15 (representing 0.0-1.0)
   */
  cursorX: number;

  /**
   * Cursor Y position on the block face
   * Possible values: 0-15 (representing 0.0-1.0)
   */
  cursorY: number;

  /**
   * Cursor Z position on the block face
   * Possible values: 0-15 (representing 0.0-1.0)
   */
  cursorZ: number;
}
```

#### ArmAnimationServerbound

Packet id `0x0A`. The Animation (serverbound) packet. Sent when the player swings their arm. Has no fields.

```ts
export interface ArmAnimationServerbound {
  // Empty packet - no fields
}
```

#### EntityActionServerbound

Packet id `0x0B`. Sent when the player performs an entity action (crouch, sprint, horse jump, etc.).

```ts
export interface EntityActionServerbound {
  /**
   * The player's own entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;

  /**
   * Action to perform
   * Possible values: 0 (start crouch), 1 (stop crouch), 2 (leave bed), 3 (start sprint), 4 (stop sprint), 5 (jump horse), 6 (open horse inv)
   */
  actionId: EntityActionType;

  /**
   * Jump boost value for horse jumping
   * Possible values: 0-100
   */
  jumpBoost: number;
}
```

#### SpectateServerbound

Packet id `0x18`. Teleports the spectating player to view another entity.

```ts
export interface SpectateServerbound {
  /**
   * UUID of the entity to spectate
   * Possible values: UUID string with hyphens
   */
  target: string;
}
```

### Inventory

Window interaction from the client: closing, clicking, transaction acknowledgements, creative slot setting, enchantment selection, and held item changes. These reuse the supporting types `MouseButton`, `ClickMode`, and `EnchantmentOption`, plus the shared `Slot` structure.

#### CloseWindowServerbound

Packet id `0x0D`. Sent when the player closes an inventory window.

```ts
export interface CloseWindowServerbound {
  /**
   * Window ID being closed (0 for player inventory)
   * Possible values: 0-255
   */
  windowId: number;
}
```

#### WindowClickServerbound

Packet id `0x0E`. The ClickWindow packet. Sent when the player clicks in an inventory window.

```ts
export interface WindowClickServerbound {
  /**
   * Window ID being interacted with
   * Possible values: 0 or positive window ID
   */
  windowId: number;

  /**
   * Slot index clicked (-999 for outside window)
   * Possible values: -999 or valid slot index
   */
  slot: number;

  /**
   * Which mouse button was used
   * Possible values: 0 (left), 1 (right)
   */
  mouseButton: MouseButton;

  /**
   * Action counter for transaction verification
   * Possible values: incrementing short integer
   */
  action: number;

  /**
   * Click mode determining the click behavior
   * Possible values: 0 (normal), 1 (shift), 2 (number key), 3 (middle), 4 (drop), 5 (drag), 6 (double click)
   */
  mode: ClickMode;

  /**
   * The item in the clicked slot before the action
   * Possible values: Slot data
   */
  item: Slot;
}
```

#### TransactionServerbound

Packet id `0x0F`. The ConfirmTransaction (serverbound) packet. Confirms or acknowledges an inventory transaction.

```ts
export interface TransactionServerbound {
  /**
   * Window ID
   * Possible values: 0 or positive window ID
   */
  windowId: number;

  /**
   * Action number matching the server's transaction
   * Possible values: short integer
   */
  action: number;

  /**
   * Whether the client accepts the transaction
   * Possible values: true or false
   */
  accepted: boolean;
}
```

#### SetCreativeSlotServerbound

Packet id `0x10`. The CreativeInventoryAction packet. Sets a slot when in creative mode.

```ts
export interface SetCreativeSlotServerbound {
  /**
   * Slot to set (-1 for drop)
   * Possible values: -1 or valid slot index
   */
  slot: number;

  /**
   * The item to place in the slot
   * Possible values: Slot data
   */
  item: Slot;
}
```

#### EnchantItemServerbound

Packet id `0x11`. Selects an enchantment option from the enchantment table.

```ts
export interface EnchantItemServerbound {
  /**
   * Enchantment table window ID
   * Possible values: positive window ID
   */
  windowId: number;

  /**
   * Enchantment option selected
   * Possible values: 0 (top), 1 (middle), 2 (bottom)
   */
  enchantment: EnchantmentOption;
}
```

#### HeldItemSlotServerbound

Packet id `0x09`. The HeldItemChange (serverbound) packet. Changes the player's selected hotbar slot.

```ts
export interface HeldItemSlotServerbound {
  /**
   * New selected hotbar slot
   * Possible values: 0-8
   */
  slotId: number;
}
```

### Chat

Chat messages, tab completion requests, and sign updates. These reuse the shared `Position` structure.

#### ChatServerbound

Packet id `0x01`. The ChatMessage (serverbound) packet. Sends a chat message or slash command from the client to the server.

```ts
export interface ChatServerbound {
  /**
   * The message or command text
   * Possible values: string of max 100 characters
   */
  message: string;
}
```

#### TabCompleteServerbound

Packet id `0x14`. The TabComplete (serverbound) packet. Requests auto-complete suggestions for a partial chat command.

```ts
export interface TabCompleteServerbound {
  /**
   * The partial text to complete
   * Possible values: any string (usually starts with "/")
   */
  text: string;

  /**
   * Block position for command block context
   * Possible values: Position with block coordinates or undefined
   */
  block?: Position;
}
```

#### UpdateSignServerbound

Packet id `0x12`. The UpdateSign (serverbound) packet. Sends the four lines of sign text after the player finishes editing.

```ts
export interface UpdateSignServerbound {
  /**
   * Sign block position
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Line 1 text
   * Possible values: string of max 15 characters
   */
  text1: string;

  /**
   * Line 2 text
   * Possible values: string of max 15 characters
   */
  text2: string;

  /**
   * Line 3 text
   * Possible values: string of max 15 characters
   */
  text3: string;

  /**
   * Line 4 text
   * Possible values: string of max 15 characters
   */
  text4: string;
}
```

## Shared and supporting types

These are the enums, value unions, shared structures, and constants referenced by the packet interfaces above. They are all exported from `@breezil/packet-defs`.

### Enums and value unions

#### NextProtocolState

Next protocol state after handshaking. 1 = Status (server list ping), 2 = Login (authentication).

```ts
export type NextProtocolState = 1 | 2;
```

#### LegacyPingPayload

Legacy ping payload marker. Always `0x01` for legacy server list ping requests.

```ts
export type LegacyPingPayload = 1;
```

#### HypixelServerType

Known Hypixel server type identifiers, representing game categories on the Hypixel network.

```ts
export type HypixelServerType =
  | "LIMBO"
  | "LOBBY"
  | "BEDWARS"
  | "SKYWARS"
  | "MURDER_MYSTERY"
  | "ARCADE"
  | "UHC"
  | "DUELS"
  | "SKYBLOCK"
  | "BUILD_BATTLE"
  | "PIT"
  | "PROTOTYPE"
  | "HOUSING"
  | "MAIN"
  | "TOURNAMENT"
  | "SMP"
  | "REPLAY";
```

#### HypixelServerTypeValue

Hypixel server type string value. Includes the known values plus any future additions for forward compatibility.

```ts
export type HypixelServerTypeValue =
  | HypixelServerType
  | (string & { __hypixelServerType?: "future" });
```

#### HypixelPartyRole

Hypixel party member role within a party. Determines the member's permissions.

```ts
export type HypixelPartyRole = "LEADER" | "MOD" | "MEMBER";
```

#### HypixelEnvironment

Hypixel ModAPI environment identifier. Indicates which API environment is active.

```ts
export type HypixelEnvironment = "PRODUCTION" | "ALPHA" | "BETA";
```

#### HypixelChannel

Union of all known Hypixel custom payload channel names.

```ts
export type HypixelChannel =
  | "hyp:hello"
  | "hyp:location"
  | "hyp:party_info"
  | "hyp:ping";
```

#### ChatMessagePosition

Chat message position type. Determines where the chat message appears on screen. 0 = Chat box, 1 = System message, 2 = Action bar (above hotbar).

```ts
export type ChatMessagePosition = 0 | 1 | 2;
```

#### PlayerInfoAction

Player list (tab list) action type. Determines what kind of player info update is being performed.

```ts
export type PlayerInfoAction =
  | "add_player"
  | "update_game_mode"
  | "update_latency"
  | "update_display_name"
  | "remove_player";
```

#### TitleAction

Title packet action type. 0 = Set title, 1 = Set subtitle, 2 = Set times, 3 = Clear, 4 = Reset.

```ts
export type TitleAction = 0 | 1 | 2 | 3 | 4;
```

#### ScoreboardObjectiveAction

Scoreboard objective action type. 0 = Create, 1 = Remove, 2 = Update display text.

```ts
export type ScoreboardObjectiveAction = 0 | 1 | 2;
```

#### ScoreboardScoreAction

Scoreboard score action type. 0 = Create/Update, 1 = Remove.

```ts
export type ScoreboardScoreAction = 0 | 1;
```

#### ScoreboardDisplayPosition

Scoreboard display position. 0 = List (tab list), 1 = Sidebar, 2 = Below player name.

```ts
export type ScoreboardDisplayPosition = 0 | 1 | 2;
```

#### WorldBorderAction

World border action type. Determines the world border operation to perform. 0 = Set size, 1 = Lerp size, 2 = Set center, 3 = Initialize, 4 = Set warning time, 5 = Set warning distance.

```ts
export type WorldBorderAction = 0 | 1 | 2 | 3 | 4 | 5;
```

#### CombatEventType

Combat event type. 0 = Enter combat, 1 = End combat, 2 = Entity dead.

```ts
export type CombatEventType = 0 | 1 | 2;
```

#### ClientStatusAction

Client status action type. 0 = Respawn, 1 = Request stats, 2 = Open inventory (1.8.1+).

```ts
export type ClientStatusAction = 0 | 1 | 2;
```

#### ChatMode

Chat mode setting. 0 = Enabled, 1 = Commands only, 2 = Hidden.

```ts
export type ChatMode = 0 | 1 | 2;
```

#### ResourcePackResult

Resource pack result status. 0 = Loaded, 1 = Declined, 2 = Failed, 3 = Accepted.

```ts
export type ResourcePackResult = 0 | 1 | 2 | 3;
```

#### UseEntityType

Entity interaction type. 0 = Interact, 1 = Attack, 2 = Interact at position.

```ts
export type UseEntityType = 0 | 1 | 2;
```

#### DiggingStatus

Block digging status. 0 = Started, 1 = Cancelled, 2 = Finished, 3 = Drop stack, 4 = Drop item, 5 = Finish action.

```ts
export type DiggingStatus = 0 | 1 | 2 | 3 | 4 | 5;
```

#### BlockFace

Block face direction. 0 = Bottom (-Y), 1 = Top (+Y), 2 = North (-Z), 3 = South (+Z), 4 = West (-X), 5 = East (+X).

```ts
export type BlockFace = 0 | 1 | 2 | 3 | 4 | 5;
```

#### EntityActionType

Entity action type. 0 = Start crouch, 1 = Stop crouch, 2 = Leave bed, 3 = Start sprint, 4 = Stop sprint, 5 = Jump with horse, 6 = Open horse inventory.

```ts
export type EntityActionType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
```

#### MouseButton

Window click mouse button. 0 = Left click, 1 = Right click.

```ts
export type MouseButton = 0 | 1;
```

#### ClickMode

Window click mode. 0 = Normal, 1 = Shift click, 2 = Number key, 3 = Middle click, 4 = Drop, 5 = Drag, 6 = Double click.

```ts
export type ClickMode = 0 | 1 | 2 | 3 | 4 | 5 | 6;
```

#### EnchantmentOption

Enchantment table option selection. 0 = Top option, 1 = Middle option, 2 = Bottom option.

```ts
export type EnchantmentOption = 0 | 1 | 2;
```

#### EntityMetadata

Entity metadata representation. An array of metadata entries containing dynamic entity properties. Each entry has a `type` (data type ID), a `key` (metadata index), and a `value` (type-dependent).

```ts
export type EntityMetadata = Array<{
  /** Metadata type ID: 0=byte, 1=short, 2=int, 3=float, 4=string, 5=slot, 6=position, 7=rotation */
  type: number;
  /** Metadata key/index: 0-31 (entity-specific) */
  key: number;
  /** Metadata value (type depends on the type field) */
  value: any;
}>;
```

### Shared structures

The following object interfaces are shared structures reused by multiple packets. They are exported and documented here once; the packets that use them reference them by name.

- **`PlayerProperty`** (Login): player profile property (skin, cape, etc.) used in login and play states. Fields: `name` (property name, e.g. "textures"), `value` (base64-encoded value), `signature?` (optional base64-encoded Yggdrasil signature). Full definition shown below.
- **`ServerStatusResponse`** (Status): the JSON status response object. Full definition shown below.
- **`HypixelPartyMemberData`** (Hypixel): a single party member. Documented under the Hypixel section above.
- **`Slot`** (Entity): an item stack in an inventory slot. Documented under Play clientbound Entity above.
- **`AttributeModifier`**, **`Attribute`** (Entity): entity attribute data. Documented under Play clientbound Entity above.
- **`PlayerInfoDataAddPlayer`**, **`PlayerInfoDataUpdateGameMode`**, **`PlayerInfoDataUpdateLatency`**, **`PlayerInfoDataUpdateDisplayName`**, **`PlayerInfoDataRemovePlayer`** (Chat and UI): the five tab-list update variants. Documented under Play clientbound Chat and UI above.
- **`StatisticsEntry`** (Chat and UI): a single statistic entry. Documented under Play clientbound Chat and UI above.
- **`Position`** (World): a 3D block position. Documented under Play clientbound World above.
- **`ChunkMeta`**, **`BlockRecord`**, **`MapIcon`**, **`AffectedBlockOffset`** (World): chunk, block, map, and explosion helper structures. Documented under Play clientbound World above.

#### PlayerProperty

Player profile property (skin, cape, etc.). Used in login and play states for profile data.

```ts
export interface PlayerProperty {
  /**
   * Property name
   * Possible values: "textures" or other Mojang property names
   */
  name: string;

  /**
   * Property value (base64-encoded)
   * Possible values: base64-encoded string
   */
  value: string;

  /**
   * Signature for verification
   * Possible values: base64-encoded Yggdrasil signature or undefined
   */
  signature?: string;
}
```

#### ServerStatusResponse

Server status response structure. The JSON response object returned by the server during a status ping.

```ts
export interface ServerStatusResponse {
  /**
   * Version information
   * Possible values: object with name and protocol fields
   */
  version: {
    /**
     * Server version name
     * Possible values: version string like "1.8.9"
     */
    name: string;

    /**
     * Protocol version number
     * Possible values: 47 for Minecraft 1.8.9
     */
    protocol: number;
  };

  /**
   * Player information
   * Possible values: object with max, online, and optional sample
   */
  players: {
    /**
     * Maximum player count
     * Possible values: 0 or positive integer
     */
    max: number;

    /**
     * Current online player count
     * Possible values: 0 or positive integer
     */
    online: number;

    /**
     * Sample of online players
     * Possible values: array of {name, id} or undefined
     */
    sample?: Array<{
      /**
       * Player display name
       * Possible values: username string
       */
      name: string;

      /**
       * Player UUID
       * Possible values: UUID string with hyphens
       */
      id: string;
    }>;
  };

  /**
   * Server description (MOTD)
   * Possible values: plain text string or JSON chat component object
   */
  description: string | Record<string, any>;

  /**
   * Server icon as base64-encoded PNG
   * Possible values: "data:image/png;base64,..." string or undefined
   */
  favicon?: string;
}
```

### Constants

#### HYPIXEL_CHANNELS

The only exported runtime value in the package: a `const` object mapping Hypixel channel keys to their channel names. Documented in full under the Hypixel section above. Keys: `HELLO` (`"hyp:hello"`), `LOCATION` (`"hyp:location"`), `PARTY_INFO` (`"hyp:party_info"`), `PING` (`"hyp:ping"`).

