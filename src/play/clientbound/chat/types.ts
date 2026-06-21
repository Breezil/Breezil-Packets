/**
 * Chat/UI Types for Clientbound Packets
 *
 * @module packets/play/clientbound/chat/types
 */

/**
 * Chat message position type.
 * Determines where the chat message appears on screen.
 * 0 = Chat box, 1 = System message, 2 = Action bar (above hotbar)
 */
export type ChatMessagePosition = 0 | 1 | 2;

/**
 * Player list (tab list) action type.
 * Determines what kind of player info update is being performed.
 */
export type PlayerInfoAction =
  | "add_player"
  | "update_game_mode"
  | "update_latency"
  | "update_display_name"
  | "remove_player";

/**
 * Title packet action type.
 * 0 = Set title, 1 = Set subtitle, 2 = Set times, 3 = Clear, 4 = Reset
 */
export type TitleAction = 0 | 1 | 2 | 3 | 4;

