import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

import { EmailService } from '@/services/emailService';
import { 
  getPartnerApprovalTemplate, 
  getPartnerSuspensionTemplate, 
  getPartnerReinstatementTemplate 
} from '@/lib/emailTemplates';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    if (hasSupabaseAdminConfig) {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('cnts_session');
      if (sessionCookie && sessionCookie.value && JWT_SECRET) {
        const session = await verifySession(sessionCookie.value, JWT_SECRET);
        if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
          return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
        }
      }
    }

    let partners: any[] = [];

    if (hasSupabaseAdminConfig) {
      const allFetched: any[] = [];

      // Fetch 100% from canonical 'partners' table
      try {
        let query = (supabaseAdmin as any).from('partners').select('*');
        if (statusFilter) query = query.eq('status', statusFilter.toUpperCase());
        const { data: d1 } = await query.order('created_at', { ascending: false });
        if (Array.isArray(d1)) allFetched.push(...d1);
      } catch (e) {
        console.warn('Query partners table notice:', e);
      }

      // 3. Fetch from 'partner_applications' table
      try {
        let query3 = (supabaseAdmin as any).from('partner_applications').select('*');
        if (statusFilter) query3 = query3.eq('status', statusFilter.toUpperCase());
        const { data: d3 } = await query3.order('created_at', { ascending: false });
        if (Array.isArray(d3)) {
          allFetched.push(...d3.map((p: any) => ({
            id: p.id || `app-${p.email}`,
            full_name: p.full_name || p.fullName || p.applicant_name || 'Partner Applicant',
            email: p.email,
            phone: p.phone,
            referral_code: p.referral_code || p.referralCode || 'CNTSJN',
            custom_slug: p.custom_slug || 'partner',
            status: p.status || 'PENDING',
            tier: p.tier || 'BRONZE',
            honorarium_rate: p.honorarium_rate || 25,
            audience_scale: p.audience_scale || '10k - 50k',
            created_at: p.created_at || new Date().toISOString()
          })));
        }
      } catch (e) {
        console.warn('Query partner_applications table notice:', e);
      }

      // Deduplicate by email
      const seen = new Set();
      for (const item of allFetched) {
        const key = (item.email || item.id || '').toLowerCase();
        if (key && !seen.has(key)) {
          seen.add(key);
          partners.push(item);
        }
      }
    }

    return NextResponse.json({
      success: true,
      partners,
      total: partners.length,
    });
  } catch (error) {
    console.error('[Admin Partners GET Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // ── Admin authentication (must precede body parse) ──────────────────────
    const cookieStore = await cookies();
    const adminSessionCookie = cookieStore.get('cnts_session');

    if (!adminSessionCookie || !adminSessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized: admin session required.' }, { status: 401 });
    }

    const adminSession = await verifySession(adminSessionCookie.value, JWT_SECRET || 'admin-secret');
    if (!adminSession || (adminSession.role !== 'ADMIN' && adminSession.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden: insufficient admin privileges.' }, { status: 403 });
    }
    // ────────────────────────────────────────────────────────────────────────

    const body = await request.json();
    const { partnerId, status, honorariumRate, tier, adminNote } = body;

    if (!partnerId) {
      return NextResponse.json({ error: 'partnerId is required' }, { status: 400 });
    }

    if (hasSupabaseAdminConfig) {
      // Check existing status to determine exact lifecycle state transition
      let previousStatus: string | null = null;
      let approvalEmailSent = false;
      try {
        const { data: existingPartner } = await (supabaseAdmin as any)
          .from('partners')
          .select('id, status, approval_email_sent')
          .eq('id', partnerId)
          .single();

        if (existingPartner) {
          previousStatus = existingPartner.status;
          approvalEmailSent = !!existingPartner.approval_email_sent;
        }
      } catch (e) {
        // Ignore fetch error, fallback to status check
      }

      const isFirstTimeApproval = previousStatus === 'PENDING' && status?.toUpperCase() === 'APPROVED' && !approvalEmailSent;
      const isReinstatement = previousStatus === 'SUSPENDED' && status?.toUpperCase() === 'APPROVED';
      const isNewSuspension = previousStatus !== 'SUSPENDED' && status?.toUpperCase() === 'SUSPENDED';

      const updateData: any = {};
      if (status) {
        updateData.status = status.toUpperCase();
        if (status.toUpperCase() === 'APPROVED') {
          updateData.approved_at = new Date().toISOString();
          if (isFirstTimeApproval) {
            updateData.approval_email_sent = true;
          }
        }
      }
      if (typeof honorariumRate === 'number' && honorariumRate > 0) {
        updateData.honorarium_rate = honorariumRate;
      }
      if (tier) {
        updateData.tier = tier;
      }

      const { data: updated, error } = await (supabaseAdmin as any)
        .from('partners')
        .update(updateData)
        .eq('id', partnerId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Dispatch appropriate transactional email based on exact state transition
      if (updated && updated.email) {
        const emailService = new EmailService();

        // 1. FIRST-TIME APPROVAL EMAIL
        if (isFirstTimeApproval) {
          try {
            const approvalHtml = getPartnerApprovalTemplate({
              fullName: updated.full_name,
              email: updated.email,
              referralCode: updated.referral_code,
              partnerId: updated.partner_id || `CP-2026-${updated.id}`,
              customSlug: updated.custom_slug,
              honorariumRate: updated.honorarium_rate,
            });
            await emailService.sendEmail(
              updated.email,
              'Your Courage Partner application has been approved',
              approvalHtml
            );
          } catch (emailErr) {
            console.error('[Partner Approval Email Error - Non Blocking]:', emailErr);
          }
        }

        // 2. REINSTATEMENT EMAIL
        else if (isReinstatement) {
          try {
            const reinstatementHtml = getPartnerReinstatementTemplate({
              fullName: updated.full_name || 'Partner',
              email: updated.email,
              partnerId: updated.partner_id || `CP-2026-${updated.id}`,
              reinstatedAt: new Date().toISOString(),
              note: adminNote || '',
              customSlug: updated.custom_slug,
            });
            await emailService.sendEmail(
              updated.email,
              'Your Courage Partner account has been reinstated',
              reinstatementHtml
            );
          } catch (emailErr) {
            console.error('[Partner Reinstatement Email Error - Non Blocking]:', emailErr);
          }
        }

        // 3. SUSPENSION EMAIL
        else if (isNewSuspension) {
          try {
            const suspensionHtml = getPartnerSuspensionTemplate({
              fullName: updated.full_name || 'Partner',
              email: updated.email,
              partnerId: updated.partner_id || `CP-2026-${updated.id}`,
              reason: updated.suspension_reason || 'Compliance Verification Review',
              note: adminNote || updated.suspension_note || '',
              suspendedAt: new Date().toISOString(),
              customSlug: updated.custom_slug,
            });
            await emailService.sendEmail(
              updated.email,
              'Your Courage Partner account has been suspended',
              suspensionHtml
            );
          } catch (emailErr) {
            console.error('[Partner Suspension Email Error - Non Blocking]:', emailErr);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Partner record updated successfully.',
        partner: updated,
      });
    }

    return NextResponse.json({ success: true, message: 'Updated in sandbox mode.' });
  } catch (error) {
    console.error('[Admin Partners PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update partner.' }, { status: 500 });
  }
}
