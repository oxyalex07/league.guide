# Complete champion library

The Champions sidebar now opens 173 detailed guides, covering every champion in Riot Data Dragon 16.22.1 and the official Riot champion directory retrieved on 5 November 2026 UTC (4 November Pacific). Both roster sets match exactly. The previous four champion routes remain valid.

## What is on each page

- Individually written playstyle, strengths, weaknesses and teamfight decisions.
- Before, during and after-fight guidance, plus an alternative when behind or unable to reach the intended target.
- A positioning diagram with accessible text and a caption. Eight guides have additional kit-specific geometry: Xayah, Orianna, Gangplank, Gnar, Anivia, Azir, Yone and Zed. Other guides use a shared schematic appropriate to their tactical role.
- A hypothetical river-contest exercise, replay review drill, related lessons and current ability names.
- Direct links to the champion's Riot page and versioned ability record. Advice is editorial interpretation of kit mechanics, not Riot recommendations or matchup statistics.

Search accepts names with or without punctuation, internal roster identifiers and Riot class tags. The A–Z sidebar remains separate from the 56 lessons and two starter matchup studies. Existing learning stages, quizzes, practice progress, dark mode and navigation remain available.

Each visible guide is now 1,667–1,723 words, at least 3.3 times its pre-expansion length. Common teamfight principles are deliberately shared across eight tactical patterns; the four central champion-specific sections and the new worked decision are individually authored. See CHAMPION-EXPANSION.md for the per-champion comparison and the latest validation. Diagrams show decisions, not exact ranges or map coordinates. Some champions can take different jobs with different builds and team compositions.

## Source and content checks

- [Official Riot directory](https://www.leagueoflegends.com/en-us/champions/): 173 champions.
- [Riot Data Dragon roster 16.22.1](https://ddragon.leagueoflegends.com/cdn/16.22.1/data/en_US/champion.json): 173 matching identifiers and names.
- Every champion has a saved versioned ability source. Notable current-kit checks include Mel's projectile destruction and shielding, Naafiri's current W/R arrangement, Shyvana's updated abilities, Aurora's slow zone, and Locke, Yunara and Zaahen.
- The builder rejects missing or duplicated champions, disagreement with the official directory, unknown lesson links and duplicate rendered guides. No generic fallback silently fills missing champions.
- No builds, exact cooldowns, tier rankings, win rates or universal matchup claims are supplied. Check current in-game tooltips for numeric tuning and detailed interactions.

## Original full-library verification

These checks record the original complete-roster delivery. CHAMPION-EXPANSION.md records checks rerun for the latest content expansion.

- 1,054 champion browser checks: all 173 routes and required sections at 1440 and 320 pixels; source links, accessible diagrams, active navigation, lesson references, theme inheritance, punctuation-tolerant search and no page errors.
- 1,640 sidebar-index checks at 1440, 390 and 320 pixels: every guide route, switching indexes, search, keyboard access, direct links, reload, Back/Forward, matchup cross-links and missing-route recovery.
- 48 focused checks on the eight kit-specific diagrams in light and dark modes at desktop and narrow mobile sizes.
- 54 existing guided-sidebar checks, 51 learning-path checks and 56 exact lesson content comparisons passed.
- Desktop and mobile screenshots inspected, including neutral dark surfaces and kit-specific diagrams. Chrome with simulated viewports was used; no cross-browser or physical-device certification is claimed.
- ZIP integrity, offline rebuild, generated champion data equality and standalone diagram references checked when packaging.

## Read and rebuild

Unzip the complete website package and open `dist/index.html`. Choose **Champions** in the left sidebar. Direct links use `#/champion/<slug>`; examples include `#/champion/xayah`, `#/champion/locke` and `#/champion/monkeyking` (Wukong).

From the website folder:

```sh
python3 build.py
python3 verify_content.py
node verify_champions.cjs
node verify_champion_diagrams.cjs
node verify_indexes.cjs
```

Browser tests require Playwright or playwright-core plus a Chromium browser; see README.md for environment overrides. The build itself uses Python's standard library and the included source snapshot, with no network requirement.

Editorial records: `content/champions/notes.tsv` and `content/champions/decisions.tsv`. Expanded teaching guidance: `champion_depth.py`. Shared tactical guidance and rendering: `champions.py`. Kit diagrams: `champion_diagrams.py`. Standalone Markdown guides and theme-aware SVGs: `content/champions/pages/`. Coverage: `content/champions/coverage.json`. Browser evidence: `evidence/`.

The content package includes the existing lesson collection, all 173 champion Markdown guides and SVGs, source snapshots, editorial records and coverage report. The website package also includes the runnable site, build scripts, frontend source and checks.

No public launch.
