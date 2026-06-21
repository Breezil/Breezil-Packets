/**
 * Inventory Types for Serverbound Packets
 *
 * @module packets/play/serverbound/inventory/types
 */

/**
 * Window click mouse button.
 * 0 = Left click, 1 = Right click
 */
export type MouseButton = 0 | 1;

/**
 * Window click mode.
 * 0 = Normal, 1 = Shift click, 2 = Number key, 3 = Middle click, 4 = Drop, 5 = Drag, 6 = Double click
 */
export type ClickMode = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Enchantment table option selection.
 * 0 = Top option, 1 = Middle option, 2 = Bottom option
 */
export type EnchantmentOption = 0 | 1 | 2;

