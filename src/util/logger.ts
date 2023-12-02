
import { createWriteStream, WriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

import { APP_ROOT } from '../constants';
import { checkDir } from '../util/files';

const LOGS_DIR = 'logs';
const LOGS_DIR_PATH = path.join(APP_ROOT, LOGS_DIR);

let loggerInstance: Logger;

export class Logger {
  private constructor(
    private writeStream: WriteStream,
  ) {

  }

  println(str: string) {
    this.writeStream.write(`${str}\n`);
  }

  static async init() {
    let logFileDir: string, logDirExists: boolean;
    let writeStream: WriteStream;

    if(loggerInstance === undefined) {
      logDirExists = await checkDir(LOGS_DIR_PATH);
      if(!logDirExists) {
        await mkdir(LOGS_DIR_PATH);
      }

      logFileDir = path.join(LOGS_DIR_PATH, 'out.log');
      writeStream = createWriteStream(logFileDir);
      loggerInstance = new Logger(writeStream);
    }

    return loggerInstance;
  }
}
