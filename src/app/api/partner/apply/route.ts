import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signSession } from '@/lib/sessionHelper';
import { EmailService } from '@/services/emailService';
import { getPartnerApplicationTemplate } from '@/lib/emailTemplates';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = SERVICE_KEY || 'partner-session-secret-key';

// Direct Supabase REST API helper
async function dbQuery(method: string, table: string, body?: any, queryParams?: string): Promise<{ data: any; error: any; status: number }> {
  const url = `${SUPABASE_URL}/rest/v1/${table}${queryParams ? '?' + queryParams : ''}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { data, error: res.ok ? null : data, status: res.status };
}

async function uploadBase64ToStorage(bucket: string, path: string, base64Data: string): Promise<string | null> {
  try {
    if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith('data:')) {
      return base64Data || null;
    }
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Data;
    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': contentType,
        'x-upsert': 'true'
      },
      body: buffer
    });
    if (res.ok) {
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
    } else {
      const errText = await res.text();
      console.error(`[Storage Upload Failed ${bucket}/${path}]:`, errText);
      return null;
    }
  } catch (err) {
    console.error(`[Storage Upload Exception]:`, err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      customSlug,
      referralCode,
      audienceScale,
      profileType = 'CREATOR',
      niche,
      contentLanguage,
      bio,
      city,
      state
    } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Full name and email are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Derive primaryRole from profileType
    const profileTypeToRole: Record<string, string> = {
      'CREATOR': 'Content Creator & Educator',
      'TEACHER': 'Teacher / Educator',
      'SCHOOL': 'School Institution',
      'NGO': 'NGO / Foundation',
      'INSTITUTE': 'Coaching Institute',
      'CAMPUS_AMBASSADOR': 'Campus Ambassador',
      'COMMUNITY': 'Community Leader',
    };
    const primaryRole = body.primaryRole || profileTypeToRole[profileType] || 'Content Creator & Educator';

    // Auto-parse City & State if entered together
    let finalCity = city ? city.trim() : null;
    let finalState = state ? state.trim() : null;
    if (finalCity && finalCity.includes(',') && !finalState) {
      const parts = finalCity.split(',').map((s: string) => s.trim());
      finalCity = parts[0] || finalCity;
      finalState = parts.slice(1).join(', ') || null;
    }

    // Honor user-selected referralCode and customSlug with uniqueness guarantee
    const userChosenCode = (referralCode || body.referralCode || '').trim().toUpperCase();
    let finalReferralCode = (userChosenCode && userChosenCode.length >= 4)
      ? userChosenCode
      : PartnerReferralEngine.generateReferralCode(fullName);

    // Check if referral code is already claimed by another partner
    const { data: codeCheckArr } = await dbQuery('GET', 'partners', undefined, `referral_code=eq.${encodeURIComponent(finalReferralCode)}&limit=1`);
    if (Array.isArray(codeCheckArr) && codeCheckArr.length > 0) {
      // If code belongs to another user, append unique numeric suffix
      finalReferralCode = `${finalReferralCode.substring(0, 8)}${Math.floor(10 + Math.random() * 90)}`;
    }

    const userChosenSlug = (customSlug || body.customSlug || '').trim().toLowerCase();
    const rawSlug = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = userChosenSlug || rawSlug || `partner${Math.floor(100 + Math.random() * 900)}`;

    const partnerId = `CP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Upload profile avatar
    let avatarPublicUrl: string | null = null;
    if (body.profileImage) {
      const avatarPath = `${partnerId}/avatar-${Date.now()}.jpg`;
      avatarPublicUrl = await uploadBase64ToStorage('partner-avatars', avatarPath, body.profileImage);
    }

    // Upload proof screenshots
    const processedPlatforms: any[] = [];
    if (Array.isArray(body.platformDetails)) {
      for (const item of body.platformDetails) {
        let proofUrl = item.proofScreenshotUrl || null;
        if (proofUrl && proofUrl.startsWith('data:')) {
          const cleanPlatformName = (item.platform || 'channel').toLowerCase().replace(/[^a-z0-9]/g, '_');
          const proofPath = `${partnerId}/${cleanPlatformName}-proof-${Date.now()}.png`;
          proofUrl = await uploadBase64ToStorage('partner-proofs', proofPath, proofUrl);
        }
        processedPlatforms.push({
          platform: item.platform || 'General',
          handle: item.handle || item.handleOrUrl || '',
          handleOrUrl: item.handleOrUrl || item.handle || '',
          followers: item.followers || item.followerCount || 0,
          followerCount: item.followerCount || item.followers || 0,
          proofScreenshotUrl: proofUrl
        });
      }
    }

    let newPartnerRecord: any = null;

    // Check if email already exists
    const { data: existingArr } = await dbQuery('GET', 'partners', undefined, `email=eq.${encodeURIComponent(cleanEmail)}&limit=1`);
    const existing = Array.isArray(existingArr) ? existingArr[0] : null;

    if (existing) {
      // UPDATE existing record with all new data
      const updatePayload: any = {
        full_name: fullName || existing.full_name,
        phone: phone || existing.phone,
        referral_code: finalReferralCode || existing.referral_code,
        custom_slug: cleanSlug || existing.custom_slug,
        primary_role: primaryRole || existing.primary_role,
        niche: niche || existing.niche,
        content_language: contentLanguage || existing.content_language,
        bio: bio || existing.bio,
        audience_scale: audienceScale || existing.audience_scale,
        total_reach: body.totalReach || existing.total_reach || 0,
        city: finalCity || existing.city,
        state: finalState || existing.state,
        status: existing.status || 'PENDING'
      };
      if (avatarPublicUrl) updatePayload.profile_image_url = avatarPublicUrl;
      if (processedPlatforms.length > 0) updatePayload.platform_details = processedPlatforms;
      if (body.password) updatePayload.password_hash = body.password;

      const { data: updated, error: updateErr, status: updateStatus } = await dbQuery(
        'PATCH', 'partners', updatePayload, `id=eq.${existing.id}`
      );
      if (updateErr) {
        console.error('[Partner Update Error]:', JSON.stringify(updateErr));
      }
      newPartnerRecord = Array.isArray(updated) ? updated[0] : (updated || existing);
    } else {
      // INSERT new record
      const insertPayload: any = {
        full_name: fullName,
        email: cleanEmail,
        phone: phone || null,
        referral_code: finalReferralCode,
        custom_slug: cleanSlug,
        partner_id: partnerId,
        primary_role: primaryRole,
        niche: niche || 'Education',
        content_language: contentLanguage || 'Hinglish',
        bio: bio || null,
        audience_scale: audienceScale || '10k - 50k',
        total_reach: body.totalReach || 0,
        city: finalCity,
        state: finalState,
        profile_image_url: avatarPublicUrl || null,
        platform_details: processedPlatforms.length > 0 ? processedPlatforms : [],
        password_hash: body.password || null,
        status: 'PENDING',
        honorarium_rate: 25.00
      };

      console.log('[Partner Apply] Inserting for email:', cleanEmail);

      const { data: inserted, error: insertErr, status: insertStatus } = await dbQuery('POST', 'partners', insertPayload);

      if (insertErr) {
        console.error('[Partner Insert Error]:', JSON.stringify(insertErr));
        return NextResponse.json({
          error: 'Database insert failed',
          details: insertErr?.message || JSON.stringify(insertErr),
          code: insertErr?.code
        }, { status: 500 });
      }

      newPartnerRecord = Array.isArray(inserted) ? inserted[0] : inserted;
    }

    // Welcome notification
    if (newPartnerRecord?.id) {
      await dbQuery('POST', 'partner_notifications', {
        partner_id: newPartnerRecord.id,
        referral_code: newPartnerRecord.referral_code,
        sender: 'Courage Partner Onboarding Desk',
        title: '🎉 Application Received — Under Review',
        preview: 'Your official Courage Partner application is under verification by our verification team.',
        full_body: `Dear ${fullName},\n\nThank you for applying to become an official Courage Partner for CNTS 2026!\n\nYour application (Partner ID: ${newPartnerRecord.partner_id}, Referral Code: ${newPartnerRecord.referral_code}) is currently under review by our Admin Team. You will receive an approval update shortly.\n\nIn the meantime, feel free to explore your workspace dashboard!`,
        category: 'System',
        is_read: false,
      });
    }

    const partnerResponseData = {
      id: newPartnerRecord?.id || 'demo-id',
      fullName: newPartnerRecord?.full_name || fullName,
      email: newPartnerRecord?.email || cleanEmail,
      phone: newPartnerRecord?.phone || phone,
      referralCode: newPartnerRecord?.referral_code || finalReferralCode,
      customSlug: newPartnerRecord?.custom_slug || cleanSlug,
      partnerId: newPartnerRecord?.partner_id || partnerId,
      primaryRole: newPartnerRecord?.primary_role || primaryRole,
      audienceScale: newPartnerRecord?.audience_scale || audienceScale || '10k - 50k',
      status: newPartnerRecord?.status || 'PENDING',
      tier: newPartnerRecord?.tier || 'BRONZE',
      honorariumRate: newPartnerRecord?.honorarium_rate || 25,
    };

    // Send confirmation email
    try {
      const emailService = new EmailService();
      const emailHtml = getPartnerApplicationTemplate({
        fullName: partnerResponseData.fullName,
        email: partnerResponseData.email,
        referralCode: partnerResponseData.referralCode,
        partnerId: partnerResponseData.partnerId,
        customSlug: partnerResponseData.customSlug,
        audienceScale: partnerResponseData.audienceScale,
        honorariumRate: partnerResponseData.honorariumRate,
      });
      await emailService.sendEmail(
        partnerResponseData.email,
        `🎉 Courage Partner Application Received (${partnerResponseData.referralCode})`,
        emailHtml
      );
    } catch (emailErr) {
      console.error('[Partner Email Error]:', emailErr);
    }

    // Sign session cookie
    const token = await signSession(
      {
        partnerDbId: partnerResponseData.id,
        email: partnerResponseData.email,
        fullName: partnerResponseData.fullName,
        referralCode: partnerResponseData.referralCode,
        status: partnerResponseData.status,
        role: 'PARTNER',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
      JWT_SECRET
    );

    const cookieStore = await cookies();
    cookieStore.set('cnts_partner_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      partner: partnerResponseData,
    });

  } catch (error) {
    console.error('[Partner Application Error]:', error);
    return NextResponse.json({ error: 'Failed to process partner application.' }, { status: 500 });
  }
}
