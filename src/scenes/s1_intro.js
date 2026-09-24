// s1_intro.js: shots A-E (0:00-0:28.64). Dawn in the square, the chores, the crowd, the Headsman, the first drop.
// Shot times are bar lines (see STORYBOARD.md). Shot functions get (t, lt, dur); acting keys use absolute time t.
const bar = n => OFF + n * 4 * BEAT;

(() => {
  // Clawd's broom, held in the near arm: tipped so the bristles reach the deck. sw = sweep angle offset.
  const broomHook = (sw0 = 0) => (u, sw) => { rotate(-.35 + sw0); broomAt(u * 5.2); };
  const stepsY = x => x > 1450 ? GY : x < 1320 ? PY : lerp(PY, GY, (x - 1320) / 130);

  // A · 0-6.49 · push out of black, fog peels, crane down the guillotine to Clawd watering the flower
  function A(t, lt, dur) {
    const cam = kf(lt, [[0, [900, 360, .78]], [2.6, [905, 300, .84]], [4.4, [1440, 790, 1.34]], [dur, [1450, 805, 1.42]]], ease);
    camBegin(...cam);
    backdrop(SKY.dawn);
    scaffold(); guillotine({ swing: .012 * Math.sin(t * 1.3) });
    // watering: tip the can 4.5-5.6, set it down, turn toward the steps and hop at the end (cut on action into B)
    const tip = ease(seg(lt, 4.5, 4.8)) - ease(seg(lt, 5.5, 5.75)), hop = jump(lt, 6.12, 6.8, 3.2);
    const k = seg(lt, 5.8, 6.1);
    flower(FX, GY, 26, { bob: .05 * Math.sin(t * 2.2) + .12 * tip * Math.sin(t * 9) });
    clawd(1370 - 40 * easeIn(seg(lt, 6.1, 6.49)), GY, U, {
      ...emotions(t, [[0, 'happy'], [bar(0) + 4.4, 'happy', { emote: null }], [bar(0) + 5.75, 'determined']], { take: .5 }),
      view: k < .5 ? 'q' : 'side', flip: k > .5, aR: .4 + .3 * tip, dy: hop.dy, sq: hop.sq, boilKey: 'clawd',
      armR: k < .5 ? (u, sw) => { translate(u * .6, u * .2); wateringCan(u * .9, -.1 + .55 * tip, tip); } : null,
    });
    if (k >= .5) { push(); translate(1470, GY - 20); wateringCan(U * .9, 0, 0); pop(); }
    camEnd();
    fog(1 - ease(seg(lt, .3, 3.2)), t);
    if (lt < 1.3) paint(rectPts(-60, -60, W + 120, H + 120), { wash: G.ink, washOp: 255 * (1 - ease(seg(lt, 0, 1.3))), ink: null });
  }

  // B · 6.49-12.82 · Clawd sweeps the deck on the beat; the blade creaks above; Clawd notices and gets nervous
  function B(t, lt, dur) {
    const s0 = bar(2), creak = s0 + 2.5, whip = seg(lt, dur - .3, dur);
    const cam = [1060 - 900 * easeIn(whip) + 6 * Math.sin(lt * .5), 440 - 50 * ease(seg(lt, 2.4, 3)) + 50 * ease(seg(lt, 4.2, 5)), 1.0 + .012 * lt];
    camBegin(...cam);
    backdrop(SKY.dawn);
    scaffold();
    const kick = spring(t, creak, 3.5, 11);
    guillotine({ swing: .01 * Math.sin(t * 1.3) + .07 * kick, drop: .02 * ease(seg(t, creak, creak + .12)) });
    // sweeping: one stroke per beat, twice as fast once nervous
    const nervous = t > s0 + 3.7, rate = nervous ? 2 : 1, ph = bpOf(t) * rate, stroke = Math.sin(ph * TAU);
    const looking = t > creak + .2 && t < s0 + 4.1, sweeping = !looking;
    const land = jump(lt, -.35, .1, 3.2);
    const mood = emotions(t, [[s0, 'happy', { emote: 'music' }], [creak + .2, 'surprised', { lookY: -1, lookX: -.2 }], [s0 + 3.7, 'nervous', { lookY: -.5 }]], { take: .7 });
    clawd(1120 + (sweeping ? 18 * stroke : 0), PY, U, {
      ...mood, view: 'q', flip: true, dy: mood.dy + land.dy, sq: mood.sq + land.sq, boilKey: 'clawd',
      aR: sweeping ? -.75 + .25 * stroke : -.3, aL: looking ? 1.1 : .2 + .3 * stroke,
      armR: broomHook(sweeping ? .25 * stroke : .2),
    });
    camEnd();
    whipLines(easeIn(whip), 1);
  }

  // C · 12.82-19.15 · the crowd arrives one per beat; a huge shadow slides over them; they freeze
  function C(t, lt, dur) {
    const s0 = bar(4), shade = s0 + 3.2, freeze = s0 + 4.6;
    camBegin(330 + 20 * Math.sin(lt * .4) - 40 * ease(seg(lt, 3, 4.6)), 700, 1.25 + .01 * lt);
    backdrop(SKY.dawn);
    scaffold(); guillotine({ swing: .01 * Math.sin(t * 1.3) });
    const slots = [600, 450, 300, 150, 10];
    for (let i = 0; i < 5; i++) {
      const ta = s0 + i * BEAT * .75, k = seg(t, ta, ta + .55), x = lerp(-520, slots[i], easeOut(k));
      const hop = k < 1 ? -Math.abs(Math.sin(k * Math.PI * 3)) * 1.2 : 0;
      const scared = seg(t, freeze + i * .05, freeze + .15 + i * .05), idle = pulse(t + i * .13, 5);
      const tremble = (i === 0 || i === 2) && t > freeze + .4 ? .06 * Math.sin(t * 50 + i) : 0;
      folk(x, GY, 22, { ...FOLK[i], boilKey: 'crowd' + i, dy: hop - .25 * idle * (1 - scared), sq: .14 * scared + .05 * idle * (1 - scared),
        lookX: t < shade ? (i % 2 ? .6 : .3) + .2 * Math.sin(t * 2 + i) : lerp(.6, 1, scared), eyes: scared > .5 ? 'wide' : 'dot',
        mouth: scared > .5 ? 'o' : (beatN(t) + i) % 3 === 0 ? 'o' : 'smile', cheer: k < 1 ? .4 : 0, rot: tremble });
    }
    // the Headsman's shadow sliding in from the right across the cobbles and the crowd
    const sk = ease(seg(t, shade, shade + 1.4));
    if (sk > 0) {
      boilSeed('shadow');
      const sx = lerp(1500, 420, sk);
      const sil = [[sx - 330, GY + 200], [sx - 360, 700], [sx - 330, 640], [sx - 200, 600], [sx - 190, 500], [sx - 150, 420], [sx - 60, 370], [sx + 40, 360], [sx + 110, 335], [sx + 150, 350],
        [sx + 130, 395], [sx + 180, 450], [sx + 200, 520], [sx + 210, 600], [sx + 340, 640], [sx + 380, 700], [sx + 360, GY + 200], [sx + 1400, GY + 300], [sx + 1400, 150], [sx + 600, 150]];
      paint(sil, { wash: G.charDk, washOp: 175 * sk, ink: null, curv: .25 });
    }
    camEnd();
    whipLines(1 - ease(seg(lt, 0, .3)), 1);
    const cover = easeIn(seg(lt, dur - .35, dur));
    if (cover > 0) paint(rectPts(-60, -60, W + 120, H + 120), { wash: G.ink, washOp: 245 * cover, ink: null });
  }

  // D · 19.15-25.48 · the Headsman climbs the steps, flicks Clawd over his shoulder, sets a melon on the block
  function D(t, lt, dur) {
    const s0 = bar(6);
    // his climb: one step per beat, a stomp on each landing
    const stepT = [0, 1, 2, 3].map(i => s0 + i * BEAT), xs = [1600, 1500, 1420, 1345];
    let hx = xs[0], lift = 0;
    for (let i = 1; i < 4; i++) { const k = seg(t, stepT[i] - .35, stepT[i]); if (k > 0) { hx = lerp(xs[i - 1], xs[i], easeOut(k)); lift = Math.sin(k * Math.PI) * .6; } }
    // then he walks to the block (after the flick)
    const walk = seg(t, s0 + 4.0, s0 + 5.0), side = seg(t, s0 + 5.6, s0 + 5.95);
    if (walk > 0) hx = lerp(1345, 1110, ease(walk)) + 40 * ease(side);
    const hgy = stepsY(hx), stomps = stepT.slice(1).concat([s0 + 4.37, s0 + 4.74, s0 + 5.95]);
    const shk = ring(t, stomps, 9, 30), [shx, shy] = shakeXY(t, 5 * Math.abs(shk));
    const settle = ease(seg(lt, 4.9, dur - .15));
    const cam = [lerp(1150, 1250, settle) + shx, lerp(560, 500, settle) + shy, lerp(1.25, 1.9, ease(settle)), -.02 * (1 - settle)];
    camBegin(cam[0], cam[1], cam[2], cam[3]);
    backdrop(SKY.dawn);
    scaffold();
    const tPlace = s0 + 5.25, placed = t > tPlace;
    guillotine({ swing: .01 * Math.sin(t * 1.3) + .02 * shk });
    if (placed) melon(GX + 20, PY - 118 + 6 * spring(t, tPlace, 8, 20), 36, { key: 1 });
    for (const st of stomps) dust(hx - 30, hgy, 18, t - st, st);
    // the flick: hand up 2.25-2.7, flick at 2.8; Clawd flies over his shoulder and lands by the flower at 3.55
    const tf = s0 + 2.8, tl = s0 + 3.55, fk = seg(t, tf, tl);
    const reach = ease(seg(t, s0 + 2.2, s0 + 2.7)) * (1 - ease(seg(t, s0 + 3.1, s0 + 3.6)));
    const flickA = 1.25 * reach + .5 * spring(t, tf, 7, 16);
    const placing = t > s0 + 4.95 && t < tPlace + .25, toLever = ease(seg(t, s0 + 5.85, s0 + 6.25));
    const block = [GX + 20, PY - 118], carryAt = [hx + 150, hgy - 7 * U];
    headsman(hx, hgy, U, { flip: true, dy: -lift, walk: walk > 0 && walk < 1 ? walk * 3 : side > 0 && side < 1 ? side : null, glow: .35 + .4 * reach + .3 * toLever,
      lookX: t < tf + .1 ? -.8 : t < tl + .3 ? .9 : t < s0 + 5.6 ? -.6 : .5, lookY: t < tf ? .6 : .2, sq: .05 * Math.abs(shk),
      aR: flickA,
      reachL: placing ? [lerp(carryAt[0], block[0], ease(seg(t, s0 + 4.95, tPlace))), lerp(carryAt[1], block[1], ease(seg(t, s0 + 4.95, tPlace)))]
        : toLever > 0 ? [lerp(hx + 110, leverKnob(0)[0], toLever), lerp(hgy - 5 * U, leverKnob(0)[1], toLever)] : null,
      aL: .7,
      handL: !placed ? (u, sw) => melon(0, u * 1.6, u * 1.5, { key: 1 }) : null });
    // Clawd
    flower(FX, GY, 26, { bob: .05 * Math.sin(t * 2.2) + (t > tl ? .15 * spring(t, tl, 4, 20) : 0) });
    const mood = emotions(t, [[s0, 'nervous', { lookX: .9 }], [s0 + 1.0, 'scared', { lookX: .9 }], [tl + .15, 'dizzy'], [s0 + 4.6, 'scared', { lookX: -1 }]], { take: .7 });
    if (t < tf) clawd(1185, PY, U, { ...mood, view: 'q', boilKey: 'clawd', sq: mood.sq + .1 * ease(seg(t, s0 + 1.9, s0 + 2.6)) });
    else if (fk < 1) { const p = arcPt([1185, PY], [1640, GY], 640, easeOut(fk * .85) / easeOut(.85)); clawd(p[0], p[1], U, { ...feel('scared', t), rot: fk * TAU * 1.5, noShadow: true, boilKey: 'clawd', smear: .5, smearDir: 1 }); }
    else { const sl = jump(t, tl - .4, tl, 1), skid = 40 * easeOut(seg(t, tl, tl + .25)); clawd(1640 + skid, GY, U, { ...mood, flip: true, sq: mood.sq + sl.sq, boilKey: 'clawd' }); }
    camEnd();
    if (lt < .35) paint(rectPts(-60, -60, W + 120, H + 120), { wash: G.ink, washOp: 245 * (1 - ease(lt / .35)), ink: null });
  }

  // E · 25.48-28.64 · the first drop, in four cuts: the lever, the blade, the splash, Clawd's flinch
  const tPull = bar(8) + .45, tHit = bar(8) + .94;
  function E1(t, lt) {   // the hand on the lever
    const ant = ease(seg(t, bar(8) + .2, tPull)) * .12, pull = easeIn(seg(t, tPull, tPull + .3)), lk = clamp(-ant + pull);
    camBegin(1250, 500, 1.9 + .08 * lt);
    backdrop(SKY.dawn); scaffold(); guillotine({ lever: lk });
    melon(GX + 20, PY - 118, 36, { key: 1 });
    headsman(1150, PY, U, { flip: true, glow: .7 + .3 * pull, lookX: -.7, lookY: .2, squint: .3 * ant / .12, reachL: leverKnob(lk), aR: .15, sq: -.04 * pull });
    camEnd();
  }
  function E2(t) {   // the blade falls
    const k = easeIn(seg(t, bar(8) + .82, tHit)), hitAge = t - tHit, [sx, sy] = shakeXY(t, hitAge > 0 ? 14 * Math.exp(-hitAge * 10) : 0);
    camBegin(900 + sx, 390 + sy, .98);
    backdrop(SKY.dawn); scaffold(); guillotine({ drop: k, lever: 1 });
    if (k > .02 && k < 1) for (let i = 0; i < 5; i++) { boilSeed('fall' + i); inkLine([[GX - 80 + i * 40, bladeY(k) - 80 - 300 * k], [GX - 80 + i * 40, bladeY(k) - 70]], 1.2, G.ink, 'dry', 0); }
    if (hitAge < 0) melon(GX + 20, PY - 118, 36, { key: 1 }); else splash(GX, PY - 110, 7, hitAge, 1, 1);
    camEnd();
    if (hitAge > 0) flash(1 - hitAge / .15, G.bone);
  }
  function E3(t, lt) {   // the splash, slowed almost to a stop, filling the frame
    camBegin(GX, PY - 150, 2.3 + .08 * lt);
    backdrop(SKY.dawn); scaffold({ stain: .6 }); guillotine({ drop: 1, lever: 1, blood: .7 });
    splash(GX, PY - 110, 26, .22 + lt * .1, 1, 1);
    camEnd();
  }
  function E4(t, lt) {   // Clawd flinches by the flower
    camBegin(1650, 790, 2.25 - .05 * lt);
    backdrop(SKY.dawn); scaffold({ stain: .6 });
    guillotine({ drop: 1, lever: 1, blood: .7 });
    flower(FX, GY, 26, { bob: .2 * Math.sin(t * 20) * Math.exp(-lt * 1.5) });
    const m = emotions(t, [[bar(8) + 2.0, 'scared', { lookX: -1 }], [bar(8) + 2.14, 'scared', { lookX: -1, emote: 'sweat' }]], { take: 1.3 });
    clawd(1680, GY, U, { ...m, flip: true, boilKey: 'clawd' });
    camEnd();
  }

  shots([[0, A], [bar(2), B], [bar(4), C], [bar(6), D], [bar(8), E1], [bar(8) + .82, E2], [bar(8) + 1.07, E3], [bar(8) + 2.12, E4]]);
})();
