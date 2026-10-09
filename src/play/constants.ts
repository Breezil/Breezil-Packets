/**
 * Protocol 47 (1.8.9) constants: the numbers packets carry and what they mean.
 *
 * Packets name their fields; these name the values inside them, so code never
 * has to know that entity metadata 6 is health or that a block face of 255
 * means "no block". Values only, no behaviour.
 *
 * @module packets/play/constants
 */

/** How the protocol encodes positions, motion and angles. */
export const PROTOCOL_UNITS = {
  /** Entity positions are fixed-point in 1/32 of a block. */
  fixedPointPerBlock: 32,
  /** Entity velocities are in 1/8000 of a block a tick. */
  velocityUnitsPerBlock: 8000,
  /** A rotation byte covers a whole turn in 256 steps. */
  degreesPerByteAngle: 360 / 256,
  /** Named sound positions are in 1/8 of a block. */
  soundUnitsPerBlock: 8,
  /** A named sound's pitch is a byte where 63 is normal. */
  soundPitchUnit: 63,
  /** Where a block click lands on the face, in 1/16 of the face. */
  cursorUnitsPerBlock: 16,
} as const;

/** `spawn_entity` (object) type ids. Mobs are numbered apart, in `spawn_entity_living`. */
export const OBJECT_TYPES = {
  boat: 1,
  item: 2,
  minecart: 10,
  primedTnt: 50,
  enderCrystal: 51,
  arrow: 60,
  snowball: 61,
  egg: 62,
  fireball: 63,
  smallFireball: 64,
  enderPearl: 65,
  witherSkull: 66,
  fallingBlock: 70,
  itemFrame: 71,
  eyeOfEnder: 72,
  potion: 73,
  expBottle: 75,
  firework: 76,
  leashKnot: 77,
  armorStand: 78,
  fishingHook: 90,
} as const;

/** Window ids with a meaning of their own in `set_slot` and `window_items`. */
export const WINDOW_IDS = {
  /** Your own inventory, open or not. */
  playerInventory: 0,
  /** With slot -1: the stack on your cursor. */
  cursor: -1,
} as const;

/** Slots of your own inventory window (window 0). */
export const PLAYER_INVENTORY_SLOTS = {
  craftingResult: 0,
  craftingFirst: 1,
  helmet: 5,
  chestplate: 6,
  leggings: 7,
  boots: 8,
  mainFirst: 9,
  hotbarFirst: 36,
} as const;

/** Bits of a `steer_vehicle` packet's jump byte. */
export const STEER_VEHICLE_FLAGS = {
  jump: 0x01,
  unmount: 0x02,
} as const;

/** Entity metadata indexes (`DataWatcher`), by the entities that have them. */
export const ENTITY_METADATA = {
  /** Every entity. */
  flags: 0,
  air: 1,
  customName: 2,
  customNameVisible: 3,
  silent: 4,
  /** Living entities. */
  health: 6,
  potionColor: 7,
  potionAmbient: 8,
  arrowsInBody: 9,
  noAi: 15,
  /** Players. */
  skinParts: 10,
  hideCape: 16,
  absorption: 17,
  score: 18,
  /** Dropped items. */
  item: 10,
  /** Armor stands: a bit field (`ARMOR_STAND_FLAGS`). */
  armorStandFlags: 10,
  /** Ageable mobs (animals, villagers): the growing age, below 0 for a baby. Zombies: 1 for a baby. */
  ageableAge: 12,
  /** Skeletons: 0 normal, 1 wither skeleton. */
  skeletonType: 13,
  /** Slimes and magma cubes: their size. */
  slimeSize: 16,
  /** Guardians: a bit field (`GUARDIAN_FLAGS`). */
  guardianFlags: 16,
} as const;

/** Bits of an armor stand's metadata 10. */
export const ARMOR_STAND_FLAGS = {
  small: 0x01,
  noGravity: 0x02,
  arms: 0x04,
  noBasePlate: 0x08,
  marker: 0x10,
} as const;

/** Bits of a guardian's metadata 16. */
export const GUARDIAN_FLAGS = {
  retractingSpikes: 0x02,
  elder: 0x04,
} as const;

