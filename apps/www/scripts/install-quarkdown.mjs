import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function install() {
  const platform = os.platform();
  const arch = os.arch();
  
  let osName = '';
  if (platform === 'darwin') osName = 'macos';
  else if (platform === 'linux') osName = 'linux';
  else if (platform === 'win32') osName = 'windows';
  else {
    console.error('Unsupported platform for Quarkdown: ' + platform);
    process.exit(1);
  }
  
  let archName = '';
  if (arch === 'x64') archName = 'x64';
  else if (arch === 'arm64') archName = 'aarch64';
  else {
    console.error('Unsupported architecture for Quarkdown: ' + arch);
    process.exit(1);
  }
  
  const zipName = `quarkdown-${osName}-${archName}.zip`;
  // Using latest tag for now, as in the github action 'devbuild' resolves to latest
  const url = `https://github.com/iamgio/quarkdown/releases/latest/download/${zipName}`;
  
  const destDir = path.join(projectRoot, 'node_modules', '.quarkdown');
  const binDir = path.join(projectRoot, 'node_modules', '.bin');
  
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });
  
  const zipPath = path.join(destDir, zipName);
  
  console.log(`Downloading Quarkdown from ${url}...`);
  try {
    await downloadFile(url, zipPath);
  } catch (err) {
    console.error('Download failed:', err);
    process.exit(1);
  }
  
  console.log('Extracting Quarkdown...');
  try {
    execSync(`unzip -o ${zipPath} -d ${destDir}`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to unzip:', err);
    process.exit(1);
  }
  
  const binName = platform === 'win32' ? 'quarkdown.exe' : 'quarkdown';
  const binPath = path.join(destDir, 'quarkdown', 'bin', binName);
  const targetPath = path.join(binDir, binName);
  
  // Make executable
  if (platform !== 'win32') {
    fs.chmodSync(binPath, 0o755);
  }
  
  // Create wrapper script instead of symlink
  if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
  
  if (platform === 'win32') {
    fs.writeFileSync(targetPath + '.cmd', `@echo off\r\n"${binPath}" %*`);
  } else {
    const wrapper = `#!/bin/bash\nexec "${binPath}" "$@"\n`;
    fs.writeFileSync(targetPath, wrapper);
    fs.chmodSync(targetPath, 0o755);
  }
  
  console.log('✅ Quarkdown installed locally via pnpm postinstall!');
}

install().catch(err => {
  console.error('Install script failed:', err);
  process.exit(1);
});
