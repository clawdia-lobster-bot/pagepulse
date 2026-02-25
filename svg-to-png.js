const sharp = require('sharp');
const fs = require('fs');

const svgPath = './public/logo.svg';
const pngPath = './public/logo.png';
const assetsPath = '../assets/logo.png';
const faviconPath = './public/favicon.png';

async function run() {
  // Convert SVG to 400x400 PNG
  await sharp(svgPath)
    .resize(400, 400)
    .png()
    .toFile(pngPath);
  // Copy to assets/logo.png
  fs.copyFileSync(pngPath, assetsPath);
  // Create favicon (48x48 PNG)
  await sharp(svgPath)
    .resize(48, 48)
    .png()
    .toFile(faviconPath);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
