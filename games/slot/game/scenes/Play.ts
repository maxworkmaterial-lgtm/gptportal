import { game } from '../engine.js';
import { listen, swiped, tapped } from '../input.js';

/**
 * The game itself.
 *
 * Build the world when the scene enters: the background, the player and everything else, each spawned from its own
 * file in entities/, and the rules stepped with `game.step`. A thing on screen is a sprite showing a picture by name:
 * `game.spawn({ id: 'player', texture: 'player', x, y, layer: 'world' })`, sized by its picture
 * (docs/make-a-2d-game.md). When the game is won or lost, `game.scenes.go('gameover')`.
 *
 * Read the player's input in the step: `game.input.keyDown('ArrowLeft')` while a key is held,
 * `game.input.keyPressed('Space')` the step it goes down, and from input.ts `tapped()` for a tap or a click in world
 * units and `swiped()` for a swipe.
 *
 * Everything made here is cleared when the scene is left, so going to 'play' again is a clean restart.
 */
let stopListening = (): void => {};

export const Play = {
    name: 'play',
    enter(): void {
        game.background.color('#10162a');
        stopListening = listen();
        // The pause and sound buttons, top right, in the engine's icons: the pause menu (Pause.ts) and the sound on
        // and off. The game's own art for them, when the design has it, goes in with `icon` (docs/ui.md).
        game.ui.pauseButton();
        game.ui.muteButton();
        game.step('play', () => {
            if (game.input.keyPressed('Escape') || game.input.keyPressed('KeyP')) { game.scenes.push('pause'); return; }
            const tap = tapped();       // { x, y } in world units, or null; game.roster.at(tap.x, tap.y) is what is there
            const swipe = swiped();     // 'up' | 'down' | 'left' | 'right', or null
            if (tap) {
                // the player chose a place, or a thing
            }
            if (swipe) {
                // the player moves, or pushes, that way
            }
        });
    },
    exit(): void {
        stopListening();
    },
};
