/**
 * Minecraft Protocol 1.8.9 Packet Type System
 *
 * Complete, fully-typed packet definitions for all protocol states.
 * Compatible with minecraft-protocol ^1.47.0 (protocol version 47)
 *
 * Protocol States:
 * - Handshake: Initial connection setup
 * - Status: Server list ping
 * - Login: Authentication
 * - Play: Main game state (clientbound + serverbound)
 * - Hypixel: Custom Hypixel ModAPI packets
 *
 * Usage:
 *   import { ... } from "@packets";
 *
 * @module packets
 */

// ── Handshake ──────────────────────────────────────────────────────────
export {
  SetProtocolServerbound,
  LegacyServerListPingServerbound,
} from "./handshake/index";
export { NextProtocolState, LegacyPingPayload } from "./handshake/types";

// ── Login ──────────────────────────────────────────────────────────────
export {
  DisconnectLoginClientbound,
  EncryptionBeginClientbound,
  LoginSuccessClientbound,
  CompressClientbound,
  LoginStartServerbound,
  EncryptionBeginServerbound,
  PlayerProperty,
} from "./login/index";

// ── Status ─────────────────────────────────────────────────────────────
export {
  ServerInfoClientbound,
  PingClientbound,
  PingStartServerbound,
  PingServerbound,
  ServerStatusResponse,
} from "./status/index";

// ── Hypixel ────────────────────────────────────────────────────────────
export {
  HypixelLocationPacket,
  HypixelPartyInfoPacket,
  HypixelPartyMemberData,
  HypixelPingPacket,
  HypixelHelloPacket,
  HYPIXEL_CHANNELS,
} from "./hypixel/index";
export {
  HypixelServerType,
  HypixelServerTypeValue,
  HypixelPartyRole,
  HypixelEnvironment,
  HypixelChannel,
} from "./hypixel/types";

// ── Play: Clientbound – Connection ─────────────────────────────────────
export {
  KeepAliveClientbound,
  LoginClientbound,
  RespawnClientbound,
  KickDisconnectClientbound,
  SetCompressionClientbound,
  DifficultyClientbound,
  ResourcePackSendClientbound,
  CustomPayloadClientbound,
} from "./play/clientbound/connection/index";

// ── Play: Clientbound – Player ─────────────────────────────────────────
export {
  PositionClientbound,
  AbilitiesClientbound,
  HeldItemSlotClientbound,
  ExperienceClientbound,
  UpdateHealthClientbound,
  BedClientbound,
  SpawnPositionClientbound,
  GameStateChangeClientbound,
  CameraClientbound,
} from "./play/clientbound/player/index";

// ── Play: Clientbound – Chat/UI ────────────────────────────────────────
export {
  PlayerInfoDataAddPlayer,
  PlayerInfoDataUpdateGameMode,
  PlayerInfoDataUpdateLatency,
  PlayerInfoDataUpdateDisplayName,
  PlayerInfoDataRemovePlayer,
  StatisticsEntry,
  ChatClientbound,
  TitleClientbound,
  PlayerlistHeaderClientbound,
  TabCompleteClientbound,
  StatisticsClientbound,
  PlayerInfoClientbound,
} from "./play/clientbound/chat/index";
export {
  ChatMessagePosition,
  PlayerInfoAction,
  TitleAction,
} from "./play/clientbound/chat/types";

// ── Play: Clientbound – Scoreboard ─────────────────────────────────────
export {
  ScoreboardObjectiveClientbound,
  ScoreboardScoreClientbound,
  ScoreboardDisplayObjectiveClientbound,
  ScoreboardTeamClientbound,
} from "./play/clientbound/scoreboard/index";
export {
  ScoreboardObjectiveAction,
  ScoreboardScoreAction,
  ScoreboardDisplayPosition,
} from "./play/clientbound/scoreboard/types";

