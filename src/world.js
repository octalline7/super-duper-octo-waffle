// world.js: the town square and its cast for "The Executioner's Apprentice". Everything is painted with paint()/inkLine()
// in world coordinates (use it inside camBegin/camEnd), and every element seeds its own boil.
//
// The square (world coordinates, y down):
//   ground GY = 900, the far houses stand on HY = 720.
//   the scaffold's deck is at PY = 760, from x 560 to 1320; its steps run down its RIGHT side to the ground at x ~1450.
//   the guillotine stands on the deck at GX = 900; its crossbeam is at y ~ -10, the lunette block at the deck.
//   the flower grows from the cobbles at FX = 1540. The melon cart stands right of it (CARTX = 1960), the hut far left (x ~ -350).
// Clawd is u = 24 in this world; the Headsman is drawn at the same u and stands about 21u tall.

const GY = 900, HY = 720, PY = 760, GX = 900, FX = 1540, SCAF = [560, 1320], U = 24, CARTX = 1960;
const G = {
  bone: '#EFE6D2', boneDk: '#D8CCB3', boneDkr: '#BFB29A', ink: PAL.ink,
  red: '#B3261E', redDk: '#7E1A16', redLt: '#D9493A', oxblood: '#6B1E22',
  char: '#38333A', charDk: '#2A262C', charLt: '#5A5460',
  wood: '#4A3C3C', woodDk: '#33292A', woodLt: '#6B5956', steel: '#CFCBC2', steelDk: '#8E8A84',
  stem: '#5F6A4C', stemDk: '#434C36', rain: '#8E97A6',
};
// Sky moods for the colour arc: [top, horizon, ground tint, houses tint k (0 = bone, 1 = dark)].
const SKY = {
  dawn:    ['#D9D2C4', '#EFE8DA', '#D8CCB3', .15],
  noon:    ['#E9DCC0', '#F4ECDC', '#D8CCB3', .1],
  rain:    ['#7E8796', '#A9B0B9', '#9FA3A6', .45],
  night:   ['#1C1A24', '#34303F', '#5A5566', .72],
  redDawn: ['#3A2230', '#B5493C', '#6B5A58', .6],
  sunrise: ['#C8463A', '#F0A06A', '#C9A68A', .35],
  morning: ['#EBD9BC', '#F6EBD6', '#DCCDB0', .12],
};
const skyMix = (a, b, k) => SKY[a].map((c, i) => typeof c === 'number' ? lerp(c, SKY[b][i], k) : mixCol(c, SKY[b][i], k));

// ---------- the square ----------
// backdrop(sky): sky, far houses and cobbles, filling a generous area around the square. sky = a SKY entry (or skyMix).
// o.lit (0..1): house windows lit (night). o.sun: [x, y, r] a big sun disc.
function backdrop(sky, o = {}) {
  const [top, hor, gnd, hk] = sky;
  boilSeed('sky');
  paint(rectPts(-2400, -2200, 6600, 2940), { wash: top, ink: null });
  paint(rectPts(-2400, 150, 6600, 590), { wash: mixCol(top, hor, .5), washOp: 255, ink: null });
  paint(rectPts(-2400, 420, 6600, 320), { wash: hor, washOp: 255, ink: null });
  paint(ellPts(900, 560, 2600, 320, 30, 30), { fill: hor, fillOp: 150, bleed: .25, tex: .4, ink: null });
  if (o.sun) { const [sx, sy, sr] = o.sun; glow(sx, sy, sr * 3.2, '#FFB070', .9); boilSeed('sun'); paint(ellPts(sx, sy, sr, sr, 36, 3), { wash: '#F6C27A', fill: '#F08A4E', fillOp: 90, ink: null }); }
  if (o.moon) { const [mx, my, mr] = o.moon; glow(mx, my, mr * 3, '#E9E2FF', .5); boilSeed('moon'); paint(ellPts(mx, my, mr, mr, 30, 2), { wash: '#ECE6D6', fill: '#C9C2B6', fillOp: 80, ink: null }); }
  houses(hk, o.lit || 0);
  boilSeed('ground');
  paint(rectPts(-2400, HY - 4, 6600, 2400, 4), { wash: gnd, ink: null });
  paint(ellPts(900, HY + 260, 2400, 200, 30, 20), { fill: mixCol(gnd, G.ink, .12), fillOp: 90, bleed: .2, tex: .5, ink: null });
  inkLine([[-2400, HY], [0, HY + 3], [2000, HY - 2], [4200, HY + 2]], .6, mixCol(gnd, G.ink, .45), 'inkfine', .3);
  cobbles(gnd);
}
function houses(hk, lit) {
  for (let i = 0; i < 24; i++) {
    const x = -2200 + i * 270 + hash(i) * 60, w = 170 + hash(i + 40) * 90, h = 160 + hash(i + 80) * 170, y = HY;
    boilSeed('house' + i);
    const wall = mixCol(mixCol(G.boneDk, G.boneDkr, hash(i + 5)), G.charDk, hk), roof = mixCol(G.charLt, G.charDk, hk);
    paint([[x, y], [x, y - h], [x + w, y - h - 10 * hash(i + 9)], [x + w, y]], { wash: wall, ink: mixCol(wall, G.ink, .5), sw: .5 });
    const rh = 60 + hash(i + 20) * 70;
    paint([[x - 14, y - h + 4], [x + w * (.3 + .4 * hash(i + 3)), y - h - rh], [x + w + 14, y - h - 6]], { wash: roof, ink: G.ink, sw: .5 });
    const nw = 1 + Math.floor(hash(i + 7) * 3);
    for (let k = 0; k < nw; k++) {
      const wx = x + (k + .5) * w / nw - 16, wy = y - h * (.45 + .2 * hash(i * 3 + k)), on = lit > 0 && hash(i * 7 + k) < .5;
      if (on) glow(wx + 16, wy + 22, 60, '#FFC270', lit * .7);
      paint(rectPts(wx, wy, 32, 44), { wash: on ? mixCol(G.charDk, '#F2B866', lit) : mixCol(G.charLt, G.charDk, hk), ink: G.ink, sw: .4 });
    }
  }
}
function cobbles(gnd) {
  const c = mixCol(gnd, G.ink, .3);
  for (let i = 0; i < 70; i++) {
    const row = i % 7, y = HY + 40 + row * row * 9 + row * 18, x = -600 + frac(hash(i * 1.3) + row * .37) * 3000, s = 1 + row * .25;
    boilSeed('cob' + i);
    inkLine([[x - 16 * s, y], [x - 6 * s, y - 6 * s], [x + 12 * s, y - 5 * s], [x + 18 * s, y + 1]], .5, c, 'inkfine', .5);
  }
}
// Fog bands across the screen (screen space), k = 0..1 density. Peels away as k falls.
function fog(k, t = 0) {
  if (k <= .01) return;
  for (let i = 0; i < 5; i++) {
    boilSeed('fog' + i);
    const y = 120 + i * 210, dx = (t * (18 + i * 7) + i * 300) % 600 - 300;
    paint(ellPts(W / 2 + dx, y, 1500, 150, 26, 18), { wash: '#EDE7DA', washOp: 150 * k, ink: null });
  }
}

