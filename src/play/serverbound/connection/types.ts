/**
 * Connection Types for Serverbound Packets
 *
 * @module packets/play/serverbound/connection/types
 */

/**
 * Client status action type.
 * 0 = Respawn, 1 = Request stats, 2 = Open inventory (1.8.1+)
 */
export type ClientStatusAction = 0 | 1 | 2;

/**
 * Chat mode setting.
 * 0 = Enabled, 1 = Commands only, 2 = Hidden
 */
export type ChatMode = 0 | 1 | 2;

/**
 * Resource pack result status.
 * 0 = Loaded, 1 = Declined, 2 = Failed, 3 = Accepted
 */
export type ResourcePackResult = 0 | 1 | 2 | 3;

