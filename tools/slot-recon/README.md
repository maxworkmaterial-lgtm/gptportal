# slot-recon

Headless разбор публичных демо слотов: стек (движок, Spine, звук, UI-фреймворк),
структура ассетов, форма протокола с игровым сервером (только ключи и типы, без значений)
и раскадровка спинов (скриншот каждые 750 мс + видео).

```bash
node tools/slot-recon/recon.mjs "<url демо>" recon-out/<имя> --spins=3 --spin-key=Space
```

Результат: `report.md`, `report.json`, скриншоты `spinN-XXXXms.png`, запись `.webm`.

Цели первого прогона:

| Игра | URL |
|---|---|
| Laced (Shady Lady) | https://cdn-staging.shadylady.tech/shadylady/laced/index.html?server=https%3A%2F%2Fstaging.shadylady.tech&provider=shadylady&wallet=demo&operator=demo&channel=desktop&rgs=shadylady |
| Shady Lady (сайт) | https://shadylady.io/ |
| InOut Games (сайт, найти демо Chicken Road / Chicken Royal) | https://inout.games/ |
| Valkyrie Waylander's Forge (Stake) | https://stake.com/ru/casino/games/valkyrie-waylanders-forge |

Нужен сетевой доступ к этим доменам и их CDN. Код и ассеты чужих игр не копируем:
берём только стек, структуру и тайминги.