// ---------- the scaffold ----------
function scaffold(o = {}) {
  const [x0, x1] = SCAF;
  boilSeed('scaffold');
  for (const px of [x0 + 30, x0 + 260, x1 - 260, x1 - 30]) paint(rectPts(px - 14, PY + 10, 28, GY - PY - 10, 2), { wash: G.woodDk, ink: G.ink, sw: .6 });
  paint(rectPts(x0 + 30, PY + 60, x1 - x0 - 60, 14, 2), { wash: G.woodDk, ink: G.ink, sw: .5 });
  inkLine([[x0 + 44, PY + 70], [x0 + 250, GY - 10]], 1.2, G.woodDk, 'ink', 0);
  inkLine([[x1 - 44, PY + 70], [x1 - 250, GY - 10]], 1.2, G.woodDk, 'ink', 0);
  // steps down the right side
  for (let k = 0; k < 4; k++) {
    const sx = x1 + k * 34, sy = PY + 10 + k * 34;
    paint(rectPts(sx - 6, sy, 60, 16, 1.5), { wash: G.wood, ink: G.ink, sw: .6 });
  }
  inkLine([[x1 + 8, PY + 10], [x1 + 150, GY]], 1.4, G.woodDk, 'ink', 0);
  // the deck
  paint(rectPts(x0, PY - 4, x1 - x0, 26, 2), { wash: G.wood, fill: G.woodDk, fillOp: 90, tex: .6, ink: G.ink, sw: .9 });
  for (let k = 1; k < 9; k++) { const px = x0 + k * (x1 - x0) / 9; inkLine([[px, PY - 2], [px + 2, PY + 20]], .4, G.woodDk, 'inkfine', 0); }
  if (o.stain) paint(ellPts(GX, PY + 2, 120 * o.stain, 10 * o.stain, 16, 2), { wash: G.redDk, washOp: 220, ink: null });
}

