// s2_grind.js: shots F-M (0:28.64-1:16.10). The crowd cheers, Clawd is put to work, the stomps, the flower saved,
// noticed, plucked, and the second drop.
(() => {
  const stepsY = x => x > 1450 ? GY : x < 1320 ? PY : lerp(PY, GY, (x - 1320) / 130);
  const noon = t => backdrop(SKY.noon);
  // a melon carried over Clawd's head, both arms up
  const overhead = (x, gy, u, dy = 0) => melon(x, gy + dy * u - 8.2 * u - 30, 30, { key: 'carry', rot: .2 });
  // red drips from the raised blade
  function drips(t) {
    for (let i = 0; i < 3; i++) {
      const ph = frac(t * .8 + i / 3), y = lerp(BLADE_TOP + 46, PY - 100, easeIn(ph)), x = GX - 60 + i * 55;
      boilSeed('drip' + i); paint(ellPts(x, y, 5, 8 + 6 * ph, 8), { wash: G.red, ink: G.ink, sw: .4 });
    }
  }

  // F · 28.64-34.97 · the crowd erupts; the camera drifts to Clawd, the only one not cheering; a hat flies (match cut)
  function F(t, lt, dur) {
    const s0 = bar(9);
    camBegin(...kf(lt, [[0, [300, 640, 1.15]], [2.86, [330, 650, 1.15]], [5.1, [1560, 760, 1.25]], [dur, [1600, 770, 1.3]]], ease));
    backdrop(skyMix('dawn', 'noon', seg(lt, 0, 4)));
    scaffold({ stain: .6 }); guillotine({ blood: .8 }); drips(t);
    headsman(1150, PY, U, { aL: 2.3 + .2 * Math.sin(t * 6), aR: 2.1 + .2 * Math.sin(t * 6 + 1), glow: .5, lookX: -.6, dy: -.3 * pulse(t, 4) });
    const slots = [600, 450, 300, 150, 10], thrown = s0 + .8;
    for (let i = 0; i < 5; i++) {
      const rate = [1, 2, 1, 2, 1][i], ph = bpOf(t) * rate + hash(i) * .5, b = Math.abs(Math.sin(ph * Math.PI));
      const hat = i === 2 && t > thrown ? 'none' : FOLK[i].hat;
      folk(slots[i], GY, 22, { ...FOLK[i], hat, boilKey: 'crowd' + i, dy: -1.3 * b, sq: .1 * (1 - b), cheer: 1, wave: true, mouth: 'open', eyes: (beatN(t) + i) % 2 ? 'shut' : 'dot', lookX: .5 });
    }
    if (t > thrown) { const k = seg(t, thrown, thrown + 1.6), p = arcPt([300, GY - 170], [520, GY - 60], 520, k); if (k < 1) flyingHat(p[0], p[1], 22, k * 9); else flyingHat(520 + 20, GY - 14, 22, .3); }
    flower(FX, GY, 26, { bob: .05 * Math.sin(t * 2.2) });
    clawd(1680, GY, U, { ...emotions(t, [[s0, 'scared', { lookX: -1 }], [s0 + 3.2, 'sad', { lookX: -.6, emote: null }]], { take: .5 }), flip: true, boilKey: 'clawd' });
    // the match cut: a cap sails in from the crowd on the arc the melon will finish in the next shot
    const hk = seg(t, s0 + dur - .8, s0 + dur + .35);
    if (hk > 0) { const p = arcPt([1180, 420], [1700, 700], 260, hk); flyingHat(p[0], p[1], 22, hk * 8, 'cap'); }
    camEnd();
  }

  // G · 34.97-41.29 · the Headsman lobs a melon; Clawd catches it, staggers, then sees the heaped cart
  function G_(t, lt, dur) {
    const s0 = bar(11), tc = s0 + 1.6;
    camBegin(...kf(lt, [[0, [1420, 600, 1.0]], [1.6, [1470, 640, 1.05]], [3.3, [1620, 720, 1.15]], [dur, [1800, 730, 1.1]]], ease));
    noon(t);
    scaffold({ stain: .6 }); guillotine({ blood: .8 }); drips(t);
    cart(CARTX, GY);
    headsman(1150, PY, U, { aR: lerp(2.6, .7, easeOut(seg(t, s0 - .3, s0 + .3))) + .2 * spring(t, s0 + .3, 6, 14), aL: .3, glow: .5, lookX: .9, lookY: .3 });
    flower(FX, GY, 26, { bob: .05 * Math.sin(t * 2.2) });
    const k = seg(t, s0 - .25, tc), cx = 1680;
    const mood = emotions(t, [[s0, 'surprised', { lookX: -.8, lookY: -1 }], [tc + .02, 'nervous', { lookY: -.6, emote: 'sweat' }], [s0 + 3.4, 'bored', { lookX: 1, lookY: 0 }]], { take: .6 });
    const catchSq = t > tc ? .35 * Math.exp(-(t - tc) * 3) * Math.cos((t - tc) * 14) : 0, sway = t > tc ? .5 * Math.exp(-(t - tc) * 2) * Math.sin((t - tc) * 9) : 0;
    if (k < 1) { const p = arcPt([1270, 470], [cx, GY - 8.2 * U - 30], 260, k); melon(p[0], p[1], 30, { key: 'carry', rot: k * 7 }); }
    clawd(cx, GY, U, { ...mood, flip: true, boilKey: 'clawd', sq: mood.sq + catchSq, dx: sway, aL: t > tc - .2 ? 1.45 : mood.aL, aR: t > tc - .2 ? 1.45 : mood.aR });
    if (k >= 1) overhead(cx + sway * U, GY, U, (1 - catchSq) * 0 + catchSq * 6);
    camEnd();
  }

  // H · 41.29-50.79 · Clawd hauls a melon to the steps; the Headsman takes it, chops it; juice splatters Clawd
  function H_(t, lt, dur) {
    const s0 = bar(13), tHand = bar(14) + .2, tChop = bar(14) + 2 * BEAT, tHit = tChop + .5;
    camBegin(...kf(lt, [[0, [1780, 690, 1.15]], [3.3, [1330, 620, 1.02]], [6.2, [1360, 650, 1.05]], [dur, [1440, 730, 1.3]]], ease));
    noon(t);
    scaffold({ stain: .7 });
    // the Headsman at the top of the steps: takes the melon, tosses it onto the block, pulls the lever
    const toss = seg(t, tHand + .45, tHand + 1.1), lk = easeIn(seg(t, tChop - .25, tChop)) * (1 - ease(seg(t, tChop + .8, tChop + 2)));
    const drop = easeIn(seg(t, tChop, tChop + .12)) * (1 - ease(seg(t, tChop + 1.2, tChop + 2.6)));
    guillotine({ blood: .8, drop, lever: lk });
    if (toss > 0 && t < tChop + .12) { const p = arcPt([1180, 560], [GX + 20, PY - 118], 180, easeOut(toss)); melon(p[0], p[1], 30, { key: 'haul', rot: toss * 6 }); }
    if (t > tChop + .1) splash(GX, PY - 110, 9, t - tChop - .1, 1, 3);
    const recv = t > tHand - .4 && t < tHand + .45;
    headsman(1250, PY, U, { flip: true, glow: .5 + .3 * lk, lookX: t < tHand + .4 ? .8 : -.6, lookY: t < tHand + .4 ? .8 : 0,
      reachR: recv ? [1400, GY - 8.2 * U - 30] : null, aR: toss > 0 ? lerp(1.9, .4, toss) : .3,
      reachL: t > tChop - .6 && t < tChop + .5 ? leverKnob(lk) : null, aL: .3,
      handR: t > tHand && toss === 0 ? (u, sw) => melon(0, u * 1.2, 30, { key: 'haul' }) : null });
    // Clawd: carries from the cart to the foot of the steps, hands it up, then stands there and takes the spray
    const carry = t < tHand, st = stroll(t, s0, tHand - .3, 1850, 1400, U);
    const hit = t > tHit, spots = hit ? 1 + 8 * ease(seg(t, tHit, tHit + .3)) : 0;
    const mood = emotions(t, [[s0, 'bored', { lookX: -1 }], [tHand + .5, 'neutral', { lookX: -1 }], [tHit + .05, 'disgusted'], [bar(15) + .2, 'sad', { aL: 1.2 }]], { take: .8 });
    clawd(st.x, GY, U, { ...mood, view: carry ? st.view : 'q', flip: true, walk: st.walk, dy: mood.dy + st.dy, boilKey: 'clawd',
      aL: carry || recv ? 1.45 : t > bar(15) && t < bar(15) + 1.4 ? 1.15 + .15 * Math.sin(t * 12) : mood.aL, aR: carry || recv ? 1.45 : mood.aR, draw: spotsHook(spots) });
    if (carry) overhead(st.x + (st.flip ? 0 : 0), GY, U, st.dy);
    // the spray: a few drops fly from the block all the way to Clawd
    for (let i = 0; i < 5; i++) {
      const k = seg(t, tChop + .15 + i * .03, tHit + i * .03); if (k <= 0 || k >= 1) continue;
      const p = arcPt([GX + 30, PY - 120], [1400 + (i - 2) * 30, GY - 130 - i * 14], 240, k); boilSeed('spray' + i); paint(ellPts(p[0], p[1], 9, 7, 8), { wash: G.red, ink: G.ink, sw: .4 });
    }
    camEnd();
  }

  // I · 50.79-53.95 · the heavy hit: the Headsman stomps, the deck jumps, Clawd drops the melon and it rolls away
  function I(t, lt, dur) {
    const s0 = bar(16), tS = s0, [sx, sy] = shakeXY(t, 16 * Math.exp(-Math.max(0, t - tS) * 5) * (t > tS ? 1 : 0));
    camBegin(1160 + sx, 560 + sy, 1.35 + .02 * lt);
    noon(t);
    scaffold({ stain: .7 }); guillotine({ blood: .8, swing: .06 * spring(t, tS, 4, 12) });
    dust(1060, PY, 22, t - tS, 1); dust(1120, PY, 18, t - tS - .05, 2);
    const lift = ease(seg(t, tS - .45, tS - .08)) * (1 - easeIn(seg(t, tS - .08, tS)));
    headsman(1060, PY, U, { dy: -1.2 * lift, sq: -.08 * lift + .12 * Math.exp(-Math.max(0, t - tS) * 8) * (t > tS ? 1 : 0), aL: .6 + .8 * lift, aR: .6 + .8 * lift,
      glow: .6 + .4 * seg(t, tS, tS + .3), squint: .45 * seg(t, tS + .3, tS + .6), lookX: .9, lookY: .2 });
    // Clawd bounces; the melon pops out, lands and rolls toward the steps
    const hop = jump(t, tS + .02, tS + .4, 1.8), mk = seg(t, tS + .05, tS + .5);
    const mood = emotions(t, [[s0 - 1, 'sad'], [tS + .02, 'scared', { lookX: .8 }], [tS + 1.2, 'scared', { lookX: -.8 }]], { take: 1.2 });
    clawd(1240, PY, U, { ...mood, flip: true, dy: mood.dy + hop.dy, sq: mood.sq + hop.sq, boilKey: 'clawd', draw: spotsHook(9), aL: t < tS + .05 ? 1.45 : mood.aL, aR: t < tS + .05 ? 1.45 : mood.aR });
    if (t < tS + .05) overhead(1240, PY, U, hop.dy);
    else { const p = mk < 1 ? arcPt([1240, PY - 8.2 * U - 30], [1275, PY - 30], 120, mk) : [lerp(1275, 1335, easeIn(seg(t, tS + .6, s0 + dur))), PY - 30]; melon(p[0], p[1], 30, { key: 'carry', rot: mk * 4 + (p[0] - 1275) / 30 }); }
    camEnd();
  }

  // J · 53.95-60.28 · the melon rolls down the steps toward the flower; Clawd chases, dives, stops it an inch away
  function J(t, lt, dur) {
    const s0 = bar(17), bounces = [0, 1, 2, 3].map(i => s0 + .15 + i * .22), tGround = s0 + .95, tStop = s0 + 2.55, tDive = s0 + 2.55, tLand = s0 + 3.2;
    camBegin(...kf(lt, [[0, [1380, 700, 1.3]], [2.5, [1470, 780, 1.4]], [dur, [1490, 790, 1.5]]], ease));
    noon(t);
    scaffold({ stain: .7 }); guillotine({ blood: .8 });
    // melon: down the steps, then a slowing roll along the cobbles to a stop a hair from the flower
    let mx, my;
    if (t < tGround) { const k = seg(t, s0, tGround), x = lerp(1335, 1462, k), bi = Math.min(3, Math.floor(k * 4)), bk = frac(k * 4); mx = x; my = stepsY(x) - 30 - 40 * Math.sin(bk * Math.PI) * (1 - bi * .15); }
    else { const k = easeOut(seg(t, tGround, tStop)); mx = lerp(1462, 1488, k); my = GY - 30; }
    const mood = emotions(t, [[s0, 'scared', { lookX: .9 }], [tDive, 'determined'], [tLand + .1, 'dizzy'], [tLand + .6, 'relieved'], [tLand + 1.4, 'happy']], { take: .8 });
    flower(FX, GY, 26, { bob: .05 * Math.sin(t * 2.2) + (t > tStop ? .2 * spring(t, tStop, 5, 18) : 0) });
    // Clawd: runs down the steps after it, dives on the downbeat, lands hugging it
    let cx, cy, extra = {};
    if (t < tDive) { const k = seg(t, s0 + .3, tDive); cx = lerp(1250, 1330, ease(k)); cy = stepsY(cx); extra = { view: 'side', walk: k * 6, rot: .1 }; }
    else if (t < tLand) { const k = seg(t, tDive, tLand), p = arcPt([1330, GY], [1395, GY], 90, k); cx = p[0]; cy = p[1]; extra = { view: 'side', sq: -.2 * Math.sin(k * Math.PI), rot: .25 * Math.sin(k * Math.PI), aL: 1.4 }; }
    else { cx = 1395; cy = GY; extra = { view: 'q', aR: t > tLand + 1.4 ? .3 + .35 * Math.abs(Math.sin((t - tLand) * 5)) : -.2 }; }
    const land = jump(t, tLand - .3, tLand, 0);
    clawd(cx, cy, U, { ...mood, ...extra, dy: (mood.dy || 0) * .5, sq: (extra.sq || 0) + land.sq, boilKey: 'clawd', draw: spotsHook(9) });
    melon(mx, my, 30, { key: 'carry', rot: (mx - 1335) / 30 });
    camEnd();
  }

  // K · 60.28-66.60 · the second heavy hit: the Headsman drops down behind Clawd, looms, and notices the flower
  function K(t, lt, dur) {
    const s0 = bar(19), tL = s0, [sx, sy] = shakeXY(t, 18 * Math.exp(-Math.max(0, t - tL) * 5));
    camBegin(...kf(lt, [[0, [1440, 600, 1.08]], [dur, [1470, 640, 1.22]]], ease).map((v, i) => v + (i === 0 ? sx : i === 1 ? sy : 0)));
    noon(t);
    scaffold({ stain: .7 }); guillotine({ blood: .8 });
    dust(1230, GY, 26, t - tL, 3); dust(1160, GY, 22, t - tL - .04, 4);
    const fall = 1 - seg(t, tL - .25, tL), turnK = ease(seg(t, s0 + 1.3, s0 + 3.2));
    headsman(1200, GY, U, { dy: -9 * fall * fall, sq: .15 * Math.exp(-Math.max(0, t - tL) * 7), aL: .5 + .6 * fall, aR: .5 + .6 * fall + .3 * turnK,
      lookX: lerp(.3, 1, turnK), lookY: lerp(.5, .9, turnK), rot: .1 * turnK, glow: .3 + .5 * turnK, dx: .6 * turnK });
    flower(FX, GY, 26, { bob: .05 * Math.sin(t * 2.2) });
    melon(1488, GY - 30, 30, { key: 'carry' });
    const mood = emotions(t, [[s0 - 1, 'happy'], [tL + .02, 'surprised', { lookX: -1, emote: '!' }], [s0 + 1.4, 'nervous', { lookX: -1, lookY: -.7 }],
      [s0 + 3.3, 'nervous', { lookX: 1, lookY: .4, emote: '!?' }], [s0 + 4.4, 'scared', { lookX: -1, lookY: -.7 }], [s0 + 5.3, 'scared', { lookX: 1, lookY: .4 }]], { take: .7 });
    clawd(1395, GY, U, { ...mood, view: 'q', boilKey: 'clawd', draw: spotsHook(9) });
    camEnd();
  }

  // L · 66.60-72.93 · the pluck (close), Clawd hopping for it, the flower laid on the block under the blade
  const tPluck = bar(21) + 1.0;
  function L1(t, lt) {
    camBegin(1520, 760, 2.1 - .1 * lt);
    noon(t); scaffold({ stain: .7 });
    const reachK = ease(seg(t, bar(21) + .2, tPluck)), up = ease(seg(t, tPluck + .1, bar(21) + 2));
    const tip = [FX + 4, GY - 104];
    melon(1488, GY - 30, 30, { key: 'carry' });
    if (t < tPluck) flower(FX, GY, 26, { bob: .15 * reachK * Math.sin(t * 20) });
    clawd(1395, GY, U, { ...emotions(t, [[bar(21) - 1, 'scared', { lookX: 1, lookY: -.3 }], [tPluck + .05, 'scared', { lookX: 1, lookY: -1, emote: '!!' }]], { take: 1 }), view: 'q', boilKey: 'clawd', draw: spotsHook(9) });
    const hand = t < tPluck ? [lerp(1380, tip[0], reachK), lerp(420, tip[1], reachK)] : [tip[0] - 10 * up, tip[1] - 360 * up];
    headsman(1200, GY, U, { reachR: hand, glow: .6, lookX: 1, lookY: .9, rot: .1, dx: .6,
      handR: t >= tPluck ? (u, sw) => { push(); rotate(-.2); flower(0, u * 4.4, 26, { key: 'plucked', bob: .1 * Math.sin(t * 7) }); pop(); } : null });
    camEnd();
  }
  function L2(t, lt) {
    camBegin(1420, 520, 1.0 + .02 * lt);
    noon(t); scaffold({ stain: .7 }); guillotine({ blood: .8 });
    melon(1488, GY - 30, 30, { key: 'carry' });
    headsman(1200, GY, U, { aR: 2.75 + .1 * Math.sin(t * 3), aL: .4, glow: .6, lookX: .6, lookY: .8, dx: .6,
      handR: (u, sw) => { push(); rotate(Math.PI); flower(0, -u * .4, 26, { key: 'plucked', bob: .1 * Math.sin(t * 5) }); pop(); } });
    const h = Math.abs(Math.sin((t - bar(21)) * 7.5)), hop = { dy: -3.2 * h, sq: .12 * (1 - h) - .08 * h };
    clawd(1440 + 20 * Math.sin(t * 3), GY, U, { ...feel('scared', t, { lookX: -.3, lookY: -1 }), eyes: 'teary', mouth: 'wail', view: 'q', flip: true, boilKey: 'clawd', dy: hop.dy, sq: hop.sq, aL: 1.5, aR: 1.5, draw: spotsHook(9) });
    camEnd();
  }
  function L3(t, lt, dur) {
    camBegin(GX + 20, 470 - 10 * lt, 1.35 + .03 * lt);
    noon(t); scaffold({ stain: .7 });
    const lay = ease(seg(lt, 0, .7));
    guillotine({ blood: .8 });
    push(); translate(GX + 10, PY - 100); rotate(-Math.PI / 2 + .1); flower(0, 0, 22, { key: 'plucked', droop: .2 }); pop();
    headsman(1150, PY, U, { flip: true, reachR: [lerp(GX + 60, 1040, lay), lerp(PY - 150, PY - 260, lay)], glow: .7, lookX: -.7, lookY: .6 });
    camEnd();
    // the crowd leans in, dark heads in the foreground
    const lean = ease(seg(lt, .4, 1.8));
    [[260, 'cap', .15], [620, 'bonnet', .05], [1560, 'top', -.12], [1830, 'scarf', -.18]].forEach(([x, hat, r], i) => {
      folk(x + r * -200 * lean, H + 150, 50, { hat, back: true, col: mixCol(G.boneDk, G.ink, .5), rot: r * lean, boilKey: 'fg' + i });
    });
  }

  // M · 72.93-76.10 · break 2: an extreme close-up on Clawd's eyes; the blade's shadow; petals falling past; tears
  function M(t, lt, dur) {
    const s0 = bar(23), tDrop = s0 + 1.07;
    camBegin(1250, PY - 150, 4.2 + .05 * lt);
    noon(t);
    guillotine({ blood: .8, noLever: true, drop: easeIn(seg(t, tDrop - .12, tDrop)) });
    clawd(1250, PY, U, { ...emotions(t, [[s0, 'scared', { lookY: -1, lookX: -.3, emote: null }], [tDrop + .5, 'sad', { eyes: 'teary', lookY: -.9, emote: null, gloom: 0 }]], { take: .4 }), boilKey: 'clawd', draw: spotsHook(9), noLegs: true });
    for (let i = 0; i < 5; i++) {
      const k = seg(t, tDrop + .15 + i * .18, tDrop + 2.3 + i * .18); if (k <= 0) continue;
      petal(1250 + (i - 2) * 55 + 30 * Math.sin(k * 6 + i), lerp(PY - 330, PY - 20, k), 16, k * 5 + i, i);
    }
    camEnd();
    const sh = seg(t, tDrop - .12, tDrop + .2);
    if (sh > 0 && sh < 1) { const y = lerp(-500, H + 200, sh); paint(rectPts(-60, y, W + 120, 380), { wash: G.charDk, washOp: 200, ink: null }); }
  }

  shots([[bar(9), F], [bar(11), G_], [bar(13), H_], [bar(16), I], [bar(17), J], [bar(19), K], [bar(21), L1], [bar(21) + 2, L2], [bar(21) + 4.2, L3], [bar(23), M]]);
})();
