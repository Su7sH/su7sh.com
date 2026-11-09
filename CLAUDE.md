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

## Public homepage direction (2026-11-08)

The owner authorized implementing the revised homepage direction, then reviewed the local result and explicitly authorized publication on 9 November 2026. This supersedes the earlier homepage freeze and the hold on committing and publishing this reviewed revision. Future substantive changes require their own task authorization.

- Present clinical practice, rural care, institutional and team leadership, and clinical AI as connected work. Keep the tone understated and grounded in the existing public record.
- Global health, value-based healthcare and environmental sustainability are explicit interests. Product, client and go-to-market language describes an approach, not unverified commercial achievements.
- Do not add new numerical claims or ask for another factual questionnaire. Existing public facts are the baseline; omit unresolved claims.
- Personal essays can range beyond healthcare. The owner clarified on 9 November that Essays must be a separate section with its own visual theme, distinct from the professional homepage and Research. Do not label personal essays as Writing or mix them with research papers. Article creation and the essay design are reserved for the separate essay chat unless explicitly requested here. Do not add an empty essay archive or invented titles.
- Keep internal ambitions and writing intentions out of public copy and metadata. The owner rejected the paragraph beginning “I want to write about the questions that hold my attention” as internal monologue. Let actual work establish the scope.
- Navigation follows Work → Approach → Research → Background → Contact. Main content is present in static HTML and readable without JavaScript. Preserve mobile menu keyboard focus, Escape, focus trapping and inert background behavior.
- Keep `profile.json` (JSON-LD), the embedded JSON-LD, `cv.md`, `llms.txt`, `robots.txt` and `sitemap.xml` consistent with visible public content. The sitemap lists only the homepage. Do not put private sources, internal documents or hidden-page inventories in these files.
- The hero background is now the Point of Contact scene (its own section below), built on 9 November 2026 from the owner's creative brief; it replaced the CloudFront video. On 9 November the owner requested “leadership” instead of “healthcare leadership” and SpaceXSI branding throughout. Employer display names and the existing `og.png` sharing card were updated; its broader visual redesign remains separate work. Keep the stable `#org-xai` entity identifier in both JSON-LD copies.

## Frozen files & protected interactions

The 9 November employer-name correction is an authorized exception for `og.png` only. All other protected files and homepage interactions below remain unchanged.

The owner subsequently authorized broader sharing-card wording: “Physician · Leadership · Clinical AI” and “Care, institutions and technology.” Preserve its understated design. Show “SpaceXSI (formerly xAI)” once in the homepage Background/current-role row, mirror that role row in the public CV, and retain `alternateName: xAI` on the Organization in both JSON-LD copies. Other visible employer references remain SpaceXSI. The accompanying hiring review is an assessment, not authorization to implement every recommendation.

The owner then approved only a shorter opening and sharper accounts of existing work. The hero now contains one paragraph and uses content-driven height so Selected Work enters the first screen. The three work accounts use direct headings and concise responsibility descriptions, with the charitable-hospital context retained. Do not turn “led work to broaden access” into a measured result or claim sole ownership of clinical AI frameworks. Full-name/CV controls and other hiring-review recommendations remain outside this update.

- `brain.html` is **"The Confluence"** (shipped 2026-07-12, commit f1fe679): a scroll journey through 13 merging nature scenes (water → land → sky), one parameterized WebGL2 world. It and `body/index.html` remain exempt from the site's restraint rules — maximal ambition, self-contained, no build step. A certified byte-exact backup lives at `.claude/brain-new.certified-122217ba.html`.
- Do not touch `letter.html`, `room.html`, `atlas.html`, `brain.html`, `body/index.html`, `models/`, `CNAME` or `og.png` for this homepage update. Preserve the homepage's hero drop CSS/JS/DOM, seam CSS/JS/DOM, coordinates fetcher, bfcache restoration and doorstep form CSS/JS/DOM byte-for-byte against commit `19628456ddc0bf1ef3a191a743aafbb95bd0b0c9`. The seam now sits on “quiet” in the Approach section; its behavior is unchanged.
- `atlas.html` is now a threshold page where the visitor chooses **Brain** (→ `brain.html`) or **Body** (→ `body/index.html`, frontier robotics curriculum). These two pages are exempt from the site's restraint rules — the mandate is maximal visual/technical ambition, self-contained files, no build step, working links, good laptop performance, graceful mobile degradation.
- The atlas entrance on `index.html` is the **hero drop** (2026-07-12): a raymarched liquid-metal *creature* (`#heroDrop`, WebGL2, `position: fixed`, z-index 30) — mercury with a breathing vein of gold (the Two Forms not yet separated), iridescent rim. It is a VIEWPORT being: materializes on load, wanders to fully random points across the whole screen (slow, spring-damped, never darts, NEVER flees), accompanies the reader through every scroll section, swims briefly against scroll, always leans toward the cursor, and comes to rest beside a nearby or resting cursor. Within ~300px it glows (uNear) and the page cursor becomes a four-pointed spark (`html.drop-near` rule) to signal clickability. It sheds beads that drift off, dissolve, and hand over to DOM sparks (`#dropMotes`, fixed) that fly away and fade. Click/Enter/Space fires a three-beat exit: elastic swell → `#dropRing` (ring of light) bursts outward → `#dropVeil` (clip-path circle) swallows the screen → `atlas.html`. The hero coordinates (`#heroCoords`) are display-only: live-updated by the gist fetcher, NOT clickable. `atlas.html` must keep serving under that filename.

