# Champion guide expansion

All 173 champion guides now contain at least three times their previous visible text. Each has 11 new sections: six deeper tactical lessons for its fight pattern, one individually written champion decision, a matchup-planning method, a practice session, a replay-review method and a self-check.

## Measured result

- Visible article text: 1,667–1,723 words per guide, compared with 473–519 previously.
- Every page is 3.32–3.54 times (rounded) its previous visible length. The test compares each champion against its own previous article, not a collection average.
- The visible-text comparison includes headings, diagram labels, existing related-matchup content and source notes. Closed ability-name details are excluded in both versions. The old article is reconstructed by removing only the 11 added sections from the expanded body; all original sections and page chrome are unchanged.
- A separate saved baseline checks body text and standalone Markdown. All 173 pass the three-times threshold in both formats.

## What changed

Each guide retains its original playstyle, strengths, weaknesses and champion-specific teamfight plan. The positioning diagram remains immediately after the core teamfight guidance, before the longer material.

The expansion explains early exchanges, midgame movement, enemy formations, entry and exit decisions, adaptation and conversion after a fight. Shared principles are deliberately written for eight tactical patterns; the new worked decision is individually authored for every champion. The four final learning-method sections are shared across all champions. This is not 173 separate matchup encyclopedias.

Examples include Ahri declining a pursuit after Charm misses, Thresh keeping a safe lantern anchor instead of following a hook, Xayah repositioning to improve feather-return lines, and K’Sante deciding whether isolation would abandon an exposed carry.

## Sources and editorial scope

New scenarios extend the champion-specific mechanics already checked against the saved Riot 16.22.1 source records and official champion pages. No new numerical builds, cooldown claims, tier lists or matchup percentages were added. Advice and hypothetical situations are editorial interpretation, not Riot recommendations. The roster and mechanics snapshot are unchanged from the previous delivery; this update is a depth expansion, not a new live-patch audit. Source links remain on every guide. Current tooltips remain the reference for numbers and detailed interactions.

## Validation

- 173 visible-article comparisons: every champion exceeds 3×; all have 11 added sections, an individual decision, unique section headings and no duplicate section paragraphs.
- 173 source-format checks: the editorial sections and individual decision appear in both HTML and Markdown; both formats exceed their saved length baseline.
- 1,054 existing champion browser checks at 1440 and 320 pixels: routes, required content, overflow, diagram accessibility, theme inheritance, navigation selection, lesson/source links and search.
- 56 existing lesson content comparisons. No changes to lesson copy, quizzes, progress, navigation code or theme styling.
- Desktop light and 320px dark screenshots of expanded sections inspected.
- Both ZIPs checked for integrity. The extracted website rebuilds offline and regenerates identical champion data.

The browser checks use Chrome with simulated viewport sizes, not physical-device or cross-browser certification.

## Files and reproduction

- Champion decisions: `content/champions/decisions.tsv`.
- Pattern guidance and learning methods: `champion_depth.py`.
- Saved pre-expansion counts: `content/champions/length-baseline.json`.
- Current browser counts: `evidence/champion-depth-checks.json`.
- Format checks: `evidence/champion-depth-content.json`.
- Standalone reading copies: `content/champions/pages/`.

From the website directory, run `python3 build.py`, `python3 verify_champion_depth.py`, `python3 verify_content.py`, `node verify_champion_depth.cjs` and `node verify_champions.cjs`. Browser setup is in README.md.

Unzip the complete website and open `dist/index.html`. Select Champions in the left sidebar. No public launch.

## Per-champion visible word counts

