/**
 * Clientbound Player Packets
 *
 * @module packets/play/clientbound/player
 */

import type { Position } from "../world/index";

/**
 * Packet: PlayerPositionAndLook (Clientbound)
 * Description: Updates the player's position and rotation. Can use relative or absolute values.
 * ID: 0x08
 */
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

/**
 * Packet: PlayerAbilities (Clientbound)
 * Description: Updates the player's ability flags like flying, creative mode, invulnerability.
 * ID: 0x39
 */
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

/**
 * Packet: HeldItemChange (Clientbound)
 * Description: Updates which hotbar slot is currently selected.
 * ID: 0x09
 */
export interface HeldItemSlotClientbound {
  /**
   * Selected hotbar slot index
   * Possible values: 0-8
   */
  slot: number;
}

/**
 * Packet: SetExperience
 * Description: Updates the player's experience bar, level, and total XP.
 * ID: 0x1F
 */
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

/**
 * Packet: UpdateHealth
 * Description: Updates the player's health, food level, and food saturation.
 * ID: 0x06
 */
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

/**
 * Packet: UseBed
 * Description: Shows a player entity entering a bed.
 * ID: 0x0A
 */
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

/**
 * Packet: SpawnPosition
 * Description: Sets the player's compass target/spawn point position.
 * ID: 0x05
 */
export interface SpawnPositionClientbound {
  /**
   * The world spawn point location
   * Possible values: Position with block coordinates
   */
  location: Position;
}

/**
 * Packet: ChangeGameState
 * Description: Updates game state like weather, game mode changes, or game events.
 * ID: 0x2B
 */
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

/**
 * Packet: Camera
 * Description: Sets the camera to view from another entity's perspective.
 * ID: 0x43
 */
export interface CameraClientbound {
  /**
   * Entity ID to view from
   * Possible values: any entity ID (own entity ID to reset to first person)
   */
  cameraId: number;
}

