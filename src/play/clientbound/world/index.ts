/**
 * Clientbound World Packets
 *
 * @module packets/play/clientbound/world
 */

import type { WorldBorderAction } from "./types";

/**
 * 3D block position in the world.
 * Coordinates are in blocks (integers).
 */
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

/**
 * Chunk metadata for bulk chunk transmission.
 * Contains information about a single chunk in a bulk update.
 */
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

/**
 * Single block change record within a chunk.
 * Used in multi-block change packets.
 */
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

/**
 * Map marker/icon for item maps.
 * Represents a point of interest on a map item.
 */
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

/**
 * Single block offset affected by an explosion.
 * Relative to the explosion center.
 */
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

/**
 * Packet: MapChunk
 * Description: Sends chunk column data to the client.
 * ID: 0x21
 */
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

/**
 * Packet: MapChunkBulk
 * Description: Sends multiple chunk columns at once.
 * ID: 0x26
 */
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

/**
 * Packet: BlockChange
 * Description: Updates a single block in the world.
 * ID: 0x23
 */
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

/**
 * Packet: MultiBlockChange
 * Description: Updates multiple blocks within a single chunk section.
 * ID: 0x22
 */
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

/**
 * Packet: BlockAction
 * Description: Triggers a block action (e.g., chest opening, note block play, piston).
 * ID: 0x24
 */
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

/**
 * Packet: BlockBreakAnimation
 * Description: Shows block breaking progress overlay.
 * ID: 0x25
 */
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

/**
 * Packet: UpdateTime
 * Description: Updates the world age and current time of day.
 * ID: 0x03
 */
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

/**
 * Packet: Effect (World Event)
 * Description: Plays a sound effect and/or particle effect at a location.
 * ID: 0x28
 */
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

/**
 * Packet: Particle
 * Description: Spawns particles in the world.
 * ID: 0x2A
 */
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

/**
 * Packet: Explosion
 * Description: Creates an explosion effect, removing blocks and pushing entities.
 * ID: 0x27
 */
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

/**
 * Packet: NamedSoundEffect
 * Description: Plays a named sound effect at a location.
 * ID: 0x29
 */
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

/**
 * Packet: WorldBorder
 * Description: Updates world border settings (size, center, warnings).
 * ID: 0x44
 */
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

/**
 * Packet: UpdateSign (Clientbound)
 * Description: Updates sign text at a given position.
 * ID: 0x33
 */
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

/**
 * Packet: OpenSignEntity
 * Description: Opens the sign editing GUI for the player.
 * ID: 0x36
 */
export interface OpenSignEntityClientbound {
  /**
   * Sign block position to edit
   * Possible values: Position with block coordinates
   */
  location: Position;
}

/**
 * Packet: TileEntityData
 * Description: Updates block entity (tile entity) NBT data at a position.
 * ID: 0x35
 */
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

/**
 * Packet: Map
 * Description: Updates a map item's data (icons, pixels).
 * ID: 0x34
 */
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

/**
 * Packet: CombatEvent
 * Description: Sends combat-related events (enter/end combat, entity death).
 * ID: 0x42
 */
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

