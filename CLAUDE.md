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

- `brain.html` is the finished frontier-AI atlas (formerly `atlas.html`, renamed with content untouched). **Never modify a byte of it.**
- Do not touch `letter.html`, `room.html`, `index.html`, `models/`, `CNAME`.
- `atlas.html` is now a threshold page where the visitor chooses **Brain** (→ `brain.html`) or **Body** (→ `body/index.html`, frontier robotics curriculum). These two pages are exempt from the site's restraint rules — the mandate is maximal visual/technical ambition, self-contained files, no build step, working links, good laptop performance, graceful mobile degradation.
- `index.html`'s hero coordinates fire at `atlas.html` — that filename must keep serving.

## The mythology (do not break this)

The site is quiet, layered, and slightly secret. Four layers, each hidden behind the last:

1. `index.html` — the public face. Portfolio of Dr. Suyash P. Gunjal (radiologist · clinical AI).
2. `letter.html` — a poetic letter. Opened from a hidden seam on the homepage. Warm paper aesthetic (Cormorant Garamond, cream).
3. `room.html` — a 3D room (Three.js, models in `/models`). Opened from the letter. Unlocked via the phone; the monitor is a door.
4. `atlas.html` — the Atlas: a private frontier-AI self-education map/workbench. Opened from the hero coordinates on `index.html` and from the room's monitor.

Never make hidden layers loud, public, or salesy. No marketing language. `atlas.html` stays `noindex,nofollow` with title `·` (matching letter/room).

## Design system

- Ink `#07080a` background family; cyan `#64CEFB` is the primary accent (index, room, atlas).
- Gold/amber is a restrained secondary "paper/light" accent only (letter warmth; atlas contracts/gates).
- Grain: fixed SVG feTurbulence overlay, opacity ~.035, mix-blend overlay — on every dark page.
- Type: Inter (body) + Instrument Serif italic (display) on index/atlas; Cormorant Garamond on letter/room; JetBrains Mono for metadata/hidden-layer UI (return links, nav rails, counts).
- Transitions between layers: slow body fades / ink veils, 700–1200ms, `cubic-bezier(.16,1,.3,1)` or ease. Respect `prefers-reduced-motion`.
- Return affordances are quiet: lowercase mono, letter-spaced, low opacity, delayed fade-in, top-right.
- No loud dashboards, no card clutter, no bright filled chips — etched outlines, hairlines, w-alpha borders (`rgba(255,255,255,.02–.10)`).

## Atlas engine (brain.html — frozen, reference only) — functional contract

All data lives in JS consts: `STAGES`, `MICRO`, `BLOCK`, `CONTRACT`, `LANES`, `RES`, `GATES`, `CAPS`, `TIERS`, `INS`, `DRIFT`, `TRAPS`, `COMPUTE`, `BIB`.
The `drift` plate (passive watch queue, 3 dimness layers) is DELIBERATELY untracked: no checkboxes, no ids, no progress/ledger integration — keep it that way. Its ⌨ chip means "keyboard pass required later"; only that later pass touches gates.
Progress persists in `localStorage` key `faicc-progress-v1` (checkbox ids in `data-pid`; values are timestamps; `_lane` and `_audit` are special keys). Export/import/reset buttons must keep working.
Preserve these element ids: `pfill ptext pace nav stages q ftopic flevel ftier fcost rcount rbody gatelist caplist tierlist inslist traplist complist biblist veil return`.
Stage completion is locked behind the 4-item completion contract (alert + revert). Tabs mirror to `location.hash` via `replaceState` only — never `pushState`.

## Known invariants / past bugs

- All pages that fade `body` out before navigating MUST restore on `pageshow` (`e.persisted`) — bfcache otherwise shows a black page on browser-back. Fixed on index/room/atlas; keep it that way.
- Table header stickiness on atlas assumes the nav rail height (~42px); mobile (≤719px) folds the resource table into cards.
- `heroCoords` text is rewritten by the live-coords gist fetcher on index — the atlas entrance listener must stay on the element, not its text.

## Verification habits

Before committing: check all four pages serve, no console errors, no horizontal overflow at 390px, atlas filters/search/checkbox persistence still work, and hidden entrances remain keyboard-accessible (Enter/Space on `heroCoords` and the seam).
