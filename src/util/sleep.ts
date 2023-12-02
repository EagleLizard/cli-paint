
export function sleep(ms?: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleepImmediate(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}
