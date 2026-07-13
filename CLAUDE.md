# su7sh.com

Static GitHub Pages site (no build step, no framework). Custom domain via `CNAME`.
Deploy = push to `main`. Every page is self-contained HTML/CSS/JS.

## Model strategy (token budget — keep this discipline in every session)

The user runs sessions on Fable 5 (powerful, token-hungry) and switches to Sonnet via `/model` for grunt work. The assistant manages this budget actively:

- **Needs Fable 5:** design concepts, taste decisions, copy that must be strong, and writing the spectacular pages themselves (shaders, choreography, visual systems).
- **Switch to Sonnet:** routine building from an already-approved design, mechanical/repetitive edits, file operations, verification passes.
- At the start of each task, state plainly which model it needs. When a taste-critical phase ends and grunt work begins, proactively say: *"This next part doesn't need me at full power, switch to Sonnet."*
- Tell the user when to `/exit` and start a fresh session — long conversations waste capacity.
- The user is not a developer: plain language, ask before risky actions, give a way to verify after each step.

## Frozen files & current rules (2026-07)

- `brain.html` is **"The Confluence"** (shipped 2026-07-12, commit f1fe679): a scroll journey through 13 merging nature scenes (water → land → sky), one parameterized WebGL2 world. It and `body/index.html` remain exempt from the site's restraint rules — maximal ambition, self-contained, no build step. A certified byte-exact backup lives at `.claude/brain-new.certified-122217ba.html`.
- Do not touch `letter.html`, `room.html`, `models/`, `CNAME`. `index.html` is frozen EXCEPT its hero drop (added 2026-07-12, see below) — no other changes to it.
- `atlas.html` is now a threshold page where the visitor chooses **Brain** (→ `brain.html`) or **Body** (→ `body/index.html`, frontier robotics curriculum). These two pages are exempt from the site's restraint rules — the mandate is maximal visual/technical ambition, self-contained files, no build step, working links, good laptop performance, graceful mobile degradation.
- The atlas entrance on `index.html` is the **hero drop** (2026-07-12): a raymarched liquid-metal *creature* (`#heroDrop`, WebGL2, `position: fixed`, z-index 30) — mercury with a breathing vein of gold (the Two Forms not yet separated), iridescent rim. It is a VIEWPORT being: materializes on load, wanders to fully random points across the whole screen (slow, spring-damped, never darts, NEVER flees), accompanies the reader through every scroll section, swims briefly against scroll, always leans toward the cursor, and comes to rest beside a nearby or resting cursor. Within ~300px it glows (uNear) and the page cursor becomes a four-pointed spark (`html.drop-near` rule) to signal clickability. It sheds beads that drift off, dissolve, and hand over to DOM sparks (`#dropMotes`, fixed) that fly away and fade. Click/Enter/Space fires a three-beat exit: elastic swell → `#dropRing` (ring of light) bursts outward → `#dropVeil` (clip-path circle) swallows the screen → `atlas.html`. The hero coordinates (`#heroCoords`) are display-only: live-updated by the gist fetcher, NOT clickable. `atlas.html` must keep serving under that filename.

## The mythology (do not break this)

The site is quiet, layered, and slightly secret. Four layers, each hidden behind the last:

1. `index.html` — the public face. Portfolio of Dr. Suyash P. Gunjal (radiologist · clinical AI).
2. `letter.html` — a poetic letter. Opened from a hidden seam on the homepage. Warm paper aesthetic (Cormorant Garamond, cream).
3. `room.html` — a 3D room (Three.js, models in `/models`). Opened from the letter. Unlocked via the phone; the monitor is a door.
4. `atlas.html` — the Atlas: a private frontier-AI self-education map/workbench. Opened from the hero drop on `index.html` and from the room's monitor.

Never make hidden layers loud, public, or salesy. No marketing language. `atlas.html` stays `noindex,nofollow`.

**Tab titles (owner decision, 2026-07-14 — supersedes the old `·` doctrine):** the hidden pages now carry real lowercase titles — `the atlas · su7sh`, `intelligence · su7sh` (brain), `robotics · su7sh` (body), `a letter · su7sh`, `the room · su7sh`. Do NOT revert them to `·`. The dot motif lives on as the site-wide favicon (inline SVG data-URI: cyan dot on ink, added to all six pages). `index.html` also gained `og:image`/`twitter:image` pointing at `/og.png` (1200×630 card) — keep these. These head-tag changes are owner-approved exceptions to the frozen-file rules; the rules still apply to everything else in those files.

## The three doors (visitor messages, owner-approved 2026-07-14)

Graduated presence prompts, one per layer, all feeding the same two endpoints (ntfy topic + KEEPSAKE sheet, payload `{word, when, page}`):
1. `index.html` contact section — "the door": plainest ask ("no agenda? the guestbook is one line long."), pill input, design-system styling.
2. `atlas.html` bottom-left — "the threshold": mono whisper ("you stand close to the maker now · leave him a word"), expands to serif input; hidden in portrait.
3. `letter.html` page vi — "the letter": the original question (below). Deepest, warmest; do not flatten the gradient — outer copy stays plainer than inner.

