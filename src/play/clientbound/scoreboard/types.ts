/**
 * Scoreboard Types for Clientbound Packets
 *
 * @module packets/play/clientbound/scoreboard/types
 */

/**
 * Scoreboard objective action type.
 * 0 = Create, 1 = Remove, 2 = Update display text
 */
export type ScoreboardObjectiveAction = 0 | 1 | 2;

/**
 * Scoreboard score action type.
 * 0 = Create/Update, 1 = Remove
 */
export type ScoreboardScoreAction = 0 | 1;

/**
 * Scoreboard display position.
 * 0 = List (tab list), 1 = Sidebar, 2 = Below player name
 */
export type ScoreboardDisplayPosition = 0 | 1 | 2;

