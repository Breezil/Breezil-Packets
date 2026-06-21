/**
 * Clientbound Scoreboard Packets
 *
 * @module packets/play/clientbound/scoreboard
 */

import type {
  ScoreboardObjectiveAction,
  ScoreboardScoreAction,
  ScoreboardDisplayPosition,
} from "./types";

/**
 * Packet: ScoreboardObjective
 * Description: Creates, removes, or updates a scoreboard objective.
 * ID: 0x3B
 */
export interface ScoreboardObjectiveClientbound {
  /**
   * Unique objective name
   * Possible values: 1-16 character identifier string
   */
  name: string;

  /**
   * Action to perform
   * Possible values: 0 (create), 1 (remove), 2 (update display text)
   */
  action: ScoreboardObjectiveAction;

  /**
   * Display text (JSON text component, only for create/update actions)
   * Possible values: serialized JSON chat component string or undefined
   */
  displayText?: string;

  /**
   * Render type for the score value
   * Possible values: "integer" or "hearts" or undefined
   */
  type?: string;
}

/**
 * Packet: ScoreboardScore
 * Description: Updates or removes a score entry in a scoreboard objective.
 * ID: 0x3C
 */
export interface ScoreboardScoreClientbound {
  /**
   * Score entry name (e.g., player name)
   * Possible values: 1-40 character string
   */
  itemName: string;

  /**
   * Action to perform
   * Possible values: 0 (create/update), 1 (remove)
   */
  action: ScoreboardScoreAction;

  /**
   * Objective name this score belongs to
   * Possible values: objective identifier string
   */
  scoreName: string;

  /**
   * The score value (only for create/update action)
   * Possible values: any integer or undefined
   */
  value?: number;
}

/**
 * Packet: ScoreboardDisplayObjective
 * Description: Sets which objective to display in which scoreboard slot.
 * ID: 0x3D
 */
export interface ScoreboardDisplayObjectiveClientbound {
  /**
   * Display position slot
   * Possible values: 0 (tab list), 1 (sidebar), 2 (below player name)
   */
  position: ScoreboardDisplayPosition;

  /**
   * Objective name to display (empty string to clear)
   * Possible values: objective identifier string or empty string
   */
  name: string;
}

/**
 * Packet: Teams
 * Description: Creates, removes, updates a team, or adds/removes team members.
 * ID: 0x3E
 */
export interface ScoreboardTeamClientbound {
  /**
   * Unique team name
   * Possible values: 1-16 character identifier string
   */
  team: string;

  /**
   * Team operation mode
   * Possible values: 0 (create), 1 (remove), 2 (update info), 3 (add players), 4 (remove players)
   */
  mode: number;

  /**
   * Team display name (only for create/update modes)
   * Possible values: display name string or undefined
   */
  name?: string;

  /**
   * Prefix for team members' nametags (only for create/update modes)
   * Possible values: prefix string or undefined
   */
  prefix?: string;

  /**
   * Suffix for team members' nametags (only for create/update modes)
   * Possible values: suffix string or undefined
   */
  suffix?: string;

  /**
   * Friendly fire flags (only for create/update modes)
   * Possible values: 0 (off), 1 (on), 3 (see invisible teammates) or undefined
   */
  friendlyFire?: number;

  /**
   * Name tag visibility rule (only for create/update modes)
   * Possible values: "always", "hideForOtherTeams", "hideForOwnTeam", "never" or undefined
   */
  nameTagVisibility?: string;

  /**
   * Team color index (only for create/update modes)
   * Possible values: 0-15 (chat color codes) or undefined
   */
  color?: number;

  /**
   * Players to add or remove (only for modes 0, 3, 4)
   * Possible values: array of player name strings or undefined
   */
  players?: string[];
}

