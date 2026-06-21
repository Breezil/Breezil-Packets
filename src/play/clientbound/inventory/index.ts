/**
 * Clientbound Inventory/Window Packets
 *
 * @module packets/play/clientbound/inventory
 */

import type { Slot } from "../entity/index";

/**
 * Packet: OpenWindow
 * Description: Opens a container inventory window for the player.
 * ID: 0x2D
 */
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

/**
 * Packet: CloseWindow (Clientbound)
 * Description: Closes an inventory window on the client.
 * ID: 0x2E
 */
export interface CloseWindowClientbound {
  /**
   * Window ID to close (0 for player inventory)
   * Possible values: 0-255
   */
  windowId: number;
}

/**
 * Packet: SetSlot
 * Description: Sets a single slot's item in an inventory window.
 * ID: 0x2F
 */
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

/**
 * Packet: WindowItems
 * Description: Sets all slots in an inventory window at once.
 * ID: 0x30
 */
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

/**
 * Packet: WindowProperty (CraftProgressBar)
 * Description: Updates a window property value (e.g., furnace progress, enchanting levels).
 * ID: 0x31
 */
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

/**
 * Packet: ConfirmTransaction (Clientbound)
 * Description: Confirms or rejects an inventory transaction.
 * ID: 0x32
 */
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

