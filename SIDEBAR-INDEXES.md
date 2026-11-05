# Switchable sidebar indexes

The left sidebar now switches between Lessons, Matchups and Champions.

- Lessons retains the 56-lesson guided path, eight stages, quizzes and practice progress.
- Champions provides an alphabetical, searchable starter collection: Ahri, Darius, Garen and Lux.
- Matchups provides Ahri vs Lux and Garen vs Darius. Each guide covers both perspectives, a hypothetical scenario, a replay exercise and relevant lesson links.
- Champion pages link to their matchup guides, and matchup guides link back to both champions. All pages have direct offline hash links. Mobile return buttons use the active index name.
- Each index retains its search during navigation; opening a guide clears a filter if that filter would hide it. Back/Forward restores the index and search. Dark mode retains neutral surfaces.

## Scope and sources

This is a starter collection, not a complete champion roster or matchup database. No rankings, win rates, exact cooldowns, builds or counter-pick claims are included. Kit facts were checked against Riot champion pages; the practice advice is editorial inference. Each page has source links and this distinction.

- https://www.leagueoflegends.com/en-us/champions/ahri/
- https://www.leagueoflegends.com/en-us/champions/darius/
- https://www.leagueoflegends.com/en-us/champions/garen/
- https://www.leagueoflegends.com/en-us/champions/lux/

## Validation

119 new index checks passed at 1440, 390 and 320 pixels: switching, keyboard activation, filtering, empty results, page links, cross-links, direct links, reloads, Back/Forward, current-page markers, missing-guide recovery and horizontal overflow. No page errors. Desktop and narrow mobile dark-mode screenshots inspected.

54 existing sidebar checks, 51 learning-path checks and 56 article comparisons passed. Browser coverage uses Chrome with simulated sizes; no physical-device or cross-browser certification is claimed.

## Review

Unzip the whole website and open dist/index.html. Use the three links at the top of the left sidebar. Source for the new collection and its rendering is src/directory.js. Add entries to CHAMPIONS or MATCHUPS, then run python3 build.py. Run node verify_indexes.cjs to check navigation and all referenced lesson slugs.

The full website ZIP includes runnable pages, source, lesson content and verification evidence. The companion content ZIP includes the unchanged lessons and the new guide source. ZIP integrity and an extracted rebuild/content check passed. No public launch.