/** Horizontal facings by the index paintings and item frames are sent with (`EnumFacing.getHorizontal`). */
export const HORIZONTAL_FACINGS = {
  south: 0,
  west: 1,
  north: 2,
  east: 3,
} as const;

/** Bits of entity metadata 0. */
export const ENTITY_FLAGS = {
  onFire: 0x01,
  sneaking: 0x02,
  sprinting: 0x08,
  usingItem: 0x10,
  invisible: 0x20,
} as const;

/** Bits of a player's skin parts (metadata 10). */
export const SKIN_PARTS = {
  cape: 0x01,
  jacket: 0x02,
  leftSleeve: 0x04,
  rightSleeve: 0x08,
  leftPants: 0x10,
  rightPants: 0x20,
  hat: 0x40,
} as const;

/** `entity_status` values with a meaning for players and common mobs. */
export const ENTITY_STATUS = {
  hurt: 2,
  dead: 3,
  ironGolemArms: 4,
  tamingFailed: 6,
  tamingSucceeded: 7,
  wolfShaking: 8,
  eatingAccepted: 9,
  sheepEating: 10,
  ironGolemRose: 11,
  villagerHearts: 12,
  villagerAngry: 13,
  villagerHappy: 14,
  witchMagic: 15,
  zombieConverting: 16,
  fireworkExploding: 17,
  animalInLove: 18,
  squidRotation: 19,
  explosionParticles: 20,
  guardianSound: 21,
  reducedDebugOn: 22,
  reducedDebugOff: 23,
} as const;

/** `animation` (clientbound) values. */
export const ANIMATIONS = {
  swingArm: 0,
  takeDamage: 1,
  leaveBed: 2,
  eatFood: 3,
  criticalEffect: 4,
  magicCriticalEffect: 5,
} as const;

/** `entity_action` (serverbound) action ids. */
export const ENTITY_ACTIONS = {
  startSneaking: 0,
  stopSneaking: 1,
  leaveBed: 2,
  startSprinting: 3,
  stopSprinting: 4,
  horseJump: 5,
  openInventory: 6,
} as const;

/** `use_entity` (serverbound) mouse kinds. */
export const USE_ENTITY_KINDS = {
  interact: 0,
  attack: 1,
  interactAt: 2,
} as const;

/** `block_dig` (serverbound) statuses. */
export const DIG_STATUS = {
  started: 0,
  cancelled: 1,
  finished: 2,
  dropStack: 3,
  dropItem: 4,
  releaseUseItem: 5,
} as const;

/** Block faces as `block_place` and `block_dig` carry them; 255 is "no block", using the held item. */
export const BLOCK_FACES = {
  down: 0,
  up: 1,
  north: 2,
  south: 3,
  west: 4,
  east: 5,
  none: 255,
} as const;

/** `window_click` modes. */
export const WINDOW_CLICK_MODES = {
  click: 0,
  shiftClick: 1,
  numberKey: 2,
  middleClick: 3,
  drop: 4,
  drag: 5,
  doubleClick: 6,
} as const;

/** `entity_equipment` slots: what an entity holds, then its armour from the feet up. */
export const EQUIPMENT_SLOTS = {
  held: 0,
  boots: 1,
  leggings: 2,
  chestplate: 3,
  helmet: 4,
} as const;

/** Slots with a meaning of their own in `window_click`. */
export const WINDOW_CLICK_SLOTS = {
  /** Clicked outside the window, dropping the cursor stack. */
  outside: -999,
} as const;

/** Game modes, as `login`, `respawn`, `player_info` and `game_state_change` carry them. */
export const GAME_MODES = {
  survival: 0,
  creative: 1,
  adventure: 2,
  spectator: 3,
} as const;

/** `client_command` (serverbound) actions. */
export const CLIENT_COMMANDS = {
  performRespawn: 0,
  requestStats: 1,
  openInventoryAchievement: 2,
} as const;

