import fs from 'fs';
import tty from 'tty';
import readline from 'readline';

(readline.Interface.prototype as any)._insertString = function(c: any) {
  if(this.cursor < this.line.length) {
    let beg = this.line.slice(0, this.cursor);
    let end = this.line.slice(this.cursor, this.line.length);

    this.line = beg + c + end;
    this.cursor += c.length;
    this._refreshLine();
  } else {
    this.line += c;
    this.cursor += c.length;
    this.output.write(c);
    this._moveCursor(0);
  }

};

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
  private rl: readline.Interface;

  constructor(width: number, height: number, writeStream?: tty.WriteStream) {
    this._width = width;
    this._height = height;
    this.writeStream = writeStream ?? process.stdout;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: this.writeStream,
    });
    this.rl.on('close', () => {
      process.exit(0);
    });

    this.fill(' ');
    this.clear();
  }

  draw() {
    this.clear();

    for(let y = 0; y < this.height; ++y) {
      for(let x = 0; x < this.width; ++x) {
        readline.cursorTo(this.writeStream, x, y);
        try {
          this.rl.write(this.buffer[y][x]);
        } catch(e) {
          setTimeout(() => {
            console.error(this.buffer[y][x]);
            console.error(this.buffer[y][x].length);
          }, 100);
          console.error(e);
          throw e;
        }
      }
    }
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
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  private drain() {
    if(this.needDrain) {
      return new Promise<void>((resolve, reject) => {
        this.writeStream.once('drain', (evt) => {
          console.error('drain evt');
          console.error(evt);
          this.needDrain = false;
          resolve();
        });
      });
    }
    return Promise.resolve();
  }

}
