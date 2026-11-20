/**
 * @module game
 * Central game-state machine. Orchestrates all subsystems:
 * player, enemies, level, camera, collectibles, HUD, and game screens.
 *
 * States:  'loading' | 'title' | 'playing' | 'paused' | 'dead' | 'levelComplete' | 'gameOver'
 */

import { CANVAS_W, CANVAS_H, TILE_SIZE, PALETTE, COL } from './constants.js';
import { Camera }       from './camera.js';
import { Level }        from './level.js';
import { Player }       from './player.js';
import { createEnemy }  from './enemy.js';
import * as Input       from './input.js';
import { playGem, playLevelComplete, toggleMute, isMuted } from './audio.js';
import { COLLECTIBLES, drawStoreBackground } from './sprites.js';
import { LEVEL_DATA } from './levelData.js';

const STARTING_LIVES = 3;

export class Game {
  /** @param {CanvasRenderingContext2D} ctx */
  constructor(ctx) {
    this._ctx         = ctx;
    this._state       = 'loading';
    this._levelIndex  = 0;
    this._lives       = STARTING_LIVES;
    this._score       = 0;
    this._timeLeft    = 200;
    this._levelData   = [];     // local level configurations
    this._level       = null;
    this._player      = null;
    this._enemies     = [];
    this._camera      = null;
    this._deathTimer  = 0;
    this._completeTimer = 0;
    this._victory = false;
    this._itemsCollected = 0;
    this._toast = '';
    this._toastTimer = 0;
  }

  // ---------------------------------------------------------------------------
  // Initialise: load local level configurations, then start
  // ---------------------------------------------------------------------------

  /** Load the local level configurations and start the game. */
  async init() {
    this._levelData = LEVEL_DATA;
    this._startLevel(0);
    this._state = 'title';
  }

  start() {
    if (this._state === 'title') this._state = 'playing';
  }

  // ---------------------------------------------------------------------------
  // Level management
  // ---------------------------------------------------------------------------

  /**
   * Prepare and start a level.
   * @param {number} index
   */
  _startLevel(index) {
    this._levelIndex = index;
    const data = this._levelData[index];
    this._level   = new Level(data);
    this._camera  = new Camera(this._level.cols, this._level.rows);
    this._timeLeft = this._level.timeLimit;

    // Spawn player
    const sp = this._level.playerStart;
    this._player = new Player(
      sp.x * TILE_SIZE,
      sp.y * TILE_SIZE
    );

    // Snap camera immediately to player
    this._camera.x = Math.max(0,
      this._player.centerX - CANVAS_W / 2
    );
    this._camera.y = Math.max(0,
      this._player.centerY - CANVAS_H / 2
    );

    // Spawn enemies
    this._enemies = this._level.enemies.map(createEnemy);

    this._state = 'playing';
  }

  /**
   * Respawn player after death (keep lives).
   */
  _respawnPlayer() {
    const sp = this._level.playerStart;
    this._player.respawn(sp.x * TILE_SIZE, sp.y * TILE_SIZE);
    this._enemies = this._level.enemies.map(createEnemy);
    // Reset gem/powerup state for this run
    this._itemsCollected -= this._level.gems.filter(g => g.collected).length;
    this._level.gems.forEach(g => g.collected = false);
    this._level.powerUps.forEach(p => p.collected = false);
    this._level.collectibleBonusAwarded = false;
    this._state = 'playing';
  }

  // ---------------------------------------------------------------------------
  // Main update (called with fixed dt)
  // ---------------------------------------------------------------------------

  /**
   * @param {number} dt  Fixed timestep in seconds
   */
  update(dt) {
    // Global input regardless of state
    if (Input.isMute()) toggleMute();

    switch (this._state) {
      case 'playing':       this._updatePlaying(dt); break;
      case 'paused':        this._updatePaused();    break;
      case 'dead':          this._updateDead(dt);    break;
      case 'levelComplete': this._updateComplete(dt);break;
      case 'gameOver':      this._updateGameOver();  break;
    }
  }

