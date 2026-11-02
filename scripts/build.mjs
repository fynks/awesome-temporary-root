import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function copyDir(src, dest) {
  if (!await fs.stat(src).then(s => s.isDirectory()).catch(() => false)) return;
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = await fs.stat(srcPath);
    if (stat.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('Starting build process...');
  
  const distDir = path.join(repoRoot, 'dist');
  const websiteDir = path.join(repoRoot, 'website');
  const distDataDir = path.join(distDir, 'data');

  // 1. Clean output directory
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  // 2. Generate data into dist/data so the site can fetch /data/*.json
  await fs.mkdir(distDataDir, { recursive: true });
  const { generate } = await import('./generate-data.mjs');
  await generate();

  // 3. Copy website assets to the dist root (this is what gets published)
  await copyDir(websiteDir, distDir);
  
  // 4. Generate static SEO files (sitemap.xml, robots.txt)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://temp-root-checker.pages.dev/</loc></url>
</urlset>`;
  
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
  
  const robots = `User-agent: *
Allow: /
Sitemap: https://temp-root-checker.pages.dev/sitemap.xml`;
  
  await fs.writeFile(path.join(distDir, 'robots.txt'), robots, 'utf8');

  console.log('Build complete. Output in dist/');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