// ---------- the guillotine ----------
// o.drop 0..1: the blade's fall (0 = up, 1 = down on the block). o.swing: blade rotation (rad). o.fray 0..1: the rope
// thinning at CUT. o.ropeCut: snapped (two dangling ends). o.lever 0..1: the red lever pulled. o.blood 0..1: red on the blade. o.bladeOff: the blade isn't drawn.
// o.noLever: leave the lever out (close-ups where its knob would read as a stray red dot).
const BLADE_TOP = 70, BLADE_LOW = PY - 150;
function bladeY(drop) { return lerp(BLADE_TOP, BLADE_LOW, drop); }
function guillotine(o = {}) {
  const drop = o.drop || 0, by = bladeY(drop), half = 118;
  boilSeed('guillotine frame');
  for (const s of [-1, 1]) {
    paint(rectPts(GX + s * half - 20, -20, 40, PY + 20, 2), { wash: G.wood, fill: G.woodDk, fillOp: 80, tex: .6, ink: G.ink, sw: 1.1 });
    paint([[GX + s * half, PY - 110], [GX + s * (half + 110), PY], [GX + s * (half + 84), PY], [GX + s * half, PY - 78]], { wash: G.woodDk, ink: G.ink, sw: .8 });   // braces
  }
  paint(rectPts(GX - half - 60, -60, 2 * half + 120, 46, 2), { wash: G.woodDk, fill: G.wood, fillOp: 70, ink: G.ink, sw: 1.1 });
  paint(ellPts(GX, -14, 18, 18, 14), { wash: G.steelDk, ink: G.ink, sw: .6 });   // pulley
  // rope: from the blade over the pulley and down the right post to the lever cleat
  boilSeed('guillotine rope');
  const fray = o.fray || 0, ropeCol = mixCol('#B9A98A', G.woodDk, .2);
  if (!o.bladeOff && !o.ropeCut) inkLine([[GX, by - 60], [GX, -14]], 1.6, ropeCol, 'ink', 0);
  // the rope from the pulley over the crossbeam's end, straight down beside the right post, and across to the lever.
  // o.fray thins it at CUT (where Clawd clings and saws); o.ropeCut leaves two dangling ends.
  const R0 = [GX + 18, -14], R1 = [CUT[0], -30], R2 = [CUT[0], LEVER[1] - 30], R3 = [LEVER[0] - 4, LEVER[1] - 6];
  if (o.ropeCut) {
    const sw2 = Math.sin(T * 5) * 12;
    inkLine([R0, R1, [CUT[0] + sw2 * .5, CUT[1] - 20]], 1.4, ropeCol, 'ink', .3);
    inkLine([[CUT[0] - sw2, CUT[1] + 40], R2, R3], 1.4, ropeCol, 'ink', .2);
  } else {
    inkLine([R0, R1, [CUT[0], CUT[1] - 8]], 1.4, ropeCol, 'ink', 0);
    inkLine([[CUT[0], CUT[1] - 8], [CUT[0], CUT[1] + 8]], 1.4 * (1 - .82 * fray), ropeCol, 'ink', 0);
    inkLine([[CUT[0], CUT[1] + 8], R2, R3], 1.4, ropeCol, 'ink', 0);
    if (fray > .05) for (let k = 0; k < Math.ceil(fray * 7); k++) { const sd = k % 2 ? 1 : -1; inkLine([[CUT[0], CUT[1] + (k % 3 - 1) * 4], [CUT[0] + sd * (8 + 7 * hash(k)), CUT[1] + (k % 3 - 1) * 9 - sd * 5]], .5, ropeCol, 'inkfine', .3); }
  }
  // blade
  if (!o.bladeOff) {
    boilSeed('guillotine blade');
    push(); translate(GX, by - 60); rotate(o.swing || 0); translate(-GX, -(by - 60));
    const bl = [[GX - 96, by - 60], [GX + 96, by - 60], [GX + 96, by + 10], [GX - 96, by + 56]];
    paint(rectPts(GX - 104, by - 110, 208, 54, 2), { wash: G.woodDk, ink: G.ink, sw: .8 });   // the weight
    paint(bl, { wash: '#8F8C88', fill: G.steelDk, fillOp: 60, tex: .3, ink: G.ink, sw: 1.3 });
    paint([[GX - 96, by + 56], [GX + 96, by + 10], [GX + 96, by - 6], [GX - 96, by + 38]], { wash: '#F4F0E6', ink: null });   // the bright edge
    inkLine([[GX - 90, by + 38], [GX + 90, by - 4]], .5, G.ink, 'inkfine', 0);
    if (o.blood > .01) paint([[GX - 94, by + 54], [GX + 94, by + 11], [GX + 92, by - 8 * o.blood], [GX - 30, by + 18], [GX - 92, by + 30 - 10 * o.blood]], { wash: G.red, washOp: 230 * clamp(o.blood), ink: null });
    pop();
  }
  // lunette block
  boilSeed('guillotine block');
  paint(rectPts(GX - half, PY - 96, 2 * half, 96, 2), { wash: G.woodDk, fill: G.wood, fillOp: 60, ink: G.ink, sw: 1 });
  paint(ellPts(GX, PY - 96, 38, 30, 16), { wash: G.charDk, ink: G.ink, sw: .7 });
  // the lever, on its own short post near the deck's right end; the rope runs down to it. Pulling swings it toward the block.
  if (o.noLever) return;
  boilSeed('guillotine lever');
  const [kx, ky] = leverKnob(o.lever || 0);
  paint(rectPts(LEVER[0] - 9, LEVER[1] - 10, 18, PY - LEVER[1] + 10, 1.5), { wash: G.woodDk, ink: G.ink, sw: .7 });
  inkLine([[LEVER[0], LEVER[1]], [kx, ky]], 3, G.woodDk, 'ink', 0);
  paint(ellPts(kx, ky, 20, 20, 14), { wash: G.red, ink: G.ink, sw: .8 });
  paint(ellPts(LEVER[0], LEVER[1], 11, 11, 10), { wash: G.steelDk, ink: G.ink, sw: .5 });
}
// Where the lever's red knob is (k = 0 up, 1 pulled), for hands.
const LEVER = [1330, 640], CUT = [1072, 40];   // CUT: where Clawd saws and bites through the rope, just below the crossbeam
const leverKnob = k => { const la = lerp(-1.35, -2.9, k); return [LEVER[0] + Math.cos(la) * 118, LEVER[1] + Math.sin(la) * 118]; };

