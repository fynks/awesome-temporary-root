import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('Starting data validation...');
  
  // Use the absolute path relative to the workspace root (/home/user)
  // Since we are in /home/user/awesome-temporary-root/scripts, 
  // path.resolve(__dirname, '..', '..') is /home/user
  const repoRoot = '/home/user/awesome-temporary-root';
  
  const sourceDevicesPath = path.join(repoRoot, 'data', 'source', 'devices.json');
  const sourceModulesPath = path.join(repoRoot, 'data', 'source', 'modules.json');
  
  const devices = JSON.parse(await fs.readFile(sourceDevicesPath, 'utf8'));
  const modules = JSON.parse(await fs.readFile(sourceModulesPath, 'utf8'));

  const statuses = ["tested", "reproduced", "experimental", "candidate", "known_issue", "unknown"];

  // Check duplicates
  const deviceIds = new Set();
  for (const d of devices) {
    if (deviceIds.has(d.id)) throw new Error(`Duplicate device ID: ${d.id}`);
    deviceIds.add(d.id);
    
    const recIds = new Set();
    for (const rec of d.compatibilityRecords) {
      if (recIds.has(rec.id)) throw new Error(`Duplicate record ID in ${d.id}: ${rec.id}`);
      recIds.add(rec.id);
      
      if (!statuses.includes(rec.status)) throw new Error(`Invalid status ${rec.status} in ${d.id}`);
    }
  }

  const moduleIds = new Set();
  for (const m of modules) {
    if (moduleIds.has(m.id)) throw new Error(`Duplicate module ID: ${m.id}`);
    moduleIds.add(m.id);
    
    if (!statuses.includes(m.status)) throw new Error(`Invalid status ${m.status} in ${m.id}`);
  }

  console.log('Validation passed.');
}

main().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
