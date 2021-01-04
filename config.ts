
export interface PaintConfig {
  width: number;
  height: number;
}

export function getConfig(): PaintConfig {
  let width: number, height: number;
  let config: PaintConfig;
  width = process.stdout.columns;
  height = process.stdout.rows;
  config = {
    width,
    height,
  };
  return config;
}
