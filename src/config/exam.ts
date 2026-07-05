// ─── Exam Structure ──────────────────────────────────────────────────────────
// Sub-Junior: Class 5–6  |  Junior: Class 7–8
// All assessments are conducted ONLINE only.
// ─────────────────────────────────────────────────────────────────────────────

export const EXAM_MODE = "Online";
export const NEGATIVE_MARKING = "None";
export const RESULT_DATE = "2026-09-12";

// Sub-Junior Category (Class 5 & 6)
export const SUB_JUNIOR_QUESTIONS = 60;
export const SUB_JUNIOR_DURATION_MINS = 75;
export const SUB_JUNIOR_DURATION = "75 Minutes";
export const SUB_JUNIOR_PER_DOMAIN = 15;
export const SUB_JUNIOR_TOTAL_MARKS = 60;

// Junior Category (Class 7 & 8)
export const JUNIOR_QUESTIONS = 80;
export const JUNIOR_DURATION_MINS = 90;
export const JUNIOR_DURATION = "90 Minutes";
export const JUNIOR_PER_DOMAIN = 20;
export const JUNIOR_TOTAL_MARKS = 80;

// Generic defaults used in single-value contexts (Junior as standard reference)
export const TOTAL_QUESTIONS = JUNIOR_QUESTIONS;
export const EXAM_DURATION = JUNIOR_DURATION;

// The 4 Assessment Domains (same for both categories — only question count differs)
export const EXAM_DOMAINS = [
  {
    name: "Logical & Inductive Reasoning",
    shortName: "Reasoning",
    weightage: "25%",
    desc: "Tests pattern recognition, abstract sequences, figure analogies, spatial deduction, and matrix reasoning.",
    sample: "Which figure logically completes the pattern when each row follows a consistent rotational rule?",
    color: "blue",
  },
  {
    name: "Mathematical & Quantitative Analysis",
    shortName: "Mathematics",
    weightage: "25%",
    desc: "Tests conceptual arithmetic, number sequences, proportional reasoning, and mathematical logic — not rote calculation.",
    sample: "Find the missing term in the sequence: 2, 6, 12, 20, 30, ?",
    color: "indigo",
  },
  {
    name: "Verbal Ability & Language Context",
    shortName: "Language",
    weightage: "25%",
    desc: "Evaluates reading comprehension, semantic inference, logical sentence structures, and vocabulary-in-context.",
    sample: "Based on the passage, which statement must logically follow from the researcher's conclusion?",
    color: "blue",
  },
  {
    name: "Critical Thinking & Cognitive Aptitude",
    shortName: "Critical Thinking",
    weightage: "25%",
    desc: "Assesses information synthesis, cause-and-effect reasoning, analytical judgment, and conceptual awareness.",
    sample: "Select the most logical explanation for why solar panels are angled relative to geographical latitude.",
    color: "indigo",
  },
] as const;
