/**
 * @module sprites
 * Procedural pixel-art sprite renderer.
 *
 * Every graphic in the game is drawn directly onto the canvas from small
 * pixel matrices — no external image files are used.
 * Colour indices reference the custom 16-colour PALETTE from constants.js.
 */

import { PALETTE, TILE_SIZE, CANVAS_W, CANVAS_H } from './constants.js';

const PIXEL_COLOURS = {
  '.': -1, a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7,
  h: 8, i: 9, j: 10, k: 11, l: 12, m: 13, n: 14, o: 15
};

function pixelArt(rows) {
  const width = rows[0].length;
  if (rows.some(row => row.length !== width)) throw new TypeError('Pixel-art rows must have equal widths.');
  return rows.map(row => [...row].map(pixel => {
    if (!(pixel in PIXEL_COLOURS)) throw new TypeError(`Unknown pixel-art colour: ${pixel}`);
    return PIXEL_COLOURS[pixel];
  }));
}

const DETAIL = {
  outline: '#34262C',
  hairShadow: '#625762',
  hair: '#A49AA2',
  hairLight: '#D5C9CA',
  hairBright: '#F3E4DD',
  skinShadow: '#A35C49',
  skin: '#D88968',
  skinLight: '#F0A27F',
  robeShadow: '#8E3B54',
  robeDark: '#AD4D68',
  robe: '#D76582',
  robeLight: '#F08AA0',
  robeBright: '#F8B3B7',
  patch: '#77704C',
  cream: '#F1DFC6',
  gold: '#E7B45A',
  slipper: '#625056',
  slipperLight: '#B9A5A1'
};

const BEER_CAN = pixelArt([
  '.jjjjjj.',
  '.jggggj.',
  '.jgnngj.',
  '.jggggj.',
  '.jggggj.',
  '.jgnngj.',
  '.jggggj.',
  '.jjjjjj.'
]);

const STORE_TILES = {
  floor: pixelArt(['dddddddd', 'd.d.d.d.', 'dddddddd', '.d.d.d.d', 'dddddddd', 'd.d.d.d.', 'dddddddd', '.d.d.d.d']),
  shelf: pixelArt(['aaaaaaaa', 'bbbbbbbb', '........', '........', 'aaaaaaaa', 'bbbbbbbb', '........', '........']),
  crate: pixelArt(['bbbbbbbb', 'bccccccb', 'bcbbcccb', 'bcbcc bcb'.replace(/ /g, ''), 'bcbbcccb', 'bccccccb', 'bbbbbbbb', 'aaaaaaaa']),
  spill: pixelArt(['........', '........', '..nn....', '.nmmn...', 'nnnnnn..', '.nmmnnn.', '..nnnn..', '........']),
  checkout: pixelArt(['.kkkkkk.', '.kggggk.', '.kgnngk.', '.kggggk.', '.kkkkkk.', '..k..k..', '..k..k..', 'hhhhhhhh']),
  beer: BEER_CAN,
  cart: pixelArt(['........', '.bbbbbb.', '.bggggb.', '.bggggb.', '.bbbbbb.', '..a..a..', '.a....a.', '.a....a.']),
  package: pixelArt(['..bbbb..', '.bggggb.', 'bggggggb', 'bggkkggb', 'bggkkggb', 'bggggggb', '.bggggb.', '..bbbb..']),
  catfood: pixelArt(['..jjjj..', '.jggggj.', '.jgnngj.', '.jggggj.', '.jggggj.', '.jggggj.', '.jggggj.', '..jjjj..']),
  yarn: pixelArt(['...nn...', '..nmmn..', '.nmmmmn.', 'nmmmnnmn', 'nmmmmmmn', '.nmmmmn.', '..nmmn..', '...nn...']),
  mouse: pixelArt(['..nn....', '.nmnn...', 'nmmmnn..', 'nmmmmmn.', 'nmmmmmn.', '.nmmmmn.', '..nnnn..', '...nn...'])
};

export const COLLECTIBLES = {
  'cat-food': { name: 'Cat food tin', value: 100, sprite: pixelArt(['..jjjj..', '.jggggj.', 'jggkkggj', 'jggkkggj', 'jggggggj', 'jggggggj', '.jggggj.', '..jjjj..']) },
  'open-cat-food': { name: 'Opened cat food', value: 100, sprite: pixelArt(['..jjjj..', '.j....j.', 'j......j', 'jggkkggj', 'jggggggj', 'jggggggj', '.jggggj.', '..jjjj..']) },
  yarn: { name: 'Ball of yarn', value: 100, sprite: STORE_TILES.yarn },
  catnip: { name: 'Catnip', value: 200, sprite: pixelArt(['...ll...', '..lmml..', '.llmmll.', '..mmmm..', '..mmmm..', '.nnnnnn.', '.nnnnnn.', '...nn...']) },
  'cat-pillow': { name: 'Little cat pillow', value: 100, sprite: pixelArt(['.jjjjjj.', 'jggggggj', 'jggnnngj', 'jggggggj', 'jggggggj', 'jggggggj', 'jggggggj', '.jjjjjj.']) },
  'porcelain-cat': { name: 'Porcelain cat', value: 200, sprite: pixelArt(['...nn...', '..nmmn..', '.nmmmn..', '.nmnmn..', '.nnnnnn.', '..n..n..', '.nn..nn.', '........']) },
  'cat-photo': { name: 'Framed cat photo', value: 200, sprite: pixelArt(['jjjjjjjj', 'jggggggj', 'jgnnnggj', 'jgnnnngj', 'jggggggj', 'jggggggj', 'jggggggj', 'jjjjjjjj']) },
  'big-cat-photo': { name: 'Giant framed cat photo', value: 500, sprite: pixelArt(['jjjjjjjj', 'jggggggj', 'jgnnnngj', 'jgnnngnj', 'jgnnnngj', 'jggggggj', 'jggggggj', 'jjjjjjjj']) },
  'cat-mug': { name: 'Cat-patterned mug', value: 100, sprite: pixelArt(['.jjjjj..', '.jggggj.', '.jgnngj.', '.jggggj.', '.jggggj.', '.jggggjj', '..jjjj..', '........']) },
  'cat-ears': { name: 'Cat ear headband', value: 100, sprite: pixelArt(['.n....n.', 'nn....nn', '.nn..nn.', '..nnnn..', '..n..n..', '..n..n..', '........', '........']) },
  slipper: { name: 'Leopard-print slipper', value: 200, sprite: pixelArt(['........', '........', '.jjjjjj.', 'jggggggg', 'jgkgkgkg', 'jggggggg', '.jjjjjjj', '........']) },
  coupon: { name: 'Half-broken coupon', value: 100, sprite: pixelArt(['jjjjjjjj', 'jggggggj', 'jggkkggj', 'jggggggj', 'jggkkggj', 'jggggggj', 'jggggggj', 'jjjjjjjj']) },
  'bag-bags': { name: 'Bag of plastic bags', value: 200, sprite: pixelArt(['...nn...', '..nmmn..', '.nmmmmn.', '.nmnmmn.', '.nmmmmn.', '..nmmn..', '..n..n..', '..n..n..']) },
  litter: { name: 'Small bag of cat litter', value: 100, sprite: pixelArt(['..jjjj..', '.jggggj.', 'jggggggj', 'jggkkggj', 'jggggggj', 'jggggggj', '.jggggj.', '..jjjj..']) },
  'cat-gift': { name: 'Christmas gift for the cat', value: 200, sprite: pixelArt(['...nn...', '.nnnnnn.', 'nnnllnnn', '.nnnnnn.', '.jjjjjj.', '.jjlljj.', '.jjlljj.', '.jjjjjj.']) },
  'toy-mouse': { name: 'Toy mouse', value: 100, sprite: STORE_TILES.mouse }
};

