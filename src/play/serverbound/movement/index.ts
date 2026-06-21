/**
 * Serverbound Movement Packets
 *
 * @module packets/play/serverbound/movement
 */

/**
 * Packet: Player (Flying)
 * Description: Updates only the player's onGround flag without position or rotation changes.
 * ID: 0x03
 */
export interface FlyingServerbound {
  /**
   * Whether the player is on the ground
   * Possible values: true or false
   */
  onGround: boolean;
}

/**
 * Packet: PlayerPosition
 * Description: Updates the player's position without rotation changes.
 * ID: 0x04
 */
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

/**
 * Packet: PlayerLook
 * Description: Updates the player's rotation without position changes.
 * ID: 0x05
 */
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

/**
 * Packet: PlayerPositionAndLook (Serverbound)
 * Description: Updates both the player's position and rotation.
 * ID: 0x06
 */
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

/**
 * Packet: SteerVehicle
 * Description: Controls vehicle movement (horse, boat, pig).
 * ID: 0x0C
 */
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

