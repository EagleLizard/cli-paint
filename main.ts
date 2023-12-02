
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { getConfig, PaintConfig } from './config';
import { Painter } from './paint/paint';
import { getFillAnim } from './anims/fill-anim';
import { getSnakeAnim } from './anims/snake';
import { sleep, sleepImmediate } from './src/util/sleep';
import { Logger } from './src/util/logger';
import { Timer } from './src/util/timer';

const FPS = 240;
const INTERVAL_MS = Math.round(1000 / FPS);
const HALF_INTERVAL_MS = Math.round(INTERVAL_MS / 2);

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
  }
})();

async function main() {
  let config: PaintConfig, painter: Painter;
  let logger: Logger, frameTimer: Timer;
  logger = await Logger.init();
  logger.println(`target FPS interval: ${INTERVAL_MS}`);

  config = getConfig();
  painter = new Painter(config.width, config.height);
  const fillAnim = getFillAnim(painter);
  // const fillAnim = getSnakeAnim(painter);
  frameTimer = Timer.start();
  for(;;) {
    // await sleep(HALF_INTERVAL_MS);
    await fillAnim();
    // await sleep(INTERVAL_MS);
    do {
      await sleepImmediate();
    } while(frameTimer.currentMs() < INTERVAL_MS);
    logger.println(`${frameTimer.currentMs()}`);
    frameTimer.reset();
  }
}
