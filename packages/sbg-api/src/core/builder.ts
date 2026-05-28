import { Pipeline } from './pipeline';
import { emitStep } from './steps/emit.step';
import { markdownStep } from './steps/markdown.step';
import { renderStep } from './steps/render.step';
import { scanStep } from './steps/scan.step';
import { syncDbStep } from './steps/sync-db.step';
import { derivedStep } from './steps/derived.step';
import { SQLite } from '../db/sqlite';

export class Builder {
  constructor(
    private db: SQLite,
    private sourceDir: string,
    private outDir: string,
    private themeDir: string
  ) {}

  async build() {
    const pipeline = new Pipeline([
      scanStep(this.sourceDir),
      syncDbStep(this.db),
      markdownStep(this.db),
      renderStep(this.themeDir),
      emitStep(this.outDir),
      derivedStep(this.db, this.themeDir, this.outDir)
    ]);

    return pipeline.run();
  }
}
