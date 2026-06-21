/**
 * Clientbound Entity Packets
 *
 * @module packets/play/clientbound/entity
 */

import type { EntityMetadata } from "./types";

/**
 * Inventory slot/item representation.
 * Represents an item stack in any inventory slot.
 */
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

/**
 * Attribute modifier applied to entity attributes.
 * Adds multiplicative or additive changes.
 */
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

/**
 * Entity attribute with optional modifiers.
 * Represents attributes like health, speed, attack damage, etc.
 */
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

/**
 * Packet: NamedEntitySpawn
 * Description: Spawns a player entity in the world.
 * ID: 0x0C
 */
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

/**
 * Packet: SpawnEntity (Object)
 * Description: Spawns an object/vehicle entity (minecart, boat, item, arrow, etc.).
 * ID: 0x0E
 */
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

/**
 * Packet: SpawnEntityLiving
 * Description: Spawns a mob or other living entity in the world.
 * ID: 0x0F
 */
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

/**
 * Packet: SpawnEntityPainting
 * Description: Spawns a painting entity on a wall.
 * ID: 0x10
 */
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

/**
 * Packet: SpawnEntityExperienceOrb
 * Description: Spawns an experience orb entity in the world.
 * ID: 0x11
 */
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

/**
 * Packet: SpawnEntityWeather
 * Description: Spawns a global entity like a lightning bolt.
 * ID: 0x2C
 */
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

/**
 * Packet: Entity
 * Description: Sent for entities with no position/rotation change (entity keep-alive).
 * ID: 0x14
 */
export interface EntityClientbound {
  /**
   * The entity ID
   * Possible values: valid entity ID integer
   */
  entityId: number;
}

/**
 * Packet: EntityRelativeMove
 * Description: Moves an entity relative to its current position.
 * ID: 0x15
 */
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

/**
 * Packet: EntityLook
 * Description: Updates an entity's rotation without movement.
 * ID: 0x16
 */
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

/**
 * Packet: EntityLookAndRelativeMove
 * Description: Updates both position (relative) and rotation of an entity.
 * ID: 0x17
 */
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

/**
 * Packet: EntityTeleport
 * Description: Teleports an entity to an absolute position.
 * ID: 0x18
 */
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

/**
 * Packet: EntityHeadLook
 * Description: Updates an entity's head yaw rotation.
 * ID: 0x19
 */
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

/**
 * Packet: EntityVelocity
 * Description: Sets an entity's velocity (motion).
 * ID: 0x12
 */
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

/**
 * Packet: DestroyEntities
 * Description: Removes one or more entities from the world.
 * ID: 0x13
 */
export interface EntityDestroyClientbound {
  /**
   * Array of entity IDs to destroy
   * Possible values: array of valid entity ID integers
   */
  entityIds: number[];
}

/**
 * Packet: EntityMetadata
 * Description: Updates an entity's metadata entries.
 * ID: 0x1C
 */
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

/**
 * Packet: EntityStatus
 * Description: Triggers an entity event/animation or state change.
 * ID: 0x1A
 */
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

/**
 * Packet: EntityEffect
 * Description: Applies a potion effect to an entity.
 * ID: 0x1D
 */
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

/**
 * Packet: RemoveEntityEffect
 * Description: Removes a potion effect from an entity.
 * ID: 0x1E
 */
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

/**
 * Packet: EntityEquipment
 * Description: Updates an entity's equipment in a specific slot.
 * ID: 0x04
 */
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

/**
 * Packet: AttachEntity
 * Description: Attaches an entity to another (leash, mount).
 * ID: 0x1B
 */
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

/**
 * Packet: UpdateAttributes
 * Description: Updates an entity's attributes and their modifiers.
 * ID: 0x20
 */
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

/**
 * Packet: Animation (Clientbound)
 * Description: Plays an entity animation (swing arm, damage, etc.).
 * ID: 0x0B
 */
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

/**
 * Packet: CollectItem
 * Description: Shows an entity picking up an item entity (with fly-toward animation).
 * ID: 0x0D
 */
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

/**
 * Packet: UpdateEntityNBT
 * Description: Updates an entity's NBT tag data.
 * ID: 0x49
 */
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

