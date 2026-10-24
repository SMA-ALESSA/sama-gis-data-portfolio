import { access, cp, copyFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const publicRoot = join(projectRoot, 'public');
const outputRoot = join(projectRoot, 'dist');

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await copyFile(join(projectRoot, 'index.html'), join(outputRoot, 'index.html'));
await cp(publicRoot, outputRoot, { recursive: true });

const certificates = Array.from({ length: 9 }, (_, index) => `certificates/certificate-${index}.pdf`);
const requiredFiles = [
  'index.html',
  'favicon.svg',
  'assets/saudi-hero-approved.webp',
  ...certificates,
];
for (const file of requiredFiles) {
  await access(join(outputRoot, file));
}
console.log(`Portfolio prepared with ${requiredFiles.length} required files.`);