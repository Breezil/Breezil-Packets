/**
 * Serverbound Interaction Packets
 *
 * @module packets/play/serverbound/interaction
 */

import type { Position } from "../../clientbound/world/index";
import type { Slot } from "../../clientbound/entity/index";
import type {
  UseEntityType,
  DiggingStatus,
  BlockFace,
  EntityActionType,
} from "./types";

/**
 * Packet: UseEntity
 * Description: Sent when interacting with or attacking an entity.
 * ID: 0x02
 */
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

/**
 * Packet: PlayerDigging
 * Description: Sent when breaking blocks or performing dig-related actions (drop item, finish eating).
 * ID: 0x07
 */
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

/**
 * Packet: PlayerBlockPlacement
 * Description: Sent when placing a block or right-clicking with an item.
 * ID: 0x08
 */
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

/**
 * Packet: Animation (Serverbound)
 * Description: Sent when the player swings their arm. Has no fields.
 * ID: 0x0A
 */
export interface ArmAnimationServerbound {
  // Empty packet - no fields
}

/**
 * Packet: EntityAction
 * Description: Sent when the player performs an entity action (crouch, sprint, horse jump, etc.).
 * ID: 0x0B
 */
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

/**
 * Packet: Spectate
 * Description: Teleports the spectating player to view another entity.
 * ID: 0x18
 */
export interface SpectateServerbound {
  /**
   * UUID of the entity to spectate
   * Possible values: UUID string with hyphens
   */
  target: string;
}

