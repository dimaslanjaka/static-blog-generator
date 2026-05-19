import { describe, it, expect } from '@jest/globals';
import { removeAnsi } from '../../src/utils/removeAnsi';

describe('removeAnsi', () => {
  it('removes ANSI color codes', () => {
    const input = '\u001b[31mHello\u001b[0m World';

    expect(removeAnsi(input)).toBe('Hello World');
  });

  it('returns the same string when no ANSI codes exist', () => {
    const input = 'Plain text';

    expect(removeAnsi(input)).toBe('Plain text');
  });

  it('removes multiple ANSI sequences', () => {
    const input = '\u001b[1mBold\u001b[0m and \u001b[32mGreen\u001b[0m';

    expect(removeAnsi(input)).toBe('Bold and Green');
  });

  it('removes nested ANSI formatting', () => {
    const input = '\u001b[1m\u001b[31mError:\u001b[0m Something failed';

    expect(removeAnsi(input)).toBe('Error: Something failed');
  });

  it('handles empty strings', () => {
    expect(removeAnsi('')).toBe('');
  });

  it('removes OSC escape sequences', () => {
    const input = '\u001b]0;Terminal Title\u0007Hello World';

    expect(removeAnsi(input)).toBe('Hello World');
  });

  it('removes ANSI cursor movement codes', () => {
    const input = 'Loading...\u001b[2K\u001b[1GDone';

    expect(removeAnsi(input)).toBe('Loading...Done');
  });

  it('removes 24-bit RGB color escape sequences', () => {
    const input = '\u001b[38;2;255;0;0mRed Text\u001b[0m and ' + '\u001b[48;2;0;255;0mGreen Background\u001b[0m';

    expect(removeAnsi(input)).toBe('Red Text and Green Background');
  });

  it('removes 256-color ANSI escape sequences', () => {
    const input = '\u001b[38;5;208mOrange\u001b[0m ' + '\u001b[48;5;27mBlueBg\u001b[0m';

    expect(removeAnsi(input)).toBe('Orange BlueBg');
  });

  it('removes hyperlink OSC sequences', () => {
    const input = '\u001b]8;;https://example.com\u0007Click Here\u001b]8;;\u0007';

    expect(removeAnsi(input)).toBe('Click Here');
  });

  it('removes mixed ANSI and OSC sequences in multiline text', () => {
    const input = [
      '\u001b[32mSUCCESS\u001b[0m Build completed',
      '\u001b]0;Build Status\u0007',
      '\u001b[33mWARNING\u001b[0m Deprecated API',
      '\u001b[31mERROR\u001b[0m Something failed'
    ].join('\n');

    expect(removeAnsi(input)).toBe(
      ['SUCCESS Build completed', '', 'WARNING Deprecated API', 'ERROR Something failed'].join('\n')
    );
  });

  it('removes DEC private mode sequences', () => {
    const input = '\u001b[?25lHidden Cursor\u001b[?25h';

    expect(removeAnsi(input)).toBe('Hidden Cursor');
  });

  it('removes erase-in-line and cursor positioning sequences', () => {
    const input = 'Progress 10%\u001b[2K\r' + 'Progress 50%\u001b[2K\r' + 'Progress 100%';

    expect(removeAnsi(input)).toBe('Progress 10%\rProgress 50%\rProgress 100%');
  });

  it('handles consecutive ANSI sequences without text between them', () => {
    const input = '\u001b[1m\u001b[4m\u001b[31mImportant\u001b[0m';

    expect(removeAnsi(input)).toBe('Important');
  });

  it('preserves unicode and emoji characters', () => {
    const input = '\u001b[35m✨ Unicode テスト 🚀\u001b[0m';

    expect(removeAnsi(input)).toBe('✨ Unicode テスト 🚀');
  });

  it('handles malformed or incomplete ANSI sequences gracefully', () => {
    const input = 'Text\u001b[31mRed\u001b[ incomplete \u001b[0mNormal';

    expect(removeAnsi(input)).toBe('TextRed\u001b[ incomplete Normal');
  });

  it('removes terminal bell characters inside OSC sequences', () => {
    const input = '\u001b]2;Window Title\u0007' + '\u001b[32mReady\u001b[0m';

    expect(removeAnsi(input)).toBe('Ready');
  });

  it('handles very long strings with many ANSI sequences', () => {
    const input = Array.from({ length: 100 })
      .map((_, i) => `\u001b[3${i % 8}mLine ${i}\u001b[0m`)
      .join('\n');

    const expected = Array.from({ length: 100 })
      .map((_, i) => `Line ${i}`)
      .join('\n');

    expect(removeAnsi(input)).toBe(expected);
  });
});
