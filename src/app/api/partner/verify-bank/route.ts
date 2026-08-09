import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { ProviderFactory } from '@/lib/payouts/ProviderFactory';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerName = 'Registered Partner';

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        if (payload.fullName && payload.fullName !== 'Partner') {
          partnerName = payload.fullName;
        } else if (payload.partnerDbId && hasSupabaseAdminConfig) {
          const { data } = await (supabaseAdmin as any)
            .from('partners')
            .select('full_name, name')
            .eq('id', payload.partnerDbId)
            .maybeSingle();

          if (data && (data.full_name || data.name)) {
            partnerName = data.full_name || data.name;
          }
        }
      }
    }

    const { accountNumber, ifsc, accountHolderName } = await request.json();

    if (!accountNumber || !ifsc) {
      return NextResponse.json({
        success: false,
        error: 'Bank Account Number and IFSC code are required.'
      }, { status: 400 });
    }

    const verificationProvider = ProviderFactory.getVerificationProvider();

    try {
      const result = await verificationProvider.verifyBankAccount({
        accountNumber,
        ifsc,
        accountHolderName,
        partnerName
      });

      return NextResponse.json({
        success: true,
        ...result
      });
    } catch (valErr: any) {
      return NextResponse.json({
        success: false,
        error: valErr?.message || 'Bank account verification failed.'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('[Verify Bank POST Error]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process bank account verification request.'
    }, { status: 500 });
  }
}
