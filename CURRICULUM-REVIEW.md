# Website and curriculum review

Reviewed the existing 52 lesson definitions, explanations, examples, exercises, prerequisites and navigation as a general beginner-to-intermediate concept library. The updated site has 56 lessons in eight stages. The Refined original / Clear lesson design and stage-based left sidebar remain.

## Findings and changes

- Trading appeared before resource and cooldown foundations. Resources now come in stage 1; cooldowns and crowd control precede combos and trading in stage 2. Skillshots now precedes Dodging.
- Level advantages were discussed without an Experience lesson. Added Experience after Last-hitting and Spacing, distinguishing level progress from last-hit income.
- Warding and tracking assumed map-reading habits. Added Map awareness in stage 1, with a player-view observation exercise, uncertainty and an action after each check.
- Committed fights assumed knowledge of escape tools. Added Summoner spells before combos and all-ins, with availability, purpose and the cost of using a spell.
- The wave sequence began with techniques without a choice framework. Added Wave management, then fast push → slow push → crash → bounce → freeze → recall. This teaches clearing and buildup before verifying a crash, then uses the return push to explain holding.
- Itemization was lesson 47. It now follows Recalling in stage 3, with Power spikes immediately after it. The early Experience lesson introduces level changes before this fuller discussion of relative strength.
- Roaming preceded Tempo, and Rotations preceded Lane assignments. Tempo and team Resets now set up movement; lane duties are assigned before players rotate.
- Win conditions was the final lesson. It now opens Closing games, before picks, objective control, siege and diving. Added a concrete behind-state decision paragraph and an objective follow-up section.
- Generic “earlier lessons in this stage” prerequisites could become stale when lessons moved. All 56 lessons now name specific foundations and link to them. A machine-readable prerequisite map is checked by the builder for missing IDs, duplicates and forward dependencies.

## Content scope

All 52 existing concept names, stable IDs, canonical routes and aliases are retained. Each new lesson includes a definition, explanation, decision steps, hypothetical example, mistake/correction, practice exercise, limits, source notes and desktop/mobile SVG diagram with caption and alt text. Related links now support the named foundations and the next learning step; the path footer remains the authoritative sequential navigation.

The existing articles remain concise concept lessons. Champion matchups, patch-specific builds, exact clear routes and all ability interactions are outside this general course. Basic movement and attack inputs are assumed; this is not a complete new-player client tutorial. Support and jungle learners can use player-view replays for lane exercises. The curriculum and drills are editorial guidance, not a validated course or rank promise.

## Sources checked for additions

