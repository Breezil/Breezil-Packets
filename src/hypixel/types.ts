/**
 * Hypixel Custom Packet Types
 *
 * Based on: https://github.com/HypixelDev/ModAPI
 *
 * @module packets/hypixel/types
 */

/**
 * Known Hypixel server type identifiers.
 * Represents game categories on the Hypixel network.
 */
export type HypixelServerType =
  | "LIMBO"
  | "LOBBY"
  | "BEDWARS"
  | "SKYWARS"
  | "MURDER_MYSTERY"
  | "ARCADE"
  | "UHC"
  | "DUELS"
  | "SKYBLOCK"
  | "BUILD_BATTLE"
  | "PIT"
  | "PROTOTYPE"
  | "HOUSING"
  | "MAIN"
  | "TOURNAMENT"
  | "SMP"
  | "REPLAY";

/**
 * Hypixel server type string value.
 * Includes known values plus any future additions for forward compatibility.
 */
export type HypixelServerTypeValue =
  | HypixelServerType
  | (string & { __hypixelServerType?: "future" });

/**
 * Hypixel party member role within a party.
 * Determines the member's permissions.
 */
export type HypixelPartyRole = "LEADER" | "MOD" | "MEMBER";

/**
 * Hypixel ModAPI environment identifier.
 * Indicates which API environment is active.
 */
export type HypixelEnvironment = "PRODUCTION" | "ALPHA" | "BETA";

/**
 * Union of all known Hypixel custom payload channel names.
 */
export type HypixelChannel =
  | "hyp:hello"
  | "hyp:location"
  | "hyp:party_info"
  | "hyp:ping";

