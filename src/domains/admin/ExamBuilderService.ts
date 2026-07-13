/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ExamBuilderService
 * Server-side coordinator for the assessment lifecycle.
 */
import { publishQuestionsForAssessment } from "./QuestionGovernanceService";

export interface CreateExamParams {
  title: string;
  type: string;
  durationMinutes: number;
  sections: any[];
  isPublished?: boolean;
}

export async function createAssessment(
  supabaseAdmin: any,
  params: CreateExamParams
): Promise<any> {
  const { data, error } = await supabaseAdmin
    .from("assessments")
    .insert({
      title: params.title.trim(),
      type: params.type,
      duration_minutes: params.durationMinutes,
      sections: params.sections,
      is_published: !!params.isPublished,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create assessment: ${error.message}`);
  return data;
}

export async function publishAssessment(
  supabaseAdmin: any,
  assessmentId: string,
  questionBankIds: string[]
): Promise<{ success: boolean; created: number; errors: string[] }> {
  // 1. Publish questions using QuestionGovernanceService
  const { created, errors } = await publishQuestionsForAssessment(
    supabaseAdmin,
    assessmentId,
    questionBankIds
  );

  if (errors.length > 0 && created === 0) {
    return { success: false, created, errors };
  }

  // 2. Mark assessment as published in the database
  const { error } = await supabaseAdmin
    .from("assessments")
    .update({ is_published: true })
    .eq("id", assessmentId);

  if (error) {
    return { success: false, created, errors: [...errors, `Failed to update assessment status: ${error.message}`] };
  }

  return { success: true, created, errors };
}
