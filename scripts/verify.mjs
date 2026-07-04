import fs from 'fs';
import path from 'path';

console.log('Running automated tests...');

// Define the critical files that MUST exist after a successful build.
// (Quarkdown files are tested in GitHub Actions, so we focus on Next.js local build here)
const requiredFiles = [
  'apps/network-guide/out/00_foreword.html',
  'apps/network-guide/out/01_why_share.html',
  'apps/network-guide/out/02_network_assets.html',
  'apps/network-guide/out/03_quick_access.html',
  'apps/network-guide/out/04_google_account.html',
  'apps/network-guide/out/05_preparation.html',
  'apps/network-guide/out/06_sim_cards.html'
];

let failed = false;

for (const file of requiredFiles) {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Test failed: Expected static file not found - ${file}`);
    failed = true;
  } else {
    console.log(`✅ File exists: ${file}`);
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('🎉 All automated tests passed!');
}
