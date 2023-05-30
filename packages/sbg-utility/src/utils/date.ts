/**
 * convert hours,min,sec to milliseconds
 * @param hrs
 * @param min
 * @param sec
 * @returns
 */
export const toMilliseconds = (hrs: number, min: number, sec: number) => (hrs * 60 * 60 + min * 60 + sec) * 1000;