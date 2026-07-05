const fs = require('fs');
const path = require('path');

const srcFile = path.resolve(__dirname, '../src/app/academy/mathematics/page.tsx');
const destDir = path.resolve(__dirname, '../src/app/academy/language');
const destFile = path.join(destDir, 'page.tsx');

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Read source content
let content = fs.readFileSync(srcFile, 'utf8');

// Replace routing and text labels
content = content.replace(/\/academy\/mathematics/g, '/academy/language');
content = content.replace(/Mathematics Academy/g, 'Language Skills Academy');
content = content.replace(/MathematicsHub/g, 'LanguageSkillsHub');
content = content.replace(/Mathematics/g, 'Language Skills');
content = content.replace(/mathematics/g, 'language');
content = content.replace(/applied-math/g, 'word-analogies');
content = content.replace(/number-puzzles/g, 'syntax-logic');

// Replace colors: amber / orange -> emerald / teal
content = content.replace(/amber/g, 'emerald');
content = content.replace(/orange/g, 'teal');
content = content.replace(/Calculator/g, 'BookOpen');

// Write out the result
fs.writeFileSync(destFile, content, 'utf8');
console.log('Successfully cloned dashboard to language!');