// ---------- the Headsman ----------
// (x, gy) = the ground point between his feet; u = the same unit as Clawd's (he stands ~21u tall).
// Options: dx, dy, sq, rot (lean from the feet), flip, walk (leg phase), aL / aR (arm angles: 0 = hanging, + = raised
// forward, ~1.6 = straight out, ~2.8 = overhead), handL / handR(u, sw) hooks drawn at the hand, reachL / reachR: [x, y]
// a world point the hand goes to (the arm aims and stretches to it; use with rot 0), lookX / lookY (-1..1),
// glow 0..1 (the eye holes burn red), squint 0..1, hoodless (the small face under the hood), boilKey.
function headsman(x, gy, u, o = {}) {
  const id = 'headsman ' + (o.boilKey ?? ''), rs = p => boilSeed(id + p), sq = o.sq || 0, sw = clamp(u / 15, .5, 2.4);
  push(); translate(x + (o.dx || 0) * u, gy + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .5), 1 - sq);
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  // legs
  [-1, 1].forEach((s, i) => {
    rs('leg' + i);
    const ph = o.walk != null ? Math.sin((o.walk + i * .5) * TAU) : 0, lift = Math.max(0, ph) * 1.1, sx = o.walk != null ? ph * .6 : 0;
    paint(rectPts((s * 1.9 - 1.15 + sx) * u, -4 * u - lift * u * .2, 2.3 * u, (4 - lift) * u, u * .06), { wash: G.charDk, ink: G.ink, sw: sw * .9 });
    paint(ellPts((s * 1.9 + .3 + sx) * u, -lift * u - .3 * u, 1.6 * u, .6 * u, 12), { wash: G.woodDk, ink: G.ink, sw: sw * .7 });
  });
  const fs = (o.flip ? -1 : 1) * (1 + sq * .5), X = x + (o.dx || 0) * u, Y = gy + (o.dy || 0) * u;
  const arm = (side, a, hook, reach) => {
    rs('arm' + side);
    let len = 1;
    if (reach) {   // aim and stretch the arm so the hand lands on a world point
      const lx = (reach[0] - X) / fs - side * 3.7 * u, ly = (reach[1] - Y) / (1 - sq) + 12.2 * u;
      a = side * Math.atan2(lx, ly); len = clamp(Math.hypot(lx, ly) / (7.6 * u), .6, 1.6);
    }
    push(); translate(side * 3.7 * u, -12.2 * u); rotate(-side * a); scale(1, len);   // the arm hangs down (+y); a swings it out and up on its own side
    const R = ribbon(P([[0, 0], [side * .5, 2.6], [side * .3, 5.4], [0, 7]]), 1.9 * u, 1.5 * u);
    paint(R, { wash: G.char, ink: G.ink, sw: sw * .9 });
    translate(0, 7.6 * u); scale(1, 1 / len);
    paint(ellPts(0, 0, 1.45 * u, 1.3 * u, 16, u * .05), { wash: G.charLt, ink: G.ink, sw: sw * .9 });
    if (hook) hook(u, sw);
    pop();
  };
    const aL = o.aL ?? .1, aR = o.aR ?? .1;
  arm(-1, aL, o.handL, o.reachL);
  // torso
  rs('torso');
  const torso = P([[-4.6, -3.6], [-4.2, -9], [-3.9, -12.8], [3.9, -12.8], [4.2, -9], [4.6, -3.6]]);
  paint(torso, { wash: G.char, fill: G.charDk, fillOp: 90, tex: .5, ink: G.ink, sw, curv: .2 });
  paint(rectPts(-4.5 * u, -5.4 * u, 9 * u, 1.1 * u, u * .05), { wash: G.oxblood, ink: G.ink, sw: sw * .6 });
  paint(rectPts(-.7 * u, -5.5 * u, 1.4 * u, 1.3 * u), { wash: G.steelDk, ink: G.ink, sw: sw * .5 });
  // hood (or the small face under it)
  rs('hood');
  if (o.hoodless) {
    paint(ellPts(0, -14.6 * u, 2.1 * u, 2 * u, 20, u * .04), { wash: '#D9B8A6', fill: '#C79886', fillOp: 70, ink: G.ink, sw: sw * .8 });
    for (const s of [-1, 1]) paint(ellPts((s * .7 + (o.lookX || 0) * .3) * u, -14.9 * u, .22 * u, .3 * u, 10), { wash: G.ink, ink: null });
    inkLine(P([[-.6, -13.7], [-.2, -13.9], [.2, -13.7], [.6, -13.9]]), sw * .6, G.ink, 'inkfine', .4);
    if (o.sweat) emote('sweat', 2.6 * u, -16 * u, u * .7, 1, T);
  } else {
    // a round, close-fitting sack cowl with a short cape over the shoulders and a crumpled tip flopped to one side
    const hood = P([[-4.9, -11.2], [-4.4, -13.4], [-4.2, -15.6], [-3.5, -17.8], [-1.8, -19.1], [.4, -19.4], [2.1, -19.1], [3.1, -19.9], [3.9, -19.6], [3.6, -18.4], [4.2, -16.6], [4.3, -13.4], [4.9, -11.2], [0, -10.6]]);
    paint(hood, { wash: G.oxblood, fill: G.redDk, fillOp: 90, tex: .6, ink: G.ink, sw, curv: .3 });
    inkLine(P([[-3.9, -13.3], [-1.5, -12.8], [1.5, -12.8], [3.9, -13.3]]), sw * .5, G.redDk, 'inkfine', .5);   // where the cowl meets the cape
    inkLine(P([[.3, -19.2], [.2, -17.6]]), sw * .45, G.redDk, 'inkfine', 0);   // seam
    const lx = (o.lookX || 0) * .45, ly = (o.lookY || 0) * .35, sqz = clamp(o.squint || 0);
    for (const s of [-1, 1]) {
      const ex = (s * 1.35 + lx) * u, ey = (-15.4 + ly) * u;
      paint(ellPts(ex, ey, .8 * u, .62 * u * (1 - .8 * sqz), 14, u * .03, s * .15), { wash: '#1A1418', ink: G.ink, sw: sw * .5 });
      if (o.glow > .02) { glow(ex, ey, 2.6 * u, '#FF4A30', o.glow); paint(ellPts(ex, ey, .3 * u, .26 * u * (1 - .8 * sqz), 10), { wash: '#FF5A3A', washOp: 255 * clamp(o.glow), ink: null }); }
    }
  }
  arm(1, aR, o.handR, o.reachR);
  rs('after');
  pop();
}

