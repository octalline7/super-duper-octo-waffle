// s6_bloom.js: the outro, shots AC-AF and the iris out (2:47.84-3:42). The dance on the rubble, the flower returns,
// the square blooms, the bonfire, the silhouettes, and the morning after.
(() => {
  const SEED = [935, GY];   // where the petal was planted: the first flower
  const sunrise = t => backdrop(SKY.sunrise, { sun: [900, 560 - 60 * seg(t, bar(53), bar(65)), 170] });
  const hoodless = { hoodless: true };
  // a different dance per townsperson (no twinning), all on the beat
  function folkDance(i, t) {
    const bp = bpOf(t), s = Math.sin(bp * Math.PI), a = Math.abs(s), hit = pulse(t, 6);
    switch (i % 5) {
      case 0: return { dy: -1.6 * a, cheer: 1, wave: true };                                  // hop, arms up
      case 1: return { dx: 0, rot: .15 * s, dy: -.4 * a, cheer: .5 + .5 * a };                // sway
      case 2: return { dy: -.8 * Math.abs(Math.sin(bp * TAU)), sq: .1 * hit, cheer: .7 };     // double-time bounce
      case 3: return { rot: .1 * Math.sin(bp * TAU), dy: -.3 * a, cheer: 1 - a };             // shimmy, arms pumping
      default: return { dy: -1.1 * a, sq: .15 * hit, cheer: .3 + .7 * hit };                  // stomp and punch
    }
  }
  function dancers(t, xs, gy, u, o = {}) {
    xs.forEach((x, i) => { const d = folkDance(i, t + hash(i) * .1); folk(x + (d.dx || 0), gy, u, { ...FOLK[i], boilKey: 'crowd' + i, eyes: 'shut', mouth: 'open', ...d, ...o }); });
  }
  // The flower field: flowers pop up in rings out from the first flower as k goes 0 → 1. Farther = smaller.
  const FIELD = Array.from({ length: 70 }, (_, i) => {
    const y = HY + 40 + Math.pow(hash(i * 2.3), .8) * 330, x = -500 + hash(i * 1.7) * 2900, s = lerp(9, 26, (y - HY) / 370);
    return { x, y, s, d: Math.hypot((x - SEED[0]) / 3, (y - SEED[1])) };
  }).sort((a, b) => a.y - b.y);
  function field(t, k) {
    const dmax = 700;
    FIELD.forEach((f, i) => { const g = clamp((k * dmax - f.d) / 60); if (g > 0) flower(f.x, f.y, f.s, { grow: g, key: 'field' + i, bob: .12 * Math.sin(bpOf(t) * Math.PI + i) }); });
  }
  // the heap bouncing on the beat
  const bouncingHeap = t => { push(); translate(0, -5 * pulse(t, 7)); scaffold({ stain: .9 }); wreckHeap(); pop(); };

  // AC1 · 167.84-174.17 · Clawd stomps on the rubble, alone at first
  function AC1(t, lt, dur) {
    camBegin(1180, 520, 1.15 + .02 * lt);
    sunrise(t); bouncingHeap(t);
    headsman(1030, PY, U, { flip: true, ...hoodless, sq: .28, dy: .2, lookX: .8, lookY: -.5, aL: .3, aR: .3 });
    const m = emotions(t, [[bar(52), 'proud'], [bar(53) + 1.5, 'excited']], { take: .8 });
    clawd(1330, PY - 150, U, { ...m, ...move('stomp', t), boilKey: 'clawd', noShadow: true, eyes: m.eyes, mouth: m.mouth });
    camEnd();
  }

  // AC2 · 174.17-180.50 · the town joins in, one by one; two of them haul the Headsman up and he gets into it
  function AC2(t, lt, dur) {
    const s0 = bar(55);
    camBegin(...kf(lt, [[0, [1000, 540, 1.0]], [dur, [880, 560, .82]]], ease));
    sunrise(t); bouncingHeap(t);
    const xs = [60, 190, 320, 450, 580];
    xs.forEach((x, i) => { const on = t > s0 + i * BEAT * .75, d = on ? folkDance(i, t) : { cheer: .2 }; folk(x, GY, 22, { ...FOLK[i], boilKey: 'crowd' + i, eyes: on ? 'shut' : 'dot', mouth: on ? 'open' : 'o', lookX: .8, ...d }); });
    const up = ease(seg(t, s0 + 2.4, s0 + 3.2)), into = seg(t, s0 + 4.2, s0 + 5);
    headsman(1030, PY, U, { flip: true, ...hoodless, sq: lerp(.28, 0, up) + .08 * pulse(t, 6) * into, dy: lerp(.2, 0, up) - .6 * Math.abs(Math.sin(bpOf(t) * Math.PI)) * into,
      aL: lerp(.3, 2.3, into) + .2 * Math.sin(t * 5), aR: lerp(.3, 2.1, into), lookX: -.5, sweat: into < .5, rot: .06 * Math.sin(bpOf(t) * Math.PI) * into });
    clawd(1330, PY - 150, U, { ...feel('excited', t), ...move('stomp', t), eyes: 'wide', mouth: 'open', boilKey: 'clawd', noShadow: true });
    camEnd();
  }

  // AD1 · 180.50-186.83 · where the petal went in, a red flower sprouts on the downbeat; Clawd sees it: love
  function AD1(t, lt, dur) {
    const s0 = bar(57), grow = ease(seg(t, s0, s0 + 1.6)), tSee = s0 + 2.2;
    camBegin(900, 790, 2.0 - .04 * lt);
    sunrise(t); scaffold({ stain: .9 }); wreckHeap();
    flower(SEED[0], SEED[1], 34, { grow: grow + .001, key: 'first', bob: .15 * Math.sin(bpOf(t) * Math.PI) * grow });
    const walk = seg(t, s0 + 1.4, tSee);
    const m = emotions(t, [[s0 - 1, 'excited'], [tSee, 'surprised', { lookX: .8, lookY: .5 }], [tSee + .7, 'love', { lookX: .6, lookY: .4 }]], { take: .8 });
    clawd(lerp(620, 790, ease(walk)), GY, U, { ...m, view: walk > 0 && walk < 1 ? 'q' : 'front', walk: walk * 3, boilKey: 'clawd' });
    camEnd();
  }

  // AD2 · 186.83-193.15 · with every stomp more flowers burst up in rings, until the square is red; the camera cranes up
  function AD2(t, lt, dur) {
    const s0 = bar(59), steps = Math.max(0, bpOf(t) - bpOf(s0)), k = clamp((Math.floor(steps) + easeOut(clamp(frac(steps) * 3))) / 7);
    camBegin(...kf(lt, [[0, [920, 780, 1.45]], [dur, [920, 560, .72]]], ease));
    sunrise(t); scaffold({ stain: .9 }); wreckHeap();
    field(t, k);
    flower(SEED[0], SEED[1], 34, { key: 'first', bob: .15 * Math.sin(bpOf(t) * Math.PI) });
    clawd(790, GY, U, { ...feel('excited', t), ...move('stomp', t), eyes: 'heart', mouth: 'open', boilKey: 'clawd' });
    for (let i = 0; i < 4; i++) dust(790, GY, 14, t - (s0 + i * BEAT), 70 + i);
    camEnd();
  }

  // AE1 · 193.15-199.48 · the beams go on a bonfire; flames jump on the beat; the blade is a spade now
  function bonfire(x, y, t, s = 1) {
    const h = pulse(t, 4);
    glow(x, y - 120 * s, 420 * s * (1 + .15 * h), '#FF9A50', .9);
    for (let i = 0; i < 5; i++) { boilSeed('flame' + i); const fx = x + (i - 2) * 40 * s, fh = (180 + 90 * hash(i) + 70 * h) * s, sw2 = 30 * Math.sin(t * 7 + i) * s;
      paint([[fx - 50 * s, y], [fx - 30 * s + sw2 * .4, y - fh * .5], [fx + sw2, y - fh], [fx + 30 * s + sw2 * .4, y - fh * .5], [fx + 50 * s, y]], { wash: i % 2 ? '#E8542E' : '#F29A3A', ink: null, curv: .6 }); }
    boilSeed('logs'); for (let i = 0; i < 4; i++) paint(rectPts(x - 110 * s, y - 20 * s - i * 6 * s, 220 * s, 24 * s, 2), { wash: G.woodDk, ink: G.ink, sw: .8 });
  }
  const FIRE = [420, GY + 40];
  function AE1(t, lt, dur) {
    const s0 = bar(61);
    camBegin(640, 600, .95);
    sunrise(t);
    field(t, 1);
    bonfire(...FIRE, t);
    // beams tossed from the right onto the fire, one per bar-half
    for (let j = 0; j < 4; j++) { const k = seg(t, s0 + j * 1.58, s0 + j * 1.58 + 1.1); if (k <= 0 || k >= 1) continue;
      const p = arcPt([1000, PY - 60], [FIRE[0], FIRE[1] - 60], 280, k); boilSeed('toss' + j); push(); translate(p[0], p[1]); rotate(k * 6 + j); paint(rectPts(-110, -18, 220, 36, 2), { wash: G.wood, ink: G.ink, sw: .9 }); pop(); }
    dancers(t, [150, 270, 700, 820, 940], GY, 22);
    // the ex-Headsman, digging a new bed with the old blade
    const dig = frac(bpOf(t) / 2);
    headsman(1180, GY, U, { ...hoodless, aR: lerp(1.2, .2, ease(seg(dig, 0, .4))), aL: .4, lookX: .6, lookY: .6, dy: -.2 * pulse(t, 5),
      handR: (u, sw) => { boilSeed('spade'); push(); rotate(.3); paint([[-u * 2, u * 2], [u * 2, u * 2], [u * 2, u * 4.5], [-u * 2, u * 5.5]], { wash: '#8F8C88', ink: G.ink, sw: sw * .7 }); pop(); } });
    clawd(560, GY, U, { ...feel('laugh', t), ...move('hop', t), boilKey: 'clawd' });
    camEnd();
  }

  // AE2 · 199.48-205.81 · silhouettes around the fire against a huge red sun, everyone out of step
  function AE2(t, lt, dur) {
    camBegin(900 + 20 * Math.sin(lt * .3), 600, .9);
    backdrop(SKY.sunrise, { sun: [900, 300, 300] });
    const sil = G.charDk;
    bonfire(900, GY + 30, t, 1.2);
    const xs = [360, 520, 1280, 1440, 1600];
    xs.forEach((x, i) => { const d = folkDance(i, t + .2 * i); folk(x, GY, 24, { hat: FOLK[i].hat, col: sil, boilKey: 'crowd' + i, eyes: 'none', back: true, ...d }); });
    headsman(1120, GY, U, { ...hoodless, dy: -.8 * Math.abs(Math.sin(bpOf(t) * Math.PI + .7)), aL: 2.4 + .3 * Math.sin(t * 5), aR: 2 + .3 * Math.sin(t * 5 + 2), rot: .08 * Math.sin(bpOf(t) * Math.PI) });
    clawd(700, GY, U, { ...move('spin', t, 2), eyes: 'happy', mouth: 'open', col: sil, dk: sil, lt: '#3A3440', boilKey: 'clawd' });
    camEnd();
  }

  // AF1 · 205.81-212.14 · morning: a slow crane down from the sky to the square full of flowers (rhymes with shot A)
  function AF1(t, lt, dur) {
    camBegin(...kf(lt, [[0, [900, 200, .78]], [dur, [930, 760, 1.15]]], ease));
    backdrop(SKY.morning);
    fog(.25 * (1 - seg(lt, 0, 4)), t);
    field(t, 1);
    flower(SEED[0], SEED[1], 34, { key: 'first', bob: .1 * Math.sin(t * 2) });
    camEnd();
  }

  // AF2 · 212.14-218.47 · Clawd waters the first flower among hundreds; the ex-Headsman sweeps beside; a look to camera
  function AF2(t, lt, dur) {
    camBegin(...kf(lt, [[0, [950, 770, 1.3]], [dur, [930, 790, 1.5]]], ease));
    backdrop(SKY.morning);
    field(t, 1);
    const tip = ease(seg(lt, .4, .9)) * (1 - ease(seg(lt, 3.6, 4.1)));
    flower(SEED[0], SEED[1], 34, { key: 'first', bob: .06 * Math.sin(t * 2.2) + .1 * tip * Math.sin(t * 9) });
    const sweep = Math.sin(bpOf(t) * Math.PI);
    headsman(1230, GY, U, { ...hoodless, flip: true, lookX: -.5, lookY: .6, aR: .5 + .3 * sweep, handR: (u, sw) => { rotate(.6 + .25 * sweep); broomAt(u * 6, { key: 'mended' }); inkLine([[-u * 1.2, -u * .4], [-u * 1.2, u * .4]], .8, '#CDBB94', 'ink', 0); } });
    const m = emotions(t, [[bar(67) - 1, 'happy'], [bar(67) + 4.4, 'relieved', { lookX: 0, lookY: 0 }]], { take: .4 });
    clawd(820, GY, U, { ...m, view: lt < 4.3 ? 'q' : 'front', aR: .4 + .3 * tip, boilKey: 'clawd',
      armR: lt < 4.3 ? (u, sw) => { translate(u * .6, u * .2); wateringCan(u * .9, -.1 + .55 * tip, tip); } : null });
    camEnd();
  }

  // Out · 218.47-222 · the iris closes onto the first flower as the song rings out; hold on black
  function Out(t, lt, dur) {
    const cam = [930, 800, 1.5 + .03 * lt];
    camBegin(...cam);
    backdrop(SKY.morning); field(t, 1);
    flower(SEED[0], SEED[1], 34, { key: 'first', bob: .06 * Math.sin(t * 2.2) });
    clawd(820, GY, U, { ...feel('happy', t), boilKey: 'clawd' });
    const at = toScreen(SEED[0], SEED[1] - 100);
    camEnd();
    iris(at[0], at[1], lerp(1300, 0, easeIn(seg(lt, .2, 2.4))), G.ink);
  }

  shots([[bar(53), AC1], [bar(55), AC2], [bar(57), AD1], [bar(59), AD2], [bar(61), AE1], [bar(63), AE2], [bar(65), AF1], [bar(67), AF2], [bar(69), Out]]);
})();
