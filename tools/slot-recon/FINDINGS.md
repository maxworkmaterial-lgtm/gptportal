# Разбор стека: Shady Lady и InOut Games (28.10.2026)

Источник: `tools/slot-recon/recon.mjs`, headless Chromium, публичные демо.
Смотрели только стек, структуру и тайминги. Код и ассеты не копировались.

## Shady Lady — разобрано 5 игр

Laced, SEW, Devil's Finger, Brainwashed, Oops. Демо: `cdn-staging.shadylady.tech/shadylady/<slug>/index.html`.

### Стек (у всех пяти игр одинаковый)

| Слой | Что используют |
|---|---|
| Рендер | **PixiJS 8.15.0**, WebGL2 (в бандле есть WebGPU-путь Pixi 8), канвас 1280×720 |
| Анимация | **Spine 4.2** (данные 4.2.43, рантайм `spine-pixi-v8` 4.2.89), JSON-скелеты |
| Твины | **GSAP 3.15.0** |
| Звук | **Howler.js**, отдельные `.ogg` (52–79 файлов на игру), без аудиоспрайтов |
| Частицы | particle-emitter (в SEW, Devil's Finger, Brainwashed) |
| Игровой UI | `breakaway-webui` на **Svelte** (UMD, общий для всех игр) |
| Ядро | Свой фреймворк **Breakaway**: FSM (`__BREAKAWAY_FSM__`), модуль `breakaway-spine`, i18next с неймспейсами `translation` + `breakaway` |
| Обёртка платформы | `slotify/connector/connector.js` на **React 19.2.8**, общий для всех игр |

**Вывод:** игра = Breakaway-движок на PixiJS + Spine + GSAP + Howler, поверх неё общий Svelte-UI и React-коннектор.
Это ровно стек, который мы закладываем (PixiJS 8 + Spine 4.2 + GSAP + Howler + Svelte + XState).

### Протокол с игровым сервером (`staging.shadylady.tech`, REST, без WebSocket)

| Вызов | Назначение |
|---|---|
| `POST /authenticate` | wallet/operator/key → token, balance, currency, jurisdiction, playerId |
| `POST /game/info` | режимы ставок, ленты барабанов (39 позиций), пейтейбл (9 символов), конфиг |
| `POST /campaigns` | активные промо-кампании |
| `POST /game/recover` | восстановление незавершённого раунда |
| `GET /feed/campaign/{id}` | лидерборды: winRatio и winAmount × all / yearly / monthly / daily, топ-50 |
| `GET /currencyDecimals`, `/currencySymbols` | валюты операторов |
| `POST /game/play` | `{action, bet}` → весь раунд целиком: reels, finalReels, payWaysWins, спец-символы, флаги фриспинов, accumulatedWin |
| `POST /game/complete` | `{roundId}` → finalWin, balance |

Сервер отдаёт **весь раунд одним ответом**, клиент только проигрывает его.
Между `play` и `complete` в Laced проходит 4.5–5.4 с: это длина анимации спина без выигрыша.

### Монетизация и удержание из `game/info` (Laced)

Режимы ставок: `main`, `GOLDEN_BET_1_5`, `GOLDEN_BET_5`, `BOOSTER_ONE`,
`FEATURE_BUY`, `FEATURE_BUY_SUPER`, `FEATURE_BUY_BRONZE/SILVER/GOLD`,
`HIGHLIGHT_REELS_100/300/500`, `LOOT_1/2/3`.

Значит, на одну игру приходится около 15 платных входов: анте-ставки, бустер, покупка бонуса трёх уровней,
«хайлайт-барабаны», лутбоксы. Плюс встроенные лидерборды с суточными, месячными и годовыми топами — это механика удержания (D1/D7).

Коды валют в `/currencyDecimals` показывают, кто их подключил: Stake (`stakesc/stakegc`), Rolla, WowVegas, Moonspin, Blazesoft, Casimba и др.
Сильный перекос в sweepstakes-казино (валюты SC/GC).

### Ассеты (Laced, остальные похожи)

- Spine-скелеты: фон (32 кости, скины base/FS/super FS), персонаж (52 кости, **7 physics-констрейнтов**:
  волосы и одежда болтаются сами), персонаж во фриспинах, два слона (80–98 костей, **IK + path-констрейнты**),
  счётчик фриспинов, layouts.
- Всего 2 атласа `.webp` (main + ui) плюс атлас прелоадера. Картинки 3.9–8 МБ, звук 4–12 МБ на игру.
- Прелоадер — отдельный лёгкий Spine-скелет.

### Звуковая карта (Laced, 79 файлов) — готовый чек-лист для нашего саунд-дизайна

- Барабаны: `Reel_stop_01..05`, `Reel_land_soft_01..05` (отдельный звук на каждый барабан), `Reels_Tumble`, `Reel_anticipation_loop`.
- Почти-выигрыш: `Near_win_symbol_land_01..03`, `Scatter_land`, `Trigger_symbol_land`.
- Выигрыши: `Win_symbol_highlight_01..05`, `Small_win`, `Medium_Win`, `High_Win`, `MAXHIGH`, `Counter_Loop`, `Counter_End`, `coin_win_slam`.
- Звук на каждый символ: `Pizza_symbol_win`, `Pipe_symbol_win`, `Phone_symbol_win`, `Bag_symbol_win`, `Wallet_symbol_win`.
- Реплики персонажа: `omg`, `omfg`, `cute_wow_sfx`, `rasta_horn`, `dj_air_horn`, `Vinyl_Scratch`.
- Музыка: `Basegame_music` (2.4 МБ), `Basegame_atmosphere`, `Music_freespin_v2`, `Elephant_music`, `laced_super_rasta(2)`, `laced_elephant_bigwin`.
- Бонус-пикер: `chest_idle/open`, `prize_bronze/silver/gold/empty`, `shuffle_deck`, `1..3_round_presentation`.

## InOut Games — стек не определён

Демо Dragon Pots, Chicken Road 2 и Megablock Empire открываются (`<slug>.inout.games/api/modes/game?...`),
но для IP из США отдают «Unfortunately, this game is not available in your country» (проверка через ipapi.co плюс серверный 403).
Облачная сессия находится в США. Гео-блок не обходили.

Чтобы снять стек: запустить `recon.mjs` или DevTools-сниппет из разрешённой страны (например, с машины в РФ или ЕС).

## Не разобрано

- `stake.com` — 403 (Cloudflare bot protection), не обходили.
- `shadylady.io` — сброс соединения. Игры при этом доступны напрямую с CDN.
