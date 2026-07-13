import { ProgressRepository } from "../repositories/ProgressRepository";
import { EventBus } from "../EventBus";
import { StudentProgress, LearningSession } from "../types";
import { RecommendationService } from "./RecommendationService";

export class LearningService {
  constructor(
    private progressRepo: ProgressRepository,
    private eventBus: EventBus
  ) {}

  /**
   * Starts a new learning session
   */
  public async startSession(topicSlug: string): Promise<LearningSession> {
    const session: LearningSession = {
      sessionId: "session_" + Math.random().toString(36).substring(2, 9),
      startTime: Date.now(),
      topicsVisited: [topicSlug],
      questionsAttempted: 0,
      correctAnswers: 0,
      xpEarned: 0,
      lastActiveTopic: topicSlug,
      lastActiveTab: "learn"
    };

    // Emit event
    this.eventBus.publish({
      type: "SESSION_ENDED", // will be logged when session ends, but start event can also be published
      payload: { sessionId: session.sessionId, action: "start", topicSlug }
    });

    return session;
  }

  /**
   * Updates state when a student submits a quiz option
   */
  public async submitAnswer(
    session: LearningSession,
    topicSlug: string,
    questionId: string,
    skill: string,
    correct: boolean,
    xpEarned: number
  ): Promise<{ session: LearningSession; nextStepRecommendation: string }> {
    const progress = await this.progressRepo.getProgress();

    // Authoritative XP Calculation:
    // Only award 50 XP if correct AND the question has not been completed before.
    // Incorrect attempts and repeated correct attempts award 0 XP.
    const isAlreadyCompleted = progress.completedQuestions.includes(questionId);
    const actualXp = (correct && !isAlreadyCompleted) ? 50 : 0;

    // 1. Update session telemetry
    session.questionsAttempted += 1;
    if (correct) {
      session.correctAnswers += 1;
      // Mark question completed
      if (!isAlreadyCompleted) {
        progress.completedQuestions.push(questionId);
      }
    }
    session.xpEarned += actualXp;

    // 2. Award skills-specific XP
    if (!progress.skillsXP) {
      progress.skillsXP = {};
    }
    progress.skillsXP[skill] = (progress.skillsXP[skill] || 0) + actualXp;

    // 3. Award general total XP
    progress.profile.totalXP += actualXp;

    // 4. Save progress changes
    await this.progressRepo.saveProgress(progress);

    // 5. Emit event to EventBus for async updates (achievements, parent dashboard, analytics logs)
    this.eventBus.publish({
      type: "QUIZ_COMPLETED",
      payload: { topicSlug, questionId, correct, skill, xpEarned }
    });

    // 6. Get personalized recommendation from the engine
    const nextStepRecommendation = await RecommendationService.getAdvice(progress, topicSlug, correct);

    return { session, nextStepRecommendation };
  }

  /**
   * Mark a topic as fully completed
   */
  public async completeTopic(topicSlug: string): Promise<StudentProgress> {
    const progress = await this.progressRepo.getProgress();
    
    if (!progress.completedTopics.includes(topicSlug)) {
      progress.completedTopics.push(topicSlug);
      
      // Award 100 XP for topic completion
      progress.profile.totalXP += 100;
      
      await this.progressRepo.saveProgress(progress);
      
      // Dispatch completion event
      this.eventBus.publish({
        type: "TOPIC_COMPLETED",
        payload: { topicSlug }
      });
    }

    return progress;
  }

  /**
   * Conclude the active learning session and save to repository logs
   */
  public async endSession(session: LearningSession): Promise<void> {
    session.endTime = Date.now();
    await this.progressRepo.saveSession(session);
    
    this.eventBus.publish({
      type: "SESSION_ENDED",
      payload: { session }
    });
  }
}
