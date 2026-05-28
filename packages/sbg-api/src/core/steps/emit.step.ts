import fs from 'node:fs';
import path from 'node:path';

export const emitStep = (outDir: string) => async (ctx: any) => {
  for (const file of ctx.rendered) {
    const fullPath = path.join(outDir, file.path);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.html);
  }

  return ctx;
};
