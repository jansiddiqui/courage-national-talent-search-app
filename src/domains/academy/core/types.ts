export type LanguageCode = 'en' | 'hi' | string;

export type LocalizedText = Record<LanguageCode, string>;

export type BlockType = 
  | 'heading' | 'paragraph' | 'example' | 'diagram' | 'tip' 
  | 'warning' | 'table' | 'illustration' | 'video'
  | 'callout' | 'recipe' | 'challenge' | 'parent-note' | 'summary';

export interface DiagramMetadata {
  type: 'flowchart' | 'coordinate' | 'family-tree' | 'grid';
  nodes: Array<{ id: string; label: LocalizedText; parentId?: string }>;
  config: Record<string, any>;
}

export interface TableMetadata {
  headers: LocalizedText[];
  rows: LocalizedText[][];
}

export interface VideoMetadata {
  provider: 'youtube' | 'vimeo';
  id: string;
}

export interface IllustrationMetadata {
  assetUrl: string;
  alt: LocalizedText;
}

export interface CalloutMetadata {
  icon?: 'idea' | 'life' | 'warn' | 'secret' | 'parent' | 'spark' | 'detective';
  theme?: 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'violet' | 'amber';
}

export interface RecipeMetadata {
  steps: LocalizedText[];
}

export interface ChallengeMetadata {
  question: LocalizedText;
  options?: LocalizedText[];
  correctIndex?: number;
  solution: LocalizedText;
  level: 'standard' | 'olympiad';
}

export interface ParentNoteMetadata {
  whyItMatters: LocalizedText;
  commonStruggle: LocalizedText;
  homeActivity: LocalizedText;
}

export interface SummaryMetadata {
  points: LocalizedText[];
  mistakesToAvoid: LocalizedText[];
  shortcuts: LocalizedText[];
}

export type BlockMetadata = 
  | DiagramMetadata
  | TableMetadata
  | VideoMetadata
  | IllustrationMetadata
  | CalloutMetadata
  | RecipeMetadata
  | ChallengeMetadata
  | ParentNoteMetadata
  | SummaryMetadata
  | Record<string, any>;

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: LocalizedText;
  metadata?: BlockMetadata;
}

export interface TopicContent {
  id: string;
  slug: string;
  version: number;
  publishedAt: string;
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  title: LocalizedText;
  category: 'Verbal' | 'Non-Verbal' | 'Spatial' | 'Analytical' | 'Mathematical';
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  blocks: ContentBlock[];
  questions: string[]; // Linked Question IDs
  cheatCard: {
    keyPoints: string[];
    quickTricks: string[];
  };
  aiCapabilities: {
    explainAgain: boolean;
    easierExample: boolean;
    harderQuestion: boolean;
  };
}

export interface Question {
  id: string;
  topicId: string;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze';
  text: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  hints: LocalizedText[];
  explanation: LocalizedText;
}

export interface StudentProfile {
  id: string;
  preferredLanguage: LanguageCode;
  preferredLearningMode: 'beginner' | 'revision' | 'challenge' | 'parent';
  totalXP: number;
  streak: number;
  joinedAt: number;
  lastActive: number;
}

export interface LearningSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  topicsVisited: string[];
  questionsAttempted: number;
  correctAnswers: number;
  xpEarned: number;
  lastActiveTopic?: string;
  lastActiveTab?: string;
}

export interface LearningPath {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  topics: string[]; // List of topic slugs included in path
}

export interface Achievement {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  unlockedAt: number;
}

export interface TopicMastery {
  topicSlug: string;
  masteryPercent: number; // 0 to 100
  status: 'Needs Revision' | 'Practicing' | 'Mastered';
  accuracy: number; // 0 to 100
  attemptsCount: number; // Distinct question attempts count
  correctAnswersCount: number;
  hintsUsedCount: number;
  lastAttemptedAt: number;
  formulaVersion: string; // "v1"
  attemptedQuestions?: string[]; // Raw evidence list of attempted question IDs
}

export interface StudentProgress {
  profile: StudentProfile;
  completedTopics: string[]; // list of completed topic slugs
  completedQuestions: string[]; // list of correct question IDs
  bookmarks: string[]; // list of topic slugs
  achievements: Achievement[];
  skillsXP: Record<string, number>; // e.g. { 'Verbal Logic': 150 }
  sessions: LearningSession[];
  topicMastery?: Record<string, TopicMastery>;
}

export interface DomainEvent {
  id: string;
  version: number;
  timestamp: number;
  type: 'ANSWER_SUBMITTED' | 'QUIZ_COMPLETED' | 'TOPIC_COMPLETED' | 'SESSION_ENDED' | 'ACHIEVEMENT_UNLOCKED';
  payload: any;
}
