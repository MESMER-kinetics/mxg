// update-version.js
// Updates the version number in src/index.html from package.json

const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, 'package.json');
const htmlPath = path.join(__dirname, 'src', 'index.html');
const swPath = path.join(__dirname, 'sw.js');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

let html = fs.readFileSync(htmlPath, 'utf8');

// Replace the version in the banner h1 (e.g., MXG Version 0.16)
html = html.replace(/(MXG Version )([\d.]+)/, `$1${version}`);

// Update CACHE_NAME in sw.js if it exists
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf8');
  // Replace the CACHE_NAME assignment (e.g., mxg-0.16)
  sw = sw.replace(/(CACHE_NAME\s*=\s*`mxg-)([\d.]+)(`)/, `$1${version}$3`);
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log(`Updated sw.js CACHE_NAME to mxg-${version}`);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`Updated index.html to version ${version}`);
