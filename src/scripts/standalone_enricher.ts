import fs from 'fs';
import path from 'path';

// Load .env.local before importing any other files
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    const matches = raw.matchAll(/^([A-Z_][A-Z0-9_]*)[ \t]*=[ \t]*(.*)$/gm);
    for (const m of matches) {
      process.env[m[1].trim()] = m[2].trim().replace(/\r$/, '').replace(/^['"]|['"]$/g, '');
    }
  }
}

loadEnv();

// Polyfill MockWebSocket to prevent Supabase Realtime from crashing on Node.js < 22
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  readyState = 3;
  onclose = null;
  onerror = null;
  onmessage = null;
  onopen = null;
  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
}
(global as any).WebSocket = MockWebSocket;
(globalThis as any).WebSocket = MockWebSocket;

// Hard per-school timeout so a hung socket can't stall the whole runner
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms/1000}s: ${label}`)), ms))
  ]);
}

process.on('uncaughtException', err => console.error('[UNCAUGHT EXCEPTION]', err.message));
process.on('unhandledRejection', (reason: any) => console.error('[UNHANDLED REJECTION]', reason?.message || reason));

async function run() {
  const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
  const { SchoolEnrichmentService } = await import("@/domains/school-intelligence/SchoolEnrichmentService");

  console.log('=== Standalone School Enrichment Runner (TypeScript) ===');
  let total = 0, success = 0, fail = 0;

  // One-time startup: reset any stuck PROCESSING prospects to PENDING
  try {
    const { data, error } = await (supabaseAdmin as any)
      .from('school_prospects')
      .update({ enrichment_status: 'PENDING', error_logs: null })
      .eq('enrichment_status', 'PROCESSING')
      .select('id');
    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`[Startup] Reset ${data.length} orphaned PROCESSING prospects to PENDING`);
    }
  } catch (e: any) {
    console.error('[Startup] Reset skipped/failed:', e.message);
  }

  while (true) {
    // Fetch next batch of PENDING prospects
    let prospects: any[] = [];
    try {
      const { data, error } = await (supabaseAdmin as any)
        .from('school_prospects')
        .select('id, name')
        .eq('enrichment_status', 'PENDING')
        .order('id', { ascending: true })
        .limit(10);
      if (error) throw error;
      prospects = data || [];
    } catch(e: any) {
      console.error('[Fetch] DB error:', e.message, '- retrying in 10s...');
      await new Promise(r => setTimeout(r, 10000));
      continue;
    }

    if (!prospects || prospects.length === 0) {
      console.log('\n✅ Queue empty! All prospects processed.');
      break;
    }

    // Immediately claim fetched prospects by marking them PROCESSING
    const ids = prospects.map(p => p.id);
    try {
      const { error } = await (supabaseAdmin as any)
        .from('school_prospects')
        .update({ enrichment_status: 'PROCESSING' })
        .in('id', ids)
        .eq('enrichment_status', 'PENDING');
      if (error) throw error;
    } catch(e: any) {
      console.warn('[Claim] Warning:', e.message);
    }

    console.log(`\n[${new Date().toLocaleTimeString()}] Batch of ${prospects.length} | Done: ${total} ✓${success} ✗${fail}`);

    for (const p of prospects) {
      console.log(`  [${p.name}] starting enrichment...`);
      try {
        const ok = await withTimeout(SchoolEnrichmentService.enrichProspect(p.id), 90000, p.name);
        total++;
        if (ok) {
          success++;
          console.log(`    ✅ COMPLETED`);
        } else {
          fail++;
          console.log(`    ❌ FAILED (enrichment returned false)`);
        }
      } catch(e: any) {
        console.error(`    ❌ FAILED (Exception): ${e.message}`);
        // Ensure status is marked FAILED on database so it doesn't get stuck/retried immediately
        try {
          await (supabaseAdmin as any)
            .from('school_prospects')
            .update({
              enrichment_status: 'FAILED',
              error_logs: e.message.substring(0, 500),
              updated_at: new Date().toISOString()
            })
            .eq('id', p.id);
        } catch(_) {}
        fail++;
        total++;
      }
    }
  }

  console.log(`\n=== DONE: ${total} processed, ${success} succeeded, ${fail} failed ===`);
}

run();
