import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { validateDataset } from './validate-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

export async function generate() {
  console.log('Starting data generation...');

  const { devices, modules, errors } = await validateDataset();
  if (errors.length > 0) {
    for (const message of errors) console.error(`  ✗ ${message}`);
    throw new Error(`${errors.length} validation error(s) — not generating data`);
  }

  const distDataDir = path.join(repoRoot, 'dist', 'data');
  await fs.mkdir(distDataDir, { recursive: true });

  // Sort deterministically
  devices.sort((a, b) => a.id.localeCompare(b.id));
  modules.sort((a, b) => a.id.localeCompare(b.id));

  // Write output (minified: served publicly, smaller payloads)
  await fs.writeFile(path.join(distDataDir, 'devices.json'), JSON.stringify(devices), 'utf8');
  await fs.writeFile(path.join(distDataDir, 'modules.json'), JSON.stringify(modules), 'utf8');

  console.log(`Generated ${devices.length} devices and ${modules.length} modules.`);
  console.log('Data generation complete.');
}

// Only run as a CLI, not when imported by build
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  generate().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
