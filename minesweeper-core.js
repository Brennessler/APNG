/* Minesweeper core: pure game logic, no DOM. Runs in the browser and in Node (for tests). */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.Minesweeper = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const LEVELS = {
        beginner: { rows: 9, cols: 9, mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert: { rows: 16, cols: 30, mines: 99 },
    };

    function createGame(level) {
        const config = LEVELS[level];
        if (!config) throw new Error(`unknown level: ${level}`);
        const board = [];
        for (let r = 0; r < config.rows; r++) {
            const row = [];
            for (let c = 0; c < config.cols; c++) {
                row.push({ mine: false, count: 0, revealed: false, flagged: false, exploded: false });
            }
            board.push(row);
        }
        return {
            level, rows: config.rows, cols: config.cols, totalMines: config.mines,
            board, status: 'ready', minesPlaced: false, revealedCount: 0, flagCount: 0,
        };
    }

    function neighbors(game, r, c) {
        const out = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols) out.push([nr, nc]);
            }
        }
        return out;
    }

    function placeMines(game, safeR, safeC, rng) {
        rng = rng || Math.random;
        const safe = new Set([[safeR, safeC], ...neighbors(game, safeR, safeC)].map(([r, c]) => r * game.cols + c));
        const spots = [];
        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                if (!safe.has(r * game.cols + c)) spots.push([r, c]);
            }
        }
        for (let i = 0; i < game.totalMines && spots.length; i++) {
            const pick = Math.floor(rng() * spots.length);
            const [r, c] = spots.splice(pick, 1)[0];
            game.board[r][c].mine = true;
        }
        for (let r = 0; r < game.rows; r++) {
            for (let c = 0; c < game.cols; c++) {
                game.board[r][c].count = neighbors(game, r, c).filter(([nr, nc]) => game.board[nr][nc].mine).length;
            }
        }
        game.minesPlaced = true;
    }

    function reveal(game, r, c) {
        if (game.status === 'won' || game.status === 'lost') return [];
        if (!game.minesPlaced) placeMines(game, r, c);
        if (game.status === 'ready') game.status = 'playing';
        const cell = game.board[r][c];
        if (cell.revealed || cell.flagged) return [];
        const opened = [];
        const stack = [[r, c]];
        while (stack.length) {
            const [cr, cc] = stack.pop();
            const current = game.board[cr][cc];
            if (current.revealed || current.flagged) continue;
            current.revealed = true;
            game.revealedCount++;
            opened.push([cr, cc]);
            if (current.mine) {
                current.exploded = true;
                game.status = 'lost';
                for (const row of game.board) {
                    for (const other of row) if (other.mine) other.revealed = true;
                }
                return opened;
            }
            if (current.count === 0) stack.push(...neighbors(game, cr, cc));
        }
        if (game.revealedCount === game.rows * game.cols - game.totalMines) game.status = 'won';
        return opened;
    }

    function toggleFlag(game, r, c) {
        if (game.status === 'won' || game.status === 'lost') return false;
        const cell = game.board[r][c];
        if (cell.revealed) return false;
        cell.flagged = !cell.flagged;
        game.flagCount += cell.flagged ? 1 : -1;
        return cell.flagged;
    }

    /* Chord: click a revealed number whose flag count matches to open the rest. */
    function chord(game, r, c) {
        const cell = game.board[r][c];
        if (!cell.revealed || cell.count === 0) return [];
        const around = neighbors(game, r, c);
        const flags = around.filter(([nr, nc]) => game.board[nr][nc].flagged).length;
        if (flags !== cell.count) return [];
        const opened = [];
        for (const [nr, nc] of around) {
            if (!game.board[nr][nc].flagged && !game.board[nr][nc].revealed) {
                opened.push(...reveal(game, nr, nc));
                if (game.status === 'lost') break;
            }
        }
        return opened;
    }

    return { LEVELS, createGame, neighbors, placeMines, reveal, toggleFlag, chord };
});
