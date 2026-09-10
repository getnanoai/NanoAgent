import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// If website subfolder exists, target it; otherwise use standalone directly
const nestedTarget = path.join(root, '.next', 'standalone', 'website');
const standaloneDir = fs.existsSync(nestedTarget)
  ? nestedTarget
  : path.join(root, '.next', 'standalone');

// 1. Copy public -> target/public
const publicSrc = path.join(root, 'public');
const publicDest = path.join(standaloneDir, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
  console.log(`✔ Copied public/ to ${path.relative(root, publicDest)}`);
}

// 2. Copy .next/static -> target/.next/static
const staticSrc = path.join(root, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDest, { recursive: true });
  console.log(`✔ Copied .next/static/ to ${path.relative(root, staticDest)}`);
}