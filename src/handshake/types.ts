/**
 * Handshake State Types for Minecraft 1.8.9 Protocol
 *
 * @module packets/handshake/types
 */

/**
 * Next protocol state after handshaking.
 * 1 = Status (server list ping), 2 = Login (authentication)
 */
export type NextProtocolState = 1 | 2;

/**
 * Legacy ping payload marker.
 * Always 0x01 for legacy server list ping requests.
 */
export type LegacyPingPayload = 1;

