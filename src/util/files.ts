
import { Stats } from 'fs';
import { stat } from 'fs/promises';

export async function checkDir(dirPath: string): Promise<boolean> {
  let stats: Stats;
  try {
    stats = await stat(dirPath);
  } catch(e) {
    if(e?.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
  return stats.isDirectory();
}
