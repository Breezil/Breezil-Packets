/**
 * World Types for Clientbound Packets
 *
 * @module packets/play/clientbound/world/types
 */

/**
 * World border action type.
 * Determines the world border operation to perform.
 * 0 = Set size, 1 = Lerp size, 2 = Set center, 3 = Initialize, 4 = Set warning time, 5 = Set warning distance
 */
export type WorldBorderAction = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Combat event type.
 * 0 = Enter combat, 1 = End combat, 2 = Entity dead
 */
export type CombatEventType = 0 | 1 | 2;

