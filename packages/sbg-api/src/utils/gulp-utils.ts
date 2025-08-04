import gulp from 'gulp';

/**
 * Copy and process files using gulp
 * @param src - The source file(s) to copy
 * @param dest - The destination directory
 * @param options - Options for gulp.src
 * @returns A promise that resolves when the copying is complete
 */
export async function gulpCopyAsync(
  src: string | string[],
  dest: string,
  options?: Parameters<typeof gulp.src>[1]
): Promise<void> {
  return new Promise((resolve, reject) => {
    gulp.src(src, options).pipe(gulp.dest(dest)).on('end', resolve).on('error', reject);
  });
}
