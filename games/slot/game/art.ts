import { game } from './engine.js';

/**
 * Every picture the game paints, by name. main.ts calls this once, before the first scene, and a sprite shows a
 * picture with `texture: 'name'` (docs/make-a-2d-game.md, Pictures). A picture from a file needs nothing here: it
 * has the key assets.json gives it.
 *
 *   game.paint('coin', 32, 32, ctx => { ctx.fillStyle = '#ffd34d'; ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill(); });
 *   game.paint('bird', 40, 30, (ctx, i) => { ... }, { frames: 4 });
 *   game.pixels('heart', ['.R.R.', 'RRRRR', '.RRR.', '..R..'], { R: '#ff3355' }, 4);
 */
export function paintArt(): void
{
}