// ── Play: Clientbound – Entity ─────────────────────────────────────────
export {
  Slot,
  AttributeModifier,
  Attribute,
  NamedEntitySpawnClientbound,
  SpawnEntityClientbound,
  SpawnEntityLivingClientbound,
  SpawnEntityPaintingClientbound,
  SpawnEntityExperienceOrbClientbound,
  SpawnEntityWeatherClientbound,
  EntityClientbound,
  RelEntityMoveClientbound,
  EntityLookClientbound,
  EntityMoveLookClientbound,
  EntityTeleportClientbound,
  EntityHeadRotationClientbound,
  EntityVelocityClientbound,
  EntityDestroyClientbound,
  EntityMetadataClientbound,
  EntityStatusClientbound,
  EntityEffectClientbound,
  RemoveEntityEffectClientbound,
  EntityEquipmentClientbound,
  AttachEntityClientbound,
  UpdateAttributesClientbound,
  AnimationClientbound,
  CollectClientbound,
  UpdateEntityNbtClientbound,
} from "./play/clientbound/entity/index";
export { EntityMetadata } from "./play/clientbound/entity/types";

// ── Play: Clientbound – Inventory ──────────────────────────────────────
export {
  OpenWindowClientbound,
  CloseWindowClientbound,
  SetSlotClientbound,
  WindowItemsClientbound,
  CraftProgressBarClientbound,
  TransactionClientbound,
} from "./play/clientbound/inventory/index";

// ── Play: Clientbound – World ──────────────────────────────────────────
export {
  Position,
  ChunkMeta,
  BlockRecord,
  MapIcon,
  AffectedBlockOffset,
  MapChunkClientbound,
  MapChunkBulkClientbound,
  BlockChangeClientbound,
  MultiBlockChangeClientbound,
  BlockActionClientbound,
  BlockBreakAnimationClientbound,
  UpdateTimeClientbound,
  WorldEventClientbound,
  WorldParticlesClientbound,
  ExplosionClientbound,
  NamedSoundEffectClientbound,
  WorldBorderClientbound,
  UpdateSignClientbound,
  OpenSignEntityClientbound,
  TileEntityDataClientbound,
  MapClientbound,
  CombatEventClientbound,
} from "./play/clientbound/world/index";
export {
  WorldBorderAction,
  CombatEventType,
} from "./play/clientbound/world/types";

// ── Play: Serverbound – Connection ─────────────────────────────────────
export {
  KeepAliveServerbound,
  ClientCommandServerbound,
  SettingsServerbound,
  AbilitiesServerbound,
  CustomPayloadServerbound,
  ResourcePackReceiveServerbound,
} from "./play/serverbound/connection/index";
export {
  ClientStatusAction,
  ChatMode,
  ResourcePackResult,
} from "./play/serverbound/connection/types";

// ── Play: Serverbound – Movement ───────────────────────────────────────
export {
  FlyingServerbound,
  PositionServerbound,
  LookServerbound,
  PositionLookServerbound,
  SteerVehicleServerbound,
} from "./play/serverbound/movement/index";

// ── Play: Serverbound – Interaction ────────────────────────────────────
export {
  UseEntityServerbound,
  BlockDigServerbound,
  BlockPlaceServerbound,
  ArmAnimationServerbound,
  EntityActionServerbound,
  SpectateServerbound,
} from "./play/serverbound/interaction/index";
export {
  UseEntityType,
  DiggingStatus,
  BlockFace,
  EntityActionType,
} from "./play/serverbound/interaction/types";

// ── Play: Serverbound – Inventory ──────────────────────────────────────
export {
  CloseWindowServerbound,
  WindowClickServerbound,
  TransactionServerbound,
  SetCreativeSlotServerbound,
  EnchantItemServerbound,
  HeldItemSlotServerbound,
} from "./play/serverbound/inventory/index";
export {
  MouseButton,
  ClickMode,
  EnchantmentOption,
} from "./play/serverbound/inventory/types";

// ── Play: Serverbound – Chat ───────────────────────────────────────────
export {
  ChatServerbound,
  TabCompleteServerbound,
  UpdateSignServerbound,
} from "./play/serverbound/chat/index";

