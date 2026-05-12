import crypto from 'crypto';
import fs from 'fs-extra';
import * as glob from 'glob';
import path from 'path';

interface CreateFileHashesOptions {
  /**
   * The root directory of the project.
   */
  projectDir: string;

  /**
   * File extensions to include (without leading dots).
   *
   * @default ['py', 'js', 'php', 'cjs', 'mjs']
   */
  extensions?: string[];

  /**
   * Directories to exclude (relative to `projectDir`).
   *
   * @default []
   */
  excludeDirs?: string[];

  /**
   * Extra files to always include (absolute paths).
   *
   * @default []
   */
  extraFiles?: string[];

  /**
   * Use absolute file paths as object keys.
   *
   * @default false
   */
  absolutePaths?: boolean;
}

type HashMap = Record<string, string>;

/**
 * Generate file hashes for a project directory.
 *
 * @param options - Hash generation options.
 * @returns Object mapping file paths to hashes.
 */
export async function createFileHashes({
  projectDir,
  extensions = ['py', 'js', 'php', 'cjs', 'mjs'],
  excludeDirs = [],
  extraFiles = [],
  absolutePaths = false
}: CreateFileHashesOptions): Promise<HashMap> {
  const ignorePatterns = excludeDirs.map((dir) => `**/${dir}/**`);

  const hashMap: HashMap = {};

  const processedFiles = new Set<string>();

  /**
   * Hash a file and store it in the hash map.
   *
   * @param file - File path.
   */
  async function hashAndStore(file: string): Promise<void> {
    if (processedFiles.has(file)) return;

    processedFiles.add(file);

    try {
      const stats = await fs.stat(file);

      const pseudoHash = `${stats.size}-${stats.mtimeMs}`;

      const hash = crypto.createHash('sha256').update(pseudoHash).digest('hex');

      let keyPath = absolutePaths ? path.resolve(file) : path.relative(projectDir, file);

      keyPath = keyPath.split(path.sep).join('/');

      hashMap[keyPath] = hash.slice(0, 8);
    } catch {
      // Ignore errors for missing files
    }
  }

  const allFiles = new Set<string>(extraFiles);

  extensions.forEach((ext) => {
    glob
      .sync(`**/*.${ext.replace(/^\./, '')}`, {
        cwd: projectDir,
        ignore: ignorePatterns,
        absolute: true
      })
      .forEach((file) => allFiles.add(file));
  });

  await Promise.all(Array.from(allFiles).map(hashAndStore));

  return Object.fromEntries(Object.entries(hashMap).sort(([a], [b]) => a.localeCompare(b)));
}

interface TreeNode {
  [key: string]: TreeNode | null;
}

/**
 * Generates a directory/file tree string from a hash map.
 *
 * @param hashMap - Object mapping relative file paths to hashes.
 * @returns The directory/file tree as a string, with file hashes.
 */
export function getFileTreeString(hashMap: HashMap): string {
  const tree: TreeNode = {};

  for (const filePath of Object.keys(hashMap)) {
    const parts = filePath.split('/');

    let current: TreeNode = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        current[part] = null;
      } else {
        current[part] ??= {};
        current = current[part] as TreeNode;
      }
    }
  }

  /**
   * Recursively prints the tree structure with hashes for files.
   *
   * @param node - Current tree node.
   * @param prefix - Prefix used for indentation.
   * @param parentPath - Parent path for hash lookup.
   * @returns Array of tree lines.
   */
  function printNode(node: TreeNode, prefix = '', parentPath = ''): string[] {
    const keys = Object.keys(node).sort();

    let lines: string[] = [];

    keys.forEach((key, idx) => {
      const isLast = idx === keys.length - 1;

      const branch = isLast ? '└── ' : '├── ';

      const currentPath = parentPath ? `${parentPath}/${key}` : key;

      if (node[key] === null) {
        lines.push(`${prefix}${branch}${key} [${hashMap[currentPath] || ''}]`);
      } else {
        lines.push(`${prefix}${branch}${key}/`);

        lines = lines.concat(printNode(node[key] as TreeNode, prefix + (isLast ? '    ' : '│   '), currentPath));
      }
    });

    return lines;
  }

  return printNode(tree).join('\n');
}

export const getTree = getFileTreeString;
export const getFileHashes = createFileHashes;
export const getFolderTree = getFileTreeString;
