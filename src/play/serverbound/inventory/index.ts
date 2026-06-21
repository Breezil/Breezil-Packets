/**
 * Serverbound Inventory Packets
 *
 * @module packets/play/serverbound/inventory
 */

import type { MouseButton, ClickMode, EnchantmentOption } from "./types";
import type { Slot } from "../../clientbound/entity/index";

/**
 * Packet: CloseWindow (Serverbound)
 * Description: Sent when the player closes an inventory window.
 * ID: 0x0D
 */
export interface CloseWindowServerbound {
  /**
   * Window ID being closed (0 for player inventory)
   * Possible values: 0-255
   */
  windowId: number;
}

/**
 * Packet: ClickWindow
 * Description: Sent when the player clicks in an inventory window.
 * ID: 0x0E
 */
export interface WindowClickServerbound {
  /**
   * Window ID being interacted with
   * Possible values: 0 or positive window ID
   */
  windowId: number;

  /**
   * Slot index clicked (-999 for outside window)
   * Possible values: -999 or valid slot index
   */
  slot: number;

  /**
   * Which mouse button was used
   * Possible values: 0 (left), 1 (right)
   */
  mouseButton: MouseButton;

  /**
   * Action counter for transaction verification
   * Possible values: incrementing short integer
   */
  action: number;

  /**
   * Click mode determining the click behavior
   * Possible values: 0 (normal), 1 (shift), 2 (number key), 3 (middle), 4 (drop), 5 (drag), 6 (double click)
   */
  mode: ClickMode;

  /**
   * The item in the clicked slot before the action
   * Possible values: Slot data
   */
  item: Slot;
}

/**
 * Packet: ConfirmTransaction (Serverbound)
 * Description: Confirms or acknowledges an inventory transaction.
 * ID: 0x0F
 */
export interface TransactionServerbound {
  /**
   * Window ID
   * Possible values: 0 or positive window ID
   */
  windowId: number;

  /**
   * Action number matching the server's transaction
   * Possible values: short integer
   */
  action: number;

  /**
   * Whether the client accepts the transaction
   * Possible values: true or false
   */
  accepted: boolean;
}

/**
 * Packet: CreativeInventoryAction
 * Description: Sets a slot when in creative mode.
 * ID: 0x10
 */
export interface SetCreativeSlotServerbound {
  /**
   * Slot to set (-1 for drop)
   * Possible values: -1 or valid slot index
   */
  slot: number;

  /**
   * The item to place in the slot
   * Possible values: Slot data
   */
  item: Slot;
}

/**
 * Packet: EnchantItem
 * Description: Selects an enchantment option from the enchantment table.
 * ID: 0x11
 */
export interface EnchantItemServerbound {
  /**
   * Enchantment table window ID
   * Possible values: positive window ID
   */
  windowId: number;

  /**
   * Enchantment option selected
   * Possible values: 0 (top), 1 (middle), 2 (bottom)
   */
  enchantment: EnchantmentOption;
}

/**
 * Packet: HeldItemChange (Serverbound)
 * Description: Changes the player's selected hotbar slot.
 * ID: 0x09
 */
export interface HeldItemSlotServerbound {
  /**
   * New selected hotbar slot
   * Possible values: 0-8
   */
  slotId: number;
}