| Champion | Before | Expanded | Multiple |
| --- | ---: | ---: | ---: |
| Aatrox | 490 | 1684 | 3.44× |
| Ahri | 501 | 1706 | 3.41× |
| Akali | 495 | 1696 | 3.43× |
| Akshan | 493 | 1704 | 3.46× |
| Alistar | 491 | 1686 | 3.43× |
| Ambessa | 482 | 1672 | 3.47× |
| Amumu | 498 | 1690 | 3.39× |
| Anivia | 504 | 1699 | 3.37× |
| Annie | 486 | 1681 | 3.46× |
| Aphelios | 485 | 1700 | 3.51× |
| Ashe | 483 | 1693 | 3.51× |
| Aurelion Sol | 492 | 1684 | 3.42× |
| Aurora | 496 | 1692 | 3.41× |
| Azir | 493 | 1703 | 3.45× |
| Bard | 490 | 1697 | 3.46× |
| Bel'Veth | 493 | 1679 | 3.41× |
| Blitzcrank | 501 | 1694 | 3.38× |
| Brand | 482 | 1677 | 3.48× |
| Braum | 476 | 1682 | 3.53× |
| Briar | 488 | 1677 | 3.44× |
| Caitlyn | 486 | 1693 | 3.48× |
| Camille | 485 | 1679 | 3.46× |
| Cassiopeia | 488 | 1683 | 3.45× |
| Cho'Gath | 505 | 1697 | 3.36× |
| Corki | 489 | 1700 | 3.48× |
| Darius | 487 | 1677 | 3.44× |
| Diana | 488 | 1679 | 3.44× |
| Dr. Mundo | 491 | 1680 | 3.42× |
| Draven | 483 | 1696 | 3.51× |
| Ekko | 502 | 1705 | 3.40× |
| Elise | 504 | 1708 | 3.39× |
| Evelynn | 494 | 1695 | 3.43× |
| Ezreal | 489 | 1703 | 3.48× |
| Fiddlesticks | 493 | 1684 | 3.42× |
| Fiora | 487 | 1685 | 3.46× |
| Fizz | 499 | 1703 | 3.41× |
| Galio | 488 | 1693 | 3.47× |
| Gangplank | 504 | 1704 | 3.38× |
| Garen | 479 | 1670 | 3.49× |
| Gnar | 489 | 1681 | 3.44× |
| Gragas | 485 | 1681 | 3.47× |
| Graves | 491 | 1706 | 3.47× |
| Gwen | 491 | 1686 | 3.43× |
| Hecarim | 500 | 1699 | 3.40× |
| Heimerdinger | 495 | 1692 | 3.42× |
| Hwei | 500 | 1696 | 3.39× |
| Illaoi | 483 | 1675 | 3.47× |
| Irelia | 489 | 1686 | 3.45× |
| Ivern | 504 | 1714 | 3.40× |
| Janna | 495 | 1700 | 3.43× |
| Jarvan IV | 504 | 1700 | 3.37× |
| Jax | 487 | 1683 | 3.46× |
| Jayce | 478 | 1679 | 3.51× |
| Jhin | 487 | 1697 | 3.48× |
| Jinx | 488 | 1697 | 3.48× |
| K'Sante | 480 | 1688 | 3.52× |
| Kai'Sa | 494 | 1706 | 3.45× |
| Kalista | 489 | 1700 | 3.48× |
| Karma | 487 | 1693 | 3.48× |
| Karthus | 500 | 1696 | 3.39× |
| Kassadin | 496 | 1700 | 3.43× |
| Katarina | 495 | 1699 | 3.43× |
| Kayle | 490 | 1703 | 3.48× |
| Kayn | 494 | 1686 | 3.41× |
| Kennen | 490 | 1682 | 3.43× |
| Kha'Zix | 496 | 1696 | 3.42× |
| Kindred | 491 | 1705 | 3.47× |
| Kled | 475 | 1667 | 3.51× |
| Kog'Maw | 482 | 1693 | 3.51× |
| LeBlanc | 500 | 1704 | 3.41× |
| Lee Sin | 490 | 1682 | 3.43× |
| Leona | 498 | 1692 | 3.40× |
| Lillia | 488 | 1679 | 3.44× |
| Lissandra | 497 | 1692 | 3.40× |
| Locke | 497 | 1687 | 3.39× |
| Lucian | 487 | 1700 | 3.49× |
| Lulu | 496 | 1708 | 3.44× |
| Lux | 479 | 1679 | 3.51× |
| Malphite | 491 | 1685 | 3.43× |
| Malzahar | 495 | 1693 | 3.42× |
| Maokai | 506 | 1700 | 3.36× |
| Master Yi | 489 | 1684 | 3.44× |
| Mel | 493 | 1693 | 3.43× |
| Milio | 491 | 1701 | 3.46× |
| Miss Fortune | 485 | 1696 | 3.50× |
| Mordekaiser | 495 | 1689 | 3.41× |
| Morgana | 494 | 1700 | 3.44× |
| Naafiri | 516 | 1718 | 3.33× |
| Nami | 483 | 1689 | 3.50× |
| Nasus | 488 | 1679 | 3.44× |
| Nautilus | 496 | 1691 | 3.41× |
| Neeko | 494 | 1689 | 3.42× |
| Nidalee | 490 | 1690 | 3.45× |
| Nilah | 485 | 1681 | 3.47× |
| Nocturne | 502 | 1703 | 3.39× |
| Nunu & Willump | 506 | 1701 | 3.36× |
| Olaf | 489 | 1680 | 3.44× |
| Orianna | 500 | 1699 | 3.40× |
| Ornn | 495 | 1690 | 3.41× |
| Pantheon | 501 | 1689 | 3.37× |
| Poppy | 485 | 1694 | 3.49× |
| Pyke | 516 | 1719 | 3.33× |
| Qiyana | 499 | 1699 | 3.40× |
| Quinn | 485 | 1696 | 3.50× |
| Rakan | 486 | 1681 | 3.46× |
| Rammus | 494 | 1690 | 3.42× |
| Rek'Sai | 482 | 1669 | 3.46× |
| Rell | 498 | 1693 | 3.40× |
| Renata Glasc | 493 | 1701 | 3.45× |
| Renekton | 495 | 1689 | 3.41× |
| Rengar | 490 | 1694 | 3.46× |
| Riven | 489 | 1684 | 3.44× |
| Rumble | 488 | 1685 | 3.45× |
| Ryze | 495 | 1691 | 3.42× |
| Samira | 487 | 1684 | 3.46× |
| Sejuani | 493 | 1687 | 3.42× |
| Senna | 497 | 1710 | 3.44× |
| Seraphine | 486 | 1696 | 3.49× |
| Sett | 479 | 1673 | 3.49× |
| Shaco | 500 | 1705 | 3.41× |
| Shen | 503 | 1713 | 3.41× |
| Shyvana | 504 | 1699 | 3.37× |
| Singed | 487 | 1680 | 3.45× |
| Sion | 501 | 1699 | 3.39× |
| Sivir | 484 | 1697 | 3.51× |
| Skarner | 491 | 1685 | 3.43× |
| Smolder | 493 | 1705 | 3.46× |
| Sona | 491 | 1701 | 3.46× |
| Soraka | 503 | 1714 | 3.41× |
| Swain | 477 | 1669 | 3.50× |
| Sylas | 489 | 1683 | 3.44× |
| Syndra | 491 | 1686 | 3.43× |
| Tahm Kench | 493 | 1697 | 3.44× |
| Taliyah | 498 | 1696 | 3.41× |
| Talon | 509 | 1710 | 3.36× |
| Taric | 492 | 1704 | 3.46× |
| Teemo | 493 | 1691 | 3.43× |
| Thresh | 489 | 1698 | 3.47× |
| Tristana | 493 | 1707 | 3.46× |
| Trundle | 488 | 1677 | 3.44× |
| Tryndamere | 490 | 1686 | 3.44× |
| Twisted Fate | 504 | 1702 | 3.38× |
| Twitch | 486 | 1699 | 3.50× |
| Udyr | 488 | 1682 | 3.45× |
| Urgot | 490 | 1681 | 3.43× |
| Varus | 499 | 1711 | 3.43× |
| Vayne | 492 | 1703 | 3.46× |
| Veigar | 495 | 1689 | 3.41× |
| Vel'Koz | 473 | 1674 | 3.54× |
| Vex | 495 | 1693 | 3.42× |
| Vi | 502 | 1694 | 3.37× |
| Viego | 492 | 1684 | 3.42× |
| Viktor | 493 | 1690 | 3.43× |
| Vladimir | 493 | 1682 | 3.41× |
| Volibear | 494 | 1683 | 3.41× |
| Warwick | 489 | 1679 | 3.43× |
| Wukong | 478 | 1669 | 3.49× |
| Xayah | 496 | 1707 | 3.44× |
| Xerath | 477 | 1677 | 3.52× |
| Xin Zhao | 496 | 1688 | 3.40× |
| Yasuo | 488 | 1687 | 3.46× |
| Yone | 499 | 1695 | 3.40× |
| Yorick | 497 | 1697 | 3.41× |
| Yunara | 495 | 1707 | 3.45× |
| Yuumi | 493 | 1703 | 3.45× |
| Zaahen | 504 | 1698 | 3.37× |
| Zac | 497 | 1692 | 3.40× |
| Zed | 519 | 1723 | 3.32× |
| Zeri | 486 | 1701 | 3.50× |
| Ziggs | 488 | 1685 | 3.45× |
| Zilean | 504 | 1714 | 3.40× |
| Zoe | 499 | 1701 | 3.41× |
| Zyra | 496 | 1693 | 3.41× |
