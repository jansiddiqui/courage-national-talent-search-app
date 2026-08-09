import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { signSession } from '@/lib/sessionHelper';
import { EmailService } from '@/services/emailService';
import { getPartnerApplicationTemplate } from '@/lib/emailTemplates';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';
import { EventDispatcher } from '@/application/dispatchers/EventDispatcher';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

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

    // Determine final customSlug & collision-proof 7-8 char referralCode
    const rawSlug = customSlug || fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanSlug = rawSlug.toLowerCase().trim() || `partner${Math.floor(100 + Math.random() * 900)}`;

    const finalReferralCode = PartnerReferralEngine.generateReferralCode(fullName);
    const partnerId = `CP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

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
        const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
          .from('partners')
          .insert({
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
            bio: bio || '',
            audience_scale: audienceScale || '10k - 50k',
            city: city || '',
            state: state || '',
            profile_image_url: body.profileImage || null,
            platform_details: body.platformDetails || [],
            status: 'APPLIED',
            trust_score: 100,
            performance_score: 0,
            growth_score: 0,
            compliance_score: 100,
            honorarium_rate: 25.00
          })
          .select()
          .single();

        // Also insert into courage_partners for double safety across DB table schemas
        try {
          await (supabaseAdmin as any)
            .from('courage_partners')
            .insert({
              full_name: fullName,
              email: cleanEmail,
              phone: phone || null,
              referral_code: finalReferralCode,
              custom_slug: cleanSlug,
              status: 'APPLIED',
              honorarium_rate: 25.00
            });
        } catch (cpErr) {
          console.warn('courage_partners dual insert notice:', cpErr);
        }

        if (insertErr) {
          console.error('[Partner Apply Insert Error]:', insertErr);
          const fallbackRef = PartnerReferralEngine.generateReferralCode(fullName);
          const fallbackSlug = `${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`;

          const { data: retryData } = await (supabaseAdmin as any)
            .from('partners')
            .insert({
              full_name: fullName,
              email: cleanEmail,
              phone: phone || null,
              referral_code: fallbackRef,
              custom_slug: fallbackSlug,
              partner_id: partnerId,
              profile_type: profileType,
              primary_role: primaryRole || 'Content Creator & Educator',
              audience_scale: audienceScale || '10k - 50k',
              status: 'APPLIED',
              trust_score: 100,
              performance_score: 0,
              growth_score: 0,
              compliance_score: 100,
              honorarium_rate: 25.00
            })
            .select()
            .single();

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
