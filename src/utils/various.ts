/**
 * Sleep a function.
 * @param ms Milliseconds
 */
export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