// ---------- townsfolk ----------
// Bean-shaped people. (x, gy) = ground point; u = the unit (about Clawd's). o: hat (bonnet, cap, top, scarf, bald,
// nightcap, none), col, cheer 0..1 (arms up), dy, sq, rot, flip, lookX, mouth ('o', 'smile', 'open', 'frown'), eyes
// ('dot', 'shut', 'wide'), back (seen from behind: no face), umbrella, boilKey.
const FOLK = [
  { hat: 'bonnet', col: '#E9DDC4' }, { hat: 'cap', col: '#E2D4B8' }, { hat: 'top', col: '#EDE3CE' },
  { hat: 'scarf', col: '#E6D8BD' }, { hat: 'bald', col: '#E4D2B6' },
];
function folk(x, gy, u, o = {}) {
  const id = 'folk ' + (o.boilKey ?? x), rs = p => boilSeed(id + p), sw = clamp(u / 15, .45, 2), sq = o.sq || 0;
  const col = o.col || '#E9DDC4', dk = mixCol(col, G.ink, .18);
  push(); translate(x, gy + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .5), 1 - sq);
  const P = pts => pts.map(([a, b]) => [a * u, b * u]);
  rs('feet'); for (const s of [-1, 1]) paint(ellPts(s * 1.1 * u, -.3 * u, .9 * u, .45 * u, 10), { wash: G.charLt, ink: G.ink, sw: sw * .6 });
  const drawArm = s => { rs('arm' + s); const k = clamp(o.cheer || 0), a = lerp(.5, 2.7, k) + (o.wave ? .35 * Math.sin(T * 16 + s * 2) * k : 0); const tip = [s * (2 + Math.sin(a) * 1.9) * u, (-3.7 + Math.cos(a) * 1.9) * u]; inkLine([[s * 1.9 * u, -3.7 * u], tip], sw * 2.2, G.ink, 'ink', 0); paint(ellPts(tip[0], tip[1], .38 * u, .38 * u, 8), { wash: col, ink: G.ink, sw: sw * .5 }); };
  [-1, 1].forEach(drawArm);
  rs('body');
  const body = P([[-2.1, -.5], [-2.35, -2.8], [-2.1, -5], [-1.2, -6.4], [0, -6.7], [1.2, -6.4], [2.1, -5], [2.35, -2.8], [2.1, -.5]]);
  paint(body, { wash: col, ink: null, curv: .5 });
  paint(ellPts(-.6 * u, -1.4 * u, 1.6 * u, .8 * u, 14), { fill: dk, fillOp: 90, bleed: .1, ink: null });
  paint(body, { ink: G.ink, sw, curv: .5 });
  rs('face');
  const lx = (o.lookX || 0) * .5 * u, e = o.back ? 'none' : o.eyes || 'dot';
  for (const s of [-1, 1]) {
    if (e === 'shut') inkLine([[s * .7 * u + lx - .3 * u, -4.6 * u], [s * .7 * u + lx, -4.8 * u], [s * .7 * u + lx + .3 * u, -4.6 * u]], sw * .6, G.ink, 'ink', .4);
    else if (e !== 'none') paint(ellPts(s * .7 * u + lx, -4.7 * u, (e === 'wide' ? .3 : .18) * u, (e === 'wide' ? .36 : .26) * u, 10), { wash: G.ink, ink: null });
  }
  if (o.back) {}
  else if (o.mouth === 'o' || o.mouth === 'open') paint(ellPts(lx * .8, -3.8 * u, (o.mouth === 'open' ? .5 : .25) * u, (o.mouth === 'open' ? .45 : .3) * u, 10), { wash: '#4A1F2A', ink: G.ink, sw: sw * .4 });
  else if (o.mouth === 'smile') inkLine([[lx - .45 * u, -3.9 * u], [lx, -3.65 * u], [lx + .45 * u, -3.9 * u]], sw * .5, G.ink, 'ink', .5);
  else if (o.mouth === 'frown') inkLine([[lx - .45 * u, -3.65 * u], [lx, -3.9 * u], [lx + .45 * u, -3.65 * u]], sw * .5, G.ink, 'ink', .5);
  rs('hat');
  const h = o.hat;
  if (h === 'bonnet') paint(P([[-2.3, -4.9], [-2, -6.5], [-.8, -7.3], [.8, -7.3], [2, -6.5], [2.3, -4.9], [1.5, -5.9], [-1.5, -5.9]]), { wash: '#9A8C9E', ink: G.ink, sw: sw * .7, curv: .4 });
  else if (h === 'cap') { paint(P([[-1.8, -6.1], [-1.2, -7.2], [1.4, -7.1], [2.9, -6.3], [1.8, -6]]), { wash: G.charLt, ink: G.ink, sw: sw * .7, curv: .3 }); }
  else if (h === 'top') { paint(rectPts(-1.2 * u, -9.4 * u, 2.4 * u, 2.9 * u, u * .04), { wash: G.charDk, ink: G.ink, sw: sw * .7 }); paint(rectPts(-2 * u, -6.7 * u, 4 * u, .5 * u), { wash: G.charDk, ink: G.ink, sw: sw * .6 }); paint(rectPts(-1.2 * u, -7.3 * u, 2.4 * u, .45 * u), { wash: G.red, ink: null }); }
  else if (h === 'scarf') paint(P([[-2.35, -3.9], [-2.2, -5.8], [-1.1, -6.9], [1.1, -6.9], [2.2, -5.8], [2.35, -3.9], [1.6, -5.4], [-1.6, -5.4]]), { wash: G.redDk, ink: G.ink, sw: sw * .7, curv: .4 });
  else if (h === 'bald') { inkLine([[-.9 * u + lx, -4.15 * u], [-.2 * u + lx, -4.35 * u], [lx, -4.15 * u], [.2 * u + lx, -4.35 * u], [.9 * u + lx, -4.15 * u]], sw * 1.1, G.ink, 'ink', .6); inkLine([[-.8 * u, -6.1 * u], [-.4 * u, -6.3 * u]], sw * .4, G.ink, 'inkfine', 0); }
  else if (h === 'nightcap') paint(P([[-2, -5.9], [0, -7.5], [2.8, -8.6], [3.6, -7.6], [2, -6.1]]), { wash: G.boneDkr, ink: G.ink, sw: sw * .7, curv: .4 });
  if (o.umbrella) { rs('umb'); inkLine([[1.2 * u, -4 * u], [1.2 * u, -10 * u]], sw, G.ink, 'ink', 0); paint(P([[-2.8, -9.6], [-1.6, -11.8], [1.2, -12.6], [4, -11.8], [5.2, -9.6], [3.9, -10], [2.6, -9.6], [1.2, -10], [-.2, -9.6], [-1.5, -10]]), { wash: G.charLt, ink: G.ink, sw: sw * .7, curv: .3 }); }
  rs('after');
  pop();
}
// The five townsfolk as a crowd. xs/gys: positions; f(i) returns per-person options (merged over their look).
function crowd(xs, gy, u, f = () => ({})) { xs.forEach((x, i) => folk(x, gy, u, { ...FOLK[i % FOLK.length], boilKey: 'crowd' + i, ...f(i) })); }

