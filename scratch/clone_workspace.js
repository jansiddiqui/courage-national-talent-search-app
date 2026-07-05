const fs = require('fs');
const path = require('path');

const srcFile = path.resolve(__dirname, '../src/app/academy/reasoning/[slug]/[tab]/page.tsx');
const destDir = path.resolve(__dirname, '../src/app/academy/mathematics/[slug]/[tab]');
const destFile = path.join(destDir, 'page.tsx');

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Read source content
let content = fs.readFileSync(srcFile, 'utf8');

// Replace routing and text labels
content = content.replace(/\/academy\/reasoning/g, '/academy/mathematics');
content = content.replace(/Reasoning Academy/g, 'Mathematics Academy');
content = content.replace(/Reasoning/g, 'Mathematics');

// Write out the result
fs.writeFileSync(destFile, content, 'utf8');
console.log('Successfully cloned workspace to mathematics!');
