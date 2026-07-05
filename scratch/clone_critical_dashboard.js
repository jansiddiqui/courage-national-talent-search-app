const fs = require('fs');
const path = require('path');

const srcFile = path.resolve(__dirname, '../src/app/academy/mathematics/page.tsx');
const destDir = path.resolve(__dirname, '../src/app/academy/critical');
const destFile = path.join(destDir, 'page.tsx');

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Read source content
let content = fs.readFileSync(srcFile, 'utf8');

// Replace routing and text labels
content = content.replace(/\/academy\/mathematics/g, '/academy/critical');
content = content.replace(/Mathematics Academy/g, 'Critical Thinking Academy');
content = content.replace(/MathematicsHub/g, 'CriticalThinkingHub');
content = content.replace(/Mathematics/g, 'Critical Thinking');
content = content.replace(/mathematics/g, 'critical');
content = content.replace(/applied-math/g, 'syllogisms');
content = content.replace(/number-puzzles/g, 'cause-effect');

// Replace colors: amber / orange -> purple / pink
content = content.replace(/amber/g, 'purple');
content = content.replace(/orange/g, 'pink');
content = content.replace(/Calculator/g, 'Sparkles');

// Write out the result
fs.writeFileSync(destFile, content, 'utf8');
console.log('Successfully cloned dashboard to critical!');