// ---------- props ----------
// The red flower. s = size (px per unit); o.grow 0..1 (sprouting), o.bob (rad), o.petals (0..5 petals left), o.droop.
function flower(x, gy, s, o = {}) {
  const g = o.grow ?? 1; if (g <= .01) return;
  boilSeed('flower ' + (o.key ?? x));
  const h = 4.2 * s * ease(Math.min(1, g * 1.4)), bob = o.bob || 0, tip = [x + Math.sin(bob) * h * .3, gy - h * Math.cos(bob * .5)];
  inkLine([[x, gy], [lerp(x, tip[0], .5) + s * .3, gy - h * .55], tip], s * .06 + .6, G.stem, 'ink', .6);
  const lk = clamp((g - .3) / .4);
  if (lk > 0) for (const sd of [-1, 1]) paint(ellPts(x + sd * s * .7 * lk, gy - h * (sd < 0 ? .35 : .5), s * .75 * lk, s * .3 * lk, 12, 0, sd * -.5), { wash: G.stem, ink: G.ink, sw: .5 });
  const bk = clamp((g - .55) / .45), n = o.petals ?? 5;
  if (bk > 0) {
    push(); translate(tip[0], tip[1]); rotate(bob * .6 + (o.droop || 0));
    for (let i = 0; i < n; i++) { const a = i / 5 * TAU - Math.PI / 2; paint(ellPts(Math.cos(a) * s * .75 * bk, Math.sin(a) * s * .75 * bk, s * .62 * bk, s * .5 * bk, 12, 0, a), { wash: G.red, fill: G.redLt, fillOp: 60, ink: G.ink, sw: .6 }); }
    paint(ellPts(0, 0, s * .38 * bk, s * .38 * bk, 10), { wash: G.redDk, ink: G.ink, sw: .5 });
    pop();
  }
}
// A single petal, drifting: (x, y) centre, s size, a angle.
function petal(x, y, s, a, key) { boilSeed('petal ' + key); push(); translate(x, y); rotate(a); paint(ellPts(0, 0, s * .62, s * .46, 12), { wash: G.red, fill: G.redLt, fillOp: 60, ink: G.ink, sw: .5 }); pop(); }
// A red melon (the guillotine's only victims). r = radius, o.rot, o.key.
function melon(x, y, r, o = {}) {
  boilSeed('melon ' + (o.key ?? 0));
  push(); translate(x, y); rotate(o.rot || 0);
  paint(ellPts(0, 0, r, r * .88, 22, r * .02), { wash: G.red, fill: G.redDk, fillOp: 60, tex: .5, ink: G.ink, sw: .8 });
  for (const k of [-.5, 0, .5]) inkLine([[k * r * .9, -r * .82], [k * r * 1.15, 0], [k * r * .9, r * .82]], .5, G.redDk, 'inkfine', .6);
  paint(ellPts(-r * .35, -r * .4, r * .22, r * .14, 10, 0, -.6), { wash: G.redLt, ink: null });
  inkLine([[0, -r * .86], [r * .15, -r * 1.15]], .8, G.stemDk, 'ink', 0);
  pop();
}
// A red splash bursting from (x, y), k = seconds since impact (slow: frozen-ish when sp is small). s = scale.
function splash(x, y, s, k, sp = 1, key = 0) {
  if (k < 0) return;
  const age = k * sp;
  for (let i = 0; i < 16; i++) {
    boilSeed('splash ' + key + ' ' + i);
    const a = -Math.PI * (.08 + .84 * hash(i + key * 13)), v = (.6 + hash(i * 3 + key) * .8) * s * 9, r = s * (.35 + .5 * hash(i * 7 + key));
    const px = x + Math.cos(a) * v * age * 3, py = y + Math.sin(a) * v * age * 3 + 900 * age * age * s / 8;
    paint(ellPts(px, py, r * (1 + age), r * (1 - age * .3), 12, 0, a), { wash: i % 3 ? G.red : G.redDk, ink: G.ink, sw: .5 });
  }
  if (age < .12) { boilSeed('splash core ' + key); paint(ellPts(x, y, s * 3 * (1 + age * 4), s * 1.6 * (1 + age * 3), 18, s * .3), { wash: G.red, washOp: 255 * (1 - age * 8), ink: null }); }
}
// Clawd's broom, drawn along +x from (0, 0) (for arm hooks), len px. o.broken: only the handle half.
function broomAt(len, o = {}) {
  boilSeed('broom ' + (o.key ?? 0));
  const hw = (len * .012 + .8) * (o.w || 1);
  if (o.broken === 'head') inkLine([[len * .05, 0], [len * .45, 0]], hw, '#A08563', 'ink', 0);
  else inkLine([[-len * .6, 0], [o.broken === 'handle' ? len * .05 : len * .45, 0]], hw, '#A08563', 'ink', 0);
  if (o.broken === 'handle') { inkLine([[len * .03, -len * .02], [len * .09, -len * .01], [len * .05, len * .005], [len * .1, len * .02]], .8, G.woodLt, 'ink', 0); return; }
  if (o.broken === 'head') inkLine([[len * .08, -len * .02], [len * .02, -len * .005], [len * .07, len * .01], [len * .01, len * .02]], .8, G.woodLt, 'ink', 0);
  paint([[len * .4, -len * .04], [len * .72, -len * .13], [len * .76, len * .13], [len * .4, len * .04]], { wash: '#B09A6A', ink: G.ink, sw: .7 });
  for (let k = 0; k < 4; k++) inkLine([[len * .45, (k - 1.5) * len * .02], [len * .74, (k - 1.5) * len * .06]], .4, '#7E6A44', 'inkfine', 0);
}
// A watering can, drawn around (0, 0), tipped by a (rad). s = size.
function wateringCan(s, a = 0, k = 0) {
  boilSeed('can');
  push(); rotate(a);
  paint(rectPts(-s * .9, -s * .9, s * 1.8, s * 1.5, s * .03), { wash: G.steelDk, fill: G.steel, fillOp: 60, ink: G.ink, sw: .8 });
  paint([[s * .9, -s * .1], [s * 2, -s * .9], [s * 2.1, -s * .7], [s * .9, s * .3]], { wash: G.steelDk, ink: G.ink, sw: .7 });
  inkLine([[-s * .6, -s * .9], [0, -s * 1.5], [s * .6, -s * .9]], 1, G.ink, 'ink', .5);
  pop();
  if (k > 0) {
    const [tx, ty] = [s * 2.05 * Math.cos(a) + s * .8 * Math.sin(a), s * 2.05 * Math.sin(a) - s * .8 * Math.cos(a)];
    for (let i = 0; i < 5; i++) { const ph = frac(T * 3 + i / 5); boilSeed('drop' + i); paint(ellPts(tx + ph * s * .8 + i * 2, ty + ph * s * 3, s * .08, s * .14, 8), { wash: G.rain, washOp: 255 * k, ink: null }); }
  }
}
// A dust puff at (x, y), age in seconds.
function dust(x, y, s, age, key = 0) {
  if (age < 0 || age > .7) return;
  for (let i = 0; i < 5; i++) {
    boilSeed('dust ' + key + ' ' + i);
    const a = Math.PI + (i / 4) * Math.PI, d = s * (1 + age * 4) * (.8 + .4 * hash(i + key)), r = s * .6 * (1 + age * 2);
    paint(ellPts(x + Math.cos(a) * d * 1.6, y + Math.sin(a) * d * .5, r, r * .7, 12), { wash: G.boneDkr, washOp: 230 * (1 - age / .7), ink: age < .35 ? mixCol(G.boneDkr, G.ink, .5) : null, sw: .4 });
  }
}
// Speed lines for a whip pan (screen space), k = 0..1 strength, dir ±1.
function whipLines(k, dir = 1) {
  if (k <= .02) return;
  for (let i = 0; i < 14; i++) { boilSeed('whip' + i); const y = hash(i) * H, l = W * (.4 + .5 * hash(i + 9)) * k, x = hash(i + 3) * W; inkLine([[x, y], [x + dir * l, y + jit(4)]], 2 + 3 * hash(i + 5), mixCol(G.boneDk, G.ink, .3), 'dry', 0); }
  paint(rectPts(-40, -40, W + 80, H + 80), { wash: G.boneDk, washOp: 170 * k, ink: null });
}

