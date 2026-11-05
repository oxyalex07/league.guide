# League.guide review build

Open `dist/index.html` in a browser. No installation, account, server or network is required to read the 56 lessons, 173 champion guides and two matchup studies. Unzip the whole package first; keep assets beside the HTML. External source links require internet access.

Optional local HTTP preview (Python 3):

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Then open http://127.0.0.1:8080. Stop with Ctrl+C. This is a local review server, not a public deployment.

## Rebuild

From this folder, with Python 3.9 or newer:

```sh
python3 build.py
python3 verify_content.py
```

No Python packages or build-time downloads are needed. `content/` contains the revised concept Markdown and assets. `src/` contains the HTML, styles and navigation code; `dist/` is the generated runnable site. Build supports the Markdown constructs used by this reviewed package; it is not a general Markdown editor. Add a renderer and content checks before introducing new Markdown syntax.

## Browser verification

Requires Node.js and Playwright. In an environment where package installation is allowed:

```sh
npm install --no-save playwright
npx playwright install chromium
node verify.cjs
node verify_path.cjs
node verify_sidebar.cjs
node verify_expansion.cjs
```

Alternatively set `PLAYWRIGHT_MODULE` to an installed Playwright module and `CHROME_PATH` to an installed Chrome executable. The saved evidence used host Playwright 1.64.1 and installed Google Chrome; a different browser version may render slightly differently. Test output and screenshots go into `evidence/`.

## Links and navigation

Lesson addresses are `index.html#/lesson/<concept-slug>`. Hash routes work from a file and static HTTP hosting without rewrite rules. Browser Back/Forward restores navigation state. Search matches words across titles, summaries and lesson text; category controls constrain results. Search state and scroll positions persist during navigation in the same tab. Lesson path returns to the ordered sidebar; Continue reading restores the reading position. The first lesson is shown on initial desktop entry; mobile begins with the list.

## Limits

JavaScript is required for the reading interface. Source Markdown remains available under `content/articles/`. This review build has no managed preview URL, public deployment, domain, CMS, analytics, accounts, or backend. This task has no configured execution workspace/runtime service. Inherited source notes remain. New Spacing and Trading framing was checked against Riot’s Hwei designer rundown; see article source notes for scope. No current numeric matchup claims were added. Reading times are estimates.

Verification uses one desktop browser engine with simulated viewport sizes, not physical devices or screen readers. No full accessibility certification, cross-browser testing or text-zoom audit is claimed. The hash route choice is for portable review; public hosting and search-engine indexing need a separate deployment decision.

## Guided learning

The left sidebar has eight numbered expandable stages, with 56 lessons nested in learning order. The current stage opens automatically. Search and category filters are in “Find a lesson” below the stages. Navigation includes current-lesson highlighting, per-lesson practice marks, stage counts and total progress. Search and category filters retain curriculum order; Show full path clears them. On mobile, Lesson path returns to this navigation. Open `index.html#/path` or choose “Path overview & checkpoints” for the full stage goals and checkpoints. Eight stages cover all 56 concepts once. Each lesson has a practice marker and next link; each stage has a replay checkpoint. You can skip or repeat lessons. Progress uses browser storage with an in-memory fallback, needs no account, and does not sync across devices. File-based storage can change if the extracted folder moves. Reset progress on the path page or undo an individual lesson marker. Marks record practice, not mastery.

`content/path.json` defines the curriculum. The builder checks that every concept appears exactly once and every named prerequisite in `content/prerequisites.json` comes earlier in the path. See CURRICULUM-REVIEW.md for the full before/after audit. Stage order and checkpoints are editorial teaching proposals, not a validated course or rank guarantee.

## Dark mode and stage quizzes

Use the header theme button to switch light and dark modes. The initial theme follows your system; explicit choices persist in browser storage when available. Dark mode uses neutral charcoal surfaces. Diagrams follow the selected theme with dark backgrounds and high-contrast labels. Each of the eight stages ends with a worked scenario, replay drill and three-question quiz. Find these on the stage’s last lesson or the path overview. Check all three answers to get a score, explanations and review links. Retry clears that stage’s attempt; practice progress is separate. Latest checked answers persist locally with a page-memory fallback. See STAGE-QUIZZES.md for the full new material and answer key. Run `node verify_learning_upgrade.cjs` for feature checks.

## Sidebar indexes

See CHAMPION-LIBRARY.md for the complete 173-champion collection, sources and checks. SIDEBAR-INDEXES.md records the earlier starter-index release. Open #/champions or #/matchups for either index; individual pages use #/champion/<slug> and #/matchup/<slug>.

## Complete champion roster

All 173 champions in the included Riot 16.22.1 snapshot have detailed guides. The build validates coverage against the saved official directory. Champion source is in `content/champions/`; `champions.py` builds the pages and `champion_diagrams.py` supplies kit-specific diagrams. Run `node verify_champions.cjs` and `node verify_champion_diagrams.cjs` for the added checks.

## Expanded champion guides

Every champion guide is now at least three times its previous visible length (1,667–1,723 words). See CHAMPION-EXPANSION.md for the scope, per-champion counts and validation. Run `python3 verify_champion_depth.py` and `node verify_champion_depth.cjs` for the added checks.
