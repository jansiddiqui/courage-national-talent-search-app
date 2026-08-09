import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = SERVICE_KEY || 'partner-session-secret-key';

async function dbFetch(method: string, path: string, body?: any): Promise<{ data: any; error: any; ok: boolean; status: number }> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
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
  return { data, error: res.ok ? null : data, ok: res.ok, status: res.status };
}

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

    if (!partnerId) {
      return NextResponse.json({ success: true, account: null, hasPrimaryAccount: false });
    }

    const { data: accounts } = await dbFetch(
      'GET',
      `partner_payout_accounts?partner_id=eq.${encodeURIComponent(partnerId)}&order=created_at.desc&limit=1`
    );

    const data = Array.isArray(accounts) ? accounts[0] : null;
    let account = null;

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

    if (!partnerId) {
      return NextResponse.json({ error: 'Unauthorized partner session.' }, { status: 401 });
    }

    const body = await request.json();
    const { accountType, upiId, qrImageUrl, bankHolderName, bankAccountNumber, bankIfsc, bankName } = body;

    // Fetch existing payout account rows for this partner
    const { data: existingAccounts } = await dbFetch(
      'GET',
      `partner_payout_accounts?partner_id=eq.${encodeURIComponent(partnerId)}&order=created_at.desc`
    );

    const accountsArr = Array.isArray(existingAccounts) ? existingAccounts : [];

    const accountPayload = {
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
    };

    if (accountsArr.length > 0) {
      // UPDATE existing row for this partner instead of inserting duplicates!
      const targetId = accountsArr[0].id;
      const { error: updateErr } = await dbFetch(
        'PATCH',
        `partner_payout_accounts?id=eq.${targetId}`,
        accountPayload
      );

      if (updateErr) {
        console.error('[Payout Account UPDATE Error]:', JSON.stringify(updateErr));
      }

      // Clean up any extra duplicate rows for this partner if they exist
      if (accountsArr.length > 1) {
        const extraIds = accountsArr.slice(1).map((a: any) => a.id);
        for (const extraId of extraIds) {
          await dbFetch('DELETE', `partner_payout_accounts?id=eq.${extraId}`);
        }
      }
    } else {
      // INSERT new primary row if none exists yet for this partner
      const { error: insertErr } = await dbFetch(
        'POST',
        'partner_payout_accounts',
        accountPayload
      );

      if (insertErr) {
        console.error('[Payout Account INSERT Error]:', JSON.stringify(insertErr));
      }
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
