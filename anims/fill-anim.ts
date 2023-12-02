
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
    '•', '$', '@', '§', '£', '∑', '¥', '∆', '©', 'ƒ', 'µ', 'Ɖ',
    // '∀', '∅', '∃',
  ];

  x = 0;
  y = 0;

  r = 150;
  g = 150;
  b = 150;
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
  // iterations = 4096;
  // iterations = 2048;
  iterations = 1024;
  // iterations = 512;
  // iterations = 256;
  // iterations = 128;
  // iterations = 64;
  // iterations = 1;
  // iterations = painter.width;

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
          ? r += Math.round(colorMod * 1.5)
          : r -= Math.round(colorMod * 1.5)
        ;
      }
      if(gFlip) {
        bDir
          ? b += Math.round(colorMod * 1.25)
          : b -= Math.round(colorMod * 1.25)
        ;
      }
      gDir
        ? g += Math.round(colorMod * 1)
        : g -= Math.round(colorMod * 1)
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
      x += Math.floor(Math.random() * (painter.width * 0.5));
      // x += Math.floor(Math.random() * (painter.width * 2));
      // x++;
      if((x < painter.width) && (y < painter.height)) {
        painter.setPoint(x, y, decoratedChar);
      }
    }
    await painter.draw();
  };
}
