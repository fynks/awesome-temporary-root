import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function main() {
  console.log('Generating README tables...');

  const devicesPath = path.join(repoRoot, 'dist', 'data', 'devices.json');
  const modulesPath = path.join(repoRoot, 'dist', 'data', 'modules.json');
  
  const devices = JSON.parse(await fs.readFile(devicesPath, 'utf8'));
  const modules = JSON.parse(await fs.readFile(modulesPath, 'utf8'));

  // Generate Device Table Markdown
  let deviceMd = `| Device | Model | Build or kernel | Loader | Status |\n| --- | --- | --- | --- | --- |\n`;
  for (const d of devices) {
    for (const rec of d.compatibilityRecords) {
      const models = d.modelNumbers.join(', ') || d.aliases.join(', ') || d.codenames.join(', ');
      const buildKernel = rec.firmware && rec.kernel ? `${rec.firmware}<br>${rec.kernel}` : (rec.firmware || rec.kernel || 'N/A');
      const loader = rec.rootMethod || 'N/A';
      const status = rec.status.toUpperCase();
      deviceMd += `| ${d.deviceName} (${d.manufacturer}) | ${models} | ${buildKernel} | ${loader} | <kbd>${status}</kbd> |\n`;
    }
  }

  // Generate Module Table Markdown
  let moduleMd = `| Module | What it does | Status | Notes |\n| --- | --- | --- | --- |\n`;
  for (const m of modules) {
    const notes = m.notes.join(' ');
    moduleMd += `| [${m.name}](${m.sourceUrl || '#'}) | ${m.description} | ${m.status.toUpperCase()} | ${notes || 'N/A'} |\n`;
  }

  // Read current README
  const readmePath = path.join(repoRoot, 'README.md');
  let readme = await fs.readFile(readmePath, 'utf8');

  // Replace the placeholders
  const devicePlaceholderStart = '## Supported devices (Generated from JSON)';
  const devicePlaceholderEnd = '## Modules (Generated from JSON)';
  const modulePlaceholderEnd = '## What is temporary root?';

  // Find indices for replacement
  const devStartIdx = readme.indexOf(devicePlaceholderStart);
  const modStartIdx = readme.indexOf(devicePlaceholderEnd);
  const modEndIdx = readme.indexOf(modulePlaceholderEnd);

  if (devStartIdx !== -1 && modStartIdx !== -1 && modEndIdx !== -1) {
    const header = readme.substring(0, devStartIdx + devicePlaceholderStart.length + 1);
    const moduleSection = readme.substring(modStartIdx, modEndIdx);
    const footer = readme.substring(modEndIdx);

    const newReadme = 
      header + '\n\n' + deviceMd + '\n\n' +
      moduleSection + '\n\n' + moduleMd + '\n\n' +
      footer;

    await fs.writeFile(readmePath, newReadme, 'utf8');
    console.log('README.md updated with generated tables.');
  } else {
    console.error('Placeholders not found in README.md');
  }
}

main().catch(err => {
  console.error('Error generating tables:', err);
  process.exit(1);
});
