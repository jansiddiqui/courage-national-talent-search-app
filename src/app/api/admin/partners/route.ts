import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

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

      // 1. Fetch from 'partners' table
      try {
        let query1 = (supabaseAdmin as any).from('partners').select('*');
        if (statusFilter) query1 = query1.eq('status', statusFilter.toUpperCase());
        const { data: d1 } = await query1.order('created_at', { ascending: false });
        if (Array.isArray(d1)) allFetched.push(...d1);
      } catch (e) {
        console.warn('Query partners table notice:', e);
      }

      // 2. Fetch from 'courage_partners' table
      try {
        let query2 = (supabaseAdmin as any).from('courage_partners').select('*');
        if (statusFilter) query2 = query2.eq('status', statusFilter.toUpperCase());
        const { data: d2 } = await query2.order('created_at', { ascending: false });
        if (Array.isArray(d2)) {
          allFetched.push(...d2.map((p: any) => ({
            id: p.id || `cp-${p.email}`,
            full_name: p.full_name || p.fullName || p.name || 'Partner Applicant',
            email: p.email,
            phone: p.phone,
            referral_code: p.referral_code || p.referralCode || p.code || 'CNTSJN',
            custom_slug: p.custom_slug || p.slug || 'partner',
            status: p.status || 'PENDING',
            tier: p.tier || 'BRONZE',
            honorarium_rate: p.honorarium_rate || p.rate || 25,
            audience_scale: p.audience_scale || p.audienceScale || '10k - 50k',
            created_at: p.created_at || new Date().toISOString()
          })));
        }
      } catch (e) {
        console.warn('Query courage_partners table notice:', e);
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
    const body = await request.json();
    const { partnerId, status, honorariumRate, tier, adminNote } = body;

    if (!partnerId) {
      return NextResponse.json({ error: 'partnerId is required' }, { status: 400 });
    }

    if (hasSupabaseAdminConfig) {
      const updateData: any = {};
      if (status) {
        updateData.status = status.toUpperCase();
        if (status.toUpperCase() === 'APPROVED') {
          updateData.approved_at = new Date().toISOString();
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

      // If approved or rate changed, notify partner in inbox
      if (updated && status && status.toUpperCase() === 'APPROVED') {
        await (supabaseAdmin as any)
          .from('partner_notifications')
          .insert({
            partner_id: updated.id,
            referral_code: updated.referral_code,
            sender: 'Courage Verification Desk',
            title: '🟢 Partner Application Approved!',
            preview: 'Your official Courage Partner application has been verified and approved.',
            full_body: `Congratulations ${updated.full_name}!\n\nYour application has been officially APPROVED by our verification team.\n\nYour referral code is ${updated.referral_code}.\nYour current honorarium rate is set to ₹${updated.honorarium_rate || 25} per verified student enrolment.\n\nYou can now start sharing your link and earning honoraria!`,
            category: 'System',
            is_read: false,
          });
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