  _updatePlaying(dt) {
    if (Input.isPause()) { this._state = 'paused'; return; }
    if (this._toastTimer > 0) this._toastTimer = Math.max(0, this._toastTimer - dt);

    // Countdown timer
    this._timeLeft -= dt;
    if (this._timeLeft <= 0) {
      this._timeLeft = 0;
      this._loseLife();
      return;
    }

    // Level update
    this._level.update(dt);

    // Player update
    this._player.update(dt, this._level);

    // Enemies update
    for (const e of this._enemies) {
      e.update(dt, this._level);
    }

    // Camera follow player
    this._camera.update(this._player.centerX, this._player.centerY, dt);

    // Collision: player ↔ enemies
    this._checkEnemyCollisions();

    // Collision: player ↔ gems
    this._checkGemCollection();

    // Collision: player ↔ power-ups
    this._checkPowerUpCollection();

    // Player dead?
    if (!this._player.alive) {
      this._loseLife();
      return;
    }

    // Player reached goal?
    if (this._player.reachedGoal) {
      this._state = 'levelComplete';
      this._completeTimer = 3;
      playLevelComplete();
      return;
    }
  }

  _updatePaused() {
    if (Input.isPause() || Input.isRestart()) {
      this._state = 'playing';
    }
  }

  _updateDead(dt) {
    this._player.updateHitAnimation(dt);
    this._deathTimer -= dt;
    if (this._deathTimer <= 0) {
      if (this._lives > 0) {
        this._respawnPlayer();
      } else {
        this._state = 'gameOver';
      }
    }
    if (Input.isRestart()) {
      if (this._lives > 0) {
        this._respawnPlayer();
      } else {
        this._fullReset();
      }
    }
  }

  _updateComplete(dt) {
    this._completeTimer -= dt;
    if (this._completeTimer <= 0 || Input.isRestart()) {
      const nextIndex = this._levelIndex + 1;
      if (nextIndex < this._levelData.length) {
        this._startLevel(nextIndex);
      } else {
        // All levels done — game over with victory
        this._state = 'gameOver';
        this._victory = true;
      }
    }
  }

  _updateGameOver() {
    if (Input.isRestart()) {
      this._fullReset();
    }
  }

  /**
   * Reset everything and restart from level 1.
   */
  _fullReset() {
    this._lives  = STARTING_LIVES;
    this._score  = 0;
    this._victory = false;
    this._itemsCollected = 0;
    this._toast = '';
    this._toastTimer = 0;
    this._startLevel(0);
  }

  /**
   * Deduct a life and trigger death state.
   */
  _loseLife() {
    this._lives = Math.max(0, this._lives - 1);
    this._player.alive = false;
    this._player._hit = true;
    this._state = 'dead';
    this._deathTimer = 2.0;
  }

  // ---------------------------------------------------------------------------
  // Collision helpers
  // ---------------------------------------------------------------------------

  _checkEnemyCollisions() {
    for (const e of this._enemies) {
      if (!e.alive) continue;
      const side = e.overlapWithPlayer(this._player);
      if (side === 'top') {
        // Stomp!
        e.defeat();
        this._score += 200;
        this._player.vy = -300; // bounce up
      } else if (side === 'side') {
        const died = this._player.hurt();
        if (died) {
          this._loseLife();
          return;
        }
      }
    }
  }

  _checkGemCollection() {
    const px = this._player.x, pw = this._player.w;
    const py = this._player.y, ph = this._player.h;

    for (const gem of this._level.gems) {
      if (gem.collected) continue;
      const gx = gem.x * TILE_SIZE + TILE_SIZE * 0.15;
      const gy = gem.y * TILE_SIZE + TILE_SIZE * 0.15;
      const gs = TILE_SIZE * 0.7;

      if (px < gx + gs && px + pw > gx &&
          py < gy + gs && py + ph > gy) {
        gem.collected = true;
        this._score += COLLECTIBLES[gem.id]?.value ?? 100;
        this._itemsCollected += 1;
        this._toast = `${COLLECTIBLES[gem.id]?.name ?? 'Collected'}!`;
        this._toastTimer = 1.1;
        playGem();
      }
    }

    if (this._level.gems.length > 0 && !this._level.collectibleBonusAwarded &&
        this._level.gems.every(gem => gem.collected)) {
      this._level.collectibleBonusAwarded = true;
      this._score += 1000;
      this._toast = 'ALL CAT TREASURES! +1000';
      this._toastTimer = 2.2;
    }
  }

