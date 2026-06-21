/**
 * Interaction Types for Serverbound Packets
 *
 * @module packets/play/serverbound/interaction/types
 */

/**
 * Entity interaction type.
 * 0 = Interact, 1 = Attack, 2 = Interact at position
 */
export type UseEntityType = 0 | 1 | 2;

/**
 * Block digging status.
 * 0 = Started, 1 = Cancelled, 2 = Finished, 3 = Drop stack, 4 = Drop item, 5 = Finish action
 */
export type DiggingStatus = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Block face direction.
 * 0 = Bottom (-Y), 1 = Top (+Y), 2 = North (-Z), 3 = South (+Z), 4 = West (-X), 5 = East (+X)
 */
export type BlockFace = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Entity action type.
 * 0 = Start crouch, 1 = Stop crouch, 2 = Leave bed, 3 = Start sprint, 4 = Stop sprint, 5 = Jump with horse, 6 = Open horse inventory
 */
export type EntityActionType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

