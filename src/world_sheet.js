// world_sheet.js: model sheets for the square and the cast (reference only, not part of the video).
//   node render.mjs --draft --loop=square --sheet=0.5 --cols=1 --w=1600 --out=out/check/square.jpg
(() => {
  LOOPS.square = t => {
    camBegin(900, 420, .62);
    backdrop(SKY.dawn);
    scaffold({ stain: 0 });
    guillotine({ drop: 0, lever: 0 });
    flower(FX, GY, 26, { bob: .1 * Math.sin(t * 2) });
    headsman(1180, PY, U, { aR: 1.2, aL: .2, lookX: -.5, glow: .6 });
    clawd(700, PY, U, feel('happy', t));
    crowd([-150, 20, 190, 350, 470], GY, 22, i => ({ cheer: i % 2 ? .8 : 0, mouth: i % 2 ? 'open' : 'o', dy: -Math.abs(Math.sin((t + i * .3) * 4)) * .5 }));
    melon(1600, GY - 40, 40, { key: 1 });
    camEnd();
  };
  LOOPS.square.len = 4;
  LOOPS.cast = t => {
    backdrop(SKY.noon);
    headsman(420, 980, 38, { aL: .3, aR: 1.4, glow: 1, handR: (u, sw) => melon(0, 0, u * 1.3, { key: 2 }) });
    headsman(1000, 980, 38, { hoodless: true, aL: -.1, aR: .1, sweat: true });
    crowd([1350, 1480, 1610, 1740, 1870], 980, 22, i => ({ cheer: i / 4, mouth: ['o', 'smile', 'open', 'frown', 'o'][i] }));
    flower(1400, 600, 40);
    clawd(1650, 600, 22, { ...feel('determined', t), armR: (u, sw) => broomAt(u * 9) , aR: .8 });
    splash(1450, 330, 12, .15, 1);
    push(); translate(1250, 330); wateringCan(40, -.4, 1); pop();
  };
  LOOPS.cast.len = 4;
})();