// The melon cart, heaped with red melons. n = how many are left on the heap (0..14).
function cart(x, gy, n = 14) {
  boilSeed('cart');
  paint(rectPts(x - 150, gy - 150, 300, 70, 2), { wash: G.wood, fill: G.woodDk, fillOp: 70, ink: G.ink, sw: .9 });
  inkLine([[x - 150, gy - 120], [x - 290, gy - 60]], 2, G.woodDk, 'ink', 0);
  for (const wx of [x - 90, x + 90]) { paint(ellPts(wx, gy - 48, 46, 46, 20, 1.5), { wash: G.woodDk, ink: G.ink, sw: .8 }); inkLine([[wx - 40, gy - 48], [wx + 40, gy - 48]], .6, G.woodLt, 'inkfine', 0); inkLine([[wx, gy - 88], [wx, gy - 8]], .6, G.woodLt, 'inkfine', 0); }
  for (let i = 0; i < n; i++) { const row = i < 6 ? 0 : i < 10 ? 1 : i < 13 ? 2 : 3, k = [0, 6, 10, 13][row], m = [6, 4, 3, 1][row]; melon(x - (m - 1) * 23 + (i - k) * 46 + (row % 2) * 4, gy - 175 - row * 38, 26, { key: 'cart' + i, rot: hash(i) - .5 }); }
}
// A top hat on its own (thrown), centred at (x, y), s = size unit, a = spin.
function flyingHat(x, y, s, a, kind = 'top') {
  boilSeed('hat ' + kind); push(); translate(x, y); rotate(a);
  if (kind === 'top') { paint(rectPts(-1.2 * s, -2.9 * s, 2.4 * s, 2.9 * s, s * .04), { wash: G.charDk, ink: G.ink, sw: .8 }); paint(rectPts(-2 * s, -.2 * s, 4 * s, .5 * s), { wash: G.charDk, ink: G.ink, sw: .7 }); paint(rectPts(-1.2 * s, -.8 * s, 2.4 * s, .45 * s), { wash: G.red, ink: null }); }
  else paint([[-1.8 * s, 0], [-1.2 * s, -1.1 * s], [1.4 * s, -1 * s], [2.9 * s, -.2 * s], [1.8 * s, .1 * s]].map(p => p), { wash: G.charLt, ink: G.ink, sw: .7, curv: .3 });
  pop();
}
// Red juice spots on Clawd (a draw hook; body-local front coords). n = how many (0..9), grows over time.
function spotsHook(n, extra) {
  return (u, sw) => {
    // on the lower body and the outer corners, clear of the eyes, so the face still reads
    const SP = [[-3.9, -3.1], [-1.2, -2.7], [3.4, -2.9], [.9, -3.4], [-4.3, -7.2], [4.2, -6.9], [-2.6, -3.6], [2.2, -2.6], [4.4, -4.6]];
    for (let i = 0; i < Math.min(9, Math.floor(n)); i++) paint(ellPts(SP[i][0] * u, SP[i][1] * u, (.3 + .3 * hash(i)) * u, (.24 + .24 * hash(i + 2)) * u, 10, u * .05), { wash: G.red, washOp: 235, ink: null });
    if (extra) extra(u, sw);
  };
}
// The blade on a bar-long chopping cycle (background work): falls fast on the bar's downbeat, rises slowly after.
function chopCycle(t) { const f = frac((t - OFF) / (4 * BEAT)), fall = seg(f, 0, .04), rise = seg(f, .3, .85); return easeIn(fall) * (1 - ease(rise)); }

