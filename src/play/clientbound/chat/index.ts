/**
 * Clientbound Chat/UI Packets
 *
 * @module packets/play/clientbound/chat
 */

import type { PlayerProperty } from "../../../login/index";
import type {
  ChatMessagePosition,
  PlayerInfoAction,
  TitleAction,
} from "./types";

/**
 * Player info data for adding a player to the tab list.
 */
export interface PlayerInfoDataAddPlayer {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * Player username
   * Possible values: 1-16 character username
   */
  name: string;

  /**
   * Skin properties and signatures
   * Possible values: array of PlayerProperty (textures, etc.)
   */
  properties: PlayerProperty[];

  /**
   * Player's game mode
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator)
   */
  gamemode: number;

  /**
   * Latency/ping in milliseconds
   * Possible values: 0 or positive integer
   */
  ping: number;

  /**
   * Display name override (JSON text component)
   * Possible values: serialized JSON chat component string or undefined
   */
  displayName?: string;
}

/**
 * Player info data for updating a player's game mode.
 */
export interface PlayerInfoDataUpdateGameMode {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * New game mode
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator)
   */
  gamemode: number;
}

/**
 * Player info data for updating a player's latency/ping.
 */
export interface PlayerInfoDataUpdateLatency {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * New ping in milliseconds
   * Possible values: 0 or positive integer
   */
  ping: number;
}

/**
 * Player info data for updating a player's display name.
 */
export interface PlayerInfoDataUpdateDisplayName {
  /**
   * Player UUID
   * Possible values: UUID string with hyphens
   */
  uuid: string;

  /**
   * New display name (JSON text component)
   * Possible values: serialized JSON chat component string or undefined
   */
  displayName?: string;
}

/**
 * Player info data for removing a player from the tab list.
 */
export interface PlayerInfoDataRemovePlayer {
  /**
   * Player UUID to remove
   * Possible values: UUID string with hyphens
   */
  uuid: string;
}

/**
 * Player statistic entry.
 * Represents a single tracked statistic value.
 */
export interface StatisticsEntry {
  /**
   * Statistic name
   * Possible values: "stat.playerKills", "stat.mobKills", "stat.deaths", etc.
   */
  name: string;

  /**
   * Statistic value
   * Possible values: 0 or positive integer
   */
  value: number;
}

/**
 * Packet: ChatMessage (Clientbound)
 * Description: Sends a chat message or system message to the client.
 * ID: 0x02
 */
export interface ChatClientbound {
  /**
   * Message content as JSON text component
   * Possible values: serialized JSON chat component string
   */
  message: string;

  /**
   * Message display position
   * Possible values: 0 (chat box), 1 (system message), 2 (action bar)
   */
  position: ChatMessagePosition;
}

/**
 * Packet: Title
 * Description: Displays a title, subtitle, or action bar text, or configures title timing.
 * ID: 0x45
 */
export interface TitleClientbound {
  /**
   * Title action type
   * Possible values: 0 (set title), 1 (set subtitle), 2 (set times), 3 (clear), 4 (reset)
   */
  action: TitleAction;

  /**
   * Text content (JSON text component, for set title/subtitle actions)
   * Possible values: serialized JSON chat component string or undefined
   */
  text?: string;

  /**
   * Fade in duration in ticks (for set times action)
   * Possible values: 0 or positive integer or undefined
   */
  fadeIn?: number;

  /**
   * Stay duration in ticks (for set times action)
   * Possible values: 0 or positive integer or undefined
   */
  stay?: number;

  /**
   * Fade out duration in ticks (for set times action)
   * Possible values: 0 or positive integer or undefined
   */
  fadeOut?: number;
}

/**
 * Packet: PlayerListHeaderAndFooter
 * Description: Sets the header and footer text in the player tab list.
 * ID: 0x47
 */
export interface PlayerlistHeaderClientbound {
  /**
   * Tab list header text
   * Possible values: serialized JSON chat component string
   */
  header: string;

  /**
   * Tab list footer text
   * Possible values: serialized JSON chat component string
   */
  footer: string;
}

/**
 * Packet: TabComplete (Clientbound)
 * Description: Provides auto-complete suggestions for a chat command.
 * ID: 0x3A
 */
export interface TabCompleteClientbound {
  /**
   * List of completion suggestions
   * Possible values: array of suggestion strings
   */
  matches: string[];
}

/**
 * Packet: Statistics
 * Description: Sends the player's tracked statistics data.
 * ID: 0x37
 */
export interface StatisticsClientbound {
  /**
   * Array of statistic entries
   * Possible values: array of StatisticsEntry
   */
  entries: StatisticsEntry[];
}

/**
 * Packet: PlayerInfo
 * Description: Updates the player list (tab list) with player information.
 * ID: 0x38
 */
export interface PlayerInfoClientbound {
  /**
   * The action type to perform
   * Possible values: "add_player", "update_game_mode", "update_latency", "update_display_name", "remove_player"
   */
  action: PlayerInfoAction;

  /**
   * Player data entries for the action
   * Possible values: array of PlayerInfoData variants matching the action
   */
  data: (
    | PlayerInfoDataAddPlayer
    | PlayerInfoDataUpdateGameMode
    | PlayerInfoDataUpdateLatency
    | PlayerInfoDataUpdateDisplayName
    | PlayerInfoDataRemovePlayer
  )[];
}

