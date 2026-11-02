import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Ajv from 'ajv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const DEVICES_SCHEMA_ID = 'device.schema.json';
const MODULES_SCHEMA_ID = 'module.schema.json';

const sourceDir = path.join(repoRoot, 'data', 'source');
const schemaDir = path.join(repoRoot, 'data', 'schema');

async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

/**
 * Full structural (JSON Schema via ajv) + semantic (duplicate IDs) validation.
 * Returns the parsed datasets so generate-data can reuse them without a second read.
 */
export async function validateDataset() {
  const [devices, modules, deviceSchema, moduleSchema] = await Promise.all([
    loadJson(path.join(sourceDir, 'devices.json')),
    loadJson(path.join(sourceDir, 'modules.json')),
    loadJson(path.join(schemaDir, 'device.schema.json')),
    loadJson(path.join(schemaDir, 'module.schema.json')),
  ]);

  const ajv = new Ajv({ allErrors: true });
  ajv.addSchema(deviceSchema, DEVICES_SCHEMA_ID);
  ajv.addSchema(moduleSchema, MODULES_SCHEMA_ID);
  const devicesValidate = ajv.compile({ type: 'array', items: { $ref: DEVICES_SCHEMA_ID } });
  const modulesValidate = ajv.compile({ type: 'array', items: { $ref: MODULES_SCHEMA_ID } });

  const errors = [];

  if (!devicesValidate(devices)) {
    for (const e of devicesValidate.errors) {
      errors.push(`devices.json: ${e.instancePath || '<root>'} ${e.message}`);
    }
  }
  if (!modulesValidate(modules)) {
    for (const e of modulesValidate.errors) {
      errors.push(`modules.json: ${e.instancePath || '<root>'} ${e.message}`);
    }
  }

  // Semantic checks ajv can't express across entries: unique IDs
  const deviceIds = new Set();
  for (const d of devices) {
    if (deviceIds.has(d.id)) errors.push(`devices.json: duplicate device ID "${d.id}"`);
    deviceIds.add(d.id);

    const recIds = new Set();
    for (const rec of d.compatibilityRecords ?? []) {
      if (recIds.has(rec.id)) errors.push(`devices.json: duplicate record ID "${rec.id}" in ${d.id}`);
      recIds.add(rec.id);
    }
  }

  const moduleIds = new Set();
  for (const m of modules) {
    if (moduleIds.has(m.id)) errors.push(`modules.json: duplicate module ID "${m.id}"`);
    moduleIds.add(m.id);
  }

  return { devices, modules, errors };
}

export async function main() {
  console.log('Starting data validation...');
  const { errors } = await validateDataset();

  if (errors.length > 0) {
    for (const message of errors) console.error(`  ✗ ${message}`);
    throw new Error(`${errors.length} validation error(s) found`);
  }

  console.log('Validation passed.');
}

// Only run as a CLI, not when imported by generate-data/build
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch(err => {
    console.error('Validation failed:', err);
    process.exit(1);
  });
}
