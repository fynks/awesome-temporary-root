import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Starting data generation...');
  
  const repoRoot = '/home/user/awesome-temporary-root';
  
  const sourceDevicesPath = path.join(repoRoot, 'data', 'source', 'devices.json');
  const sourceModulesPath = path.join(repoRoot, 'data', 'source', 'modules.json');
  
  const distDataDir = path.join(repoRoot, 'dist', 'data');
  await fs.mkdir(distDataDir, { recursive: true });

  const devices = JSON.parse(await fs.readFile(sourceDevicesPath, 'utf8'));
  const modules = JSON.parse(await fs.readFile(sourceModulesPath, 'utf8'));

  // Validate
  const devicesSchema = JSON.parse(await fs.readFile(path.join(repoRoot, 'data', 'schema', 'device.schema.json'), 'utf8'));
  const modulesSchema = JSON.parse(await fs.readFile(path.join(repoRoot, 'data', 'schema', 'module.schema.json'), 'utf8'));

  function validate(data, schema) {
    const required = schema.required || [];
    for (const req of required) {
      if (!(req in data)) {
        throw new Error(`Missing required field: ${req}`);
      }
    }
    if (data.compatibilityRecords) {
      const recSchema = schema.properties.compatibilityRecords.items;
      const recReq = recSchema.required || [];
      for (const rec of data.compatibilityRecords) {
        for (const req of recReq) {
          if (!(req in rec)) {
            throw new Error(`Missing required record field: ${req}`);
          }
        }
        if (!recSchema.properties.status.enum.includes(rec.status)) {
          throw new Error(`Invalid status: ${rec.status}`);
        }
      }
    }
    return true;
  }

  for (const d of devices) validate(d, devicesSchema);
  for (const m of modules) validate(m, modulesSchema);

  // Sort deterministically
  devices.sort((a, b) => a.id.localeCompare(b.id));
  modules.sort((a, b) => a.id.localeCompare(b.id));

  // Write output
  await fs.writeFile(path.join(distDataDir, 'devices.json'), JSON.stringify(devices, null, 2), 'utf8');
  await fs.writeFile(path.join(distDataDir, 'modules.json'), JSON.stringify(modules, null, 2), 'utf8');

  console.log(`Generated ${devices.length} devices and ${modules.length} modules.`);
  console.log('Data generation complete.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
