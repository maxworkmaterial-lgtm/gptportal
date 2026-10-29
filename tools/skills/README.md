# Скиллы проекта: что стоит и как перенести

Установить всё одной командой на любом компьютере (из корня репо):

```bash
bash tools/skills/install.sh
```

Скрипт ставит всё **на уровень пользователя** (`~/.claude/`), поэтому скиллы работают в любом чате и в любой папке, а не только в этом репо.
Повторный запуск безопасен: уже установленные скиллы пропускаются (`--force` перезапишет их).
После установки перезапусти Claude Code или открой новый чат.

## 1. Скиллы (папки в `.claude/skills/`)

| Скилл | Для чего | Источник |
|---|---|---|
| `animate` | Построить анимацию с нуля: нужна ли, кривая, длительность, прерывание | emilkowalski/skill |
| `review-animations` | Ревью существующей анимации | emilkowalski/skill |
| `improve-animations` | Аудит всей анимации в проекте + план правок | emilkowalski/skill |
| `find-animation-opportunities` | Где анимации не хватает | emilkowalski/skill |
| `animation-performance` | Чтобы анимация не дропала кадры | emilkowalski/skill |
| `animation-vocabulary` | Как называется эффект («та штука, когда…») | emilkowalski/skill |
| `emil-design-eng` | Философия полировки UI Эмиля Ковальски | emilkowalski/skill |
| `mobile-native` | Веб-игра ощущается нативной на телефоне | emilkowalski/skill |
| `game-feel` | «Сочность»: тряска, hit-stop, squash & stretch | gamedev-skills/awesome-gamedev-agent-skills |
| `audio-design` | Шины, дакинг, адаптивная музыка, вариации SFX | gamedev-skills/awesome-gamedev-agent-skills |
| `game-ui-ux` | HUD, меню, safe area, масштабирование | gamedev-skills/awesome-gamedev-agent-skills |
| `shader-programming` | Шейдеры: dissolve, outline, glow (GLSL/HLSL) | gamedev-skills/awesome-gamedev-agent-skills |
| `stake-math-sdk` | Математика слота: RTP, books, оптимизатор (Stake Engine) | reskin-games/stake-engine-skills |
| `stake-web-sdk` | Фронт слота на Svelte + PixiJS (Stake Engine) | reskin-games/stake-engine-skills |
| `music` | Генерация музыки (ElevenLabs) | elevenlabs/skills |
| `sound-effects` | Генерация звуков (ElevenLabs) | elevenlabs/skills |
| `voicestudio` | Голоса и озвучка персонажей (VoiceStudio) | debpalash/VoiceStudio |
| `svelte-code-writer`, `svelte-core-bestpractices` | Svelte 5 | sveltejs/ai-tools |
| `find-skills` | Поиск и установка новых скиллов | vercel-labs/skills |

Лицензии и коммиты: `.claude/skills/THIRD_PARTY.md`, хэши: `skills-lock.json`.

## 2. Плагины (ставятся из маркетплейсов на GitHub)

| Плагин | Что даёт |
|---|---|
| `pixijs-skills@pixijs-skills` | 30+ скиллов по PixiJS v8 (рендер, ассеты, фильтры, частицы) |
| `gsap-skills@gsap-skills` | GSAP: твины, таймлайны, плагины |
| `rigc@rigc` | Риггинг и анимация персонажей |
| `rea@rea` | Реверс-инжиниринг (`/rea:reverse-engineer-anything`). Нужен Node.js ≥ 22.23 |
| `text-to-cad@earthtojake` | CAD-модели (для игр не обязателен) |

## 3. MCP-серверы

- `svelte`: документация Svelte (`https://mcp.svelte.dev/mcp`).
- Higgsfield, Figma, Google Drive, GitHub — это коннекторы claude.ai, они подключены к аккаунту и в новом чате уже есть.

## 4. Phaser AE

`npx -y @phaser-ae/cli setup` откроет браузер для входа в phaser.io и поставит скилл `phaser-ae`. Скрипт делает это сам на шаге 4.

## Не переносится скриптом

- Встроенные скиллы Claude (`anthropic-skills:*`, `marketing-skills:*`, `nano-banana`, `seedance-clean` и т.д.) приходят с аккаунтом и уже есть в любом чате.
- `NODE_USE_ENV_PROXY` и `PHASER_AE_BROWSER_WEBGPU=off` в `.claude/settings.json` нужны только облачному контейнеру. На Маке они не нужны.
