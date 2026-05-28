export type PipelineContext = {
  files?: string[];
  posts?: any[];
  pages?: any[];
  rendered?: Array<{ path: string; html: string }>;
};

export type PipelineStep = (ctx: PipelineContext) => Promise<PipelineContext> | PipelineContext;

export class Pipeline {
  constructor(private steps: PipelineStep[]) {}

  async run(initial: PipelineContext = {}): Promise<PipelineContext> {
    let ctx = initial;

    for (const step of this.steps) {
      ctx = await step(ctx);
    }

    return ctx;
  }
}
