// s5_fall.js: shots X-AB (2:19.37-2:47.84). The showdown at dawn, the last strand, the guillotine brought down by its
// own blade, the Headsman without his hood, and the town switching sides.
(() => {
  const CLING = [CUT[0], CUT[1] + 4.3 * U];
  const dawnK = t => seg(t, bar(44), bar(48));   // night → red dawn across the showdown
  const sky = t => t < bar(48) ? skyMix('night', 'redDawn', dawnK(t)) : skyMix('redDawn', 'sunrise', seg(t, bar(48), bar(53)));
  // Clawd's colours warm from moonlit back to daylight gray with the dawn
  const tone = (t, o) => { const k = t < bar(48) ? dawnK(t) * .6 : 1; return { col: mixCol(MOONLIT.col, CLAWD.col, k), dk: mixCol(MOONLIT.dk, CLAWD.dk, k), lt: mixCol(MOONLIT.lt, CLAWD.lt, k), ...o }; };
  const nightcaps = i => ({ ...FOLK[i], hat: i % 2 ? FOLK[i].hat : 'nightcap', boilKey: 'crowd' + i });
  // screen-space rope helper for close-ups (p5.brush lines collapse inside a strongly zoomed camera)
  function ropeScreen(cam, pts, w, col = '#CDBB94') { const [cx, cy, z] = cam; inkLine(pts.map(([x, y]) => [W / 2 + (x - cx) * z, H / 2 + (y - cy) * z]), w * z / 1.3, col, 'inkfine', .2); }

  // X · 139.37-145.70 · the Headsman charges across the square and up the steps; windows light; the town pours out
  function X(t, lt, dur) {
    const s0 = bar(44), beats = [0, 1, 2, 3, 4, 5, 6, 7].map(i => s0 + i * BEAT);
    const run = ease(seg(t, s0, s0 + 3.0)), climb = seg(t, s0 + 3.0, s0 + 4.4);
    let hx = lerp(230, 1470, run); if (climb > 0) hx = lerp(1470, 1250, ease(climb));
    const hgy = hx > 1450 ? GY : hx < 1320 ? PY : lerp(PY, GY, (hx - 1320) / 130);
    const shk = ring(t, beats, 9, 30), [sx, sy] = shakeXY(t, 6 * Math.abs(shk));
    camBegin(880 + sx, 440 + sy, .74);
    backdrop(sky(t), { moon: [386, 354 + 200 * dawnK(t), 58], lit: seg(t, s0 + 1, s0 + 3) });
    hut(60, GY, { door: 1, lamp: 1 - seg(t, s0, s0 + 3) });
    scaffold({ stain: .9 }); guillotine({ blood: .6, fray: .93, swing: .03 * shk });
    for (const b of beats) dust(hx, hgy, 22, t - b, b);
    headsman(hx, hgy, U, { flip: hx > 1400 && climb > 0, walk: run < 1 ? run * 7 : climb < 1 ? climb * 3 : null, rot: run < 1 ? .12 : 0, glow: 1, lookX: .6, lookY: -.8, aL: 1.2 * (1 - climb), aR: 1.4 * (1 - climb) });
    for (let i = 0; i < 5; i++) {
      const k = ease(seg(t, s0 + 2.8 + i * .3, s0 + 4.0 + i * .3));
      folk(lerp(-380, 60 + i * 130, k), GY, 22, { ...nightcaps(i), dy: k < 1 ? -Math.abs(Math.sin(k * 9)) * .8 : 0, lookX: .8, eyes: 'wide', mouth: 'o' });
    }
    clawd(CLING[0], CLING[1], U, tone(t, { ...feel('scared', t, { lookX: -1, lookY: .8 }), noShadow: true, aL: 1.5, aR: 1.5, boilKey: 'clawd' }));
    camEnd();
  }

  // Y · 145.70-152.03 · the two-shot: he grabs the rope below Clawd and yanks; Clawd bites down on the last strand
  function Y(t, lt, dur) {
    const s0 = bar(46), grab = s0 + .8, yank = t > grab ? 22 * (1 - pulse(t, 5)) : 0, tBite = s0 + 3.2;
    const cam = [1120, 215, 1.25 + .03 * lt];
    camBegin(...cam);
    backdrop(sky(t), { lit: 1 });
    scaffold({ stain: .9 }); guillotine({ blood: .6, fray: .93 + .05 * seg(t, tBite, s0 + dur), swing: .02 * Math.sin(t * 4), noLever: true });
    const hand = [CUT[0], 380 + yank * .5];
    headsman(1250, PY, U, { flip: true, reachR: t > grab ? hand : [lerp(1180, hand[0], seg(t, s0, grab)), lerp(560, hand[1], seg(t, s0, grab))], aL: .4 + .5 * (t > grab ? 1 : 0),
      glow: 1, lookX: -.6, lookY: -1, rot: -.05 - .03 * (yank / 22), sq: .04 * yank / 22 });
    const bite = t > tBite ? .1 + .55 * (1 - pulse(t, 7)) : 0;
    clawd(CLING[0], CLING[1] + yank * .6, U, tone(t, { ...feel(t > tBite ? 'furious' : 'angry', t), tint: null, lid: bite, eyes: t > tBite ? 'red' : 'angry', emote: t > tBite ? 'steam' : null, emoteAge: t,
      noShadow: true, aL: 1.5, aR: -.9, boilKey: 'clawd' }));
    camEnd();
    ropeScreen(cam, [[CUT[0], CUT[1] - 40], [CUT[0], CUT[1]], [CUT[0], CUT[1] + 60]], 1.4 * (1 - .8 * seg(t, tBite, s0 + dur)));
  }

  // The guillotine coming apart: k = 0 standing, 1 down. The blade falls crooked and cuts through the left post; the
  // right post (with Clawd on it) falls right, the left post falls left, the crossbeam tumbles onto the deck.
  function wreck(k, o = {}) {
    const half = 118, beam = (x, y, w, h, a, px, py, key) => { boilSeed('wreck ' + key); push(); translate(px, py); rotate(a); translate(-px, -py); paint(rectPts(x, y, w, h, 2), { wash: G.wood, fill: G.woodDk, fillOp: 80, tex: .6, ink: G.ink, sw: 1.1 }); pop(); };
    const kL = easeIn(seg(k, .15, 1)), kR = easeIn(seg(k, .1, .95)), kB = easeIn(seg(k, 0, .85));
    // posts pivot at their feet
    beam(GX - half - 20, -20, 40, PY + 20, -1.35 * kL, GX - half, PY, 'L');
    beam(GX + half - 20, -20, 40, PY + 20, 1.3 * kR, GX + half, PY, 'R');
    // crossbeam drops and tumbles onto the deck
    const cbx = lerp(GX, GX + 140, kB), cby = lerp(-37, PY - 30, kB * kB);
    beam(cbx - half - 60, cby - 23, 2 * half + 120, 46, .5 * kB, cbx, cby, 'C');
    // block
    boilSeed('wreck block'); paint(rectPts(GX - half, PY - 96, 2 * half, 96, 2), { wash: G.woodDk, fill: G.wood, fillOp: 60, ink: G.ink, sw: 1 });
    // the blade, crooked, ending wedged in the block
    const bk = easeIn(seg(k, 0, .35)), by = lerp(BLADE_TOP, PY - 150, bk), ba = lerp(0, .55, bk);
    boilSeed('wreck blade'); push(); translate(GX, by); rotate(ba);
    paint([[-96, -60], [96, -60], [96, 10], [-96, 56]], { wash: '#8F8C88', ink: G.ink, sw: 1.3 });
    paint([[-96, 56], [96, 10], [96, -6], [-96, 38]], { wash: '#F4F0E6', ink: null });
    paint([[-94, 54], [94, 11], [92, -5], [-92, 30]], { wash: G.red, washOp: 150, ink: null });
    pop();
    if (o.cb) o.cb({ kR, postTop: [GX + half + Math.sin(1.3 * kR) * (PY + 20), PY - Math.cos(1.3 * kR) * (PY + 20)] });
  }

  // Z · 152.03-155.19 · break 4: the strand snaps, the blade drops crooked, the guillotine splits and falls, dust
  const tSnap = bar(48) + .12;
  function Z1(t, lt) {
    const cam = [CUT[0], CUT[1] + 20, 3.0];
    camBegin(...cam);
    backdrop(sky(t), { lit: 1 });
    guillotine({ blood: .6, ropeCut: t > tSnap, fray: .99, noLever: true });
    clawd(CLING[0], CLING[1], U, tone(t, { ...feel('furious', t), tint: null, lid: t > tSnap ? 0 : .6 * (1 - seg(t, tSnap - .1, tSnap)), eyes: t > tSnap ? 'wide' : 'red', emote: null, noShadow: true, aL: 1.5, aR: -.9, boilKey: 'clawd' }));
    camEnd();
    if (t < tSnap) ropeScreen(cam, [[CUT[0], CUT[1] - 60], [CUT[0], CUT[1]], [CUT[0], CUT[1] + 80]], .6);
    else { const r = easeOut(seg(t, tSnap, tSnap + .3)); ropeScreen(cam, [[CUT[0], CUT[1] - 60], [CUT[0] - 10 * r, CUT[1] - 30 - 30 * r], [CUT[0] - 30 * r, CUT[1] - 70 * r - 5]], 2.2); ropeScreen(cam, [[CUT[0] + 30 * r, CUT[1] + 60 * r + 5], [CUT[0] + 8 * r, CUT[1] + 40 + 20 * r], [CUT[0], CUT[1] + 90]], 2.2); }
    flash(1 - seg(t, tSnap, tSnap + .12), G.bone);
  }
  function Z2(t, lt) {   // the blade falls crooked and bites into the left post
    const k = seg(lt, 0, .6) * .35, [sx, sy] = shakeXY(t, lt > .2 ? 10 : 0);
    camBegin(900 + sx, 330 + sy, .9);
    backdrop(sky(t), { lit: 1 });
    scaffold({ stain: .9 });
    wreck(k, { cb: ({ postTop }) => clawd(postTop[0] + 60, postTop[1] + 180, U, tone(t, { ...feel('scared', t), noShadow: true, aL: 1.5, aR: 1.5, boilKey: 'clawd' })) });
    headsman(1250, PY, U, { flip: true, aR: 1.8, aL: 1.2, glow: 1, lookX: -.8, lookY: -1, rot: .1 * seg(lt, .1, .6) });
    camEnd();
  }
  function Z3(t, lt) {   // wide: it all comes down; Clawd rides the right post down
    const k = lerp(.35, 1, easeIn(seg(lt, 0, 1.0))), landed = lt > 1.0, [sx, sy] = shakeXY(t, landed ? 18 * Math.exp(-(lt - 1) * 4) : 0);
    camBegin(950 + sx, 420 + sy, .72);
    backdrop(sky(t), { lit: 1 });
    scaffold({ stain: .9 });
    for (let i = 0; i < 5; i++) folk(80 + i * 120, GY, 22, { ...nightcaps(i), eyes: 'wide', mouth: 'O', cheer: .3, lookX: .9 });
    wreck(k, { cb: ({ postTop }) => clawd(postTop[0] - 20, postTop[1] - 10, U, tone(t, { ...feel(landed ? 'dizzy' : 'scared', t), rot: 1.3 * k - .4, noShadow: true, aL: 1.5, aR: 1.5, boilKey: 'clawd' })) });
    headsman(1000, PY, U, { flip: true, aR: 2.2, aL: 2.0, glow: 1, lookX: -.3, lookY: -1, dy: landed ? .4 : 0, sq: landed ? .25 : 0 });
    if (landed) for (let i = 0; i < 6; i++) dust(700 + i * 150, PY - 10, 40, lt - 1 - i * .03, 40 + i);
    camEnd();
  }
  function Z4(t, lt, dur) {   // dust fills the frame
    Z3(t, lt + 1.2);
    for (let i = 0; i < 9; i++) { boilSeed('cloud' + i); const r = lerp(200, 520, seg(lt, 0, dur)) * (.7 + .5 * hash(i)); paint(ellPts(hash(i * 3) * W, H * .3 + hash(i * 5) * H * .7, r, r * .7, 18, 20), { wash: mixCol(G.boneDkr, '#E0A080', .25), washOp: 235, ink: null }); }
  }

  // The heap: the wrecked guillotine lying on the deck (after Z).
  const heap = () => { wreck(1); };

  // AA · 155.19-161.52 · the dust clears: Clawd on top of the heap; the Headsman in the rubble, hood pinned by the blade;
  // he tugs free, the hood tears away: a small, nervous face
  function AA(t, lt, dur) {
    const s0 = bar(49), tTear = s0 + 2.6, tug = seg(t, s0 + 1.8, tTear), torn = t > tTear;
    camBegin(1060, 530 + 15 * Math.sin(lt * .3), 1.3);
    backdrop(sky(t));
    scaffold({ stain: .9 }); heap();
    for (let i = 0; i < 5; i++) folk(80 + i * 120, GY, 22, { ...nightcaps(i), eyes: 'wide', mouth: 'o', lookX: .9 });
    // the hood: a red strip from his head to the blade in the block; after the tear, a rag under the blade
    const hx = 1010 + 40 * tug * (1 - (torn ? 1 : 0)) + (torn ? 60 * easeOut(seg(t, tTear, tTear + .3)) : 0);
    if (!torn) { boilSeed('hood strap'); paint(ribbon([[hx - 30, PY - 14 * U], [lerp(hx - 30, 930, .5), PY - 11 * U + 20 * tug], [930, PY - 150]], 50, 30), { wash: G.oxblood, ink: G.ink, sw: .9 }); }
    else { boilSeed('hood rag'); paint([[880, PY - 150], [990, PY - 170], [960, PY - 120], [900, PY - 110]], { wash: G.oxblood, ink: G.ink, sw: .9, curv: .3 }); }
    headsman(hx, PY, U, { flip: true, sq: .28, dy: .2, hoodless: torn, sweat: torn, rot: -.12 * tug + (torn ? .08 * spring(t, tTear, 4, 10) : 0), aR: 1 + .6 * tug, aL: .4, lookX: torn ? .8 : -.6, glow: torn ? 0 : .6 });
    // Clawd, on top of the heap with the rope's end
    const m = emotions(t, [[s0 - 1, 'dizzy'], [s0 + .9, 'determined', { lookX: -.8, lookY: .6 }], [tTear + .15, 'surprised', { lookX: -.8, lookY: .6 }]], { take: .9 });
    clawd(1330, PY - 150, U, tone(t, { ...m, flip: true, boilKey: 'clawd', noShadow: true, aR: .6, armR: (u, sw) => inkLine([[0, 0], [u * 1.5, u * 2], [u * .8, u * 4]], 1.3, '#CDBB94', 'ink', .4) }));
    camEnd();
    if (lt < .8) for (let i = 0; i < 9; i++) { boilSeed('cloud' + i); const r = lerp(520, 300, lt / .8) * (.7 + .5 * hash(i)); paint(ellPts(hash(i * 3) * W, H * .3 + hash(i * 5) * H * .7, r, r * .7, 18, 20), { wash: mixCol(G.boneDkr, '#E0A080', .25), washOp: 235 * (1 - lt / .8), ink: null }); }
  }

  // AB · 161.52-167.84 · the crowd looks from him to Clawd; one hat goes up; the cheer spreads; Clawd plants the petal
  function AB(t, lt, dur) {
    const s0 = bar(51), tHat = s0 + 1.6, tPlant = s0 + 3.9;
    if (t < tPlant) {
      camBegin(...kf(lt, [[0, [620, 640, 1.0]], [2.2, [700, 640, 1.0]], [3.9, [860, 620, .95]]], ease));
      backdrop(sky(t));
      scaffold({ stain: .9 }); heap();
      headsman(1030, PY, U, { flip: true, hoodless: true, sq: .28, dy: .2, sweat: true, aL: .3, aR: .3, lookX: lt < 1.5 ? -.8 : .8 });
      for (let i = 0; i < 5; i++) {
        const tc = tHat + [0, .5, .3, .7, .9][i] * (i === 2 ? 0 : 1), cheer = t > tc ? 1 : 0, b = cheer ? Math.abs(Math.sin((t * 2.6 + hash(i)) * Math.PI)) : 0;
        const look = lt < .9 ? .9 : lt < 1.5 ? 1 : 1;
        folk(80 + i * 120, GY, 22, { ...nightcaps(i), hat: i === 2 && t > tHat ? 'none' : nightcaps(i).hat, eyes: cheer ? 'shut' : 'dot', mouth: cheer ? 'open' : 'o', cheer, wave: true, dy: -1.1 * b, lookX: look });
      }
      if (t > tHat) { const k = seg(t, tHat, tHat + 1.4), p = arcPt([320, GY - 170], [460, GY - 40], 420, k); flyingHat(p[0], p[1], 22, k * 9, k < 1 ? 'top' : 'top'); }
      const m = emotions(t, [[s0 - 1, 'surprised'], [tHat + .6, 'surprised', { lookX: -1, emote: '!' }], [tHat + 1.4, 'proud']], { take: .8 });
      clawd(1330, PY - 150, U, { ...m, flip: true, boilKey: 'clawd', noShadow: true });
      camEnd();
    } else {   // the petal pressed into the cobbles in front of the heap
      const lt2 = t - tPlant, press = ease(seg(lt2, .6, 1.3));
      camBegin(880, 820, 2.3 - .05 * lt2);
      backdrop(sky(t));
      scaffold({ stain: .9 }); heap();
      clawd(800, GY, U, { ...feel('hopeful', t, { lookX: .8, lookY: .9 }), view: 'q', sq: .2 * press, dy: -.1, aR: lerp(.5, -.7, press), boilKey: 'clawd' });
      petal(lerp(960, 935, press), lerp(GY - 110, GY - 10, press), 42, lerp(.4, 1.5, press), 'kept');
      if (press >= 1) dust(920, GY, 8, lt2 - 1.3, 60);
      camEnd();
    }
  }

  shots([[bar(44), X], [bar(46), Y], [bar(48), Z1], [bar(48) + .57, Z2], [bar(48) + 1.17, Z3], [bar(48) + 2.37, Z4], [bar(49), AA], [bar(51), AB]]);
})();
