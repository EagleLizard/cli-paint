
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { getConfig, PaintConfig } from './config';
import { Painter } from './paint/paint';
import { getFillAnim } from './anims/fill-anim';
import { sleep } from './lib/sleep';

const FPS = 12;
const INTERVAL_MS = Math.round(1000 / FPS);

(async () => {
  await main();
})();

async function main() {
  let config: PaintConfig, painter: Painter;
  config = getConfig();
  painter = new Painter(config.width, config.height);
  const fillAnim = getFillAnim(painter);
  for(;;) {
    await sleep(INTERVAL_MS);
    await fillAnim();
  }
}
