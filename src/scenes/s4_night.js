// s4_night.js: shots S-W (1:47.73-2:19.37). Night: Clawd sneaks past the snoring hut, climbs the guillotine, the
// lightning, the rope sawn and bitten, and the Headsman waking.
(() => {
  const HUTX = 60, MOON = [386, 354, 58];
  const night = (o = {}) => backdrop(SKY.night, { moon: MOON, ...o });
  // the jagged broom handle slung across Clawd's back (a draw hook, body-local front coords)
  const slung = (u, sw) => { push(); translate(-.5 * u, -8.2 * u); rotate(-.5); broomAt(u * 4.6, { key: 'broom', broken: 'handle' }); pop(); };
  const moonlit = o => ({ ...MOONLIT, ...o });
  // The rope at the cut, drawn over everything for close-ups: fray 0..1 thins it to a last strand. p5.brush lines
  // collapse to dots inside a camera zoomed in this far, so call it after camEnd() with that camera: it maps the rope
  // to the screen itself and scales the weights.
  function ropeFront(cam, fray, reach = 60) {
    const [cx, cy, z] = cam, S = (x, y) => [W / 2 + (x - cx) * z, H / 2 + (y - cy) * z], k = z / 1.3;
    boilSeed('rope front');
    const c = '#CDBB94', x = CUT[0], y = CUT[1], w = lerp(2.2, .45, fray) * k;
    inkLine([S(x, y - reach), S(x, y - reach / 2 - 5), S(x, y - 10)], 2.2 * k, c, 'inkfine', 0);
    inkLine([S(x, y - 10), S(x, y), S(x, y + 10)], w, c, 'inkfine', 0);
    inkLine([S(x, y + 10), S(x, y + reach / 2 + 5), S(x, y + reach)], 2.2 * k, c, 'inkfine', 0);
    for (let i = 0; i < Math.ceil(fray * 8); i++) { const sd = i % 2 ? 1 : -1; inkLine([S(x, y + (i % 3 - 1) * 5), S(x + sd * (10 + 8 * hash(i)), y + (i % 3 - 1) * 10 - sd * 6)], .5 * k, c, 'inkfine', .3); }
  }
  // Clawd clinging to the right post at the rope, mouth at the cut
  const CLING = [CUT[0], CUT[1] + 4.3 * U];

  // S · 107.73-114.06 · the bulb's glow becomes the moon; the snoring hut; Clawd tiptoes across the square on the beat
  function S(t, lt, dur) {
    const s0 = bar(34);
    camBegin(500 + 30 * lt, 560, .9);
    night();
    // the bulb's glow, in the same spot on screen, settles into moonlight
    glow(MOON[0], MOON[1], MOON[2] * lerp(6, 3, ease(seg(lt, 0, .6))), '#FFE3A0', 1 - .6 * ease(seg(lt, 0, .6)));
    scaffold({ stain: .9 }); guillotine({ drop: 0, blood: .6 });
    const snore = Math.sin((t - OFF) / BEAT * Math.PI) ** 2;
    hut(HUTX, GY, { door: .03 * snore });
    emote('zzz', HUTX - 60, GY - 290, 30, 1, t);
    // tiptoe: one step per beat, lifted high, and a freeze on each landing
    const bp = bpOf(t), bf = frac(bp), step = Math.floor(bp) - Math.floor(bpOf(s0 + 2.4));
    const k = t < s0 + 2.4 ? 0 : clamp((step + easeOut(clamp(bf * 2.5))) / 5);
    const x = lerp(-120, 520, k), lift = t > s0 + 2.4 && k < 1 ? Math.sin(clamp(bf * 2.5) * Math.PI) : 0;
    clawd(x, GY, U, moonlit({ ...feel('mischief', t, { lookX: -.6 }), view: 'side', walk: k * 5, dy: -.9 * lift, sq: -.08 * lift, aL: .9 * lift, boilKey: 'clawd', draw: slung }));
    camEnd();
  }

  // T · 114.06-123.55 · the climb up the right post; a window lights, Clawd freezes flat; it goes dark; on up
  function T_(t, lt, dur) {
    const s0 = bar(36), tLight = s0 + 3.2, tDark = s0 + 5.9;
    const climb = t < tLight ? ease(seg(t, s0, tLight - .1)) * .45 : t < tDark ? .45 : .45 + .55 * ease(seg(t, tDark + .3, s0 + dur - .2));
    const cy = lerp(PY, -60, climb), cx = GX + 118 + 3.2 * U - 70 * ease(seg(climb, .92, 1));
    camBegin(980 + 60 * seg(t, tLight, tLight + .5) * (1 - seg(t, tDark, tDark + .6)), cy - 150, 1.35);
    night();
    const lit = seg(t, tLight, tLight + .15) * (1 - seg(t, tDark, tDark + .12));
    // the window that lights: a townsperson in a nightcap peers out
    boilSeed('peeper');
    const wx = 1330, wy = 470;
    if (lit > 0) glow(wx, wy, 120, '#FFC270', lit);
    paint(rectPts(wx - 50, wy - 60, 100, 120, 2), { wash: mixCol('#2A2630', '#F2B866', lit), ink: G.ink, sw: .7 });
    if (lit > .5) folk(wx, wy + 62, 11, { hat: 'nightcap', col: '#E9DDC4', lookX: -.9, eyes: 'wide', mouth: 'o', boilKey: 'peeper' });
    scaffold({ stain: .9 }); guillotine({ blood: .6 });
    // Clawd climbing: hand over hand (arms alternate on the beat), flattened against the post while the window is lit
    const frozen = t > tLight && t < tDark + .3, ph = bpOf(t) * 2, moving = !frozen && climb < 1;
    const mood = emotions(t, [[s0, 'determined', { lookY: -1 }], [tLight + .12, 'scared', { lookX: 1 }], [tDark + .15, 'relieved'], [tDark + .9, 'determined', { lookY: -1 }]], { take: .8 });
    clawd(cx, cy, U, moonlit({ ...mood, view: frozen ? 'front' : 'side', flip: true, noShadow: true, walk: moving ? ph * .5 : null, boilKey: 'clawd', draw: frozen ? null : slung,
      aL: moving ? 1.3 + .4 * Math.sin(ph * Math.PI) : 1.5, aR: moving ? 1.3 - .4 * Math.sin(ph * Math.PI) : 1.5, sq: frozen ? -.12 : mood.sq, dx: frozen ? -.8 : 0 }));
    camEnd();
  }

  // U · 123.55-126.72 · lightning: Clawd on top of the guillotine, broom half raised, lid open, against a white sky
  function U_(t, lt, dur) {
    const fl = Math.exp(-lt * 2.2), flick = lt < .35 ? (Math.floor(lt * 24) % 3 === 1 ? .4 : 1) : 1;
    camBegin(920, 160, .95, .04);
    const sky = [mixCol(SKY.night[0], G.bone, fl * flick), mixCol(SKY.night[1], '#FFFFFF', fl * flick), mixCol(SKY.night[2], G.boneDk, .5 * fl), .95];
    backdrop(sky, { moon: MOON });
    if (lt < .3) { boilSeed('bolt'); const B = [[1500, -600], [1420, -380], [1480, -300], [1360, -40], [1420, 40], [1300, 330]]; inkLine(B, 5, '#FFFFFF', 'ink', 0); inkLine(B, 1.5, G.ink, 'inkfine', 0); }
    scaffold({ stain: .9 }); guillotine({ blood: .6 });
    const sil = { col: mixCol(MOONLIT.col, G.charDk, fl * .9), dk: mixCol(MOONLIT.dk, G.charDk, fl * .9), lt: mixCol(MOONLIT.lt, G.charDk, fl * .9) };
    clawd(1010, -60, U, { ...feel('furious', t), ...sil, eyes: 'determined', tint: null, lid: .55, emote: null, noShadow: true, boilKey: 'clawd',
      aR: 1.45 + .05 * Math.sin(t * 8), armR: (u, sw) => { rotate(-1.2); broomAt(u * 4.6, { key: 'broom', broken: 'handle' }); }, aL: .3 });
    camEnd();
  }

  // V · 126.72-133.04 · clinging at the rope: sawing with the jagged handle, one strand per beat, then biting with the lid
  function V(t, lt, dur) {
    const s0 = bar(40), tBite = s0 + 3.16, beats = Math.max(0, bpOf(t) - bpOf(s0)), fray = clamp(beats * .11, 0, .88);
    const [sx, sy] = shakeXY(t, 3 * pulse(t, 8));
    const cam = [CUT[0] + sx, CUT[1] + 30 + sy, 2.3 + .06 * lt];
    camBegin(...cam);
    night();
    guillotine({ blood: .6, fray, swing: .04 * Math.sin(t * 2.2) + .02 * pulse(t, 5), noLever: true });
    const sawing = t < tBite, stroke = Math.sin(bpOf(t) * TAU);
    const mood = sawing ? feel('determined', t, { lookX: -.4, lookY: -.2 }) : feel('furious', t);
    const bite = sawing ? 0 : .15 + .5 * (1 - pulse(t, 7));
    clawd(CLING[0], CLING[1], U, moonlit({ ...mood, tint: sawing ? null : mood.tint, tintK: .5, noShadow: true, noLegs: false, dy: -.1 * pulse(t, 6), boilKey: 'clawd',
      lid: bite, emote: sawing ? null : 'steam', emoteAge: t,
      aL: 1.5, aR: sawing ? .35 + .2 * stroke : -.9 }));
    camEnd();
    // the rope passes in front of Clawd's mouth; the saw: the jagged end drawn back and forth across it
    ropeFront(cam, fray, 90);
    if (sawing) {
      const [cx, cy, z] = cam, S = (x, y) => [W / 2 + (x - cx) * z, H / 2 + (y - cy) * z];
      boilSeed('saw');
      const hand = S(CLING[0] + 150, CUT[1] - 20 + 14 * stroke), tip = S(CUT[0] - 18 + 26 * stroke, CUT[1] + 4), d = z;
      inkLine([hand, tip], 2.6 * z / 2.3, '#A08563', 'inkfine', 0);
      inkLine([[tip[0] - 4 * d, tip[1] - 8 * d], [tip[0] - 14 * d, tip[1] - 2 * d], [tip[0] - 5 * d, tip[1] + 3 * d], [tip[0] - 15 * d, tip[1] + 9 * d]], .8 * z / 2.3, '#A08563', 'inkfine', 0);
    }
  }

  // W · 133.04-139.37 · the hush: one strand left; the hut door opens on lantern light; the hood looks up, eyes red
  function W1(t, lt) {   // one strand left
    const cam = [CUT[0], CUT[1] - 10, 3.2 + .12 * lt];
    camBegin(...cam);
    night();
    guillotine({ blood: .6, fray: .93, noLever: true });
    clawd(CLING[0], CLING[1], U, moonlit({ ...feel('furious', t), dx: .2 * Math.sin(t * 2), tint: null, lid: .45, emote: null, eyes: 'red', noShadow: true, aL: 1.5, aR: -.9, boilKey: 'clawd' }));
    camEnd();
    ropeFront(cam, .97, 200);
  }
  function W2(t, lt) {   // the door opens
    const door = ease(seg(lt, .3, 1.3)), lamp = ease(seg(lt, .2, 1));
    camBegin(HUTX + 60, GY - 150, 1.6 + .04 * lt);
    night();
    hut(HUTX, GY, { door, lamp });
    camEnd();
  }
  function W3(t, lt, dur) {   // the Headsman steps into the light and looks up; up top, a tiny Clawd freezes
    const up = ease(seg(lt, .5, 1.4));
    camBegin(560, 360 - 60 * up, .82);
    night();
    hut(HUTX, GY, { door: 1, lamp: 1 });
    scaffold({ stain: .9 }); guillotine({ blood: .6, fray: .93, swing: .02 * Math.sin(t * 2) });
    clawd(CLING[0], CLING[1], U, moonlit({ ...feel('scared', t, { lookX: -1, lookY: .8 }), noShadow: true, aL: 1.5, aR: 1.5, boilKey: 'clawd' }));
    glow(HUTX + 90, GY - 230, 220, '#FFB866', .8);
    headsman(HUTX + 90 + 80 * ease(seg(lt, 0, .5)), GY, U, { aL: .2, aR: .9, handR: (u, sw) => { glow(0, u * 1.2, u * 5, '#FFB866', .9); boilSeed('lantern'); paint(rrPts(-u * .8, u * .2, u * 1.6, u * 2, u * .3), { wash: '#F4C070', ink: G.ink, sw: sw * .6 }); },
      lookX: .7 * up, lookY: -1 * up, glow: lerp(.3, 1, up), squint: .3 * (1 - up) });
    camEnd();
  }

  shots([[bar(34), S], [bar(36), T_], [bar(39), U_], [bar(40), V], [bar(42), W1], [bar(42) + 1.96, W2], [bar(42) + 3.96, W3]]);
})();