## The hero scene — the Point of Contact (published 2026-11-09)

Published on 9 November 2026 after independent visual, interaction and source-integrity checks. The owner authorized Codex to take Claude's abstract hand beyond its first implementation, including internet research for artistic inspiration. The scene uses the same anatomical study and Canvas 2D foundation, refined into several scales of drawn detail.

- `hero/hands.js` generates a sparse pixel and numeral field, long incoming currents, fine curved hatching, and continuous tonal contours. The hidden source image `hero/hand.webp` supplies luminance and surface orientation. Its pixels are sampled for geometry. The visible hand is drawn from paths.
- The twelve-second choreography assembles the fingertip, brings seven signals to it, passes warmth through the hand, and briefly leaves a warm trace in the surrounding current. The surface holds a fading afterimage of the pulse. Ambient motion is periodic across the loop boundary.
- References informing the refinement include Nervous System's Hyphae, Ryoji Ikeda's data-verse and Quayola's Landscape Paintings, alongside Claude's Nees and Molnár references. All visible paths are generated by this engine.
- Desktop text keeps its content-driven layout. At widths below 1024 px, `#heroRoom` reserves space below the introduction. The hand is drawn further left on phones to reveal more of its gesture.
- Three posters are generated from the same engine at contact. `hero/contact-still.webp` serves desktop, `hero/contact-tablet.webp` serves 720–1023 px, and `hero/contact-mobile.webp` serves smaller widths. The poster stays beneath the canvas, including when the script, source image or canvas context fails.
- `#heroMotion` pauses and resumes the background, including via keyboard. The scene continues its quiet motion under reduced-motion preferences, following the owner's standing rule. `PRM_STILL` remains available at the top of the engine for a future policy change.
- Rendering targets roughly 30 fps. Geometry is cached per layout. Leaving the hero or hiding the tab cancels the animation callback and preserves elapsed scene time. Resize rebuilds geometry and redraws even while paused. Browser-back restoration resumes the scene.
- `?handsT=4.6` pins the contact frame. `window.__hands` exposes `setTime`, `play`, `draw`, `relayout`, `layout`, `ready` and `LOOP` for review.
- The homepage's protected drop, seam, coordinates, bfcache restoration and doorstep regions were verified byte-identical to commit `1962845`. Public copy and structured profile files retain their existing content.

## The mythology (do not break this)

The site is quiet, layered, and slightly secret. Four layers, each hidden behind the last:

1. `index.html` — the public face. Dr. Suyash P. Gunjal's work across clinical practice, rural healthcare, institutional leadership and clinical AI, with room for broader curiosity.
2. `letter.html` — a poetic letter. Opened from a hidden seam on the homepage. Warm paper aesthetic (Cormorant Garamond, cream).
3. `room.html` — a 3D room (Three.js, models in `/models`). Opened from the letter. Unlocked via the phone; the monitor is a door.
4. `atlas.html` — the Atlas: a private frontier-AI self-education map/workbench. Opened from the hero drop on `index.html` and from the room's monitor.

Never make hidden layers loud, public, or salesy. No marketing language. `atlas.html` stays `noindex,nofollow`.

**Tab titles (owner decision, 2026-07-14 — supersedes the old `·` doctrine):** the hidden pages now carry real lowercase titles — `the atlas · su7sh`, `intelligence · su7sh` (brain), `robotics · su7sh` (body), `a letter · su7sh`, `the room · su7sh`. Do NOT revert them to `·`. The dot motif lives on as the site-wide favicon (inline SVG data-URI: cyan dot on ink, added to all six pages). `index.html` also gained `og:image`/`twitter:image` pointing at `/og.png` (1200×630 card) — keep these. These head-tag changes are owner-approved exceptions to the frozen-file rules; the rules still apply to everything else in those files.

## The three doors (visitor messages, owner-approved 2026-07-14)

Graduated presence prompts, one per layer, all POSTing (no-cors, fire-and-forget) to the single KEEPSAKE endpoint — Google Apps Script `/exec` → the owner's private Google Sheet + an email per message. Payload `{word, when, name}`; `name` ("a name, or how he knows you") exists on every door — the owner considers identity the most important field. ntfy was removed 2026-07-14 (owner decision): the sheet is the sole channel; do not re-add push relays.

