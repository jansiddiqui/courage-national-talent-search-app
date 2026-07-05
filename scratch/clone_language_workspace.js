const fs = require('fs');
const path = require('path');

const srcFile = path.resolve(__dirname, '../src/app/academy/reasoning/[slug]/[tab]/page.tsx');
const destDir = path.resolve(__dirname, '../src/app/academy/language/[slug]/[tab]');
const destFile = path.join(destDir, 'page.tsx');

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Read source content
let content = fs.readFileSync(srcFile, 'utf8');

// Replace routing and text labels
content = content.replace(/\/academy\/reasoning/g, '/academy/language');
content = content.replace(/Reasoning Academy/g, 'Language Skills Academy');
content = content.replace(/Reasoning/g, 'Language Skills');
content = content.replace(/reasoning/g, 'language');
content = content.replace(/analogy/g, 'word-analogies');

// Write out the result
fs.writeFileSync(destFile, content, 'utf8');
console.log('Successfully cloned workspace to language!');
