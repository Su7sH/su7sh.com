/* The Point of Contact — a field learns the shape of a human gesture.
   Claude's hand study and luminance mapping remain the anatomical source.
   The visible drawing combines curved hatching, tonal contours, incoming
   signals and a warmth that briefly leaves a trace in the surrounding field.

   Art references inform principles, with all visible geometry generated here.
   Nees and Molnar — disorder resolving into structure.
   Nervous System, Hyphae — a flow that leaves a memory of its passage.
   Ikeda, data-verse — a composition with several scales of detail.
   Quayola, Landscape Paintings — observation translated into drawn marks.

   Twelve-second periodic motion. ?handsT=4.6 pins the contact frame.
   window.__hands exposes setTime / play / draw / relayout. November 2026.
*/
(() => {
  'use strict';

  const root = document.getElementById('heroScene');
  const canvas = root && root.querySelector('canvas');
  if (!root || !canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  /* Site policy (CLAUDE.md): worlds keep living under prefers-reduced-motion;
     only vestibular motion is gated, and there is none here. Flip to true to
     hold the contact still instead. */
  const PRM_STILL = false;

  const BASE = (() => {
    const s = document.currentScript;
    return s && s.src ? s.src.replace(/[^/]*$/, '') : 'hero/';
  })();

  /* ── the hand that steers the strokes (normalized image coordinates) ── */
  const HAND = {
    src: BASE + 'hand.webp',
    tip: [0.1406, 0.6426],           // index fingertip
    len: 0.7253,                      // fingertip → where the forearm dissolves, / image width
    roll: 10 * Math.PI / 180,         // rolled about the fingertip so the wrist leaves at mid-height
    path: [[0.1406, 0.6426], [0.2656, 0.5183], [0.3750, 0.4051], [0.5000, 0.3122],
           [0.6250, 0.3017], [0.7344, 0.2875], [0.8594, 0.1857]],   // tip → joints → knuckle → palm → wrist
  };

  /* ── choreography, seconds ── */
  const LOOP = 12;
  const T = {
    reach: [1.8, 4.2],      // the front advances toward the fingertip
    contact: 4.5,
    pulse: [4.55, 8.3],      // warmth travels tip → wrist
    rest: [8.6, 11.7],      // the front recedes; the finger loosens back into pixels
  };

  /* ── palette ── */
  const INK = '#07080a';
  const P = {
    shade: [112, 152, 186],    // the hand's shadow side, still cool
    skin: [236, 166, 112],     // lit skin, copper
    light: [255, 232, 204],    // the highlights
  };

  /* ── helpers ── */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const ease = (x) => x * x * (3 - 2 * x);
  const lerp = (a, b, x) => a + (b - a) * x;
  const mix = (c0, c1, x) => [lerp(c0[0], c1[0], x), lerp(c0[1], c1[1], x), lerp(c0[2], c1[2], x)];
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  /* ── state ── */
  let W = 0, H = 0, dpr = 1, mobile = false;
  let L = null;                       // layout
  let marks = [], etchings = [], contours = [], currents = [], arrivals = [], energySpine = [];
  let handImg = null, handLum = null, handSoft = null, HL_W = 0, HL_H = 0;
  let pinned = null, elapsed = 0, lastFrame = 0, frameId = 0, onscreen = true, live = false, paused = false;

  const params = new URLSearchParams(location.search);
  if (params.has('handsT')) { const v = parseFloat(params.get('handsT')); if (isFinite(v)) pinned = ((v % LOOP) + LOOP) % LOOP; }

  /* ── the photograph becomes a luminance field ── */
  function buildHandField() {
    HL_W = 512; HL_H = Math.round(HL_W * handImg.naturalHeight / handImg.naturalWidth);
    const c = document.createElement('canvas'); c.width = HL_W; c.height = HL_H;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(handImg, 0, 0, HL_W, HL_H);
    const d = g.getImageData(0, 0, HL_W, HL_H).data;
    handLum = new Float32Array(HL_W * HL_H);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) {
      handLum[j] = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
    }
    handSoft = boxBlur(handLum, HL_W, HL_H, 2, 2);        // the form, for hatching direction
  }
  function boxBlur(src, w, h, r, passes) {
    let a = Float32Array.from(src), b = new Float32Array(w * h);
    for (let p = 0; p < passes; p++) {
      for (let y = 0; y < h; y++) {                          // horizontal
        let acc = 0; const row = y * w;
        for (let x = -r; x <= r; x++) acc += a[row + clamp(x, 0, w - 1)];
        for (let x = 0; x < w; x++) { b[row + x] = acc / (2 * r + 1); acc += a[row + clamp(x + r + 1, 0, w - 1)] - a[row + clamp(x - r, 0, w - 1)]; }
      }
      for (let x = 0; x < w; x++) {                          // vertical
        let acc = 0;
        for (let y = -r; y <= r; y++) acc += b[clamp(y, 0, h - 1) * w + x];
        for (let y = 0; y < h; y++) { a[y * w + x] = acc / (2 * r + 1); acc += b[clamp(y + r + 1, 0, h - 1) * w + x] - b[clamp(y - r, 0, h - 1) * w + x]; }
      }
    }
    return a;
  }
  function lumAt(arr, u, v) {                           // bilinear, normalized image coords
    if (u < 0 || v < 0 || u >= 1 || v >= 1) return 0;
    const x = u * (HL_W - 1), y = v * (HL_H - 1);
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
    const i = yi * HL_W + xi;
    const x1 = Math.min(xi + 1, HL_W - 1) - xi, y1 = Math.min(yi + 1, HL_H - 1) - yi;
    return lerp(lerp(arr[i], arr[i + x1], fx), lerp(arr[i + y1 * HL_W], arr[i + y1 * HL_W + x1], fx), fy);
  }

  /* ── layout ── */
  function layout() {
    const r = root.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    const d = window.__forceDpr || Math.min(2, window.devicePixelRatio || 1);
    mobile = root.dataset.layout ? root.dataset.layout === 'mobile' : window.matchMedia('(max-width: 1023px)').matches;
    if (w === W && h === H && d === dpr && L && L.mobile === mobile) return false;
    W = w; H = h; dpr = d;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);

    // where the fingertip sits, how long the hand is, and which way the field flows
    let cx, cy, handLen, flowAngle;
    if (!mobile) {
      const box = Math.min(W, 1160), left = (W - box) / 2;
      cx = Math.max(W * 0.58, left + box * 0.665);
      cy = H * 0.51;
      handLen = clamp(H * 0.82, 260, 700);
      flowAngle = 0;                                     // left → right
    } else {
      // the copy owns the top of the hero; the hand lives in the room kept below it
      const room = document.getElementById('heroRoom');
      const rr = room ? room.getBoundingClientRect() : null;
      const top = rr ? rr.top - r.top : H * 0.6, hh = rr ? rr.height : H * 0.4;
      cx = W * 0.31;
      cy = top + hh * 0.50;
      handLen = Math.min(W * 0.70, hh * 1.05);
      flowAngle = Math.atan2(top, W) * 0.9;              // top-left → bottom-right
    }
    const cell = clamp(handLen / 45, 6.5, 12);
    L = { cx, cy, handLen, cell, mobile, flowAngle, fx: Math.cos(flowAngle), fy: Math.sin(flowAngle), u: handLen / 400 };
    // normalized order coordinate along the flow, 0 at the start of the flow, 1 at its end
    const corners = [[0, 0], [W, 0], [0, H], [W, H]].map(p => p[0] * L.fx + p[1] * L.fy);
    L.u0 = Math.min(...corners); L.u1 = Math.max(...corners);
    L.uOf = (x, y) => (x * L.fx + y * L.fy - L.u0) / (L.u1 - L.u0);
    L.uTip = L.uOf(cx, cy);
    return true;
  }

  function handXform() {
    const s = L.handLen / (HAND.len * handImg.naturalWidth);
    const w = handImg.naturalWidth * s, h = handImg.naturalHeight * s;
    const cr = Math.cos(HAND.roll), sr = Math.sin(HAND.roll);
    const ox = -HAND.tip[0] * w, oy = -HAND.tip[1] * h;
    const toScene = (nx, ny) => { const lx = ox + nx * w, ly = oy + ny * h; return [L.cx + lx * cr - ly * sr, L.cy + lx * sr + ly * cr]; };
    const toImage = (x, y) => {                              // scene → normalized image coords
      const dx = x - L.cx, dy = y - L.cy;
      const lx = dx * cr + dy * sr, ly = -dx * sr + dy * cr;
      return [(lx - ox) / w, (ly - oy) / h];
    };
    return { s, w, h, toScene, toImage };
  }

  // Geometry is authored once per layout. The animation changes its light.
  function buildMarks() {
    const X = handXform();
    const spine = HAND.path.map(p => X.toScene(...p));
    energySpine = [];
    for (let i = 0; i < spine.length - 1; i++) {
      const p0 = spine[Math.max(0, i - 1)], p1 = spine[i];
      const p2 = spine[i + 1], p3 = spine[Math.min(spine.length - 1, i + 2)];
      for (let step = 0; step < 12; step++) {
        const t = step / 12, t2 = t * t, t3 = t2 * t;
        const point = [0, 1].map(axis => 0.5 * (
          2 * p1[axis] + (-p0[axis] + p2[axis]) * t
          + (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2
          + (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3
        ));
        energySpine.push(point);
      }
    }
    energySpine.push(spine[spine.length - 1]);
    const lengths = [0];
    for (let i = 1; i < spine.length; i++) {
      lengths.push(lengths[i - 1] + Math.hypot(spine[i][0] - spine[i - 1][0], spine[i][1] - spine[i - 1][1]));
    }
    function progress(x, y) {
      let nearest = Infinity, value = 0;
      for (let i = 1; i < spine.length; i++) {
        const [ax, ay] = spine[i - 1], [bx, by] = spine[i];
        const dx = bx - ax, dy = by - ay;
        const f = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy), 0, 1);
        const distance = (x - ax - dx * f) ** 2 + (y - ay - dy * f) ** 2;
        if (distance < nearest) {
          nearest = distance;
          value = lerp(lengths[i - 1], lengths[i], f) / lengths[lengths.length - 1];
        }
      }
      return value;
    }
    for (const point of energySpine) point.push(progress(point[0], point[1]));
    function sample(x, y) {
      const [u, v] = X.toImage(x, y);
      return lumAt(handLum, u, v);
    }
    function direction(x, y) {
      const [u, v] = X.toImage(x, y);
      const dx = 2.5 / X.w, dy = 2.5 / X.h;
      const gx = lumAt(handSoft, u + dx, v) - lumAt(handSoft, u - dx, v);
      const gy = lumAt(handSoft, u, v + dy) - lumAt(handSoft, u, v - dy);
      const amount = clamp(Math.hypot(gx, gy) / 0.035, 0, 1);
      const contour = Math.atan2(gy, gx) + Math.PI / 2 + HAND.roll;
      const anatomical = -0.38 + 0.16 * Math.sin(x * 0.013 + y * 0.009);
      // Lines have orientation, rather than a forward-facing arrow.
      return Math.atan2(
        Math.sin(contour * 2) * amount + Math.sin(anatomical * 2) * (1 - amount),
        Math.cos(contour * 2) * amount + Math.cos(anatomical * 2) * (1 - amount)
      ) / 2;
    }
    marks = [];
    etchings = [];
    contours = [];
    currents = [];
    arrivals = [];
    const cell = L.cell;
    let seed = 0;
    for (let y = 0; y < H; y += cell) {
      for (let x = 0; x < W; x += cell) {
        seed++;
        const r = hash(seed);
        const px = x + (r - 0.5) * cell * 1.8;
        const py = y + (hash(seed + 0.31) - 0.5) * cell * 1.8;
        marks.push({
          x: px, y: py, u: L.uOf(px, py), r,
          phase: hash(seed + 0.8) * Math.PI * 2,
          hand: sample(px, py),
          size: 1.0 + r * 1.9
        });
      }
    }

    // Fine curved hatching follows the measured surface. Occupancy keeps
    // neighbouring strokes apart, preserving dark air between the lines.
    const gap = clamp(L.handLen / 140, 1.65, 3);
    const gridWidth = Math.ceil(W / gap);
    const occupied = new Uint8Array(gridWidth * Math.ceil(H / gap));
    const occupiedIndex = (x, y) => Math.floor(y / gap) * gridWidth + Math.floor(x / gap);
    const candidates = [];
    for (let y = 8; y < H - 8; y += gap * 1.6) {
      for (let x = 8; x < W - 8; x += gap * 1.6) {
        const lum = sample(x, y);
        if (lum > 0.045) candidates.push({x, y, lum, rank: hash(x * 0.73 + y * 1.93)});
      }
    }
    candidates.sort((a, b) => a.rank - b.rank);
    for (const start of candidates) {
      if (occupied[occupiedIndex(start.x, start.y)]) continue;
      const points = [];
      const steps = 4 + Math.floor(start.rank * 15);
      const step = gap * 0.72;
      for (const sign of [-1, 1]) {
        let x = start.x, y = start.y;
        let angle = direction(x, y) + (sign < 0 ? Math.PI : 0);
        const half = [];
        for (let i = 0; i < steps; i++) {
          if (x < 1 || x >= W - 1 || y < 1 || y >= H - 1 || sample(x, y) < 0.035) break;
          if (i > 1 && occupied[occupiedIndex(x, y)]) break;
          half.push([x, y]);
          let next = direction(x, y);
          if (Math.cos(next - angle) < 0) next += Math.PI;
          angle += Math.atan2(Math.sin(next - angle), Math.cos(next - angle)) * 0.5;
          x += Math.cos(angle) * step;
          y += Math.sin(angle) * step;
        }
        if (sign < 0) points.push(...half.reverse());
        else points.push(...half.slice(1));
      }
      if (points.length < 3) continue;
      const path = new Path2D();
      path.moveTo(...points[0]);
      for (let i = 1; i < points.length; i++) {
        path.lineTo(...points[i]);
        occupied[occupiedIndex(...points[i])] = 1;
      }
      etchings.push({
        path, lum: start.lum,
        v: progress(start.x, start.y), rank: start.rank,
        x: start.x, y: start.y,
        sourceX: hash(start.x * 1.7 + start.y) * L.cx * 0.95,
        sourceY: hash(start.y * 2.3 + start.x) * H
      });
    }

    // Tonal contours supply longer, unbroken anatomical lines among the hatches.
    const levels = [0.065, 0.095, 0.14, 0.20, 0.28, 0.37, 0.47, 0.58, 0.70];
    const step = 2;
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      const level = levels[levelIndex];
      const grouped = new Map();
      for (let y = 0; y < HL_H - step; y += step) {
        for (let x = 0; x < HL_W - step; x += step) {
          const corners = [[x, y], [x + step, y], [x + step, y + step], [x, y + step]];
          const values = corners.map(([cx, cy]) => handSoft[cy * HL_W + cx]);
          const crossings = [];
          for (let edge = 0; edge < 4; edge++) {
            const next = (edge + 1) % 4;
            if ((values[edge] >= level) === (values[next] >= level)) continue;
            const amount = (level - values[edge]) / (values[next] - values[edge]);
            crossings.push(X.toScene(
              lerp(corners[edge][0], corners[next][0], amount) / (HL_W - 1),
              lerp(corners[edge][1], corners[next][1], amount) / (HL_H - 1)
            ));
          }
          if (crossings.length !== 2) continue;
          const [px, py] = crossings[0];
          if (px < 0 || px > W || py < 0 || py > H) continue;
          const v = Math.floor(progress(px, py) * 28) / 28;
          const key = v;
          if (!grouped.has(key)) grouped.set(key, {path: new Path2D(), v, level});
          const group = grouped.get(key);
          group.path.moveTo(...crossings[0]);
          group.path.lineTo(...crossings[1]);
        }
      }
      contours.push(...grouped.values());
    }

    // These long paths make the ambient field a composed current.
    // A narrow family reaches the tip. The others pass around the hand.
    const count = mobile ? 48 : 70;
    for (let i = 0; i < count; i++) {
      const offset = (i / (count - 1) - 0.5) * H * 1.5;
      const path = new Path2D();
      const points = [];
      const narrow = Math.abs(offset) < H * 0.17;
      for (let j = 0; j <= 90; j++) {
        const x = -40 + (W + 80) * j / 90;
        const approach = Math.exp(-Math.pow((x - L.cx) / (L.handLen * 0.44), 2));
        const opening = 0.18 + 0.82 * (1 - approach);
        const handBend = ease(seg(x, L.cx, L.cx + L.handLen * 0.6));
        const bend = Math.sign(offset) * handBend * L.handLen * 0.24;
        const wave = Math.sin(x / (W * 0.35) + i * 0.05) * H * 0.035;
        const y = L.cy + offset * opening + wave * (1 - approach) + bend;
        if (sample(x, y) > 0.04) {
          if (points.length > 0) break;
          continue;
        }
        if (points.length === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
        points.push([x, y]);
      }
      currents.push({path, points, rank: hash(i + 13), narrow});
    }
    for (let i = 0; i < 7; i++) {
      const startX = mobile ? -W * 0.1 : L.cx - L.handLen * 1.6;
      const startY = L.cy + (i - 3) * L.handLen * 0.12;
      arrivals.push({startX, startY, offset: (i - 3) * L.handLen * 0.055, rank: i / 7});
    }
  }

  function timeline(t) {
    const far = 0.11, near = -0.06;
    const reach = ease(seg(t, T.reach[0], T.contact));
    const release = ease(seg(t, T.rest[0], T.rest[1]));
    const front = L.uTip + lerp(lerp(far, near, reach), far, release);
    const spark = Math.exp(-Math.pow((t - 4.62) / 0.25, 2)) * 0.8
      + ease(seg(t, 4.5, 4.8)) * (1 - ease(seg(t, 7.8, 9.1))) * 0.22;
    const assembly = ease(seg(t, 0.6, 4.5)) * (1 - release);
    return {front, spark, reach, release, assembly, pulse: seg(t, T.pulse[0], T.pulse[1])};
  }

  const palettes = [];
  for (let i = 0; i < 24; i++) {
    const cold = mix(P.shade, P.skin, Math.pow(i / 23, 0.65));
    const lit = mix(cold, P.light, ease(seg(i / 23, 0.55, 1)) * 0.8);
    palettes.push(lit.map(Math.round).join(','));
  }
  const color = (rgb, alpha) => 'rgba(' + rgb + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';

  function draw(time) {
    if (!L || !handImg) return;
    const t = ((time % LOOP) + LOOP) % LOOP;
    const phase = t / LOOP * Math.PI * 2;
    const k = timeline(t);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);

    const atmosphere = ctx.createRadialGradient(L.cx + L.handLen * 0.4, L.cy, 1,
      L.cx + L.handLen * 0.4, L.cy, L.handLen * 0.85);
    atmosphere.addColorStop(0, 'rgba(90,107,126,0.22)');
    atmosphere.addColorStop(0.55, 'rgba(25,69,87,0.12)');
    atmosphere.addColorStop(1, 'rgba(7,8,10,0)');
    ctx.fillStyle = atmosphere;
    ctx.fillRect(0, 0, W, H);
    ctx.lineCap = 'round';

    // The drawn current becomes visible as it approaches the point of touch.
    const flowLight = ctx.createLinearGradient(0, 0, W, mobile ? H : 0);
    flowLight.addColorStop(0, 'rgba(70,139,166,0.10)');
    flowLight.addColorStop(0.40, 'rgba(88,157,181,0.22)');
    flowLight.addColorStop(0.65, 'rgba(119,188,205,0.42)');
    flowLight.addColorStop(1, 'rgba(113,143,157,0.14)');
    ctx.strokeStyle = flowLight;
    for (const current of currents) {
      ctx.globalAlpha = 0.6 + current.rank * 0.6;
      ctx.lineWidth = current.rank > 0.92 ? 1.1 : 0.6;
      ctx.stroke(current.path);
    }
    ctx.globalAlpha = 1;

    // A legible numerical field supplies the material of the drawing.
    ctx.font = '11px "JetBrains Mono", monospace';
    for (const m of marks) {
      const order = ease(seg(m.u, k.front - 0.06, k.front + 0.06));
      if (m.hand > 0.04 && order > 0.98) continue;
      const motion = (1 - order) * L.cell * 1.3;
      const x = m.x + Math.cos(phase + m.phase) * motion;
      const y = m.y + Math.sin(phase + m.phase) * motion * 0.6;
      const edge = 1 - ease(seg(Math.hypot(x - L.cx, y - L.cy), 8, L.handLen * 0.33));
      const alpha = (0.12 + m.r * m.r * 0.32) * (1 - order * 0.9) + edge * (1 - order) * 0.12;
      ctx.fillStyle = color('113,190,220', alpha);
      if (m.r > 0.89 && order < 0.6 && x < L.cx - 35) {
        ctx.fillText(String(Math.floor(m.phase * 1.5)), x, y);
      } else {
        ctx.fillRect(x, y, m.size, m.size);
      }
    }

    // The incoming signals converge before the hand carries their energy.
    const arrival = ease(seg(t, 2.1, 4.5));
    const arrivalFade = 1 - ease(seg(t, 4.5, 5.0));
    for (const line of arrivals) {
      const path = new Path2D();
      path.moveTo(line.startX, line.startY);
      path.bezierCurveTo(L.cx - L.handLen * 0.55, line.startY + line.offset,
        L.cx - L.handLen * 0.18, L.cy + line.offset, L.cx, L.cy);
      ctx.strokeStyle = color('116,195,213', 0.08 + arrival * arrivalFade * 0.35);
      ctx.lineWidth = 0.8;
      ctx.stroke(path);
      if (arrival > 0 && arrivalFade > 0) {
        const a = clamp(arrival * 1.07 - line.rank * 0.07, 0, 1);
        const inv = 1 - a;
        const x = inv ** 3 * line.startX + 3 * inv ** 2 * a * (L.cx - L.handLen * 0.55)
          + 3 * inv * a ** 2 * (L.cx - L.handLen * 0.18) + a ** 3 * L.cx;
        const y = inv ** 3 * line.startY + 3 * inv ** 2 * a * (line.startY + line.offset)
          + 3 * inv * a ** 2 * (L.cy + line.offset) + a ** 3 * L.cy;
        ctx.fillStyle = color('170,223,231', arrivalFade * (0.3 + arrival * 0.5));
        ctx.fillRect(x, y, 3, 3);
      }
    }

    function illumination(v) {
      const formed = ease(seg(k.assembly, 0.10 + v * 0.23, 0.62 + v * 0.30));
      const ordered = 0.18 + formed * 0.82;
      const distance = v - k.pulse;
      const pulse = t >= T.pulse[0] && t <= T.pulse[1]
        ? Math.exp(-(distance * distance) / 0.016) * (1 - ease(seg(v, 0.90, 1))) : 0;
      const arrivedAt = T.pulse[0] + v * (T.pulse[1] - T.pulse[0]);
      const memory = t > arrivedAt
        ? Math.exp(-(t - arrivedAt) / 2.5) * (1 - k.release) : 0;
      return {ordered, formed, pulse, memory};
    }
    // Selected marks travel out of the data field and settle into anatomy.
    for (const stroke of etchings) {
      if (stroke.rank < 0.76) continue;
      const light = illumination(stroke.v);
      if (light.formed > 0.995) continue;
      const amount = light.formed;
      const arc = Math.sin(amount * Math.PI);
      const x = lerp(stroke.sourceX, stroke.x, amount);
      const y = lerp(stroke.sourceY, stroke.y, amount)
        + arc * (stroke.rank - 0.85) * H * 0.7;
      ctx.fillStyle = color('143,216,239', (0.34 + amount * 0.40) * (1 - amount));
      if (stroke.rank > 0.94 && amount < 0.68) {
        ctx.fillText(String(Math.floor(stroke.rank * 100)), x, y);
      } else {
        const size = 2 + amount * 2;
        ctx.fillRect(x, y, size, size);
      }
    }
    for (const stroke of etchings) {
      const light = illumination(stroke.v);
      if (light.ordered < 0.005) continue;
      const shade = clamp((stroke.lum - 0.035) / 0.65, 0, 1);
      const rgb = palettes[Math.round(shade * 23)];
      ctx.lineWidth = 0.75 + stroke.rank * 0.40;
      ctx.strokeStyle = color(rgb, light.ordered * (0.48 + shade * 0.80 + light.memory * 0.26));
      ctx.stroke(stroke.path);
      if (light.pulse > 0.015) {
        ctx.strokeStyle = color('255,207,146', light.pulse * light.ordered * 0.95);
        ctx.lineWidth = 1.3;
        ctx.stroke(stroke.path);
      }
    }
    for (const contour of contours) {
      const light = illumination(contour.v);
      if (light.ordered < 0.005) continue;
      const copper = contour.level > 0.19;
      ctx.lineWidth = contour.level < 0.1 ? 1.0 : 0.85;
      ctx.strokeStyle = color(copper ? '221,170,124' : '110,169,183',
        light.ordered * (0.55 + contour.level * 0.50 + light.memory * 0.30 + light.pulse * 0.65));
      ctx.stroke(contour.path);
    }

    // A broad glow and a fine core make the travelling energy readable.
    if (t >= T.pulse[0] && t < T.pulse[1]) {
      ctx.globalCompositeOperation = 'lighter';
      for (const pass of [0, 1]) {
        ctx.lineWidth = pass === 0 ? L.handLen * 0.033 : Math.max(1.4, L.handLen * 0.0045);
        for (let i = 1; i < energySpine.length; i++) {
          const v = energySpine[i][2];
          const envelope = Math.exp(-Math.pow((v - k.pulse) / 0.12, 2))
            * ease(seg(t, T.pulse[0], T.pulse[0] + 0.3))
            * (1 - ease(seg(k.pulse, 0.86, 1)));
          if (envelope < 0.01) continue;
          ctx.strokeStyle = color(pass === 0 ? '255,160,70' : '255,235,192', envelope * (pass === 0 ? 0.13 : 0.9));
          ctx.beginPath();
          ctx.moveTo(energySpine[i - 1][0], energySpine[i - 1][1]);
          ctx.lineTo(energySpine[i][0], energySpine[i][1]);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    // A trace returns into the current after the hand has received the signal.
    const returning = seg(t, 6.5, 9.2);
    if (returning > 0 && returning < 1) {
      ctx.lineWidth = 1.0;
      const radius = returning * L.handLen * 1.05;
      const envelope = Math.sin(returning * Math.PI) * 0.5;
      for (const current of currents) {
        if (!current.narrow || current.rank < 0.35) continue;
        ctx.strokeStyle = color('217,167,119', envelope);
        ctx.beginPath();
        let drawing = false;
        for (const [x, y] of current.points) {
          const distance = Math.hypot(x - L.cx, y - L.cy);
          if (x > L.cx || Math.abs(distance - radius) > L.handLen * 0.10) { drawing = false; continue; }
          if (!drawing) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          drawing = true;
        }
        ctx.stroke();
      }
    }
    if (k.spark > 0.005) {
      const radius = L.handLen * 0.065;
      const glow = ctx.createRadialGradient(L.cx, L.cy, 0, L.cx, L.cy, radius);
      glow.addColorStop(0, color('255,247,225', k.spark));
      glow.addColorStop(0.12, color('255,222,171', k.spark * 0.7));
      glow.addColorStop(0.4, color('140,214,220', k.spark * 0.2));
      glow.addColorStop(1, 'rgba(140,214,220,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(L.cx - radius, L.cy - radius, radius * 2, radius * 2);
    }
  }

  function clock() { return pinned === null ? elapsed : pinned; }
  function frame(timestamp) {
    frameId = 0;
    if (paused || document.hidden || !onscreen || pinned !== null) { lastFrame = 0; return; }
    if (lastFrame === 0) lastFrame = timestamp;
    const delta = timestamp - lastFrame;
    if (delta >= 32) {
      elapsed += Math.min(delta, 100) / 1000;
      lastFrame = timestamp;
      draw(elapsed);
    }
    frameId = requestAnimationFrame(frame);
  }
  function resume() {
    if (!live || paused || document.hidden || !onscreen || pinned !== null || frameId) return;
    lastFrame = 0;
    frameId = requestAnimationFrame(frame);
  }
  function suspend() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrame = 0;
  }
  function relayout() {
    if (!handImg) return;
    if (layout()) { buildMarks(); draw(clock()); }
  }
  const motion = document.getElementById('heroMotion');
  if (motion) {
    motion.addEventListener('click', () => {
      paused = !paused;
      motion.setAttribute('aria-pressed', String(paused));
      motion.setAttribute('aria-label', paused ? 'Play background animation' : 'Pause background animation');
      if (paused) suspend();
      else resume();
    });
  }
  const hand = new Image();
  hand.onload = () => {
    try {
      handImg = hand;
      buildHandField();
      layout();
      buildMarks();
      if (PRM_STILL && matchMedia('(prefers-reduced-motion: reduce)').matches) pinned = 4.7;
      draw(clock());
      live = true;
      root.classList.add('live');
      if (motion && pinned === null) motion.hidden = false;
      resume();
    } catch (error) {
      root.classList.remove('live');
      console.warn('The hero is using its still image.', error);
    }
  };
  hand.onerror = () => root.classList.remove('live');
  hand.src = HAND.src;
  let resizeFrame = 0;
  const onResize = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(relayout);
  };
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(root);
  else window.addEventListener('resize', onResize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      onscreen = entries[0].isIntersecting;
      if (onscreen) resume();
      else suspend();
    }).observe(root);
  }
  document.addEventListener('visibilitychange', () => document.hidden ? suspend() : resume());
  window.addEventListener('pagehide', suspend);
  window.addEventListener('pageshow', () => { relayout(); resume(); });
  window.__hands = {
    setTime(t) { pinned = ((t % LOOP) + LOOP) % LOOP; suspend(); if (live) draw(pinned); },
    play() {
      pinned = null;
      paused = false;
      elapsed = 0;
      if (motion) {
        motion.hidden = !live;
        motion.setAttribute('aria-pressed', 'false');
        motion.setAttribute('aria-label', 'Pause background animation');
      }
      resume();
    },
    draw() { if (live) draw(clock()); },
    relayout() { L = null; relayout(); },
    get layout() { return L; },
    ready: () => live,
    LOOP
  };
})();

