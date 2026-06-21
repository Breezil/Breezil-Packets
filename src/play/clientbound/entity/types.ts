/**
 * Entity Types for Play State Packets
 *
 * @module packets/play/clientbound/entity/types
 */

/**
 * Entity metadata representation.
 * Array of metadata entries containing dynamic entity properties.
 * Each entry has: type (data type ID), key (metadata index), value (type-dependent).
 */
export type EntityMetadata = Array<{
  /** Metadata type ID: 0=byte, 1=short, 2=int, 3=float, 4=string, 5=slot, 6=position, 7=rotation */
  type: number;
  /** Metadata key/index: 0-31 (entity-specific) */
  key: number;
  /** Metadata value (type depends on the type field) */
  value: any;
}>;

