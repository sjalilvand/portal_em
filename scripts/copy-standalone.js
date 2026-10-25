// Cross-platform replacement for `cp -r` in the build script.
// Copies static assets and public folder into the standalone output.
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = (p) => path.join(root, p);
const dest = (p) => path.join(root, '.next', 'standalone', p);

try {
  fs.cpSync(src('.next/static'), dest('.next/static'), { recursive: true });
  console.log('✓ copied .next/static');
} catch (e) {
  console.warn('⚠ .next/static copy skipped:', e.message);
}

try {
  fs.cpSync(src('public'), dest('public'), { recursive: true });
  console.log('✓ copied public');
} catch (e) {
  console.warn('⚠ public copy skipped:', e.message);
}

console.log('Standalone build ready → .next/standalone/server.js');