// Rain streaks over the frame (screen space, after camEnd). k = 0..1 heaviness.
function rain(t, k = 1) {
  if (k <= .01) return;
  const n = Math.round(70 * k);
  for (let i = 0; i < n; i++) {
    boilSeed('rain' + i);
    const x = frac(hash(i * 1.7) + t * .05) * (W + 200) - 100, y = frac(hash(i * 2.9) + t * (1.3 + .5 * hash(i))) * (H + 200) - 100;
    inkLine([[x, y], [x - 14, y + 60 + 30 * hash(i + 4)]], .6 + .5 * hash(i + 8), mixCol(G.rain, '#FFFFFF', .2), 'inkfine', 0);
  }
}
// The broom in world space from (x0, y0) toward (x1, y1): the handle, with the bristles at the (x1, y1) end.
// o.half: 'handle' (the jagged handle half) or 'head' (the bristle half). o.w: handle thickness multiplier.
function broomSpan(x0, y0, x1, y1, o = {}) {
  const a = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x1 - x0, y1 - y0);
  push(); translate(x0, y0); rotate(a); translate(len * .6, 0); broomAt(len / 1.36, { key: o.key, broken: o.half, w: o.w }); pop();
}

// Clawd at night: moonlit, a little bluer and lighter so the gray body still separates from the dark.
const MOONLIT = { col: '#5E6276', dk: '#43465A', lt: '#8A8FA8' };
// The Headsman's hut. (x, gy) = the ground point at the middle of its front; o.door 0..1 open, o.lamp 0..1 light inside.
function hut(x, gy, o = {}) {
  boilSeed('hut');
  const w = 380, h = 300;
  if (o.lamp > 0) glow(x + 60, gy - 110, 260, '#FFB866', o.lamp);
  paint(rectPts(x - w / 2, gy - h, w, h, 3), { wash: G.woodDk, fill: G.wood, fillOp: 70, tex: .6, ink: G.ink, sw: 1 });
  for (let k = 1; k < 7; k++) inkLine([[x - w / 2 + k * w / 7, gy - h + 6], [x - w / 2 + k * w / 7 + 3, gy - 4]], .5, G.charDk, 'inkfine', 0);
  paint([[x - w / 2 - 40, gy - h + 10], [x - 20, gy - h - 150], [x + w / 2 + 40, gy - h + 20]], { wash: G.charDk, ink: G.ink, sw: 1 });
  // round window
  paint(ellPts(x - 100, gy - 190, 44, 44, 18), { wash: o.lamp > 0 ? mixCol('#2A2228', '#F4B964', o.lamp) : '#1E1A20', ink: G.ink, sw: .8 });
  inkLine([[x - 144, gy - 190], [x - 56, gy - 190]], .6, G.woodDk, 'inkfine', 0); inkLine([[x - 100, gy - 234], [x - 100, gy - 146]], .6, G.woodDk, 'inkfine', 0);
  // door: a dark doorway, and the door swinging open over it
  paint(rectPts(x + 30, gy - 210, 120, 210, 1.5), { wash: o.lamp > 0 ? mixCol('#241C20', '#F2B060', o.lamp) : '#1E1A20', ink: G.ink, sw: .8 });
  const d = o.door || 0;
  paint([[x + 30, gy - 210], [x + 30 + 120 * (1 - d), gy - 210 - 14 * d], [x + 30 + 120 * (1 - d), gy + 8 * d], [x + 30, gy]], { wash: G.wood, ink: G.ink, sw: .8 });
}