## The visitor's question (letter.html, owner-approved 2026-07-14)

On the closing page (vi), a quiet prompt fades in ~1.8s after the page reveals: "before you go — do you want to tell suyash you were here?" — *yes, quietly* / *no, just passing*. Yes reveals an optional 80-char word input; sending fires ONE fetch to `https://ntfy.sh/su7sh-letter-45761abc79e1` (POST, X-Title "the letter"). No other network calls, no tracking; the question is asked once per browser (localStorage `letter-visit-answered`). The owner receives pings by subscribing to that topic in the ntfy app/web. On send the page also POSTs to the KEEPSAKE endpoint (Google Apps Script `/exec`, no-cors fire-and-forget) which appends a row to the owner's private Google Sheet and emails him — that's the permanent record. Playful layer (2026-07-14): rotating input placeholders (HINTS), varied kept/silent replies, SPECIAL recognised words with bespoke answers. Both endpoints are visible in page source (semi-public by design — rotate if spammed; long-term upgrade is a Cloudflare Worker). Do not add analytics to this; consent-only presence is the point.

## Design system

- Ink `#07080a` background family; cyan `#64CEFB` is the primary accent (index, room, atlas).
- Gold/amber is a restrained secondary "paper/light" accent only (letter warmth; atlas contracts/gates).
- Grain: fixed SVG feTurbulence overlay, opacity ~.035, mix-blend overlay — on every dark page.
- Type: Inter (body) + Instrument Serif italic (display) on index/atlas; Cormorant Garamond on letter/room; JetBrains Mono for metadata/hidden-layer UI (return links, nav rails, counts).
- Transitions between layers: slow body fades / ink veils, 700–1200ms, `cubic-bezier(.16,1,.3,1)` or ease.
- `prefers-reduced-motion`: the worlds ALWAYS live (time, agents, ambient motion keep running — Assembly precedent; the owner's macOS runs Reduce Motion). PRM gates only vestibular motion: pointer parallax, scroll smoothing (snaps), CSS transitions. Never ship a frozen world under PRM.
- Return affordances are quiet: lowercase mono, letter-spaced, low opacity, delayed fade-in, top-right.
- No loud dashboards, no card clutter, no bright filled chips — etched outlines, hairlines, w-alpha borders (`rgba(255,255,255,.02–.10)`).

## The Confluence engine (brain.html) — functional contract

Data consts verbatim from the old engine: `STAGES MICRO BLOCK CONTRACT LANES RES GATES CAPS TIERS INS DRIFT TRAPS COMPUTE BIB` (quality tiers are `QT` to avoid the TIERS name). Progress persists in localStorage `faicc-progress-v1` (pids `m{n}_{i}` `c{n}_{i}` `stage{n}` `res{i}` `gate{i}` `cap{i}` `pap{t}_{i}`; special keys `_lane` `_audit` `_question` `_last`). Export/import/reset must keep working. Stage completion stays locked behind the 4-item contract (alert + revert). Drift stays deliberately untracked. Hash uses `replaceState` only: `#s{n}` per scene, plus `#gates #capstones #papers #insights #traps #compute #bib #drift #resources`.
Preserved ids: `pfill ptext pace nav stages q ftopic flevel ftier fcost rcount rbody gatelist caplist tierlist inslist traplist complist biblist veil return` (+ `sndBtn ledgerBtn plates folio library ledger`). Debug pins: `?t=N` (0–12, fractions = bridges) and `?q=0/1/2` (quality tiers). Scene interval U = 1.1 viewport-heights; the scroll mapping must never have dead zones or bursts (slope bounded ≈ [.45, 1.28]).

## Known invariants / past bugs

- All pages that fade `body` out before navigating MUST restore on `pageshow` (`e.persisted`) — bfcache otherwise shows a black page on browser-back. Fixed on index/room/atlas; keep it that way.
- Table header stickiness on atlas assumes the nav rail height (~42px); mobile (≤719px) folds the resource table into cards.
- `heroCoords` text is rewritten by the live-coords gist fetcher on index — keep the element id; it is display-only (the entrance is `#heroDrop`).
- The hero drop pauses rendering when offscreen/tab-hidden (IntersectionObserver + visibilitychange) and falls back to a painted CSS orb (`.flat`) when WebGL2 is unavailable; `window.__dropReset()` restores drop + veil state on bfcache return — keep all three behaviors.

## Verification habits

Before committing: check all four pages serve, no console errors, no horizontal overflow at 390px, atlas filters/search/checkbox persistence still work, and hidden entrances remain keyboard-accessible (Enter/Space on `heroDrop` and the seam).
