import { game } from '../engine.js';
import assets from '../assets.json';

/**
 * The title screen: the first thing the player sees.
 *
 * Usually the game's name (or its logo, if it has one), its title art and music, and the way in. The way in is
 * already here: the Play button, Space or Enter goes to 'play'. Add more buttons (levels, settings) the same way:
 * the skin's styles, an engine icon, and no width, so each fits its icon and caption.
 *
 * Everything this screen shows comes from the 'title' pack in assets.json, or is painted in art.ts. The 'game' pack
 * is still loading while the title is up, so the way in waits for it: it only waits if the player is quicker than
 * the download.
 *
 * A game that drops straight into play can delete this file and go to 'play' from main.ts.
 */
const NAME = 'Game';

/**
 * A title screen designed on phaser.io arrives as a file in the 'title' pack (`title-screen`). With the
 * `title-screen` pack composed, it plays exactly as designed (its art, motion, music and the way into play) and
 * this scene does nothing else. Without one, the plain way in below.
 */
interface TitlePlayer { play(file: unknown, options: { next: string; wait: () => unknown }): unknown }
const designed = (): TitlePlayer | null => {
    const player = (game as unknown as { titleScreen?: TitlePlayer }).titleScreen;
    return player && game.assets.has('title-screen') ? player : null;
};

export const Title = {
    name: 'title',
    enter(): void {
        const player = designed();
        if (player) {
            player.play(game.assets.get('title-screen'), { next: 'play', wait: () => game.assets.load(assets, { pack: 'game' }) });
            return;
        }
        const W = game.screen.width, H = game.screen.height;
        game.background.gradient('#141a3a', '#3a2a5a');
        // The name in the skin's `heading`, and Play in its `good` colour (main.ts chooses the skin).
        game.ui.label({ anchor: 'center', y: -H * 0.12, w: W - 64, h: 160, text: NAME, style: 'heading' });
        let starting = false;
        const start = (): void => {
            if (starting) return;
            starting = true;
            void game.assets.load(assets, { pack: 'game' }).then(() => game.scenes.go('play'));
        };
        game.ui.button({ anchor: 'center', y: H * 0.1, h: 96, text: 'Play', style: 'good', icon: 'play', onClick: start });
        game.step('title', () => {
            if (game.input.keyPressed('Space') || game.input.keyPressed('Enter')) start();
        });
    },
};
