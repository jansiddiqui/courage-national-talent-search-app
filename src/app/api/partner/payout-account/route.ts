import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
      }
    }

    let account = null;

    if (hasSupabaseAdminConfig && partnerId) {
      const { data } = await (supabaseAdmin as any)
        .from('partner_payout_accounts')
        .select('*')
        .eq('partner_id', partnerId)
        .eq('is_primary', true)
        .maybeSingle();

      if (data) {
        account = {
          accountType: data.account_type,
          upiId: data.upi_id,
          qrImageUrl: data.qr_image_url,
          bankHolderName: data.bank_holder_name,
          bankAccountNumber: data.bank_account_number,
          bankIfsc: data.bank_ifsc,
          bankName: data.bank_name,
          verified: data.verified,
        };
      }
    }

    return NextResponse.json({
      success: true,
      account,
      hasPrimaryAccount: !!account,
    });
  } catch (error) {
    console.error('[Payout Account GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch payout account.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
      }
    }

    const body = await request.json();
    const { accountType, upiId, qrImageUrl, bankHolderName, bankAccountNumber, bankIfsc, bankName } = body;

    if (hasSupabaseAdminConfig && partnerId) {
      // Unset previous primary accounts
      await (supabaseAdmin as any)
        .from('partner_payout_accounts')
        .update({ is_primary: false })
        .eq('partner_id', partnerId);

      // Insert new primary payout account
      await (supabaseAdmin as any)
        .from('partner_payout_accounts')
        .insert({
          partner_id: partnerId,
          account_type: accountType || 'UPI',
          upi_id: upiId || null,
          qr_image_url: qrImageUrl || null,
          bank_holder_name: bankHolderName || null,
          bank_account_number: bankAccountNumber || null,
          bank_ifsc: bankIfsc || null,
          bank_name: bankName || null,
          is_primary: true,
          verified: false,
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Payout account updated successfully.',
    });
  } catch (error) {
    console.error('[Payout Account POST Error]:', error);
    return NextResponse.json({ error: 'Failed to save payout account.' }, { status: 500 });
  }
}
