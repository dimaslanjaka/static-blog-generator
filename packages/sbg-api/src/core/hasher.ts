import fs from 'node:fs';
import crypto from 'node:crypto';

export function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');

  return crypto.createHash('sha1').update(content).digest('hex');
}
