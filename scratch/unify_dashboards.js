const fs = require('fs');
const path = require('path');

const srcFile = path.resolve(__dirname, '../src/app/academy/reasoning/page.tsx');

// Read source content
const sourceContent = fs.readFileSync(srcFile, 'utf8');

function buildDashboard(destPath, subjectSlug, subjectTitle, hubName, defaultTopic1, defaultTopic2, CMSArgument, mainIcon, searchSubject) {
  let content = sourceContent;

  // Replace component name and titles
  content = content.replace(/export default function ReasoningHub\(\)/g, `export default function ${hubName}()`);
  content = content.replace(/Reasoning Academy/g, subjectTitle);
  content = content.replace(/Reasoning/g, searchSubject);
  content = content.replace(/reasoning/g, subjectSlug);

  // Replace routes
  content = content.replace(/\/academy\/reasoning/g, `/academy/${subjectSlug}`);

  // Replace CMS learning paths fetch call
  content = content.replace(/ContentCMS\.getLearningPaths\(\)/g, `ContentCMS.getLearningPaths("${CMSArgument}")`);

  // Replace topic filters
  content = content.replace(
    /const topics = ContentCMS\.getAllTopics\(\);/g,
    `const topics = ContentCMS.getAllTopics().filter(t => t.slug === "${defaultTopic1}" || t.slug === "${defaultTopic2}");`
  );

  // Replace main icon imports and instances
  if (mainIcon !== 'Brain') {
    // Replace Brain in Lucide imports
    content = content.replace(/Brain,\s*\n\s*Flame,/g, `${mainIcon},\n  Flame,`);
    // Replace <Brain in rendering
    content = content.replace(/<Brain/g, `<${mainIcon}`);
  }

  // Ensure directories exist
  const destDir = path.dirname(destPath);
  fs.mkdirSync(destDir, { recursive: true });

  // Write file
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`Successfully generated unified dashboard at: ${destPath}`);
}

// 1. Mathematics
buildDashboard(
  path.resolve(__dirname, '../src/app/academy/mathematics/page.tsx'),
  'mathematics',
  'Mathematics Academy',
  'MathematicsHub',
  'applied-math',
  'number-puzzles',
  'mathematics',
  'Calculator',
  'Mathematics'
);

// 2. Language
buildDashboard(
  path.resolve(__dirname, '../src/app/academy/language/page.tsx'),
  'language',
  'Language Skills Academy',
  'LanguageSkillsHub',
  'word-analogies',
  'syntax-logic',
  'language',
  'BookOpen',
  'Language Skills'
);

// 3. Critical Thinking
buildDashboard(
  path.resolve(__dirname, '../src/app/academy/critical/page.tsx'),
  'critical',
  'Critical Thinking Academy',
  'CriticalThinkingHub',
  'syllogisms',
  'cause-effect',
  'critical',
  'Sparkles',
  'Critical Thinking'
);
