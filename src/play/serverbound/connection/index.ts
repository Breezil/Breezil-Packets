/**
 * Serverbound Connection Packets
 *
 * @module packets/play/serverbound/connection
 */

import type { ClientStatusAction, ChatMode, ResourcePackResult } from "./types";

/**
 * Packet: KeepAlive (Serverbound)
 * Description: Client response to server keep-alive; must echo back the same ID.
 * ID: 0x00
 */
export interface KeepAliveServerbound {
  /**
   * The keep alive ID (must match server's request)
   * Possible values: any integer matching the server's keep_alive packet
   */
  keepAliveId: number;
}

/**
 * Packet: ClientStatus (ClientCommand)
 * Description: Sent when the client respawns, requests stats, or opens inventory achievement.
 * ID: 0x16
 */
export interface ClientCommandServerbound {
  /**
   * Client action to perform
   * Possible values: 0 (respawn), 1 (request stats), 2 (open inventory)
   */
  payload: ClientStatusAction;
}

/**
 * Packet: ClientSettings
 * Description: Sends the client's configuration and preferences to the server.
 * ID: 0x15
 */
export interface SettingsServerbound {
  /**
   * Client locale setting
   * Possible values: locale string like "en_US", "pt_BR", etc.
   */
  locale: string;

  /**
   * Client render distance in chunks
   * Possible values: 2-16
   */
  viewDistance: number;

  /**
   * Chat visibility mode
   * Possible values: 0 (enabled), 1 (commands only), 2 (hidden)
   */
  chatFlags: ChatMode;

  /**
   * Whether chat colors are enabled
   * Possible values: true or false
   */
  chatColors: boolean;

  /**
   * Displayed skin part flags (bitmask)
   * Possible values: bit 0=cape, 1=jacket, 2=left sleeve, 3=right sleeve, 4=left pants, 5=right pants, 6=hat
   */
  skinParts: number;
}

/**
 * Packet: PlayerAbilities (Serverbound)
 * Description: Sent when the player toggles flying.
 * ID: 0x13
 */
export interface AbilitiesServerbound {
  /**
   * Ability flags bitmask (only bit 1 = flying is used by server)
   * Possible values: bitmask with bit 1 for flying
   */
  flags: number;

  /**
   * Flying speed (ignored by server)
   * Possible values: any floating-point
   */
  flyingSpeed: number;

  /**
   * Walking speed (ignored by server)
   * Possible values: any floating-point
   */
  walkingSpeed: number;
}

/**
 * Packet: PluginMessage (Serverbound)
 * Description: Sends custom plugin data to the server on a named channel.
 * ID: 0x17
 */
export interface CustomPayloadServerbound {
  /**
   * The plugin message channel name
   * Possible values: channel identifier string like "MC|Brand", etc.
   */
  channel: string;

  /**
   * The raw message data
   * Possible values: Buffer of arbitrary bytes
   */
  data: Buffer;
}

/**
 * Packet: ResourcePackStatus
 * Description: Reports the resource pack download/load result to the server.
 * ID: 0x19
 */
export interface ResourcePackReceiveServerbound {
  /**
   * Resource pack hash string
   * Possible values: 40-character hex SHA-1 hash
   */
  hash: string;

  /**
   * Result status
   * Possible values: 0 (loaded), 1 (declined), 2 (failed), 3 (accepted)
   */
  result: ResourcePackResult;
}

