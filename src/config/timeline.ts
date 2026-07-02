// Timeline configuration (Single Source of Truth)
export const TIMELINE = {
  AWARENESS_START: "2026-07-05",
  AWARENESS_END: "2026-07-14",
  REGISTRATION_OPEN: "2026-07-15",
  REGISTRATION_CLOSE: "2026-08-24",
  ADMIT_CARD_RELEASE: "2026-08-25",
  EXAM_DATE: "2026-08-30", // Sunday
  RESULTS_DATE: "2026-09-12",
  TALENT_PROFILE_DATE: "2026-09-18",
  CERTIFICATE_DATE: "2026-09-20",
  AWARDS_DATE: "2026-09-22",
};

// Formatted display labels for UI consistency
export const TIMELINE_LABELS = {
  REGISTRATION_OPEN: "15 July 2026",
  REGISTRATION_CLOSE: "24 August 2026",
  ADMIT_CARD_RELEASE: "25 August 2026",
  EXAM_DATE: "30 August 2026 (Sunday)",
  RESULTS_DATE: "12 September 2026",
  TALENT_PROFILE_DATE: "18 September 2026",
  CERTIFICATE_DATE: "20 September 2026",
  AWARDS_DATE: "22 September 2026",
};

// Date helper to parse/format dates
export function getTimelineDates() {
  return {
    awarenessStart: new Date(TIMELINE.AWARENESS_START),
    awarenessEnd: new Date(TIMELINE.AWARENESS_END),
    registrationOpen: new Date(TIMELINE.REGISTRATION_OPEN),
    registrationClose: new Date(TIMELINE.REGISTRATION_CLOSE),
    admitCardRelease: new Date(TIMELINE.ADMIT_CARD_RELEASE),
    examDate: new Date(TIMELINE.EXAM_DATE),
    resultsDate: new Date(TIMELINE.RESULTS_DATE),
    talentProfileDate: new Date(TIMELINE.TALENT_PROFILE_DATE),
    certificateDate: new Date(TIMELINE.CERTIFICATE_DATE),
    awardsDate: new Date(TIMELINE.AWARDS_DATE),
  };
}

export function getRegistrationStatusLabel(nowDate?: Date): string {
  const now = nowDate || new Date();
  const dates = getTimelineDates();
  
  // Set times to midnight for date-only comparisons
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const openTime = new Date(dates.registrationOpen.getFullYear(), dates.registrationOpen.getMonth(), dates.registrationOpen.getDate()).getTime();
  const closeTime = new Date(dates.registrationClose.getFullYear(), dates.registrationClose.getMonth(), dates.registrationClose.getDate()).getTime();
  
  // 21 August is closeTime minus 3 days (warning starts on 21 August)
  const warningTime = closeTime - 3 * 24 * 60 * 60 * 1000;

  if (today < openTime) {
    return `Registrations Open from 15 July 2026`;
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
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const openTime = new Date(dates.registrationOpen.getFullYear(), dates.registrationOpen.getMonth(), dates.registrationOpen.getDate()).getTime();
  const closeTime = new Date(dates.registrationClose.getFullYear(), dates.registrationClose.getMonth(), dates.registrationClose.getDate()).getTime();
  
  const warningTime = closeTime - 3 * 24 * 60 * 60 * 1000; // August 21

  if (today < openTime) {
    return `Registrations open on 15 July 2026`;
  } else if (today >= openTime && today < warningTime) {
    return `Registrations are now open`;
  } else if (today >= warningTime && today <= closeTime) {
    return `Last few days to register`;
  } else {
    return `Registrations Closed`;
  }
}
