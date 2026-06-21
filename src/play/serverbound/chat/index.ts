/**
 * Serverbound Chat/UI Packets
 *
 * @module packets/play/serverbound/chat
 */

import type { Position } from "../../clientbound/world/index";

/**
 * Packet: ChatMessage (Serverbound)
 * Description: Sends a chat message or slash command from the client to the server.
 * ID: 0x01
 */
export interface ChatServerbound {
  /**
   * The message or command text
   * Possible values: string of max 100 characters
   */
  message: string;
}

/**
 * Packet: TabComplete (Serverbound)
 * Description: Requests auto-complete suggestions for a partial chat command.
 * ID: 0x14
 */
export interface TabCompleteServerbound {
  /**
   * The partial text to complete
   * Possible values: any string (usually starts with "/")
   */
  text: string;

  /**
   * Block position for command block context
   * Possible values: Position with block coordinates or undefined
   */
  block?: Position;
}

/**
 * Packet: UpdateSign (Serverbound)
 * Description: Sends the four lines of sign text after the player finishes editing.
 * ID: 0x12
 */
export interface UpdateSignServerbound {
  /**
   * Sign block position
   * Possible values: Position with block coordinates
   */
  location: Position;

  /**
   * Line 1 text
   * Possible values: string of max 15 characters
   */
  text1: string;

  /**
   * Line 2 text
   * Possible values: string of max 15 characters
   */
  text2: string;

  /**
   * Line 3 text
   * Possible values: string of max 15 characters
   */
  text3: string;

  /**
   * Line 4 text
   * Possible values: string of max 15 characters
   */
  text4: string;
}

