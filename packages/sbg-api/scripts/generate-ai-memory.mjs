import fs from 'fs-extra';
import path from 'upath';

const SRC_DIR = path.resolve('src');
const OUT_FILE = path.resolve('.github/instructions/project.instructions.md');
const TEMPLATE_FILE = path.resolve('scripts/generate-ai-memory.template.md');

function walk(dir, result = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, result);
    } else {
      result.push(full.replace(SRC_DIR + path.sep, ''));
    }
  }

  return result;
}

function groupModules(files) {
  const groups = {
    core: [],
    pipeline: [],
    services: [],
    utils: [],
    models: [],
    config: [],
    other: []
  };

  for (const f of files) {
    if (f.startsWith('core/')) groups.core.push(f);
    else if (f.startsWith('pipeline/')) groups.pipeline.push(f);
    else if (f.startsWith('services/')) groups.services.push(f);
    else if (f.startsWith('utils/')) groups.utils.push(f);
    else if (f.startsWith('models/')) groups.models.push(f);
    else if (f.startsWith('config/')) groups.config.push(f);
    else groups.other.push(f);
  }

  return groups;
}

function renderList(arr) {
  return arr.length ? arr.map((f) => `- ${f}`).join('\n') : '- (none)';
}

function generate() {
  const files = walk(SRC_DIR);
  const groups = groupModules(files);

  const pipelineFlow = ['scanStep', 'syncDbStep', 'transformStep', 'processStep', 'renderStep', 'outputStep'].join(
    ' → '
  );

  const content = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  const final = content
    .replace('{{CORE_MODULES}}', renderList(groups.core))
    .replace('{{PIPELINE_MODULES}}', renderList(groups.pipeline))
    .replace('{{SERVICES_MODULES}}', renderList(groups.services))
    .replace('{{UTILS_MODULES}}', renderList(groups.utils))
    .replace('{{MODELS_MODULES}}', renderList(groups.models))
    .replace('{{CONFIG_MODULES}}', renderList(groups.config))
    .replace('{{FILE_TREE}}', renderList(files))
    .replace('{{PIPELINE_FLOW}}', pipelineFlow);

  fs.writeFileSync(OUT_FILE, final);
  console.log(
    `✅ AI memory updated with ${files.length} modules (${Object.values(groups).reduce((a, b) => a + b.length, 0)} in groups)`
  );
  console.log(`📁 Output file: ${path.relative(process.cwd(), OUT_FILE)}`);
}

generate();
