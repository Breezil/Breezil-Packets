/**
 * Hypixel Packet Types
 *
 * Based on: https://github.com/HypixelDev/ModAPI
 *
 * @module packets/hypixel
 */

import type {
  HypixelServerTypeValue,
  HypixelPartyRole,
  HypixelEnvironment,
} from "./types";

/**
 * Packet: HypixelLocation
 * Description: Describes the server/lobby context the player is currently in on Hypixel.
 * Channel: hyp:location
 */
export interface HypixelLocationPacket {
  /**
   * Internal server name
   * Possible values: server identifier string like "mini123A"
   */
  serverName: string;

  /**
   * Top-level server type (game category)
   * Possible values: HypixelServerTypeValue or undefined when not provided
   */
  serverType?: HypixelServerTypeValue;

  /**
   * Lobby name if the player is in a lobby
   * Possible values: lobby identifier string or undefined
   */
  lobbyName?: string;

  /**
   * Game mode identifier
   * Possible values: "solo", "teams", "doubles", etc. or undefined
   */
  mode?: string;

  /**
   * Map name if applicable
   * Possible values: map name string or undefined
   */
  map?: string;
}

/**
 * Packet: HypixelPartyInfo
 * Description: Contains the player's current party information on Hypixel.
 * Channel: hyp:party_info
 */
export interface HypixelPartyInfoPacket {
  /**
   * Whether the player is currently in a party
   * Possible values: true or false
   */
  inParty: boolean;

  /**
   * Members in the party
   * Possible values: array of HypixelPartyMemberData, empty if not in a party
   */
  members: HypixelPartyMemberData[];
}

/**
 * Hypixel party member data.
 * Represents a single member within a Hypixel party.
 */
export interface HypixelPartyMemberData {
  /**
   * Member UUID with hyphens
   * Possible values: UUID string in format "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  uuid: string;

  /**
   * Member role within the party
   * Possible values: "LEADER", "MOD", or "MEMBER"
   */
  role: HypixelPartyRole;
}

/**
 * Packet: HypixelPing
 * Description: Hypixel ping/pong packet for connection health checks.
 * Channel: hyp:ping
 */
export interface HypixelPingPacket {
  /**
   * Server response string
   * Possible values: "pong" or other response strings
   */
  response: string;
}

/**
 * Packet: HypixelHello
 * Description: Initial handshake packet from Hypixel ModAPI identifying the environment.
 * Channel: hyp:hello
 */
export interface HypixelHelloPacket {
  /**
   * Environment identifier for the API
   * Possible values: "PRODUCTION", "ALPHA", or "BETA"
   */
  environment: HypixelEnvironment;
}

/**
 * Custom payload channels used by the Hypixel ModAPI.
 */
export const HYPIXEL_CHANNELS = {
  /** Hello channel - initial handshake */
  HELLO: "hyp:hello",
  /** Location channel - server/lobby context */
  LOCATION: "hyp:location",
  /** Party info channel - party membership */
  PARTY_INFO: "hyp:party_info",
  /** Ping channel - connection health */
  PING: "hyp:ping",
} as const;

