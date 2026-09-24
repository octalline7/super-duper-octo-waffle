// s3_grief.js: shots N-R (1:16.10-1:47.73). Rain; Clawd keeps a petal; grief turns to anger; the broom tug of war;
// the third drop and the idea.
(() => {
  const wet = () => backdrop(SKY.rain);
  // what's left of the flower on the block: a cut stem
  const stub = () => { boilSeed('stub'); inkLine([[GX - 30, PY - 98], [GX + 34, PY - 104]], 1.4, G.stem, 'ink', .3); };
  const petalHook = (u, sw) => petal(u * .7, -u * .2, 30, .4, 'kept');

  // N · 76.10-82.42 · rain; the crowd hurries home; Clawd, alone on the deck, finds one whole petal and picks it up
  function N(t, lt, dur) {
    const s0 = bar(24), tSpot = s0 + 2.7, tPick = s0 + 4.6;
    camBegin(...kf(lt, [[0, [1000, 560, .95]], [2.6, [1020, 580, 1.0]], [dur, [1110, 660, 1.5]]], ease));
    wet();
    scaffold({ stain: .9 }); guillotine({ drop: 1, blood: .9 }); stub();
    // the crowd leaves under umbrellas, out of step
    const xs = [700, 560, 420, 280, 140];
    for (let i = 0; i < 5; i++) {
      const x = xs[i] - (lt - i * .15) * (190 + 20 * hash(i)), b = Math.abs(Math.sin((t * 2.4 + hash(i)) * Math.PI));
      folk(x, GY, 22, { ...FOLK[i], boilKey: 'crowd' + i, flip: true, umbrella: true, dy: -.5 * b, lookX: .3, mouth: 'frown' });
    }
    // the last petals land on the deck; one stays whole
    for (let i = 0; i < 4; i++) {
      const k = seg(t, s0 - .4 + i * .2, s0 + 1.6 + i * .2), x = 1010 + i * 42 + 30 * Math.sin(k * 5 + i), y = lerp(PY - 360, PY - 6, easeOut(k));
      if (i === 1 && t > tPick) continue;
      petal(x, y, 16, k * 4 + i + (k >= 1 ? -k * 4 + i * .8 : 0), 'fall' + i);
    }
    const walkK = seg(t, tSpot + .6, tPick - .1);
    const mood = emotions(t, [[s0, 'cry', { emote: null }], [tSpot, 'sad', { lookX: -.8, lookY: .8, emote: null }], [tPick + .1, 'sad', { lookY: .4, emote: 'cloud' }]], { take: .4 });
    clawd(lerp(1220, 1150, ease(walkK)), PY, U, { ...mood, view: walkK > 0 && walkK < 1 ? 'q' : 'front', flip: true, walk: walkK * 2, boilKey: 'clawd', draw: spotsHook(9),
      aR: t > tPick ? .5 : t > tPick - .4 ? -.9 : mood.aR, armR: t > tPick ? petalHook : null });
    camEnd();
    rain(t, ease(seg(lt, 0, 1.5)));
  }

  // O · 82.42-88.75 · close-up: the petal held close; the crying slows, the eyes narrow, the rain cloud turns to steam
  function O(t, lt, dur) {
    const s0 = bar(26);
    camBegin(1150, PY - 110, 2.3 + .05 * lt);
    wet();
    scaffold({ stain: .9 }); guillotine({ drop: 1, blood: .9, noLever: true });
    const mood = emotions(t, [[s0 - 1, 'sad', { emote: 'cloud', lookY: .5 }], [s0 + 1.1, 'sad', { emote: 'cloud', eyes: 'teary', lookY: .6 }],
      [s0 + 2.6, 'sad', { emote: 'cloud', eyes: 'narrow', mouth: 'flat', gloom: .5 }], [s0 + 4.0, 'angry', { emote: 'steam', lookX: -.3 }]], { take: .9 });
    clawd(1150, PY, U, { ...mood, view: 'q', flip: true, boilKey: 'clawd', draw: spotsHook(9), aR: .9 + .05 * Math.sin(t * 3), armR: petalHook });
    camEnd();
    rain(t, 1 - .5 * seg(lt, 3, dur));
  }

  // P · 88.75-95.08 · the Headsman comes back and tosses Clawd the broom; he leans in over the block; Clawd doesn't back off
  const CX = 650, HX = 1190;
  function P(t, lt, dur) {
    const s0 = bar(28), tCatch = s0 + .45, lean = ease(seg(t, s0 + 1.6, s0 + 3.0)) * (1 - ease(seg(t, s0 + 4.6, s0 + 5.6)));
    camBegin(...kf(lt, [[0, [930, 560, 1.12]], [dur, [930, 580, 1.2]]], ease));
    wet();
    scaffold({ stain: .9 }); guillotine({ drop: 1, blood: .9 }); stub();
    const blink = seg(t, s0 + 3.9, s0 + 4.2) * (1 - seg(t, s0 + 4.5, s0 + 4.7));
    headsman(HX, PY, U, { flip: true, aR: lerp(2.4, .3, easeOut(seg(t, s0 - .3, s0 + .2))), aL: .2 + .3 * lean,
      rot: -.3 * lean, dy: .8 * lean, sq: .06 * lean, glow: .5 + .4 * lean, lookX: -.9, lookY: .3 + .4 * lean, squint: blink });
    // the broom: thrown over the block, caught
    const k = seg(t, s0 - .35, tCatch);
    if (k < 1) { const p = arcPt([HX - 150, 470], [CX + 150, PY - 110], 140, k); push(); translate(p[0], p[1]); rotate(-1 + k * 5.3); broomAt(U * 5.2, { key: 'broom' }); pop(); }
    const mood = emotions(t, [[s0 - 1, 'angry', { emote: 'steam' }], [tCatch, 'angry', { emote: null, lookX: .9, lookY: -.6 }], [s0 + 3.0, 'determined', { lookX: .9, lookY: -.9 }]], { take: .6 });
    clawd(CX, PY, U, { ...mood, view: 'q', boilKey: 'clawd', draw: spotsHook(9), aR: t > tCatch ? -.6 : .8, armR: t > tCatch ? (u, sw) => { rotate(-.35); broomAt(u * 5.2, { key: 'broom' }); } : null, aL: .1, armL: petalHook });
    camEnd();
    rain(t, .45);
  }

  // Q · 95.08-104.57 · tug of war on the beat across the block; he wins, lifts the broom with Clawd hanging on,
  // shakes Clawd off and lays the broom on the block
  function Q(t, lt, dur) {
    const s0 = bar(30), tLift = s0 + 6.3, tDrop = s0 + 7.9, tLay = s0 + 8.9;
    camBegin(...kf(lt, [[0, [930, 560, 1.12]], [6.2, [930, 540, 1.15]], [dur, [950, 520, 1.15]]], ease));
    wet();
    scaffold({ stain: .9 }); guillotine({ drop: 1, blood: .9 });
    if (t < tLay) stub();
    // each beat yanks the pair one way, the next the other; harder in the second bar
    const bi = beatN(t), bf = frac(bpOf(t)), dir = bi % 2 ? 1 : -1, amp = t < s0 + 3.1 ? 28 : 46;
    const tug = t < tLift ? dir * amp * (2 * easeOut(clamp(bf * 3)) - 1) : 0;
    const hx = HX + tug, cx = CX + tug;
    const lift = ease(seg(t, tLift, tLift + .6)), layK = ease(seg(t, tLay - .5, tLay));
    const shake = t > tLift + .6 && t < tDrop ? Math.sin(t * 22) : 0;
    // the broom's two ends: the handle in his fist, the bristles in Clawd's arms
    const grip = [hx - 250, PY - 175], raised = [hx - 170, PY - 540];
    let hEnd = t < tLift ? grip : [lerp(grip[0], raised[0], lift), lerp(grip[1], raised[1], lift)];
    let cEnd = t < tLift ? [cx + 150, PY - 165] : [hEnd[0] - 250 + 20 * shake, hEnd[1] + 120];
    if (t > tDrop) { hEnd = [lerp(raised[0], GX + 110, layK), lerp(raised[1], PY - 108, layK)]; cEnd = [lerp(raised[0] - 250, GX - 120, layK), lerp(raised[1] + 120, PY - 104, layK)]; }
    headsman(hx, PY, U, { flip: true, reachR: hEnd, aL: .3 + .4 * lift, glow: .6 + .3 * lift, lookX: -.9, lookY: .3, rot: t < tLift ? -dir * .05 * (1 - bf) : 0, dy: -.2 * Math.abs(shake) });
    broomSpan(hEnd[0] + 30, hEnd[1], cEnd[0], cEnd[1], { key: 'broom', w: 2 });
    // Clawd: skids with the tug, hangs from the bristles, is shaken off onto the deck
    const mood = emotions(t, [[s0 - 1, 'determined', { lookX: .9 }], [s0 + 3.1, 'angry', { lookX: .9 }], [tLift + .2, 'scared', { lookY: -.8 }], [tDrop + .45, 'furious']], { take: .7 });
    if (t < tLift) clawd(cx, PY, U, { ...mood, view: 'q', boilKey: 'clawd', draw: spotsHook(9), rot: dir * .07 * (1 - bf), aR: .75, aL: .8, sq: mood.sq + .05 * (1 - bf) });
    else if (t < tDrop) clawd(cEnd[0], cEnd[1] + 8.6 * U, U, { ...mood, boilKey: 'clawd', draw: spotsHook(9), aL: 1.5, aR: 1.5, noShadow: true, rot: shake * .15 });
    else { const k = seg(t, tDrop, tDrop + .4), fx = raised[0] - 250, y = lerp(raised[1] + 120 + 8.6 * U, PY, easeIn(k)), land = jump(t, tDrop, tDrop + .4, 0);
      clawd(fx, y, U, { ...mood, boilKey: 'clawd', draw: spotsHook(9), sq: mood.sq + land.sq, noShadow: k < 1 }); }
    if (t > tDrop) dust(raised[0] - 250, PY, 16, t - tDrop - .4, 5);
    camEnd();
    rain(t, .45 - .45 * seg(lt, 5, dur));
  }

  // R · 104.57-107.73 · break 3: the lever, the drop, the broom snaps and its handle lands at Clawd's feet, the idea
  const tPull = bar(33) + .45, tHit = bar(33) + .94, tSnap = tHit + .12;
  function R1(t, lt) {
    const pull = easeIn(seg(t, tPull, tPull + .3)), ant = ease(seg(t, bar(33) + .2, tPull)) * .12, lk = clamp(pull - ant);
    camBegin(1250, 500, 1.9 + .08 * lt);
    backdrop(SKY.noon); scaffold({ stain: .9 }); guillotine({ lever: lk, blood: .9 });
    broomSpan(GX + 80, PY - 108, GX - 70, PY - 104, { key: 'broom' });
    headsman(1150, PY, U, { flip: true, glow: .8 + .2 * pull, lookX: -.7, lookY: .2, reachL: leverKnob(lk), aR: .15, sq: -.04 * pull });
    camEnd();
  }
  function R2(t) {
    const k = easeIn(seg(t, bar(33) + .82, tHit)), hitAge = t - tHit, [sx, sy] = shakeXY(t, hitAge > 0 ? 14 * Math.exp(-hitAge * 10) : 0);
    camBegin(900 + sx, 390 + sy, .98);
    backdrop(SKY.noon); scaffold({ stain: .9 }); guillotine({ drop: k, lever: 1, blood: .9 });
    if (k > .02 && k < 1) for (let i = 0; i < 5; i++) { boilSeed('fall' + i); inkLine([[GX - 80 + i * 40, bladeY(k) - 80 - 300 * k], [GX - 80 + i * 40, bladeY(k) - 70]], 1.2, G.ink, 'dry', 0); }
    broomSpan(GX + 80, PY - 108, GX - 70, PY - 104, { key: 'broom' });
    camEnd();
    if (hitAge > 0) flash(1 - hitAge / .15, G.bone);
  }
  function R3(t, lt) {   // the two halves fly apart; the handle spins onto the deck at Clawd's feet
    camBegin(880, 600, 1.25);
    backdrop(SKY.noon); scaffold({ stain: .9 }); guillotine({ drop: 1, lever: 1, blood: .9 });
    const k = seg(t, tSnap, tSnap + .8), hk = seg(t, tSnap, tSnap + .5);
    const hp = arcPt([GX - 50, PY - 110], [760, PY - 6], 200, easeOut(k)), bp = arcPt([GX + 40, PY - 110], [GX + 180, PY - 8], 80, hk);
    push(); translate(hp[0], hp[1]); rotate(k * 9 + (k >= 1 ? -k * 9 + .1 : 0)); broomAt(U * 4.6, { key: 'broom', broken: 'handle' }); pop();
    push(); translate(bp[0], bp[1]); rotate(Math.PI - hk * 4); broomAt(U * 4.6, { key: 'broomhead', broken: 'head' }); pop();
    clawd(650, PY, U, { ...emotions(t, [[tSnap - 1, 'furious'], [tSnap + .85, 'surprised', { lookX: 1, lookY: .8 }]], { take: .7 }), boilKey: 'clawd', draw: spotsHook(9) });
    camEnd();
  }
  function R4(t, lt) {   // Clawd looks from the jagged handle up to the blade's rope: the bulb
    const s = bar(33) + 2.03;
    camBegin(700, PY - 160, 2.0 + .06 * lt);
    backdrop(SKY.noon); scaffold({ stain: .9 }); guillotine({ drop: 1, lever: 1, blood: .9, noLever: true });
    push(); translate(760, PY - 6); rotate(Math.PI + .1); broomAt(U * 4.6, { key: 'broom', broken: 'handle' }); pop();
    clawd(650, PY, U, { ...emotions(t, [[s - 1, 'surprised', { lookX: 1, lookY: .8, emote: null }], [s + .35, 'thinking', { lookX: .9, lookY: -1, emote: null }], [s + .75, 'idea', { lookX: .6, lookY: -1 }]], { take: .9 }),
      boilKey: 'clawd', draw: spotsHook(9) });
    camEnd();
  }

  shots([[bar(24), N], [bar(26), O], [bar(28), P], [bar(30), Q], [bar(33), R1], [bar(33) + .82, R2], [bar(33) + 1.13, R3], [bar(33) + 2.03, R4]]);
})();
