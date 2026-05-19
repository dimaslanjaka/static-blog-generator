import stripAnsi from 'strip-ansi';

/**
 * Removes ANSI escape codes from a string.
 *
 * ANSI escape codes are commonly used to add colors, styles, and cursor
 * movements in terminal output. This function strips them out, returning
 * a plain-text version of the input string.
 *
 * @param input - The string that may contain ANSI escape sequences.
 * @returns A cleaned string with all ANSI escape codes removed.
 *
 * @example
 * ```ts
 * const colored = "\u001b[31mHello\u001b[0m World";
 * console.log(removeAnsi(colored)); // "Hello World"
 * ```
 */
export function removeAnsi(input: string): string {
  const stripped = stripAnsi(input);

  // Matches ANSI escape sequences (CSI, OSC, etc.)
  const ansiRegex =
    // biome-ignore lint/suspicious/noControlCharactersInRegex: intentional ANSI stripping
    // eslint-disable-next-line no-control-regex
    /\u001b\[[0-9;?]*[A-Za-z]|(?:\u001b\][^\u001b\u0007]*(?:\u0007|\u001b\\))/g;

  if (ansiRegex.test(stripped)) {
    return input.replace(ansiRegex, '');
  }
  return stripped;
}

export default removeAnsi;
