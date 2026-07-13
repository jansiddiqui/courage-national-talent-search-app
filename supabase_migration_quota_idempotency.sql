-- Migration: Sponsored Registration RPC Idempotency & Draft Update Fix
-- Target: Supabase database update

create or replace function public.consume_school_quota_and_register(
  p_registration_id text,
  p_student_name text,
  p_dob date,
  p_student_class text,
  p_school_name text,
  p_school_city text,
  p_school_code text,
  p_school_id uuid,
  p_parent_name text,
  p_mobile_number text,
  p_whatsapp_number text,
  p_parent_email text,
  p_state text,
  p_district text,
  p_language text,
  p_why_participating text,
  p_how_heard text,
  p_payment_status text,
  p_registration_source text
) returns boolean as $$
declare
  v_quota int;
  v_used int;
begin
  -- 1. Idempotency Check: if this registration is already completed and registered, return true
  if exists (
    select 1 from public.registrations
    where registration_id = p_registration_id and registration_status = 'REGISTERED'
  ) then
    return true;
  end if;

  -- 2. Lock school row to prevent concurrent race conditions
  select quota, used_quota into v_quota, v_used
  from public.schools
  where id = p_school_id and status = 'ACTIVE'
  for update;

  if not found then
    raise exception 'School not found or not active';
  end if;

  if v_used >= v_quota then
    raise exception 'School quota exceeded';
  end if;

  -- 3. Increment school used quota
  update public.schools
  set used_quota = used_quota + 1
  where id = p_school_id;

  -- 4. Insert or Update registration depending on draft status
  if exists (
    select 1 from public.registrations where registration_id = p_registration_id
  ) then
    -- Update existing draft
    update public.registrations
    set
      student_name = p_student_name,
      dob = p_dob,
      student_class = p_student_class,
      school_name = p_school_name,
      school_city = p_school_city,
      school_code = p_school_code,
      school_id = p_school_id,
      parent_name = p_parent_name,
      mobile_number = p_mobile_number,
      whatsapp_number = p_whatsapp_number,
      parent_email = p_parent_email,
      state = p_state,
      district = p_district,
      language = p_language,
      why_participating = p_why_participating,
      how_heard = p_how_heard,
      payment_status = p_payment_status,
      registration_source = p_registration_source,
      registration_status = 'REGISTERED'
    where registration_id = p_registration_id;
  else
    -- Insert new registration record
    insert into public.registrations (
      registration_id, student_name, dob, student_class, school_name, school_city, school_code, school_id,
      parent_name, mobile_number, whatsapp_number, parent_email, state, district, language,
      why_participating, how_heard, payment_status, registration_source, registration_status
    ) values (
      p_registration_id, p_student_name, p_dob, p_student_class, p_school_name, p_school_city, p_school_code, p_school_id,
      p_parent_name, p_mobile_number, p_whatsapp_number, p_parent_email, p_state, p_district, p_language,
      p_why_participating, p_how_heard, p_payment_status, p_registration_source, 'REGISTERED'
    );
  end if;

  return true;
end;
$$ language plpgsql security definer;
