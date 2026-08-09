import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { signSession } from '@/lib/sessionHelper';
import { EmailService } from '@/services/emailService';
import { getPartnerApplicationTemplate } from '@/lib/emailTemplates';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';
import { EventDispatcher } from '@/application/dispatchers/EventDispatcher';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

async function uploadBase64ToStorage(bucket: string, path: string, base64Data: string): Promise<string | null> {
  try {
    if (!base64Data || typeof base64Data !== 'string' || !base64Data.startsWith('data:')) {
      return base64Data || null;
    }

    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Data;

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!serviceKey) return null;

    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': contentType,
        'x-upsert': 'true'
      },
      body: buffer
    });

    if (res.ok) {
      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
    } else {
      const errText = await res.text();
      console.error(`[Storage Upload Failed ${bucket}/${path}]:`, errText);
      return null;
    }
  } catch (err) {
    console.error(`[Storage Upload Exception ${bucket}/${path}]:`, err);
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
      primaryRole, 
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

    // Auto-parse City & State if entered together (e.g. "Kanpur, Uttar Pradesh")
    let finalCity = city ? city.trim() : null;
    let finalState = state ? state.trim() : null;
    if (finalCity && finalCity.includes(',') && !finalState) {
      const parts = finalCity.split(',').map((s: string) => s.trim());
      finalCity = parts[0] || finalCity;
      finalState = parts.slice(1).join(', ') || null;
    }

    // Determine final customSlug & collision-proof 7-8 char referralCode
    const rawSlug = customSlug || fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = rawSlug.toLowerCase().trim() || `partner${Math.floor(100 + Math.random() * 900)}`;

    const finalReferralCode = PartnerReferralEngine.generateReferralCode(fullName);
    const partnerId = `CP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Upload profile avatar to Supabase Storage bucket 'partner-avatars'
    let avatarPublicUrl: string | null = null;
    if (body.profileImage && hasSupabaseAdminConfig) {
      const avatarPath = `${partnerId}/avatar-${Date.now()}.jpg`;
      avatarPublicUrl = await uploadBase64ToStorage('partner-avatars', avatarPath, body.profileImage);
    }

    // Upload proof screenshots to Supabase Storage bucket 'partner-proofs'
    const processedPlatforms: any[] = [];
    if (Array.isArray(body.platformDetails)) {
      for (const item of body.platformDetails) {
        let proofUrl = item.proofScreenshotUrl || null;
        if (proofUrl && proofUrl.startsWith('data:') && hasSupabaseAdminConfig) {
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

    if (hasSupabaseAdminConfig) {
      // Check if email already exists
      const { data: existing } = await (supabaseAdmin as any)
        .from('partners')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        newPartnerRecord = existing;
      } else {
        const insertPayload: any = {
          full_name: fullName,
          email: cleanEmail,
          phone: phone || null,
          referral_code: finalReferralCode,
          custom_slug: cleanSlug,
          partner_id: partnerId,
          profile_type: profileType,
          primary_role: primaryRole || 'Content Creator & Educator',
          niche: niche || 'Education',
          content_language: contentLanguage || 'Hinglish',
          bio: bio || null,
          audience_scale: audienceScale || '10k - 50k',
          total_reach: body.totalReach || 0,
          city: finalCity,
          state: finalState,
          profile_image_url: avatarPublicUrl || body.profileImage || null,
          platform_details: processedPlatforms.length > 0 ? processedPlatforms : (body.platformDetails || []),
          password_hash: body.password || null,
          status: 'PENDING',
          honorarium_rate: 25.00
        };

        let { data: inserted, error: insertErr } = await (supabaseAdmin as any)
          .from('partners')
          .insert(insertPayload)
          .select()
          .maybeSingle();

        if (insertErr || !inserted) {
          console.error('[Partner Apply Insert Error - Retrying with Core Schema]:', insertErr);
          const corePayload: any = {
            full_name: fullName,
            email: cleanEmail,
            phone: phone || null,
            referral_code: finalReferralCode,
            custom_slug: cleanSlug,
            partner_id: partnerId,
            status: 'PENDING',
            honorarium_rate: 25.00
          };

          const { data: retryData, error: retryErr } = await (supabaseAdmin as any)
            .from('partners')
            .insert(corePayload)
            .select()
            .maybeSingle();

          if (retryErr) {
            console.error('[Partner Apply Core Insert Critical Error]:', retryErr);
          }
          newPartnerRecord = retryData;
        } else {
          newPartnerRecord = inserted;
        }
      }

      // Dispatch PARTNER_APPLIED event via EventDispatcher
      if (newPartnerRecord?.id) {
        await EventDispatcher.dispatch({
          eventId: `EVT_APPLY_${newPartnerRecord.id}`,
          idempotencyKey: `IDEM_APPLY_${newPartnerRecord.id}`,
          eventType: 'PARTNER_APPLIED',
          partnerId: newPartnerRecord.id,
          timestamp: new Date().toISOString(),
          metadata: { fullName, email: cleanEmail, referralCode: newPartnerRecord.referral_code }
        });
      }

      // Add welcome notification in inbox
      if (newPartnerRecord?.id) {
        await (supabaseAdmin as any)
          .from('partner_notifications')
          .insert({
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
    }

    const partnerResponseData = {
      id: newPartnerRecord?.id || 'demo-id',
      fullName: newPartnerRecord?.full_name || fullName,
      email: newPartnerRecord?.email || cleanEmail,
      phone: newPartnerRecord?.phone || phone,
      referralCode: newPartnerRecord?.referral_code || finalReferralCode,
      customSlug: newPartnerRecord?.custom_slug || cleanSlug,
      partnerId: newPartnerRecord?.partner_id || partnerId,
      primaryRole: newPartnerRecord?.primary_role || primaryRole || 'Content Creator & Educator',
      audienceScale: newPartnerRecord?.audience_scale || audienceScale || '10k - 50k',
      status: newPartnerRecord?.status || 'PENDING',
      tier: newPartnerRecord?.tier || 'BRONZE',
      honorariumRate: newPartnerRecord?.honorarium_rate || 25,
    };

    // Dispatch automatic instant email directly to the creator's registered email address
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
      console.error('[Partner Email Notification Error]:', emailErr);
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
