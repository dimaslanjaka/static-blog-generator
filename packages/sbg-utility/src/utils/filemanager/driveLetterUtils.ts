/**
 * Utility functions for drive letter normalization and path handling.
 * Shared by normalizePath and case-path to avoid circular dependencies.
 */

/**
 * Ensures the drive letter in a Windows path is uppercase.
 * @param filePath - The file path to fix.
 * @returns The file path with an uppercase drive letter if applicable.
 */
export function fixDriveLetter(filePath: string): string {
  if (/^[a-z]:/.test(filePath)) {
    return filePath.charAt(0).toUpperCase() + filePath.slice(1);
  }
  return filePath;
}
