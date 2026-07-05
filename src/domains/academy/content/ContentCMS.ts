import { TopicContent, Question, LearningPath } from "../core/types";

// Reasoning imports
import { analogyContent } from "./reasoning/content/analogy";
import { classificationContent } from "./reasoning/content/classification";
import { codingDecodingContent } from "./reasoning/content/coding-decoding";
import { numberSeriesContent } from "./reasoning/content/number-series";
import { alphabetSeriesContent } from "./reasoning/content/alphabet-series";
import { analogyQuestions } from "./reasoning/questions/analogy";
import { classificationQuestions } from "./reasoning/questions/classification";
import { codingDecodingQuestions } from "./reasoning/questions/coding-decoding";
import { numberSeriesQuestions } from "./reasoning/questions/number-series";
import { alphabetSeriesQuestions } from "./reasoning/questions/alphabet-series";
import { learningPaths as reasoningPaths } from "./reasoning/metadata/paths";

// Mathematics imports
import { appliedMathContent } from "./mathematics/content/applied-math";
import { numberPuzzlesContent } from "./mathematics/content/number-puzzles";
import { lcmIntervalsContent } from "./mathematics/content/lcm-intervals";
import { coordinateGeometryContent } from "./mathematics/content/coordinate-geometry";
import { appliedMathQuestions } from "./mathematics/questions/applied-math";
import { numberPuzzlesQuestions } from "./mathematics/questions/number-puzzles";
import { lcmIntervalsQuestions } from "./mathematics/questions/lcm-intervals";
import { coordinateGeometryQuestions } from "./mathematics/questions/coordinate-geometry";
import { learningPaths as mathPaths } from "./mathematics/metadata/paths";

// Language Skills imports
import { wordAnalogiesContent } from "./language/content/word-analogies";
import { syntaxLogicContent } from "./language/content/syntax-logic";
import { comprehensionDrillsContent } from "./language/content/comprehension-drills";
import { prepositionsConjunctionsContent } from "./language/content/prepositions-conjunctions";
import { wordAnalogiesQuestions } from "./language/questions/word-analogies";
import { syntaxLogicQuestions } from "./language/questions/syntax-logic";
import { comprehensionDrillsQuestions } from "./language/questions/comprehension-drills";
import { prepositionsConjunctionsQuestions } from "./language/questions/prepositions-conjunctions";
import { learningPaths as languagePaths } from "./language/metadata/paths";

// Critical Thinking imports
import { syllogismsContent } from "./critical/content/syllogisms";
import { causeEffectContent } from "./critical/content/cause-effect";
import { dataSufficiencyContent } from "./critical/content/data-sufficiency";
import { argumentEvaluationContent } from "./critical/content/argument-evaluation";
import { syllogismsQuestions } from "./critical/questions/syllogisms";
import { causeEffectQuestions } from "./critical/questions/cause-effect";
import { dataSufficiencyQuestions } from "./critical/questions/data-sufficiency";
import { argumentEvaluationQuestions } from "./critical/questions/argument-evaluation";
import { learningPaths as criticalPaths } from "./critical/metadata/paths";

export class ContentCMS {
  private static topics: Map<string, TopicContent> = new Map([
    // Reasoning topics
    ["analogy", analogyContent],
    ["classification", classificationContent],
    ["coding-decoding", codingDecodingContent],
    ["number-series", numberSeriesContent],
    ["alphabet-series", alphabetSeriesContent],
    // Mathematics topics
    ["applied-math", appliedMathContent],
    ["number-puzzles", numberPuzzlesContent],
    ["lcm-intervals", lcmIntervalsContent],
    ["coordinate-geometry", coordinateGeometryContent],
    // Language Skills topics
    ["word-analogies", wordAnalogiesContent],
    ["syntax-logic", syntaxLogicContent],
    ["comprehension-drills", comprehensionDrillsContent],
    ["prepositions-conjunctions", prepositionsConjunctionsContent],
    // Critical Thinking topics
    ["syllogisms", syllogismsContent],
    ["cause-effect", causeEffectContent],
    ["data-sufficiency", dataSufficiencyContent],
    ["argument-evaluation", argumentEvaluationContent]
  ]);

  private static questions: Map<string, Question> = new Map([
    // Reasoning questions
    ...analogyQuestions.map(q => [q.id, q] as [string, Question]),
    ...classificationQuestions.map(q => [q.id, q] as [string, Question]),
    ...codingDecodingQuestions.map(q => [q.id, q] as [string, Question]),
    ...numberSeriesQuestions.map(q => [q.id, q] as [string, Question]),
    ...alphabetSeriesQuestions.map(q => [q.id, q] as [string, Question]),
    // Mathematics questions
    ...appliedMathQuestions.map(q => [q.id, q] as [string, Question]),
    ...numberPuzzlesQuestions.map(q => [q.id, q] as [string, Question]),
    ...lcmIntervalsQuestions.map(q => [q.id, q] as [string, Question]),
    ...coordinateGeometryQuestions.map(q => [q.id, q] as [string, Question]),
    // Language Skills questions
    ...wordAnalogiesQuestions.map(q => [q.id, q] as [string, Question]),
    ...syntaxLogicQuestions.map(q => [q.id, q] as [string, Question]),
    ...comprehensionDrillsQuestions.map(q => [q.id, q] as [string, Question]),
    ...prepositionsConjunctionsQuestions.map(q => [q.id, q] as [string, Question]),
    // Critical Thinking questions
    ...syllogismsQuestions.map(q => [q.id, q] as [string, Question]),
    ...causeEffectQuestions.map(q => [q.id, q] as [string, Question]),
    ...dataSufficiencyQuestions.map(q => [q.id, q] as [string, Question]),
    ...argumentEvaluationQuestions.map(q => [q.id, q] as [string, Question])
  ]);

  public static getTopic(slug: string): TopicContent | null {
    return this.topics.get(slug) || null;
  }

  public static getQuestion(id: string): Question | null {
    return this.questions.get(id) || null;
  }

  public static getAllTopics(): TopicContent[] {
    return Array.from(this.topics.values());
  }

  public static getLearningPaths(subject: "reasoning" | "mathematics" | "language" | "critical" = "reasoning"): LearningPath[] {
    if (subject === "mathematics") return mathPaths;
    if (subject === "language") return languagePaths;
    if (subject === "critical") return criticalPaths;
    return reasoningPaths;
  }

  public static getTopicQuestions(topicSlug: string): Question[] {
    const topic = this.getTopic(topicSlug);
    if (!topic) return [];
    return topic.questions
      .map(id => this.getQuestion(id))
      .filter((q): q is Question => q !== null);
  }
}