/** Bits of the `abilities` flags, both directions. */
export const ABILITY_FLAGS = {
  invulnerable: 0x01,
  flying: 0x02,
  allowFlying: 0x04,
  creative: 0x08,
} as const;

/** Bits of a server `position` (S08) packet's flags, each making its value relative. */
export const POSITION_RELATIVE_FLAGS = {
  x: 0x01,
  y: 0x02,
  z: 0x04,
  yaw: 0x08,
  pitch: 0x10,
} as const;

/** Where a clientbound `chat` message is shown. */
export const CHAT_POSITIONS = {
  chat: 0,
  system: 1,
  actionBar: 2,
} as const;

/** `title` actions. */
export const TITLE_ACTIONS = {
  title: 0,
  subtitle: 1,
  times: 2,
  clear: 3,
  reset: 4,
} as const;

/**
 * `game_state_change` reasons. Rain is 1 to begin and 2 to end, as the 1.8
 * client handles them (the names are often given the other way round).
 */
export const GAME_STATE_REASONS = {
  invalidBed: 0,
  beginRaining: 1,
  endRaining: 2,
  changeGameMode: 3,
  enterCredits: 4,
  demoMessage: 5,
  arrowHitPlayer: 6,
  fadeValue: 7,
  fadeTime: 8,
  mobAppearance: 10,
} as const;

/** `combat_event` events. */
export const COMBAT_EVENTS = {
  enterCombat: 0,
  endCombat: 1,
  entityDead: 2,
} as const;

/** `player_info` actions. */
export const PLAYER_INFO_ACTIONS = {
  addPlayer: 0,
  updateGameMode: 1,
  updateLatency: 2,
  updateDisplayName: 3,
  removePlayer: 4,
} as const;

/** `scoreboard_team` modes. */
export const TEAM_MODES = {
  create: 0,
  remove: 1,
  update: 2,
  addPlayers: 3,
  removePlayers: 4,
} as const;

/** Bits of a team's friendly flags. */
export const TEAM_FRIENDLY_FLAGS = {
  friendlyFire: 0x01,
  seeFriendlyInvisibles: 0x02,
} as const;

/** `resource_pack_receive` results. */
export const RESOURCE_PACK_RESULTS = {
  loaded: 0,
  declined: 1,
  failed: 2,
  accepted: 3,
} as const;

/** `tile_entity_data` actions: which block entity the NBT describes. */
export const TILE_ENTITY_ACTIONS = {
  mobSpawner: 1,
  commandBlock: 2,
  beacon: 3,
  skull: 4,
  flowerPot: 5,
  banner: 6,
} as const;

/** `world_event` (effect) ids, as the 1.8 client plays them (`RenderGlobal.playAuxSFX`). */
export const WORLD_EVENTS = {
  dispenserDispense: 1000,
  dispenserFail: 1001,
  dispenserShoot: 1002,
  doorToggle: 1003,
  fireExtinguish: 1004,
  playRecord: 1005,
  ghastCharge: 1007,
  ghastShoot: 1008,
  blazeShoot: 1009,
  zombieAttackWoodenDoor: 1010,
  zombieAttackIronDoor: 1011,
  zombieBreakWoodenDoor: 1012,
  witherSpawn: 1013,
  witherShoot: 1014,
  batTakeoff: 1015,
  zombieInfect: 1016,
  zombieCure: 1017,
  dragonDeath: 1018,
  anvilBreak: 1020,
  anvilUse: 1021,
  anvilLand: 1022,
  dispenserSmoke: 2000,
  blockBreak: 2001,
  splashPotion: 2002,
  eyeOfEnderBreak: 2003,
  mobSpawn: 2004,
  bonemeal: 2005,
} as const;

/** Every name in a constants table, as a type. */
export type ConstantName<TTable extends Readonly<Record<string, number>>> =
  keyof TTable & string;

/** A table turned around: value to name. */
export function namesOf<TTable extends Readonly<Record<string, number>>>(
  table: TTable,
): ReadonlyMap<number, ConstantName<TTable>> {
  return new Map(
    Object.entries(table).map(([name, value]) => [
      value,
      name as ConstantName<TTable>,
    ]),
  );
}
