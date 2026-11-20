/**
 * @module constants
 * Global constants: tile sizes, physics values, and the custom 16-color palette.
 * All graphics are drawn procedurally – no external image assets.
 */

/** Logical tile size in canvas pixels (each "pixel" is drawn 2× via CSS scaling). */
export const TILE_SIZE = 32;

/** Canvas render resolution */
export const CANVAS_W = 640;
export const CANVAS_H = 400;

/** Gravitational acceleration (pixels/s²) */
export const GRAVITY = 1400;

/** Maximum fall speed (pixels/s) */
export const MAX_FALL_SPEED = 800;

/** Coyote-time window in seconds */
export const COYOTE_TIME = 0.1;

/** Jump-buffer window in seconds */
export const JUMP_BUFFER_TIME = 0.1;

/** Fixed physics timestep */
export const FIXED_DT = 1 / 60;

// ---------------------------------------------------------------------------
// Tile IDs
// ---------------------------------------------------------------------------
export const TILE_EMPTY    = 0;
export const TILE_SOLID    = 1;   // full solid block
export const TILE_PLATFORM = 2;   // one-way platform (can jump through)
export const TILE_SPIKE    = 3;   // instant-kill hazard
export const TILE_GOAL     = 4;   // level exit flag tile

// ---------------------------------------------------------------------------
// Own 16-colour palette — inspired by the 8-bit era, entirely original
// ---------------------------------------------------------------------------
/** @type {string[]} */
export const PALETTE = [
  '#11131A', // 0  near-black
  '#22262D', // 1  charcoal
  '#353B42', // 2  slate
  '#59656D', // 3  steel
  '#83969B', // 4  cool grey
  '#B4C4BF', // 5  pale grey-green
  '#E7E2D3', // 6  warm white
  '#F9F2DF', // 7  paper
  '#332820', // 8  deep brown
  '#75513D', // 9  cardboard
  '#D3A94A', // 10 price-label gold
  '#B34235', // 11 retail red
  '#E87835', // 12 bread orange
  '#557A52', // 13 evergreen
  '#84B5A0', // 14 mint
  '#E4A6B0', // 15 holiday pink
];

// Convenient named colour aliases (indexes into PALETTE)
export const COL = {
  BLACK:      0,
  NIGHT:      1,
  ROYAL:      2,
  CORN:       3,
  SKY:        4,
  PALE:       5,
  WHITE:      6,
  GREY:       7,
  DARK:       8,
  BROWN:      9,
  GOLD:       10,
  RED:        11,
  ORANGE:     12,
  GREEN:      13,
  MINT:       14,
  HOLIDAY:    15,
};

/** Returns the hex colour string for a palette index. */
export function col(index) {
  return PALETTE[index & 0xf];
}
