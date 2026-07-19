-- Run this in Supabase SQL Editor to reset stuck jobs from crashed dev server sessions
-- Safe to run anytime — only resets jobs stuck in PROCESSING for more than 2 minutes

-- 1. Reset stuck background jobs
UPDATE admin_background_jobs 
SET status = 'PENDING', locked_at = null, locked_by = null
WHERE status = 'PROCESSING'
  AND locked_at < now() - interval '2 minutes';

-- 2. Reset stuck school prospect enrichment statuses  
UPDATE school_prospects 
SET enrichment_status = 'PENDING' 
WHERE enrichment_status = 'PROCESSING';

-- 3. Cancel any lingering RUNNING discovery runs that are more than 30 minutes old (they died)
UPDATE school_discovery_runs
SET status = 'CANCELLED', error_summary = 'Auto-cancelled: worker died (dev server restart)'
WHERE status = 'RUNNING'
  AND updated_at < now() - interval '30 minutes';

-- Check results
SELECT status, count(*) FROM admin_background_jobs GROUP BY status;
SELECT status, count(*) FROM school_discovery_runs GROUP BY status;