function drawPackage(ctx, x, y, w, h, body, label) {
  ctx.fillStyle = DETAIL.outline;
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = body;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255,244,215,0.52)';
  ctx.fillRect(x + 1, y + 1, Math.max(1, w * 0.18), h - 2);
  ctx.fillStyle = 'rgba(30,24,28,0.28)';
  ctx.fillRect(x + w - Math.max(1, w * 0.2), y + 1, Math.max(1, w * 0.2), h - 2);
  ctx.fillStyle = label;
  ctx.fillRect(x + 2, y + Math.floor(h * 0.42), w - 4, Math.max(2, Math.floor(h * 0.3)));
  ctx.fillStyle = DETAIL.outline;
  ctx.fillRect(x + 3, y + Math.floor(h * 0.49), Math.max(2, w - 7), 1);
}

export function drawStoreBackground(ctx, cameraX, theme = {}, time = 0) {
  const wall = PALETTE[theme.wall ?? 2];
  const ceiling = PALETTE[theme.ceiling ?? 7];
  const shelf = PALETTE[theme.shelf ?? 8];
  const accent = PALETTE[theme.accent ?? 10];
  const sign = PALETTE[theme.sign ?? 11];
  const offset = Math.round(cameraX * 0.18);

  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = ceiling;
  ctx.fillRect(0, 0, CANVAS_W, 58);
  ctx.fillStyle = PALETTE[theme.floor ?? 9];
  ctx.fillRect(0, 290, CANVAS_W, CANVAS_H - 290);
  ctx.fillStyle = 'rgba(35,25,24,0.14)';
  for (let x = -((offset % 32) + 32); x < CANVAS_W + 32; x += 32) {
    ctx.fillRect(x, 291, 1, CANVAS_H - 291);
    ctx.fillRect(x + 16, 316, 8, 1);
    ctx.fillRect(x + 5, 358, 12, 1);
  }
  ctx.fillStyle = 'rgba(255,235,192,0.13)';
  for (let x = -((offset % 64) + 64); x < CANVAS_W + 64; x += 64) {
    ctx.fillRect(x + 6, 304, 9, 2);
    ctx.fillRect(x + 34, 340, 5, 2);
    ctx.fillRect(x + 20, 382, 12, 2);
  }
  ctx.fillStyle = PALETTE[theme.shelf ?? 8];
  ctx.fillRect(0, 56, CANVAS_W, 8);

  for (let x = -((offset % 170) + 170); x < CANVAS_W + 170; x += 170) {
    ctx.fillStyle = DETAIL.outline;
    ctx.fillRect(x + 22, 76, 122, 192);
    ctx.fillStyle = PALETTE[1];
    ctx.fillRect(x + 26, 80, 114, 184);
    ctx.fillStyle = shelf;
    ctx.fillRect(x + 32, 86, 102, 170);
    ctx.fillStyle = PALETTE[3];
    ctx.fillRect(x + 25, 82, 3, 180);
    ctx.fillRect(x + 138, 82, 3, 180);
    for (let y = 101; y < 246; y += 38) {
      ctx.fillStyle = DETAIL.outline;
      ctx.fillRect(x + 29, y + 2, 108, 5);
      ctx.fillStyle = PALETTE[theme.accent ?? 10];
      ctx.fillRect(x + 29, y, 108, 4);
      ctx.fillStyle = 'rgba(255,245,219,0.38)';
      ctx.fillRect(x + 29, y, 108, 1);
      for (let item = 0; item < 6; item++) {
        const colour = PALETTE[(theme.variety + item * 3 + Math.floor(y / 38)) % 5 + 9];
        const productX = x + 34 + item * 16;
        const productY = y - 15 + (item % 2);
        drawPackage(ctx, productX, productY, 10, 13, colour, PALETTE[theme.holiday ?? 11]);
      }
    }

    ctx.fillStyle = DETAIL.outline;
    ctx.fillRect(x + 16, 63, 134, 27);
    ctx.fillStyle = sign;
    ctx.fillRect(x + 18, 65, 130, 23);
    ctx.fillStyle = 'rgba(255,245,219,0.35)';
    ctx.fillRect(x + 20, 67, 126, 2);
    ctx.fillStyle = DETAIL.outline;
    ctx.fillRect(x + 24, 84, 3, 2);
    ctx.fillRect(x + 140, 84, 3, 2);
    ctx.fillStyle = PALETTE[7];
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(theme.signText ?? 'SALE', x + 83, 80, 124);
  }

  for (let x = -((offset % 210) + 210); x < CANVAS_W + 210; x += 210) {
    ctx.fillStyle = DETAIL.outline;
    ctx.fillRect(x + 18, 18, 122, 11);
    ctx.fillStyle = PALETTE[3];
    ctx.fillRect(x + 20, 20, 118, 7);
    ctx.fillStyle = Math.sin(time * 5 + x) > 0.97 ? PALETTE[5] : PALETTE[7];
    ctx.fillRect(x + 23, 22, 112, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.fillRect(x + 24, 22, 108, 1);
    ctx.fillStyle = PALETTE[2];
    ctx.fillRect(x + 3, 39, 155, 5);
    ctx.fillStyle = PALETTE[4];
    ctx.fillRect(x + 10, 40, 142, 1);
  }

  ctx.fillStyle = PALETTE[theme.holiday ?? 11];
  for (let x = -((offset % 32) + 32); x < CANVAS_W + 32; x += 32) {
    const y = 57 + Math.round(Math.sin((x + offset) / 42) * 5);
    ctx.fillRect(x, y, 4, 4);
    ctx.fillStyle = PALETTE[theme.sign ?? 10];
    ctx.fillRect(x + 5, y + 3, 3, 3);
    ctx.fillStyle = PALETTE[theme.holiday ?? 11];
  }

  ctx.textAlign = 'left';
}

export function drawStoreFixtures(ctx, minCol, maxCol, theme = {}, time = 0) {
  const first = Math.floor(minCol / 18) * 18;
  for (let col = first; col <= maxCol; col += 18) {
    const x = col * TILE_SIZE;
    ctx.fillStyle = DETAIL.outline;
    ctx.fillRect(x + 6, 116, 170, 116);
    ctx.fillStyle = PALETTE[theme.shelf ?? 8];
    ctx.fillRect(x + 9, 119, 164, 110);
    ctx.fillStyle = PALETTE[2];
    ctx.fillRect(x + 13, 123, 156, 102);
    ctx.fillStyle = PALETTE[3];
    ctx.fillRect(x + 15, 125, 3, 96);
    ctx.fillRect(x + 164, 125, 3, 96);
    for (let row = 0; row < 3; row++) {
      const y = 130 + row * 29;
      ctx.fillStyle = DETAIL.outline;
      ctx.fillRect(x + 12, y + 23, 160, 5);
      ctx.fillStyle = PALETTE[theme.accent ?? 10];
      ctx.fillRect(x + 12, y + 22, 158, 4);
      ctx.fillStyle = 'rgba(255,244,215,0.42)';
      ctx.fillRect(x + 12, y + 22, 158, 1);
      for (let item = 0; item < 7; item++) {
        const colour = (theme.variety + row + item * 2) % 6 + 9;
        const productHeight = item % 3 === 0 ? 18 : 15;
        const productY = y + 22 - productHeight - (item % 2);
        drawPackage(
          ctx,
          x + 18 + item * 21,
          productY,
          13,
          productHeight,
          PALETTE[colour],
          PALETTE[item % 2 ? theme.holiday ?? 11 : theme.sign ?? 10]
        );
        ctx.fillStyle = PALETTE[7];
        ctx.fillRect(x + 21 + item * 21, productY + productHeight - 3, 2, 1);
      }
    }
    ctx.fillStyle = DETAIL.outline;
    ctx.fillRect(x + 25, 100, 130, 21);
    ctx.fillStyle = PALETTE[theme.sign ?? 10];
    ctx.fillRect(x + 27, 102, 126, 17);
    ctx.fillStyle = 'rgba(255,245,219,0.4)';
    ctx.fillRect(x + 29, 104, 122, 2);
    ctx.fillStyle = PALETTE[7];
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(theme.shortSign ?? 'MARKET', x + 90, 114, 118);

    if (theme.variety === 1 || theme.variety === 3) {
      ctx.fillStyle = DETAIL.outline;
      ctx.fillRect(x + 180, 140, 42, 94);
      ctx.fillStyle = PALETTE[theme.cold ?? 4];
      ctx.fillRect(x + 182, 142, 38, 90);
      ctx.fillStyle = PALETTE[5];
      ctx.fillRect(x + 187, 148, 28, 72);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(x + 190, 151, 3, 65);
      ctx.fillStyle = DETAIL.outline;
      ctx.fillRect(x + 184, 164, 34, 2);
      ctx.fillRect(x + 184, 187, 34, 2);
      ctx.fillStyle = PALETTE[theme.accent ?? 10];
      ctx.fillRect(x + 182, 137, 38, 5);
      ctx.fillStyle = PALETTE[7];
      ctx.fillRect(x + 211, 176, 3, 6);
    }

    if (col % 36 === 0) {
      const sparkle = Math.sin(time * 3 + col) > 0 ? 11 : 10;
      ctx.fillStyle = PALETTE[theme.holiday ?? sparkle];
      ctx.fillRect(x + 4, 84 + Math.round(Math.sin(time * 2 + col) * 2), 8, 8);
      ctx.fillStyle = PALETTE[theme.sign ?? 10];
      ctx.fillRect(x + 2, 91, 12, 2);

      ctx.fillStyle = PALETTE[9];
      ctx.fillRect(x + 187, 268, 44, 6);
      ctx.fillRect(x + 194, 274, 4, 5);
      ctx.fillRect(x + 220, 274, 4, 5);
      ctx.fillStyle = PALETTE[7];
      ctx.fillRect(x + 192, 270, 34, 1);
      ctx.fillStyle = PALETTE[theme.accent ?? 10];
      ctx.fillRect(x + 194, 246, 30, 22);
      ctx.fillStyle = PALETTE[theme.shelf ?? 8];
      ctx.fillRect(x + 197, 250, 24, 15);
      ctx.fillStyle = PALETTE[theme.sign ?? 10];
      ctx.fillRect(x + 200, 252, 18, 3);
      ctx.fillStyle = PALETTE[7];
      ctx.fillRect(x + 201, 257, 12, 2);
    }

    if (theme.variety === 0 && col === 0) {
      ctx.fillStyle = PALETTE[4];
      ctx.fillRect(x + 2, 128, 42, 126);
      ctx.fillStyle = PALETTE[7];
      ctx.fillRect(x + 5, 132, 17, 119);
      ctx.fillRect(x + 24, 132, 17, 119);
      ctx.fillStyle = PALETTE[theme.holiday ?? 11];
      ctx.fillRect(x + 17, 151, 14, 14);
    }
  }
  ctx.textAlign = 'left';
}

// ---------------------------------------------------------------------------
// Low-level pixel-matrix renderer
// ---------------------------------------------------------------------------

/**
 * Draws a pixel matrix scaled to fit a given rectangle on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number[][]} matrix  - 2-D array of palette indices; -1 = transparent
 * @param {number} x           - Canvas X (top-left)
 * @param {number} y           - Canvas Y (top-left)
 * @param {number} w           - Target draw width  (default: TILE_SIZE)
 * @param {number} h           - Target draw height (default: TILE_SIZE)
 * @param {boolean} [flipX]    - Mirror horizontally
 */
export function drawPixels(ctx, matrix, x, y, w = TILE_SIZE, h = TILE_SIZE, flipX = false) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const pw = w / cols;
  const ph = h / rows;

  ctx.save();
  if (flipX) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    x = 0;
    y = 0;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = matrix[r][c];
      if (idx < 0) continue;          // transparent
      ctx.fillStyle = PALETTE[idx & 0xf];
      ctx.fillRect(
        (flipX ? 0 : x) + c * pw,
        (flipX ? 0 : y) + r * ph,
        pw, ph
      );
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Sprite definitions (pixel matrices, 8×8 unless stated)
// ---------------------------------------------------------------------------

// Solid ground tile (stone / brick look)
const TILE_SOLID_MAT = [
  [ 9, 9, 9, 9, 9, 9, 9, 9],
  [ 9,10,10, 9,10,10, 9, 9],
  [ 9,10,10, 9,10,10, 9, 9],
  [ 8, 8, 8, 8, 8, 8, 8, 8],
  [ 9, 9,10,10, 9, 9,10, 9],
  [ 9, 9,10,10, 9, 9,10, 9],
  [ 9, 9,10,10, 9, 9,10, 9],
  [ 8, 8, 8, 8, 8, 8, 8, 8],
];

// One-way platform tile (wooden plank look)
const TILE_PLATFORM_MAT = [
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [ 9,10, 9,10, 9,10, 9,10],
  [ 9, 9,10, 9,10, 9, 9, 9],
  [ 8, 8, 8, 8, 8, 8, 8, 8],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
];

// Gem / collectible (diamond shape, cyan/mint)
const GEM_MAT = [
  [-1,-1, 4, 4,-1,-1,-1,-1],
  [-1, 4, 5,14, 4,-1,-1,-1],
  [ 4, 5,14,14, 5, 4,-1,-1],
  [ 4,14,14,14,14, 4,-1,-1],
  [-1, 4,14,14, 4,-1,-1,-1],
  [-1,-1, 4, 4,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
];

// Spike hazard tile (pointing up)
const SPIKE_MAT = [
  [-1, 8,-1,-1,-1, 8,-1,-1],
  [-1, 8, 8,-1, 8, 8,-1,-1],
  [-1, 7, 8,-1, 7, 8,-1,-1],
  [ 8, 7, 8, 8, 7, 8, 8, 8],
  [ 8, 7, 7, 7, 7, 7, 7, 8],
  [ 8, 8, 8, 8, 8, 8, 8, 8],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
];

// Goal flag (pole + flag)
const FLAG_MAT = [
  [-1,-1,13,13,13,-1,-1,-1],
  [-1,-1,13, 6, 6,13,-1,-1],
  [-1,-1,13, 6, 6,-1,-1,-1],
  [-1,-1,13,-1,-1,-1,-1,-1],
  [-1,-1,13,-1,-1,-1,-1,-1],
  [-1,-1,13,-1,-1,-1,-1,-1],
  [-1,-1,13,-1,-1,-1,-1,-1],
  [ 8, 8,13, 8, 8, 8, 8, 8],
];

// Legacy crystal power-up (unused)
const PRISMA_MAT = [
  [-1,-1,15,15,-1,-1,-1,-1],
  [-1,15, 6,15,15,-1,-1,-1],
  [15, 6,15,15, 6,15,-1,-1],
  [15,15,15,15,15,15,-1,-1],
  [-1,15,15,15,15,-1,-1,-1],
  [-1,-1,15,15,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
];

// ---------------------------------------------------------------------------
// Player sprites (8×12 logical pixels, drawn at variable size)
// Normal mode: cornflower/blue
// ---------------------------------------------------------------------------

// Normal mode — idle / walking frames
const PLAYER_NORMAL = [
  [-1,-1, 3, 3, 3,-1,-1,-1],  // hair
  [-1, 3, 5, 5, 5, 3,-1,-1],  // face
  [-1, 3, 5,11, 5, 3,-1,-1],  // face w/ eye
  [-1, 3, 3, 3, 3, 3,-1,-1],  // chin
  [-1, 3, 2, 3, 2, 3,-1,-1],  // body
  [ 3, 2, 2, 2, 2, 2, 3,-1],  // body wide
  [ 3, 2, 2, 2, 2, 2, 3,-1],  // body wide
  [-1, 3, 3, 3, 3, 3,-1,-1],  // waist
  [-1, 2, 9,-1, 9, 2,-1,-1],  // legs apart
  [-1, 2, 9,-1, 9, 2,-1,-1],  // legs apart
  [-1, 2, 9,-1, 9, 2,-1,-1],  // legs
  [-1, 9, 9,-1, 9, 9,-1,-1],  // feet
];

// Legacy alternate player palette (unused)
const PLAYER_PRISMA = [
  [-1,-1,15,15,15,-1,-1,-1],
  [-1,15, 5, 5, 5,15,-1,-1],
  [-1,15, 5,10, 5,15,-1,-1],
  [-1,15,15,15,15,15,-1,-1],
  [-1,14,15,14,15,14,-1,-1],
  [15,14,14,14,14,14,15,-1],
  [15,14,14,14,14,14,15,-1],
  [-1,15,15,15,15,15,-1,-1],
  [-1,14,15,-1,15,14,-1,-1],
  [-1,14,15,-1,15,14,-1,-1],
  [-1,14,15,-1,15,14,-1,-1],
  [-1,15,15,-1,15,15,-1,-1],
];

// Walk frame 2 (legs swapped – reuse matrix with slight offset)
const PLAYER_WALK2_NORMAL = [
  [-1,-1, 3, 3, 3,-1,-1,-1],
  [-1, 3, 5, 5, 5, 3,-1,-1],
  [-1, 3, 5,11, 5, 3,-1,-1],
  [-1, 3, 3, 3, 3, 3,-1,-1],
  [-1, 3, 2, 3, 2, 3,-1,-1],
  [ 3, 2, 2, 2, 2, 2, 3,-1],
  [ 3, 2, 2, 2, 2, 2, 3,-1],
  [-1, 3, 3, 3, 3, 3,-1,-1],
  [-1, 9, 2,-1, 2, 9,-1,-1],
  [-1, 9, 2,-1, 2, 9,-1,-1],
  [-1, 9, 2,-1, 2, 9,-1,-1],
  [-1, 9, 9,-1, 9, 9,-1,-1],
];

// ---------------------------------------------------------------------------
// Ground enemy (patrol) — orange/red crab-like creature
// ---------------------------------------------------------------------------
const ENEMY_GROUND = [
  [-1, 8,-1,-1,-1,-1, 8,-1],
  [ 8,12,12,12,12,12,12, 8],
  [ 8,12,11,12,11,12,12, 8],
  [ 8,12,12,12,12,12,12, 8],
  [-1, 8,12,12,12,12, 8,-1],
  [-1,-1, 8, 8, 8, 8,-1,-1],
  [-1, 8,-1,-1,-1,-1, 8,-1],
  [-1, 8,-1,-1,-1,-1, 8,-1],
];

// Ground enemy walk frame 2
const ENEMY_GROUND2 = [
  [-1, 8,-1,-1,-1,-1, 8,-1],
  [ 8,12,12,12,12,12,12, 8],
  [ 8,12,11,12,11,12,12, 8],
  [ 8,12,12,12,12,12,12, 8],
  [-1, 8,12,12,12,12, 8,-1],
  [-1,-1, 8, 8, 8, 8,-1,-1],
  [ 8,-1,-1,-1,-1,-1,-1, 8],
  [ 8,-1,-1,-1,-1,-1,-1, 8],
];

// Jumping enemy — green bouncy slime
const ENEMY_JUMP = [
  [-1,-1,13,13,13,13,-1,-1],
  [-1,13,14,14,14,13,-1,-1],
  [13,14,14,11,14,14,13,-1],
  [13,14,14,14,14,14,13,-1],
  [13,13,14,14,14,13,13,-1],
  [-1,13,13,13,13,13,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
];

// Jumping enemy squished frame (on ground)
const ENEMY_JUMP_SQUAT = [
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,13,14,14,14,13,-1,-1],
  [13,14,14,11,14,14,13,-1],
  [13,14,14,14,14,14,13,-1],
  [13,13,14,14,14,13,13,-1],
  [-1,13,13,13,13,13,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1],
];

// ---------------------------------------------------------------------------
// Public draw functions
// ---------------------------------------------------------------------------

/**
 * Draw a solid ground tile.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 */
export function drawTileSolid(ctx, x, y, theme = {}, floor = false) {
  if (floor) {
    ctx.fillStyle = PALETTE[theme.floor ?? 9];
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = 'rgba(25,19,19,0.28)';
    ctx.fillRect(x, y, TILE_SIZE, 2);
    ctx.fillRect(x + 2, y + 8, 1, 21);
    ctx.fillRect(x + 16, y + 3, 1, 9);
    ctx.fillRect(x + 24, y + 17, 1, 12);
    ctx.fillStyle = PALETTE[theme.shelf ?? 8];
    ctx.fillRect(x, y, TILE_SIZE, 4);
    ctx.fillStyle = 'rgba(245,224,190,0.4)';
    ctx.fillRect(x, y + 3, TILE_SIZE, 1);
    ctx.fillStyle = PALETTE[theme.ceiling ?? 7];
    ctx.fillRect(x + ((x / TILE_SIZE) % 2) * 8, y + 9, 8, 2);
    ctx.fillRect(x + (((x / TILE_SIZE) + 1) % 2) * 8 + 16, y + 23, 8, 2);
    return;
  }
  drawPixels(ctx, STORE_TILES.crate, x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'rgba(22,18,19,0.5)';
  ctx.fillRect(x + 4, y + 9, TILE_SIZE - 8, 2);
  ctx.fillRect(x + 4, y + 20, TILE_SIZE - 8, 2);
  ctx.fillStyle = 'rgba(245,224,190,0.55)';
  ctx.fillRect(x + 5, y + 10, TILE_SIZE - 10, 1);
  ctx.fillRect(x + 5, y + 21, TILE_SIZE - 10, 1);
  ctx.fillStyle = PALETTE[10];
  for (const boltX of [4, TILE_SIZE - 7]) {
    ctx.fillRect(x + boltX, y + 5, 2, 2);
    ctx.fillRect(x + boltX, y + TILE_SIZE - 8, 2, 2);
  }
}

/**
 * Draw a one-way platform tile.
 */
export function drawTilePlatform(ctx, x, y, theme = {}) {
  ctx.fillStyle = 'rgba(20,16,19,0.4)';
  ctx.fillRect(x, y + 15, TILE_SIZE, 8);
  ctx.fillStyle = PALETTE[theme.shelf ?? 8];
  ctx.fillRect(x, y + 12, TILE_SIZE, 8);
  ctx.fillStyle = PALETTE[theme.sign ?? 10];
  ctx.fillRect(x, y + 10, TILE_SIZE, 3);
  ctx.fillStyle = 'rgba(255,244,215,0.55)';
  ctx.fillRect(x, y + 10, TILE_SIZE, 1);
  ctx.fillStyle = PALETTE[7];
  ctx.fillRect(x + 4, y + 22, 3, 5);
  ctx.fillRect(x + TILE_SIZE - 7, y + 22, 3, 5);
  ctx.fillStyle = DETAIL.outline;
  ctx.fillRect(x + 5, y + 23, 1, 2);
  ctx.fillRect(x + TILE_SIZE - 6, y + 23, 1, 2);
}

/**
 * Draw a spike hazard tile.
 */
export function drawTileSpike(ctx, x, y) {
  drawPixels(ctx, STORE_TILES.spill, x, y + 8, TILE_SIZE, TILE_SIZE * 0.75);
  ctx.fillStyle = PALETTE[5];
  ctx.fillRect(x + 14, y + 18, 4, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(x + 9, y + 23, 3, 1);
  ctx.fillRect(x + 22, y + 25, 4, 1);
  ctx.fillStyle = 'rgba(20,24,22,0.35)';
  ctx.fillRect(x + 6, y + 28, 22, 2);
}

/**
 * Draw the goal flag tile.
 */
export function drawTileFlag(ctx, x, y, theme = {}) {
  ctx.fillStyle = PALETTE[theme.accent ?? 10];
  ctx.fillRect(x + 1, y + 3, TILE_SIZE - 2, TILE_SIZE - 5);
  ctx.fillStyle = PALETTE[theme.shelf ?? 8];
  ctx.fillRect(x + 4, y + 6, TILE_SIZE - 8, TILE_SIZE - 10);
  ctx.fillStyle = PALETTE[7];
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CHECKOUT', x + TILE_SIZE / 2, y + 19, TILE_SIZE - 4);
  ctx.fillStyle = PALETTE[theme.holiday ?? 11];
  ctx.fillRect(x + 10, y + 22, 12, 3);
  ctx.textAlign = 'left';
}

/**
 * Draw a collectible using the shared collectible data model.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x   Canvas X (centre)
 * @param {number} y   Canvas Y (centre)
 * @param {number} size  Draw size (default TILE_SIZE * 0.7)
 */
export function drawCollectible(ctx, x, y, id = 'cat-food', size = TILE_SIZE * 0.9, theme = {}, time = 0) {
  const collectible = COLLECTIBLES[id] ?? COLLECTIBLES['cat-food'];
  drawPixels(ctx, collectible.sprite, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
  if (theme.variety === 4 && id === 'big-cat-photo' && Math.sin(time * 8) > 0) {
    ctx.fillStyle = PALETTE[theme.sign ?? 10];
    ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), 3, 3);
  }
}

/**
 * Draw the long-can power-up.
 */
export function drawFolkBeer(ctx, x, y, size = TILE_SIZE * 0.8, time = 0) {
  const blink = Math.sin(time * 9) > 0;
  ctx.save();
  if (blink) ctx.globalAlpha = 0.72;
  drawPixels(ctx, STORE_TILES.beer, Math.round(x - size * 0.21), Math.round(y - size / 2), size * 0.42, size);
  ctx.restore();
}

function drawShape(ctx, colour, points, outline = DETAIL.outline) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

const MARGIT_POSES = {
  idle: [{ bodyY: 0, lean: 0, leftArm: [0, 0], rightArm: [0, 0], leftFoot: [0, 0], rightFoot: [0, 0] }],
  run: [
    { bodyY: 0, lean: 0.04, leftArm: [-2, -1], rightArm: [2, -2], leftFoot: [-3, -1], rightFoot: [3, -2] },
    { bodyY: -2, lean: 0.07, leftArm: [-4, -3], rightArm: [3, -4], leftFoot: [-4, -2], rightFoot: [4, -3] },
    { bodyY: -4, lean: 0.06, leftArm: [-3, -4], rightArm: [4, -2], leftFoot: [-3, -3], rightFoot: [4, -4] },
    { bodyY: -2, lean: 0.02, leftArm: [-1, -3], rightArm: [3, -4], leftFoot: [0, -4], rightFoot: [2, -1] },
    { bodyY: 0, lean: -0.04, leftArm: [2, -2], rightArm: [-2, -1], leftFoot: [3, -2], rightFoot: [-3, -1] },
    { bodyY: -2, lean: -0.07, leftArm: [4, -4], rightArm: [-3, -3], leftFoot: [4, -3], rightFoot: [-4, -2] },
    { bodyY: -4, lean: -0.06, leftArm: [3, -2], rightArm: [-4, -4], leftFoot: [4, -4], rightFoot: [-3, -3] },
    { bodyY: -2, lean: -0.02, leftArm: [3, -4], rightArm: [-1, -3], leftFoot: [2, -1], rightFoot: [0, -4] }
  ],
  jump: [
    { bodyY: 0, lean: 0, leftArm: [0, 0], rightArm: [0, 0], leftFoot: [0, 0], rightFoot: [0, 0] },
    { bodyY: 2, lean: -0.05, leftArm: [-2, -2], rightArm: [2, -2], leftFoot: [-1, 1], rightFoot: [1, 1] },
    { bodyY: -1, lean: -0.04, leftArm: [-4, -4], rightArm: [4, -4], leftFoot: [-3, -2], rightFoot: [3, -2] },
    { bodyY: -4, lean: 0, leftArm: [-5, -5], rightArm: [5, -5], leftFoot: [-4, -3], rightFoot: [4, -3] },
    { bodyY: -6, lean: 0.03, leftArm: [-4, -5], rightArm: [4, -5], leftFoot: [-4, -4], rightFoot: [4, -2] },
    { bodyY: -5, lean: 0.05, leftArm: [-2, -4], rightArm: [2, -4], leftFoot: [-2, -3], rightFoot: [2, -1] },
    { bodyY: -2, lean: 0.03, leftArm: [-1, -2], rightArm: [1, -2], leftFoot: [-1, -1], rightFoot: [1, 0] },
    { bodyY: 2, lean: -0.04, leftArm: [-1, 0], rightArm: [1, 0], leftFoot: [-1, 0], rightFoot: [1, 0] }
  ],
  hurt: [
    { bodyY: -1, lean: -0.12, leftArm: [-4, -4], rightArm: [4, -4], leftFoot: [-1, 0], rightFoot: [1, 0] },
    { bodyY: -3, lean: 0.14, leftArm: [-5, -5], rightArm: [5, -2], leftFoot: [-2, 0], rightFoot: [2, -1] },
    { bodyY: -1, lean: -0.18, leftArm: [-6, -3], rightArm: [5, -4], leftFoot: [-3, -1], rightFoot: [3, 0] },
    { bodyY: 0, lean: 0.16, leftArm: [-4, -4], rightArm: [6, -3], leftFoot: [-3, 0], rightFoot: [3, -1] },
    { bodyY: 3, lean: -0.1, leftArm: [-4, -1], rightArm: [4, -1], leftFoot: [-3, -3], rightFoot: [3, -3] },
    { bodyY: 4, lean: 0.07, leftArm: [-3, 0], rightArm: [3, 0], leftFoot: [-3, -2], rightFoot: [3, 0] },
    { bodyY: 3, lean: -0.04, leftArm: [-2, 0], rightArm: [2, 0], leftFoot: [-2, 0], rightFoot: [2, 0] },
    { bodyY: 2, lean: 0, leftArm: [-1, 0], rightArm: [1, 0], leftFoot: [-1, 0], rightFoot: [1, 0] }
  ]
};

function drawShapeOffset(ctx, colour, points, offset, outline) {
  ctx.save();
  ctx.translate(offset[0], offset[1]);
  drawShape(ctx, colour, points, outline);
  ctx.restore();
}

function drawDetailedMargit(ctx, x, y, w, h, facingLeft, frame, powerupMode, animationState) {
  const pose = MARGIT_POSES[animationState]?.[frame] ?? MARGIT_POSES.idle[0];
  const scale = h * 1.38 / 48;
  const bodyWidth = 36;
  const bodyHeight = 48;
  const left = x + w / 2 - bodyWidth * scale / 2;
  const top = y + h - bodyHeight * scale + pose.bodyY * scale;

  ctx.save();
  ctx.translate(facingLeft ? left + bodyWidth * scale : left, top);
  ctx.scale(facingLeft ? -scale : scale, scale);
  ctx.translate(18, 24);
  ctx.rotate(pose.lean);
  ctx.translate(-18, -24);
  ctx.lineJoin = 'round';

  ctx.fillStyle = 'rgba(27,18,23,0.3)';
  ctx.beginPath();
  ctx.ellipse(18, 47.5, 12, 1.7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = DETAIL.skinShadow;
  ctx.fillRect(13, 18, 11, 8);
  ctx.fillStyle = DETAIL.skin;
  ctx.fillRect(14, 18, 9, 7);
  ctx.fillStyle = DETAIL.skinLight;
  ctx.fillRect(15, 19, 6, 2);

  drawShape(ctx, DETAIL.robeShadow, [
    [12, 21], [15, 20], [21, 20], [24, 22], [26, 26], [25, 32],
    [27, 36], [29, 44], [26, 47], [9, 47], [7, 44], [10, 35],
    [11, 31], [10, 26]
  ]);
  drawShape(ctx, DETAIL.robe, [
    [13, 22], [15, 21], [21, 21], [24, 23], [25, 27], [24, 32],
    [26, 36], [27, 44], [25, 46], [10, 46], [8, 44], [10, 35],
    [11, 31], [10, 27]
  ], null);

  drawShapeOffset(ctx, DETAIL.robeDark, [[8, 23], [12, 22], [15, 25], [13, 31], [9, 34], [5, 30], [6, 27]], pose.leftArm);
  drawShapeOffset(ctx, DETAIL.robeLight, [[8, 24], [11, 23], [13, 26], [11, 30], [8, 31], [6, 29]], pose.leftArm);
  drawShapeOffset(ctx, DETAIL.robeDark, [[23, 22], [27, 24], [30, 28], [28, 32], [24, 30], [22, 26]], pose.rightArm);
  drawShapeOffset(ctx, DETAIL.robeLight, [[24, 23], [27, 25], [29, 28], [27, 30], [25, 29], [23, 26]], pose.rightArm);

  ctx.fillStyle = DETAIL.skinShadow;
  ctx.fillRect(9 + pose.leftArm[0], 30 + pose.leftArm[1], 4, 3);
  ctx.fillRect(29 + pose.rightArm[0], 28 + pose.rightArm[1], 4, 3);
  ctx.fillStyle = DETAIL.skin;
  ctx.fillRect(9 + pose.leftArm[0], 30 + pose.leftArm[1], 3, 2);
  ctx.fillRect(29 + pose.rightArm[0], 28 + pose.rightArm[1], 3, 2);
  ctx.fillStyle = DETAIL.skinLight;
  ctx.fillRect(10 + pose.leftArm[0], 30 + pose.leftArm[1], 2, 1);
  ctx.fillRect(30 + pose.rightArm[0], 28 + pose.rightArm[1], 2, 1);

  drawShape(ctx, DETAIL.cream, [[13, 21], [17, 22], [19, 26], [15, 25]]);
  drawShape(ctx, DETAIL.cream, [[23, 21], [20, 22], [18, 26], [22, 25]]);
  ctx.strokeStyle = DETAIL.robeBright;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(14, 24); ctx.lineTo(17, 28); ctx.lineTo(18, 34);
  ctx.moveTo(22, 24); ctx.lineTo(19, 28); ctx.lineTo(18, 34);
  ctx.stroke();

  ctx.fillStyle = DETAIL.robeDark;
  ctx.fillRect(9, 32, 18, 2);
  ctx.fillStyle = DETAIL.robeBright;
  ctx.fillRect(10, 32, 16, 1);
  ctx.fillStyle = DETAIL.gold;
  ctx.fillRect(17, 31, 3, 4);
  ctx.fillStyle = DETAIL.robeShadow;
  ctx.fillRect(17, 35, 2, 8);
  ctx.fillRect(20, 35, 2, 6);

  ctx.fillStyle = DETAIL.robeDark;
  ctx.fillRect(10, 36, 7, 6);
  ctx.fillStyle = DETAIL.robeLight;
  ctx.fillRect(11, 36, 6, 5);
  ctx.fillStyle = DETAIL.robeBright;
  ctx.fillRect(11, 37, 4, 1);
  ctx.fillStyle = DETAIL.robeShadow;
  ctx.fillRect(12, 39, 3, 1);
  ctx.fillStyle = DETAIL.patch;
  ctx.fillRect(12, 38, 2, 2);

  ctx.fillStyle = DETAIL.robeShadow;
  ctx.fillRect(8, 43, 19, 2);
  ctx.fillStyle = DETAIL.robeBright;
  ctx.fillRect(9, 44, 5, 1);
  ctx.fillRect(19, 44, 6, 1);
  ctx.fillStyle = DETAIL.patch;
  ctx.fillRect(22, 38, 3, 3);
  ctx.fillStyle = DETAIL.robeDark;
  ctx.fillRect(23, 37, 1, 5);
  ctx.fillRect(21, 39, 5, 1);

  ctx.fillStyle = DETAIL.skinShadow;
  ctx.fillRect(12 + pose.leftFoot[0], 43 + pose.leftFoot[1], 4, 3);
  ctx.fillRect(21 + pose.rightFoot[0], 43 + pose.rightFoot[1], 4, 3);
  ctx.fillStyle = DETAIL.skinLight;
  ctx.fillRect(13 + pose.leftFoot[0], 43 + pose.leftFoot[1], 2, 2);
  ctx.fillRect(22 + pose.rightFoot[0], 43 + pose.rightFoot[1], 2, 2);

  ctx.fillStyle = DETAIL.slipper;
  ctx.fillRect(9 + pose.leftFoot[0], 45 + pose.leftFoot[1], 8, 3);
  ctx.fillRect(20 + pose.rightFoot[0], 45 + pose.rightFoot[1], 8, 3);
  ctx.fillStyle = DETAIL.slipperLight;
  ctx.fillRect(10 + pose.leftFoot[0], 45 + pose.leftFoot[1], 6, 1);
  ctx.fillRect(21 + pose.rightFoot[0], 45 + pose.rightFoot[1], 6, 1);
  ctx.fillStyle = DETAIL.outline;
  ctx.fillRect(8 + pose.leftFoot[0], 47 + pose.leftFoot[1], 10, 1);
  ctx.fillRect(19 + pose.rightFoot[0], 47 + pose.rightFoot[1], 10, 1);
  ctx.fillStyle = DETAIL.robeBright;
  ctx.fillRect(11 + pose.leftFoot[0], 46 + pose.leftFoot[1], 2, 1);
  ctx.fillRect(23 + pose.rightFoot[0], 46 + pose.rightFoot[1], 2, 1);

  drawShape(ctx, DETAIL.hairShadow, [
    [9, 4], [12, 1], [16, 2], [19, 0], [23, 2], [27, 2], [30, 6],
    [29, 10], [32, 13], [29, 17], [30, 21], [26, 25], [10, 25],
    [6, 21], [5, 17], [3, 14], [6, 10], [5, 6]
  ]);
  ctx.fillStyle = DETAIL.hair;
  ctx.fillRect(8, 5, 21, 13);
  ctx.fillRect(6, 9, 5, 10);
  ctx.fillRect(26, 7, 4, 13);
  ctx.fillStyle = DETAIL.hairLight;
  ctx.fillRect(10, 4, 4, 4);
  ctx.fillRect(16, 3, 3, 4);
  ctx.fillRect(22, 4, 4, 3);
  ctx.fillRect(5, 11, 4, 4);
  ctx.fillRect(28, 12, 3, 5);
  ctx.fillStyle = DETAIL.hairBright;
  ctx.fillRect(12, 3, 2, 3);
  ctx.fillRect(18, 2, 2, 3);
  ctx.fillRect(24, 5, 2, 3);
  ctx.fillRect(7, 8, 2, 3);
  ctx.fillRect(29, 9, 2, 3);
  ctx.fillStyle = DETAIL.hairShadow;
  ctx.fillRect(8, 16, 3, 7);
  ctx.fillRect(26, 17, 4, 5);

  ctx.strokeStyle = DETAIL.hairBright;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(8, 8); ctx.lineTo(11, 5); ctx.lineTo(13, 6);
  ctx.moveTo(15, 5); ctx.lineTo(17, 3); ctx.lineTo(19, 5);
  ctx.moveTo(21, 5); ctx.lineTo(24, 4); ctx.lineTo(27, 7);
  ctx.moveTo(6, 13); ctx.lineTo(9, 10); ctx.moveTo(28, 13); ctx.lineTo(31, 11);
  ctx.stroke();

  ctx.fillStyle = DETAIL.skinShadow;
  ctx.fillRect(10, 9, 17, 13);
  ctx.fillRect(12, 7, 13, 17);
  ctx.fillStyle = DETAIL.skin;
  ctx.fillRect(11, 9, 15, 12);
  ctx.fillRect(13, 8, 11, 15);
  ctx.fillStyle = DETAIL.skinLight;
  ctx.fillRect(14, 9, 8, 2);
  ctx.fillRect(12, 12, 2, 5);
  ctx.fillRect(23, 12, 2, 5);
  ctx.fillStyle = DETAIL.skinShadow;
  ctx.fillRect(13, 18, 11, 3);
  ctx.fillStyle = DETAIL.skin;
  ctx.fillRect(14, 18, 9, 2);

  ctx.fillStyle = DETAIL.gold;
  ctx.fillRect(9, 16, 2, 4);
  ctx.fillRect(26, 16, 2, 4);
  ctx.fillStyle = DETAIL.outline;
  ctx.fillRect(10, 11, 6, 1);
  ctx.fillRect(20, 11, 6, 1);
  ctx.fillStyle = DETAIL.cream;
  ctx.fillRect(11, 12, 4, 2);
  ctx.fillRect(21, 12, 4, 2);
  ctx.fillStyle = DETAIL.outline;
  ctx.fillRect(12, 12, 2, 2);
  ctx.fillRect(22, 12, 2, 2);
  ctx.strokeStyle = DETAIL.outline;
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 11, 6, 4);
  ctx.strokeRect(20, 11, 6, 4);
  ctx.beginPath();
  ctx.moveTo(16, 12); ctx.lineTo(20, 12);
  ctx.moveTo(11, 10); ctx.lineTo(15, 9);
  ctx.moveTo(21, 9); ctx.lineTo(25, 10);
  ctx.stroke();

  ctx.strokeStyle = DETAIL.skinShadow;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(11, 16); ctx.lineTo(14, 17);
  ctx.moveTo(21, 17); ctx.lineTo(25, 16);
  ctx.moveTo(15, 17); ctx.lineTo(14, 19);
  ctx.moveTo(19, 17); ctx.lineTo(20, 19);
  ctx.moveTo(15, 21); ctx.lineTo(20, 21);
  ctx.stroke();
  ctx.fillStyle = DETAIL.robeDark;
  ctx.fillRect(15, 22, 6, 1);
  ctx.fillStyle = DETAIL.skinLight;
  ctx.fillRect(13, 15, 2, 1);
  ctx.fillRect(22, 15, 2, 1);

  ctx.fillStyle = DETAIL.hair;
  ctx.fillRect(10, 7, 5, 2);
  ctx.fillRect(16, 6, 5, 2);
  ctx.fillRect(22, 7, 5, 2);
  ctx.fillStyle = DETAIL.hairBright;
  ctx.fillRect(11, 7, 3, 1);
  ctx.fillRect(17, 6, 3, 1);
  ctx.fillRect(23, 7, 3, 1);

  ctx.fillStyle = DETAIL.cream;
  ctx.fillRect(23, 21, 7, 1);
  ctx.fillStyle = DETAIL.outline;
  ctx.fillRect(29, 20, 3, 1);
  ctx.fillStyle = '#F2E9D7';
  ctx.fillRect(29, 19, 6, 1);
  ctx.fillStyle = '#E48442';
  ctx.fillRect(34, 19, 1, 1);
  ctx.strokeStyle = 'rgba(231,228,221,0.8)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(33, 17); ctx.lineTo(34, 14); ctx.lineTo(33, 12);
  ctx.moveTo(35, 16); ctx.lineTo(36, 13);
  ctx.stroke();

  if (animationState === 'hurt' && frame < 4) {
    ctx.fillStyle = '#F2D45C';
    const spark = frame % 2;
    ctx.fillRect(2, 2 + spark, 2, 1);
    ctx.fillRect(32, 4 - spark, 2, 1);
    ctx.fillRect(4, 7 - spark, 1, 2);
  }
  if (powerupMode) {
    ctx.fillStyle = DETAIL.gold;
    ctx.fillRect(3, 24, 2, 2);
    ctx.fillRect(31, 24, 2, 2);
    ctx.fillRect(7, 19, 1, 2);
  }

  ctx.restore();
}

/**
 * Draw the player.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x          Canvas X of left edge
 * @param {number} y          Canvas Y of top edge
 * @param {number} w          Draw width
 * @param {number} h          Draw height
 * @param {boolean} powerupMode
 * @param {boolean} facingLeft
 * @param {number}  walkFrame  0 or 1
 */
export function drawPlayer(ctx, x, y, w, h, powerupMode, facingLeft, frame, animationState = 'idle') {
  drawDetailedMargit(ctx, x, y, w, h, facingLeft, frame, powerupMode, animationState);
}

/**
 * Draw a ground patrol enemy.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} walkFrame 0 or 1
 * @param {boolean} facingLeft
 */
export function drawEnemyGround(ctx, x, y, w, h, walkFrame, facingLeft, variant = 'cart') {
  const mat = variant === 'can' ? STORE_TILES.catfood : STORE_TILES.cart;
  drawPixels(ctx, mat, x, y, w, h, facingLeft);
}

/**
 * Draw a jumping enemy.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {boolean} isAirborne
 */
export function drawEnemyJump(ctx, x, y, w, h, isAirborne, variant = 'package') {
  let mat = STORE_TILES.package;
  if (variant === 'bread') mat = pixelArt(['...kkkk...', '..kggggk..', '.kggggggk.', 'kgggkkgggk', 'kggggggggk', '.kggggggk.', '..kkkkkk..', '....kk....']);
  if (variant === 'fish') mat = pixelArt(['..nnnn....', '.nmmmmn...', 'nnmmmmmn..', 'nnmmmmmmn.', 'nnmmmmmn..', '.nmmmmn...', '..nnnn....', '...n......']);
  if (variant === 'bottle') mat = pixelArt(['...jjj..', '..jgggj.', '..jgggj.', '..jgggj.', '..jgggj.', '..jgggj.', '..jjjj..', '...jj...']);
  if (variant === 'can') mat = STORE_TILES.catfood;
  if (variant === 'ornament') mat = pixelArt(['...jjj..', '..jnnnj.', '.jnmmnnj', '.jnmmnnj', '.jnmmnnj', '..jnnnj.', '...jjj..', '....a...']);
  drawPixels(ctx, mat, x, y, w, h);
}
