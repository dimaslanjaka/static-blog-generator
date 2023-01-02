/**
 * check development NODE_ENV
 * @returns
 */
export function isdev() {
  return /dev/i.test(process.env.NODE_ENV || '');
}
