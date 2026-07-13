import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { verifySession } from '@/lib/sessionHelper';
import { checkAdminPermission } from '@/domains/admin/AdminAuthService';
import { writeAuditEntry } from '@/domains/admin/AdminAuditService';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET() {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      questions: [
        { id: 'mock-q1', question_text: 'What is photosynthesis?', approval_status: 'REVIEW', version: 1 }
      ]
    });
  }
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('cnts_session');
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('admin_question_bank')
    .select('id, question_text, subject, chapter, approval_status, version, created_at, bloom_taxonomy, difficulty_index')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ questions: data || [] });
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: true, newStatus: 'APPROVED' });
  }
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('cnts_session');
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id as string, 'question.approve');
  if (!hasPerm) return NextResponse.json({ error: 'Missing permission: question.approve' }, { status: 403 });

  const body = await request.json();
  const { questionId, action } = body;

  if (!questionId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request: questionId and action (approve|reject) required' }, { status: 400 });
  }

  const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

  const { data: before } = await supabaseAdmin
    .from('admin_question_bank')
    .select('approval_status')
    .eq('id', questionId)
    .single();

  const { error } = await (supabaseAdmin as any)
    .from('admin_question_bank')
    .update({ approval_status: newStatus })
    .eq('id', questionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditEntry(supabaseAdmin, {
    actorId: payload.id as string, actorRole: 'admin',
    action: `QUESTION_${action.toUpperCase()}ED`,
    module: 'QUESTION_BANK',
    previousValue: before || {},
    newValue: { approval_status: newStatus, questionId },
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
  });

  return NextResponse.json({ success: true, newStatus });
}
