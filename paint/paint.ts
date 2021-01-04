import fs from 'fs';
import tty from 'tty';
import readline from 'readline';

export function print(str: string, writeStream?: fs.WriteStream | tty.WriteStream) {
  writeStream = writeStream ?? process.stdout;
  writeStream.write(str);
}

export class Painter {
  private _width: number;
  private _height: number;
  private buffer: string[][];
  private writeStream: tty.WriteStream;
  private needDrain: boolean;

  constructor(width: number, height: number, writeStream?: tty.WriteStream) {
    this._width = width;
    this._height = height;
    this.writeStream = writeStream ?? process.stdout;
    this.fill(' ');
    this.clear();
  }

  async draw() {
    let outStr: string;
    await this.clear();
    outStr = Array(this.buffer.length).fill(0).map((v, idx) => this.buffer[idx].join('')).join('\n');
    while(this.needDrain) {
      console.error('drain');
    }
    await new Promise<void>((resolve, reject) => {
      this.needDrain = !this.writeStream.write(outStr, err => {
        if(err) {
          return reject(err);
        }
        resolve();
        // this.writeStream.cursorTo(0, 0, resolve);
      });
      if(this.needDrain) {
        this.drain();
      }
    });
  }

  setPoint(x: number, y: number, char: string) {
    // enforce canvas boundaries, ignoring for now
    if(
      (y < 0)
      || (y > (this.buffer.length - 1))
      || (x < 0)
      || (x > (this.buffer[y].length - 1))
    ) {
      return;
    }
    this.buffer[y][x] = char;
  }

  fill(char: string) {
    let rows: string[][], bufferArr: string[][];
    bufferArr = (this.buffer === undefined)
      ? Array(this._height)
        .fill(0)
        .map(() => Array(this._width)
          .fill(0)
          .map(() => char)
        )
      : this.buffer
    ;
    for(let y = 0; y < this.height; ++y) {
      for(let x = 0; x < this.width; ++x) {
        bufferArr[y][x] = char;
      }
    }
    this.buffer = bufferArr;
    // this.buffer = rows;
  }

  clear() {
    return new Promise<void>(resolve => {
      readline.cursorTo(this.writeStream, 0, 0);
      readline.clearScreenDown(this.writeStream, resolve);
      // this.writeStream.cursorTo(0, 0);
      // this.writeStream.clearScreenDown(resolve);
    });
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  private drain() {
    this.writeStream.once('drain', (evt) => {
      this.needDrain = false;
    });
  }

}
