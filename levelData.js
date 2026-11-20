import { TILE_EMPTY, TILE_SOLID, TILE_PLATFORM, TILE_SPIKE, TILE_GOAL } from './constants.js';

const DEPARTMENTS = [
  {
    name: 'Level 1 – Entrén & Nybakat',
    sign: 'ENTRANCE  •  BAKERY  •  FRESH BREAD',
    theme: { wall: 9, ceiling: 7, shelf: 8, floor: 9, accent: 12, sign: 10, holiday: 11, cold: 4, variety: 0, signText: 'BAKERY', shortSign: 'FRESH BREAD' },
    columns: 80,
    timeLimit: 110,
    platforms: [[5, 9, 9], [11, 15, 8], [17, 22, 9], [29, 34, 8], [36, 38, 9], [46, 50, 9], [51, 55, 8], [58, 63, 9], [68, 72, 8]],
    crates: [10, 27, 56, 73],
    hazards: [21, 45, 63],
    collectibles: [
      ['cat-ears', 3, 10], ['yarn', 7, 8], ['bag-bags', 13, 7],
      ['cat-mug', 18, 8], ['coupon', 25, 10], ['cat-photo', 31, 7],
      ['catnip', 39, 10], ['cat-gift', 52, 7], ['open-cat-food', 66, 10],
      ['toy-mouse', 74, 10]
    ],
    powerUps: [{ x: 35, y: 10, id: 'folk-beer' }],
    enemies: [
      { type: 'ground', x: 14, y: 10, speed: 54, variant: 'cart', patrol: [13, 17] }
    ]
  },
  {
    name: 'Level 2 – Kött & Fisk',
    sign: 'MEAT  •  SEAFOOD  •  DELI',
    theme: { wall: 3, ceiling: 6, shelf: 2, floor: 4, accent: 11, sign: 7, holiday: 11, cold: 5, variety: 1, signText: 'SEAFOOD', shortSign: 'MEAT & FISH' },
    columns: 86,
    timeLimit: 125,
    platforms: [[5, 9, 9], [11, 15, 8], [18, 23, 9], [28, 32, 8], [35, 40, 9], [47, 51, 8], [54, 57, 9], [66, 70, 8], [73, 78, 9]],
    crates: [14, 27, 42, 80],
    hazards: [21, 22, 37, 51, 52, 64],
    collectibles: [
      ['cat-food', 3, 10], ['open-cat-food', 12, 7], ['porcelain-cat', 19, 8],
      ['cat-photo', 26, 10], ['litter', 31, 7], ['catnip', 39, 10],
      ['cat-gift', 48, 7], ['slipper', 57, 8], ['bag-bags', 62, 10],
      ['cat-mug', 69, 7], ['toy-mouse', 77, 8], ['yarn', 83, 10]
    ],
    powerUps: [{ x: 44, y: 10, id: 'folk-beer' }],
    enemies: [
      { type: 'ground', x: 16, y: 10, speed: 62, variant: 'cooler', patrol: [15, 19] },
      { type: 'ground', x: 70, y: 10, speed: 70, variant: 'cooler', patrol: [68, 72] }
    ]
  },
  {
    name: 'Level 3 – Konservkaos',
    sign: 'CANNED GOODS  •  MEGA SAVINGS',
    theme: { wall: 2, ceiling: 7, shelf: 8, floor: 3, accent: 10, sign: 11, holiday: 13, cold: 4, variety: 2, signText: 'CANNED GOODS', shortSign: 'MEGA SAVINGS' },
    columns: 94,
    timeLimit: 140,
    platforms: [[5, 9, 9], [11, 15, 8], [17, 21, 7], [23, 28, 8], [30, 34, 7], [44, 48, 8], [50, 54, 7], [56, 61, 8], [65, 70, 9], [72, 76, 8], [78, 83, 7]],
    crates: [13, 26, 35, 49, 62, 88],
    hazards: [20, 21, 33, 43, 44, 58, 69, 82],
    collectibles: [
      ['cat-food', 3, 10], ['catnip', 8, 8], ['toy-mouse', 13, 7],
      ['coupon', 19, 6], ['slipper', 25, 7], ['yarn', 31, 6],
      ['open-cat-food', 38, 10], ['porcelain-cat', 45, 7],
      ['cat-photo', 52, 6], ['cat-gift', 60, 7], ['cat-mug', 67, 8],
      ['bag-bags', 73, 7], ['litter', 85, 10], ['cat-ears', 91, 10]
    ],
    powerUps: [{ x: 40, y: 10, id: 'folk-beer' }],
    enemies: [
      { type: 'ground', x: 15, y: 10, speed: 68, variant: 'can', patrol: [15, 18] },
      { type: 'ground', x: 52, y: 10, speed: 74, variant: 'can', patrol: [51, 55] },
      { type: 'jump', x: 74, y: 5, variant: 'can' }
    ]
  },
  {
    name: 'Level 4 – Dryckesdepån',
    sign: 'DRINKS  •  SODA  •  FOLKÖL',
    theme: { wall: 1, ceiling: 6, shelf: 2, floor: 3, accent: 14, sign: 10, holiday: 12, cold: 4, variety: 3, signText: 'DRINKS', shortSign: 'FOLKÖL' },
    columns: 100,
    timeLimit: 155,
    platforms: [[5, 9, 9], [11, 15, 8], [17, 21, 7], [23, 28, 8], [30, 34, 7], [38, 43, 9], [45, 50, 8], [52, 57, 7], [60, 65, 8], [68, 73, 9], [75, 80, 8], [82, 84, 7]],
    crates: [12, 25, 39, 54, 66, 88],
    hazards: [17, 18, 30, 42, 43, 56, 68, 69, 82, 92, 93],
    collectibles: [
      ['cat-pillow', 3, 10], ['cat-mug', 8, 8], ['cat-photo', 13, 7],
      ['cat-gift', 19, 6], ['yarn', 26, 7], ['cat-ears', 33, 6],
      ['toy-mouse', 40, 10], ['cat-gift', 47, 7], ['porcelain-cat', 55, 6],
      ['cat-pillow', 62, 7], ['cat-mug', 71, 8], ['cat-photo', 77, 7],
      ['catnip', 85, 6], ['coupon', 89, 10], ['slipper', 95, 10],
      ['litter', 97, 10]
    ],
    powerUps: [
      { x: 35, y: 10, id: 'folk-beer' },
      { x: 75, y: 7, id: 'folk-beer' }
    ],
    enemies: [
      { type: 'ground', x: 14, y: 10, speed: 72, variant: 'cart', patrol: [14, 16] },
      { type: 'ground', x: 45, y: 10, speed: 78, variant: 'cart', patrol: [44, 47] },
      { type: 'jump', x: 77, y: 5, variant: 'bottle' },
      { type: 'ground', x: 84, y: 10, speed: 82, variant: 'cart', patrol: [84, 86] }
    ]
  },
  {
    name: 'Level 5 – Julruschen',
    sign: 'CHRISTMAS  •  CHECKOUT  •  EXIT',
    theme: { wall: 8, ceiling: 7, shelf: 13, floor: 9, accent: 11, sign: 10, holiday: 13, cold: 5, variety: 4, signText: 'CHRISTMAS', shortSign: 'CHECKOUT' },
    columns: 116,
    timeLimit: 185,
    platforms: [[5, 9, 9], [11, 13, 8], [17, 21, 7], [24, 28, 9], [30, 34, 8], [36, 41, 7], [44, 49, 9], [51, 53, 8], [58, 63, 7], [66, 71, 9], [73, 78, 8], [80, 85, 7], [90, 95, 9], [97, 102, 8], [104, 109, 9]],
    crates: [25, 38, 70, 81, 90, 106, 111],
    hazards: [19, 20, 33, 47, 48, 60, 61, 76, 88, 89, 101, 102],
    collectibles: [
      ['cat-gift', 3, 10], ['porcelain-cat', 8, 8], ['cat-ears', 13, 7],
      ['cat-mug', 19, 6], ['toy-mouse', 27, 8], ['slipper', 34, 7],
      ['cat-food', 42, 10], ['coupon', 49, 8], ['bag-bags', 56, 7],
      ['catnip', 63, 6], ['cat-gift', 71, 8], ['porcelain-cat', 78, 7],
      ['open-cat-food', 82, 6], ['yarn', 85, 6], ['cat-photo', 92, 10],
      ['cat-mug', 99, 7], ['cat-ears', 105, 8], ['big-cat-photo', 109, 8]
    ],
    powerUps: [
      { x: 58, y: 10, id: 'folk-beer' },
      { x: 84, y: 6, id: 'folk-beer' }
    ],
    enemies: [
      { type: 'ground', x: 14, y: 10, speed: 76, variant: 'cart', patrol: [13, 16] },
      { type: 'ground', x: 43, y: 10, speed: 82, variant: 'can', patrol: [41, 45] },
      { type: 'ground', x: 65, y: 10, speed: 86, variant: 'cart', patrol: [64, 68] },
      { type: 'ground', x: 83, y: 10, speed: 88, variant: 'cart', patrol: [83, 86] },
      { type: 'ground', x: 96, y: 10, speed: 90, variant: 'cart', patrol: [93, 97] }
    ]
  }
];

function createTiles(config) {
  const rows = 12;
  const tiles = Array.from({ length: rows }, () => Array(config.columns).fill(TILE_EMPTY));

  for (let col = 0; col < config.columns; col++) tiles[rows - 1][col] = TILE_SOLID;
  for (const [start, end, row] of config.platforms) {
    for (let col = start; col <= end; col++) tiles[row][col] = TILE_PLATFORM;
  }
  for (const col of config.crates) tiles[10][col] = TILE_SOLID;
  for (const col of config.hazards) tiles[10][col] = TILE_SPIKE;
  tiles[9][config.columns - 2] = TILE_GOAL;
  return tiles;
}

export const LEVEL_DATA = DEPARTMENTS.map((department, index) => ({
  ...department,
  department: department.sign,
  tiles: createTiles(department),
  gems: department.collectibles.map(([id, x, y]) => ({ id, x, y })),
  levelIndex: index
}));
