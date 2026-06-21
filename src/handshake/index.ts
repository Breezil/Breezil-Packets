/**
 * Handshake State Packets for Minecraft 1.8.9
 *
 * @module packets/handshake
 */

import type { NextProtocolState, LegacyPingPayload } from "./types";

/**
 * Packet: SetProtocol
 * Description: First packet sent by the client to initiate the connection handshake.
 * Determines whether the client wants to check server status or login.
 * ID: 0x00
 */
export interface SetProtocolServerbound {
  /**
   * The protocol version used by the client
   * Possible values: 47 (Minecraft 1.8.9)
   */
  protocolVersion: number;

  /**
   * Server hostname used to connect
   * Possible values: any valid hostname or IP string
   */
  serverHost: string;

  /**
   * Server port used to connect
   * Possible values: 0-65535
   */
  serverPort: number;

  /**
   * Next state to transition to
   * Possible values: 1 (Status), 2 (Login)
   */
  nextState: NextProtocolState;
}

/**
 * Packet: LegacyServerListPing
 * Description: Legacy ping request used to query server MOTD and player count.
 * ID: 0xFE
 */
export interface LegacyServerListPingServerbound {
  /**
   * Payload marker byte
   * Possible values: 1 (always 0x01)
   */
  payload: LegacyPingPayload;
}

