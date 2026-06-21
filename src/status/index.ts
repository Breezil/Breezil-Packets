/**
 * Status State Packets for Minecraft 1.8.9
 *
 * @module packets/status
 */

/**
 * Server status response structure.
 * JSON response object returned by the server during status ping.
 */
export interface ServerStatusResponse {
  /**
   * Version information
   * Possible values: object with name and protocol fields
   */
  version: {
    /**
     * Server version name
     * Possible values: version string like "1.8.9"
     */
    name: string;

    /**
     * Protocol version number
     * Possible values: 47 for Minecraft 1.8.9
     */
    protocol: number;
  };

  /**
   * Player information
   * Possible values: object with max, online, and optional sample
   */
  players: {
    /**
     * Maximum player count
     * Possible values: 0 or positive integer
     */
    max: number;

    /**
     * Current online player count
     * Possible values: 0 or positive integer
     */
    online: number;

    /**
     * Sample of online players
     * Possible values: array of {name, id} or undefined
     */
    sample?: Array<{
      /**
       * Player display name
       * Possible values: username string
       */
      name: string;

      /**
       * Player UUID
       * Possible values: UUID string with hyphens
       */
      id: string;
    }>;
  };

  /**
   * Server description (MOTD)
   * Possible values: plain text string or JSON chat component object
   */
  description: string | Record<string, any>;

  /**
   * Server icon as base64-encoded PNG
   * Possible values: "data:image/png;base64,..." string or undefined
   */
  favicon?: string;
}

/**
 * Packet: ServerInfo
 * Description: Contains the server's status information for the server list.
 * ID: 0x00
 */
export interface ServerInfoClientbound {
  /**
   * Server status response object
   * Possible values: ServerStatusResponse JSON structure
   */
  response: ServerStatusResponse;
}

/**
 * Packet: Pong
 * Description: Response to client's ping packet with the same timestamp for latency calculation.
 * ID: 0x01
 */
export interface PingClientbound {
  /**
   * Timestamp from the client's ping packet
   * Possible values: 64-bit integer (BigInt) echoed from client
   */
  time: bigint;
}

/**
 * Packet: PingStart
 * Description: Requests the server to send its status information. This packet has no fields.
 * ID: 0x00
 */
export interface PingStartServerbound {
  // No fields - empty packet
}

/**
 * Packet: Ping
 * Description: Sent by client to measure server latency. Server should respond with same timestamp.
 * ID: 0x01
 */
export interface PingServerbound {
  /**
   * Timestamp for latency measurement
   * Possible values: 64-bit integer (BigInt), usually current time in milliseconds
   */
  time: bigint;
}

