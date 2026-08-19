// ============================================================================
// CNTS Timeline Configuration (Baseline Foundation & Emergency Fallback)
// The database (cnts_editions & cnts_timeline_events) is the authoritative
// single source of truth at runtime via TimelineService.
// ============================================================================

export const TIMELINE = {
  AWARENESS_START: "2026-07-05T00:00:00+05:30",
  AWARENESS_END: "2026-07-14T23:59:59+05:30",
  REGISTRATION_OPEN: "2026-07-15T10:00:00+05:30",
  REGISTRATION_CLOSE: "2026-09-25T23:59:59+05:30",
  FINAL_RECONCILIATION: "2026-09-26T00:00:00+05:30",
  ADMIT_CARD_RELEASE: "2026-09-26T10:00:00+05:30",
  EXAM_LOGIN_OPEN: "2026-09-27T09:30:00+05:30",
  EXAM_DATE: "2026-09-27T10:00:00+05:30", // Sunday, 27 September 2026
  EXAM_START: "2026-09-27T10:00:00+05:30",
  SUB_JUNIOR_EXAM_END: "2026-09-27T11:15:00+05:30",
  JUNIOR_EXAM_END: "2026-09-27T11:30:00+05:30",
  EXAM_GLOBAL_CUTOFF: "2026-09-27T12:00:00+05:30",
  RESULT_COMPILATION_START: "2026-09-28T00:00:00+05:30",
  RESULT_COMPILATION_END: "2026-10-09T23:59:59+05:30",
  RESULTS_DATE: "2026-10-10T00:00:00+05:30",
  TALENT_PROFILE_DATE: "2026-10-16T00:00:00+05:30",
  CERTIFICATE_DATE: "2026-10-18T00:00:00+05:30",
  AWARDS_DATE: "2026-10-20T00:00:00+05:30",
};

// Formatted display labels for UI consistency
export const TIMELINE_LABELS = {
  REGISTRATION_OPEN: "15 July 2026",
  REGISTRATION_CLOSE: "25 September 2026",
  ADMIT_CARD_RELEASE: "26 September 2026",
  EXAM_DATE: "27 September 2026 (Sunday)",
  EXAM_TIME: "10:00 AM IST",
  EXAM_WINDOW: "10:00 AM - 12:00 PM IST",
  RESULTS_DATE: "10 October 2026",
  TALENT_PROFILE_DATE: "16 October 2026",
  CERTIFICATE_DATE: "18 October 2026",
  AWARDS_DATE: "20 October 2026",
};

// Parse an ISO or datetime string into a safe Date object
export function parseISTDate(dateStr: string): Date {
  return new Date(dateStr);
}

// Date helper to parse/format dates
export function getTimelineDates() {
  return {
    awarenessStart: parseISTDate(TIMELINE.AWARENESS_START),
    awarenessEnd: parseISTDate(TIMELINE.AWARENESS_END),
    registrationOpen: parseISTDate(TIMELINE.REGISTRATION_OPEN),
    registrationClose: parseISTDate(TIMELINE.REGISTRATION_CLOSE),
    admitCardRelease: parseISTDate(TIMELINE.ADMIT_CARD_RELEASE),
    examDate: parseISTDate(TIMELINE.EXAM_DATE),
    resultsDate: parseISTDate(TIMELINE.RESULTS_DATE),
    talentProfileDate: parseISTDate(TIMELINE.TALENT_PROFILE_DATE),
    certificateDate: parseISTDate(TIMELINE.CERTIFICATE_DATE),
    awardsDate: parseISTDate(TIMELINE.AWARDS_DATE),
  };
}

export function getRegistrationStatusLabel(nowDate?: Date): string {
  const now = nowDate || new Date();
  const dates = getTimelineDates();
  
  const today = now.getTime();
  const openTime = dates.registrationOpen.getTime();
  const closeTime = dates.registrationClose.getTime();
  
  // 3 days prior warning
  const warningTime = closeTime - 3 * 24 * 60 * 60 * 1000;

  if (today < openTime) {
    return `Registrations Open from ${TIMELINE_LABELS.REGISTRATION_OPEN}`;
  } else if (today >= openTime && today < warningTime) {
    return `Registrations Open`;
  } else if (today >= warningTime && today <= closeTime) {
    return `Last few days to register`;
  } else {
    return `Registrations Closed`;
  }
}

export function getContextualRegistrationEndsLabel(nowDate?: Date): string {
  const now = nowDate || new Date();
  const dates = getTimelineDates();
  const today = now.getTime();
  const openTime = dates.registrationOpen.getTime();
  const closeTime = dates.registrationClose.getTime();
  
  const warningTime = closeTime - 3 * 24 * 60 * 60 * 1000;

  if (today < openTime) {
    return `Registrations open on ${TIMELINE_LABELS.REGISTRATION_OPEN}`;
  } else if (today >= openTime && today < warningTime) {
    return `Registrations are now open`;
  } else if (today >= warningTime && today <= closeTime) {
    return `Last few days to register`;
  } else {
    return `Registrations Closed`;
  }
}
