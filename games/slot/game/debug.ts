import { game } from './engine.js';

/**
 * The game's debug controls: the ways into it that playing would take minutes to reach (docs/make-a-2d-game.md and docs/00-kernel.md, Debug
 * controls). `bake play` runs them with `cheat`, and a person opens them with the backquote key (`) or `?cheats`.
 *
 * Add the game's own here: a jump to any level, a power-up, infinite lives, win or lose now. A jump starts the game
 * as a player would find it there, and an outcome goes through the game's own path, so what is checked is what a
 * player gets. main.ts adds them at boot, before the first scene, so they work from any screen. Run before the game
 * is ready (`game.ready`), a control waits for it by itself.
 *
 * Register the run's state here too, once the game keeps it in one object: `game.inspect.state(() => run)`. Every
 * inspection then reports it, so a reviewer's change request says "level 14, 1 life, score 8400" from the game itself.
 */
export function addDebugControls(): void
{
    game.cheats.add({
        name: 'screen',
        does: 'Go straight to a screen: title, play or gameover',
        args: 'name',
        run: name => { game.scenes.go(name ?? 'title'); return `screen ${name ?? 'title'}`; },
    });
}