- [Riot: How to Play](https://www.leagueoflegends.com/en-us/how-to-play/) — level growth, summoner spells, limited vision and the base objective.
- [Riot: Patch 25.S1.1](https://www.leagueoflegends.com/en-us/news/game-updates/patch-25-s1-1-notes/) — minion experience has a range rule.
- [Riot: Patch 26.1](https://www.leagueoflegends.com/en-gb/news/game-updates/patch-26-1-notes/) — solo/shared minion experience is different.
- [Riot: Hwei Abilities Rundown](https://www.leagueoflegends.com/en-us/event/hwei-abilities-rundown/) — champion-specific context for clearing to recall or roam, with exposure and resource costs.

Checked 4 November 2026 Pacific time. Historical numerical values and builds are not reproduced as current rules. New routines are teaching synthesis, with source scope stated in each article. Existing source notes were retained; this review does not claim to revalidate every historical source or current game interaction.

## Complete order audit

“Before” is the previous 52-lesson global position. “After” is the revised global position. Every row was checked for concept scope, example, practice, figure, links and prerequisite fit; retained content is kept where it already serves the concept. Named foundations below are earlier in the path, not every optional related topic mentioned in prose.

| Concept | Before | After | Stage | Named foundations |
| --- | --- | --- | --- | --- |
| Last-hitting | 1 | 1 | Lane foundations | Basic inputs |
| Spacing | 2 | 2 | Lane foundations | Basic inputs |
| Experience | New | 3 | Lane foundations | Last-hitting, Spacing |
| Resource management | 6 | 4 | Lane foundations | Last-hitting |
| Skillshots | 8 | 5 | Lane foundations | Spacing, Resource management |
| Dodging | 4 | 6 | Lane foundations | Spacing, Skillshots |
| Kiting | 5 | 7 | Lane foundations | Last-hitting, Spacing |
| Map awareness | New | 8 | Lane foundations | Spacing |
| Cooldown tracking | 9 | 9 | Combat tools | Skillshots, Resource management |
| Crowd control | 13 | 10 | Combat tools | Skillshots |
| Summoner spells | New | 11 | Combat tools | Cooldown tracking, Crowd control |
| Combos | 10 | 12 | Combat tools | Skillshots, Cooldown tracking, Resource management, Crowd control |
| Trading | 3 | 13 | Combat tools | Spacing, Cooldown tracking, Resource management |
| Poking | 11 | 14 | Combat tools | Trading, Skillshots |
| All-ins | 12 | 15 | Combat tools | Trading, Crowd control, Summoner spells |
| Zoning | 14 | 16 | Combat tools | Spacing, Trading |
| Baiting | 15 | 17 | Combat tools | All-ins, Map awareness |
| Wave management | New | 18 | Waves and purchases | Last-hitting, Experience, Map awareness |
| Fast pushing | 16 | 19 | Waves and purchases | Wave management, Resource management |
| Slow pushing | 18 | 20 | Waves and purchases | Wave management, Fast pushing |
| Wave crashing | 17 | 21 | Waves and purchases | Fast pushing, Slow pushing |
| Wave bouncing | 19 | 22 | Waves and purchases | Wave crashing |
| Freezing | 20 | 23 | Waves and purchases | Wave bouncing |
| Recalling | 21 | 24 | Waves and purchases | Wave crashing, Resource management |
| Itemization | 47 | 25 | Waves and purchases | Recalling |
| Power spikes | 7 | 26 | Waves and purchases | Experience, Itemization |
| Warding | 22 | 27 | Map information | Map awareness |
| Vision denial | 24 | 28 | Map information | Warding |
| Jungle tracking | 23 | 29 | Map information | Map awareness, Warding |
| Lane priority | 25 | 30 | Map information | Wave crashing, Recalling, Map awareness |
| Weak side | 26 | 31 | Map information | Lane priority, Jungle tracking |
| Jungle pathing | 27 | 32 | Jungle decisions | Jungle tracking, Lane priority |
| Ganking | 28 | 33 | Jungle decisions | Jungle pathing, Crowd control, Summoner spells |
| Counterganking | 29 | 34 | Jungle decisions | Ganking, Jungle tracking |
| Invading | 30 | 35 | Jungle decisions | Jungle pathing, Lane priority, Warding |
| Counterjungling | 31 | 36 | Jungle decisions | Invading |
| Tempo | 33 | 37 | Connected pressure | Lane priority, Recalling |
| Resets | 34 | 38 | Connected pressure | Recalling, Itemization, Tempo |
| Roaming | 32 | 39 | Connected pressure | Lane priority, Jungle tracking, Tempo |
| Lane assignments | 36 | 40 | Connected pressure | Wave management, Weak side |
| Rotations | 35 | 41 | Connected pressure | Lane assignments, Tempo |
| Split pushing | 37 | 42 | Connected pressure | Rotations, Jungle tracking |
| Cross-map trading | 38 | 43 | Connected pressure | Split pushing, Tempo |
| Positioning | 39 | 44 | Team fights | Spacing, Map awareness |
| Target selection | 40 | 45 | Team fights | Positioning, Cooldown tracking |
| Body blocking | 41 | 46 | Team fights | Skillshots, Positioning |
| Peeling | 42 | 47 | Team fights | Crowd control, Positioning |
| Engaging | 43 | 48 | Team fights | Crowd control, Target selection |
| Disengaging | 44 | 49 | Team fights | Peeling, Engaging |
| Flanking | 45 | 50 | Team fights | Engaging, Vision denial |
| Collapsing | 46 | 51 | Team fights | Flanking, Rotations |
| Win conditions | 52 | 52 | Closing games | Split pushing, Target selection, Resets |
| Picks | 48 | 53 | Closing games | Win conditions, Collapsing |
| Objective control | 49 | 54 | Closing games | Lane priority, Warding, Jungle tracking, Resets |
| Sieging | 50 | 55 | Closing games | Objective control, Poking, Disengaging |
| Diving | 51 | 56 | Closing games | Sieging, All-ins, Summoner spells |

## Verification

See HANDOFF.md for final test results, downloads and local run steps. The builder checks complete unique curriculum membership and prerequisite order. Browser checks cover the actual displayed order and Next sequence at desktop and mobile widths. Existing IDs preserve practice marks; the completion denominator grows to 56.
