/**
 * Clientbound Connection Packets
 *
 * @module packets/play/clientbound/connection
 */

/**
 * Packet: KeepAlive (Clientbound)
 * Description: Server sends this periodically; client must respond with the same ID.
 * ID: 0x00
 */
export interface KeepAliveClientbound {
  /**
   * Random ID that must be echoed back by the client
   * Possible values: any integer
   */
  keepAliveId: number;
}

/**
 * Packet: JoinGame
 * Description: Sent when the player joins the server to establish initial game state.
 * ID: 0x01
 */
export interface LoginClientbound {
  /**
   * The player's entity ID assigned by the server
   * Possible values: any integer entity ID
   */
  entityId: number;

  /**
   * Game mode of the player
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator), +8 for hardcore
   */
  gameMode: number;

  /**
   * Dimension the player is in
   * Possible values: -1 (Nether), 0 (Overworld), 1 (End)
   */
  dimension: number;

  /**
   * Server difficulty setting
   * Possible values: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard)
   */
  difficulty: number;

  /**
   * Maximum players shown in tab list (ignored by client)
   * Possible values: any unsigned byte
   */
  maxPlayers: number;

  /**
   * World type identifier
   * Possible values: "default", "flat", "largeBiomes", "amplified", "customized"
   */
  levelType: string;

  /**
   * Whether to disable some debug information on F3
   * Possible values: true or false
   */
  reducedDebugInfo: boolean;
}

/**
 * Packet: Respawn
 * Description: Sent to change the player's dimension or respawn after death.
 * ID: 0x07
 */
export interface RespawnClientbound {
  /**
   * The new dimension ID
   * Possible values: -1 (Nether), 0 (Overworld), 1 (End)
   */
  dimension: number;

  /**
   * The server difficulty
   * Possible values: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard)
   */
  difficulty: number;

  /**
   * The player's game mode
   * Possible values: 0 (Survival), 1 (Creative), 2 (Adventure), 3 (Spectator)
   */
  gamemode: number;

  /**
   * World type string
   * Possible values: "default", "flat", "largeBiomes", "amplified", "customized"
   */
  levelType: string;
}

/**
 * Packet: KickDisconnect
 * Description: Disconnects the player with a given reason.
 * ID: 0x40
 */
export interface KickDisconnectClientbound {
  /**
   * Disconnect reason as JSON text component
   * Possible values: serialized JSON chat component string
   */
  reason: string;
}

/**
 * Packet: SetCompression (Play)
 * Description: Enables packet compression above a given threshold during play state.
 * ID: 0x46
 */
export interface SetCompressionClientbound {
  /**
   * Minimum packet size to compress
   * Possible values: -1 (disable) or positive integer threshold in bytes
   */
  threshold: number;
}

/**
 * Packet: ServerDifficulty
 * Description: Updates the server difficulty shown to the player.
 * ID: 0x41
 */
export interface DifficultyClientbound {
  /**
   * The server difficulty level
   * Possible values: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard)
   */
  difficulty: number;
}

/**
 * Packet: ResourcePackSend
 * Description: Requests the client to download a resource pack.
 * ID: 0x48
 */
export interface ResourcePackSendClientbound {
  /**
   * URL to download the resource pack from
   * Possible values: valid HTTP/HTTPS URL string
   */
  url: string;

  /**
   * SHA-1 hash of the resource pack file
   * Possible values: 40-character hex string
   */
  hash: string;
}

/**
 * Packet: CustomPayload (Clientbound)
 * Description: Sends custom plugin message data on a named channel.
 * ID: 0x3F
 */
export interface CustomPayloadClientbound {
  /**
   * The plugin message channel name
   * Possible values: channel identifier string like "MC|Brand", "hyp:location", etc.
   */
  channel: string;

  /**
   * The raw message data
   * Possible values: Buffer of arbitrary bytes
   */
  data: Buffer;
}

