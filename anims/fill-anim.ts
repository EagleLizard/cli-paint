
import { Painter } from '../paint/paint';
import chalk from 'chalk';

export function getFillAnim(painter: Painter) {
  let x: number, y: number, fillCharIdx: number, iterations: number;
  let r: number, g: number, b: number,
    rDir: boolean, gDir: boolean, bDir: boolean,
    rFlip: boolean, gFlip: boolean, bFlip: boolean,
    colorMod: number;
  let fillChars: string[];
  let iterationCounter: number;

  fillChars = [
    '•', '$', '@', '§', '£', '∑', '¥', '∆', '©', 'ƒ', 'µ',
  ];

  x = 0;
  y = 0;

  r = 0;
  g = 0;
  b = 0;
  rDir = true;
  gDir = true;
  bDir = true;
  rFlip = false;
  gFlip = false;
  bFlip = false;

  colorMod = 1;

  iterationCounter = 0;

  fillCharIdx = Math.floor(Math.random() * fillChars.length);
  // iterations = Math.round((painter.width * painter.height) / 2);
  iterations = 512;

  return async () => {
    let drawChar: string, decoratedChar: string;
    for(let i = 0; i < iterations; ++i) {
      if(iterationCounter > Number.MAX_SAFE_INTEGER) {
        iterationCounter = 0;
      }
      iterationCounter++;

      if(rDir && (r > 255)) {
        rDir = false;
        rFlip = true;
      }
      if(!rDir && (r < 1)) {
        rDir = true;
        rFlip = true;
      }
      if(bDir && (b > 255)) {
        bDir = false;
        bFlip = true;
      }
      if(!bDir && (b < 1)) {
        bDir = true;
        bFlip = true;
      }
      if(gDir && (g > 255)) {
        gDir = false;
        gFlip = true;
      }
      if(!gDir && (g < 1)) {
        gDir = true;
        gFlip = true;
      }
      if(bFlip) {
        rDir
          ? r += Math.round(colorMod)
          : r -= Math.round(colorMod)
        ;
      }
      if(gFlip) {
        bDir
          ? b += Math.round(colorMod * 2)
          : b -= Math.round(colorMod * 2)
        ;
      }
      gDir
        ? g += Math.round(colorMod * 1.5)
        : g -= Math.round(colorMod * 1.5)
      ;

      rFlip = false;
      gFlip = false;
      bFlip = false;

      if(x >= painter.width) {
        x = 0;
        y += 1;
      }

      if(y >= painter.height) {
        y = 0;
        x = 0;
      }
      fillCharIdx = Math.floor(Math.random() * fillChars.length);
      drawChar = fillChars[fillCharIdx];
      decoratedChar = chalk.rgb(r, g, b)(drawChar);
      // x += Math.floor(Math.random() * (painter.width / 8));
      x += Math.floor(Math.random() * (painter.width * 1));
      // x++;
      if((x < painter.width) && (y < painter.height)) {
        painter.setPoint(x, y, decoratedChar);
      }
    }
    await painter.draw();
  };
}