1. `index.html` contact section — "the door": plainest ask ("most visitors pass in silence — you don't have to."), pill inputs (name + word), design-system styling.
2. `atlas.html` bottom-left — "the threshold": mono whisper ("few stand this close to the maker · leave him a word, and a name"), expands to stacked serif inputs; hidden in portrait.
3. `letter.html` page vi — "the letter": the original question, plus a "signed —" name line. Deepest, warmest; do not flatten the gradient — outer copy stays plainer than inner.

Replies weave the visitor's name in when given (all three doors). Letter keeps its playful layer: rotating HINTS placeholders, varied kept/silent replies, SPECIAL recognised words; asked once per browser (localStorage `letter-visit-answered`). Enter in the word field moves focus to the name field; Enter there sends. The endpoint is visible in page source (semi-public by design — rotate the deployment if spammed; long-term upgrade is a Cloudflare Worker). Do not add analytics to any of this; consent-only presence is the point.

## Design system

- Ink `#07080a` background family; cyan `#64CEFB` is the primary accent (index, room, atlas).
- Gold/amber is a restrained secondary "paper/light" accent only (letter warmth; atlas contracts/gates).
- Grain: fixed SVG feTurbulence overlay, opacity ~.035, mix-blend overlay — on every dark page.
- Type: Inter (body) + Instrument Serif italic (display) on index/atlas; Cormorant Garamond on letter/room; JetBrains Mono for metadata/hidden-layer UI (return links, nav rails, counts).
- Transitions between layers: slow body fades / ink veils, 700–1200ms, `cubic-bezier(.16,1,.3,1)` or ease.
- `prefers-reduced-motion`: the worlds ALWAYS live (time, agents, ambient motion keep running — Assembly precedent; the owner's macOS runs Reduce Motion). PRM gates only vestibular motion: pointer parallax, scroll smoothing (snaps), CSS transitions. Never ship a frozen world under PRM.
- Baseline exception: the protected homepage drop currently passes `uMotion = 0` and uses static bead behavior under reduced motion. This existing behavior was preserved during the homepage rebuild; the general aspiration above must not be mistaken for a tested property of that engine or permission to rewrite it.
- Return affordances are quiet: lowercase mono, letter-spaced, low opacity, delayed fade-in, top-right.
- No loud dashboards, no card clutter, no bright filled chips — etched outlines, hairlines, w-alpha borders (`rgba(255,255,255,.02–.10)`).

## The Confluence engine (brain.html) — functional contract

Data consts verbatim from the old engine: `STAGES MICRO BLOCK CONTRACT LANES RES GATES CAPS TIERS INS DRIFT TRAPS COMPUTE BIB` (quality tiers are `QT` to avoid the TIERS name). Progress persists in localStorage `faicc-progress-v1` (pids `m{n}_{i}` `c{n}_{i}` `stage{n}` `res{i}` `gate{i}` `cap{i}` `pap{t}_{i}`; special keys `_lane` `_audit` `_question` `_last`). Export/import/reset must keep working. Stage completion stays locked behind the 4-item contract (alert + revert). Drift stays deliberately untracked. Hash uses `replaceState` only: `#s{n}` per scene, plus `#gates #capstones #papers #insights #traps #compute #bib #drift #resources`.
Preserved ids: `pfill ptext pace nav stages q ftopic flevel ftier fcost rcount rbody gatelist caplist tierlist inslist traplist complist biblist veil return` (+ `sndBtn ledgerBtn plates folio library ledger`). Debug pins: `?t=N` (0–12, fractions = bridges) and `?q=0/1/2` (quality tiers). Scene interval U = 1.1 viewport-heights; the scroll mapping must never have dead zones or bursts (slope bounded ≈ [.45, 1.28]).

## Known invariants / past bugs

- All pages that fade `body` out before navigating MUST restore on `pageshow` (`e.persisted`) — bfcache otherwise shows a black page on browser-back. Fixed on index/room/atlas; keep it that way.
- Table header stickiness on atlas assumes the nav rail height (~42px); mobile (≤719px) folds the resource table into cards.
- `heroCoords` text is rewritten by the live-coords gist fetcher on index — keep the element id; it is display-only (the entrance is `#heroDrop`).
- The hero drop pauses rendering when the tab is hidden and falls back to a painted CSS orb (`.flat`) when WebGL2 is unavailable; `window.__dropReset()` restores drop + veil state on bfcache return. The baseline's `onscreen` flag is always true; it has no active IntersectionObserver. Do not claim offscreen pausing was verified or implemented.
- The doorstep sends a no-cors request without an acknowledgment and displays its response optimistically. Preserving the handler does not verify receipt; do not submit test visitor messages.

## Verification habits

Before committing: check all four pages serve, no console errors, no horizontal overflow at 390px, atlas filters/search/checkbox persistence still work, and hidden entrances remain keyboard-accessible (Enter/Space on `heroDrop` and the seam).
