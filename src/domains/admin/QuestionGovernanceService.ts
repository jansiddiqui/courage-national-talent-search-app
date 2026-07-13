/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * QuestionGovernanceService
 * Governs the lifecycle of questions in admin_question_bank.
 * The database trigger (trigger_sync_question_version) automatically
 * snapshots question content into admin_question_versions on each
 * meaningful content change — this service does not need to manage that.
 */

export async function getQuestionProvenance(
  supabaseAdmin: any,
  runtimeQuestionId: string
): Promise<any | null> {
  const { data, error } = await supabaseAdmin
    .from('questions')
    .select(`
      id,
      assessment_id,
      source_question_version_id,
      admin_question_versions!source_question_version_id (
        id, question_id, version, question_text, subject, chapter,
        topic, bloom_taxonomy, created_at
      )
    `)
    .eq('id', runtimeQuestionId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function publishQuestionsForAssessment(
  supabaseAdmin: any,
  assessmentId: string,
  questionBankIds: string[]
): Promise<{ created: number; errors: string[] }> {
  const errors: string[] = [];
  let created = 0;

  for (const bankId of questionBankIds) {
    // Fetch the latest approved version from admin_question_bank
    const { data: bankQ, error: bankErr } = await supabaseAdmin
      .from('admin_question_bank')
      .select('id, version, approval_status, question_text, options, subject, bloom_taxonomy, difficulty_index')
      .eq('id', bankId)
      .single();

    if (bankErr || !bankQ) {
      errors.push(`Question ${bankId} not found in bank`);
      continue;
    }

    if (bankQ.approval_status !== 'APPROVED') {
      errors.push(`Question ${bankId} is not approved (status: ${bankQ.approval_status})`);
      continue;
    }

    // Get the immutable version snapshot
    const { data: versionRow, error: vErr } = await supabaseAdmin
      .from('admin_question_versions')
      .select('id')
      .eq('question_id', bankId)
      .eq('version', bankQ.version)
      .single();

    if (vErr || !versionRow) {
      errors.push(`Version snapshot missing for question ${bankId} v${bankQ.version}`);
      continue;
    }

    // Insert into runtime questions table with provenance link
    const { error: insertErr } = await supabaseAdmin
      .from('questions')
      .insert({
        assessment_id:               assessmentId,
        type:                        'MCQ',
        content:                     bankQ,
        difficulty:                  Math.round((bankQ.difficulty_index ?? 0.5) * 100),
        status:                      'PUBLISHED',
        version:                     bankQ.version,
        source_question_version_id:  versionRow.id,
      });

    if (insertErr) {
      errors.push(`Failed to publish question ${bankId}: ${insertErr.message}`);
    } else {
      created++;
    }
  }

  return { created, errors };
}
