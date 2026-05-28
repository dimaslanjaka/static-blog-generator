import { generateDerivedPages } from '../derived';

export const derivedStep = (db: any, themeDir: string, outDir: string) => async (ctx: any) => {
  generateDerivedPages(db, themeDir, outDir);
  return ctx;
};
