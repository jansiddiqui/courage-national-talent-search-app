const fs = require('fs');
const path = require('path');

const srcFile = path.resolve(__dirname, '../src/app/academy/reasoning/[slug]/[tab]/page.tsx');
const destDir = path.resolve(__dirname, '../src/app/academy/critical/[slug]/[tab]');
const destFile = path.join(destDir, 'page.tsx');

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Read source content
let content = fs.readFileSync(srcFile, 'utf8');

// Replace routing and text labels
content = content.replace(/\/academy\/reasoning/g, '/academy/critical');
content = content.replace(/Reasoning Academy/g, 'Critical Thinking Academy');
content = content.replace(/Reasoning/g, 'Critical Thinking');
content = content.replace(/reasoning/g, 'critical');
content = content.replace(/analogy/g, 'syllogisms');

// Write out the result
fs.writeFileSync(destFile, content, 'utf8');
console.log('Successfully cloned workspace to critical!');