  _checkPowerUpCollection() {
    const px = this._player.x, pw = this._player.w;
    const py = this._player.y, ph = this._player.h;

    for (const pu of this._level.powerUps) {
      if (pu.collected) continue;
      const gx = pu.x * TILE_SIZE;
      const gy = pu.y * TILE_SIZE;
      const gs = TILE_SIZE;

      if (px < gx + gs && px + pw > gx &&
          py < gy + gs && py + ph > gy) {
        pu.collected = true;
        this._player.activatePowerup();
        this._toast = 'ÖLKRAFT!';
        this._toastTimer = 2;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  /** Draw everything for the current frame. */
  draw() {
    const ctx = this._ctx;
    this._drawBackground(ctx);

    if (this._state === 'loading') {
      this._drawLoading(ctx);
      return;
    }

    // World
    this._camera.apply(ctx);
    this._level.draw(ctx, this._camera);
    for (const e of this._enemies) e.draw(ctx);
    this._player.draw(ctx);
    this._camera.restore(ctx);

    // HUD (screen-space)
    this._drawHUD(ctx);

    // Overlays
    if (this._state === 'paused')        this._drawPauseOverlay(ctx);
    if (this._state === 'dead')          this._drawDeadOverlay(ctx);
    if (this._state === 'levelComplete') this._drawCompleteOverlay(ctx);
    if (this._state === 'gameOver')      this._drawGameOverScreen(ctx);
  }

  // ---------------------------------------------------------------------------
  // Background
  // ---------------------------------------------------------------------------

  _drawBackground(ctx) {
    drawStoreBackground(ctx, this._camera?.x ?? 0, this._level?.theme, this._level?._t ?? 0);
  }

  // ---------------------------------------------------------------------------
  // HUD
  // ---------------------------------------------------------------------------

  _drawHUD(ctx) {
    const pad = 8;
    ctx.fillStyle = 'rgba(17,19,26,0.94)';
    ctx.fillRect(0, 0, CANVAS_W, 43);
    ctx.fillStyle = PALETTE[this._level?.theme?.accent ?? 10];
    ctx.fillRect(0, 42, CANVAS_W, 2);

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = PALETTE[COL.GOLD];
    ctx.fillText(`SCORE ${String(this._score).padStart(6,'0')}`, pad, 17);

    ctx.fillStyle = PALETTE[COL.RED];
    ctx.fillText(`♥ ×${this._lives}`, 160, 17);

    ctx.fillStyle = PALETTE[COL.PALE];
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`DEPT ${this._levelIndex + 1}/5  ${this._level?.department ?? ''}`, 230, 17, 290);

    const t = Math.ceil(this._timeLeft);
    ctx.fillStyle = t < 30 ? PALETTE[COL.RED] : PALETTE[COL.WHITE];
    ctx.textAlign = 'right';
    ctx.fillText(`TIME ${String(t).padStart(3,'0')}`, CANVAS_W - pad, 17);
    ctx.textAlign = 'left';

    if (isMuted()) {
      ctx.fillStyle = PALETTE[COL.GREY];
      ctx.fillText('M', CANVAS_W - 83, 17);
    }

    const remaining = this._level?.gems.filter(gem => !gem.collected).length ?? 0;
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = PALETTE[COL.WHITE];
    ctx.fillText(`CAT TREASURES ${remaining}`, pad, 34);

    if (this._player?.powerupMode) {
      const ratio = this._player._powerupTimer / 15;
      ctx.fillStyle = PALETTE[1];
      ctx.fillRect(166, 27, 105, 8);
      ctx.fillStyle = PALETTE[COL.GOLD];
      ctx.fillRect(166, 27, Math.round(105 * ratio), 8);
      ctx.fillStyle = PALETTE[COL.WHITE];
      ctx.fillText('ÖLKRAFT!', 166, 24);
    }

    if (this._toastTimer > 0 && this._toast) {
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = PALETTE[COL.WHITE];
      ctx.fillText(this._toast, CANVAS_W / 2, 62);
      ctx.textAlign = 'left';
    }
  }

  // ---------------------------------------------------------------------------
  // Overlay screens
  // ---------------------------------------------------------------------------

  _drawLoading(ctx) {
    this._centreText(ctx, 'LOADING…', CANVAS_H / 2, PALETTE[COL.GOLD], '24px');
  }

  _drawPauseOverlay(ctx) {
    this._dimOverlay(ctx);
    this._centreText(ctx, 'PAUSED', CANVAS_H / 2 - 20, PALETTE[COL.GOLD], '28px');
    this._centreText(ctx, 'Press P or Enter to continue', CANVAS_H / 2 + 20, PALETTE[COL.PALE], '16px');
  }

  _drawDeadOverlay(ctx) {
    this._dimOverlay(ctx);
    this._centreText(ctx, this._lives > 0 ? 'YOU DIED!' : 'GAME OVER',
                     CANVAS_H / 2 - 20, PALETTE[COL.RED], '28px');
    this._centreText(ctx,
      this._lives > 0
        ? `Lives remaining: ${this._lives}  –  Press Enter to retry`
        : 'Press Enter to restart',
      CANVAS_H / 2 + 20, PALETTE[COL.PALE], '14px');
  }

  _drawCompleteOverlay(ctx) {
    this._dimOverlay(ctx);
    this._centreText(ctx, 'DEPARTMENT CLEARED!', CANVAS_H / 2 - 28, PALETTE[COL.MINT], '24px');
    this._centreText(ctx, this._level?.name ?? '', CANVAS_H / 2, PALETTE[COL.GOLD], '14px');
    this._centreText(ctx, `Score: ${this._score}  •  Items: ${this._itemsCollected}  •  Enter: continue`,
                     CANVAS_H / 2 + 28, PALETTE[COL.PALE], '12px');
  }

  _drawGameOverScreen(ctx) {
    this._dimOverlay(ctx, 0.85);
    if (this._victory) {
      this._centreText(ctx, 'MARGIT KLARADE JULHANDELN!', CANVAS_H / 2 - 48, PALETTE[COL.GOLD], '20px');
      this._centreText(ctx, `Final score: ${this._score}`, CANVAS_H / 2 - 10, PALETTE[COL.MINT], '18px');
      this._centreText(ctx, `Cat treasures collected: ${this._itemsCollected}`, CANVAS_H / 2 + 20, PALETTE[COL.PALE], '13px');
    } else {
      this._centreText(ctx, 'GAME OVER', CANVAS_H / 2 - 40, PALETTE[COL.RED], '32px');
      this._centreText(ctx, `Score: ${this._score}  •  Items: ${this._itemsCollected}`, CANVAS_H / 2, PALETTE[COL.PALE], '16px');
    }
    this._centreText(ctx, 'Press Enter to play again', CANVAS_H / 2 + 40, PALETTE[COL.GREY], '16px');
  }

  // ---------------------------------------------------------------------------
  // Overlay helpers
  // ---------------------------------------------------------------------------

  _dimOverlay(ctx, alpha = 0.6) {
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  _centreText(ctx, text, y, colour, size = '18px') {
    ctx.font = `bold ${size} monospace`;
    ctx.fillStyle = colour;
    ctx.textAlign = 'center';
    ctx.fillText(text, CANVAS_W / 2, y);
    ctx.textAlign = 'left';
  }
}
