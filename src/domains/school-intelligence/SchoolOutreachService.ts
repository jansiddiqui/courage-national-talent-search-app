import { AIExtractedIntelligence, SchoolProspect } from "./types";

export interface OutreachDrafts {
  emailLong: string;
  emailShort: string;
  emailFollowUp: string;
  whatsappMessage: string;
  callOpeningScript: string;
}

export class SchoolOutreachService {
  /**
   * Generates grounded outreach materials tailored to verified/inferred school facts.
   */
  static generateDrafts(prospect: SchoolProspect, intelligence: AIExtractedIntelligence): OutreachDrafts {
    // 1. Resolve decision maker
    let recipientName = "Principal / Director";
    let isLeaderVerified = false;

    if (intelligence.principal_name && intelligence.principal_name.value) {
      recipientName = `Principal ${intelligence.principal_name.value}`;
      isLeaderVerified = intelligence.principal_name.status === "VERIFIED";
    } else if (intelligence.director_name && intelligence.director_name.value) {
      recipientName = `Director ${intelligence.director_name.value}`;
      isLeaderVerified = intelligence.director_name.status === "VERIFIED";
    }

    // 2. Build personalized details based purely on verified details
    let achievementsSnippet = "";
    if (intelligence.partnership_signals_olympiad_participation && intelligence.partnership_signals_olympiad_participation.value === true) {
      const quote = intelligence.partnership_signals_olympiad_participation.status === "VERIFIED"
        ? "active participation in science and mathematics olympiads"
        : "focus on competitive student development";
      achievementsSnippet = `I observed your school's ${quote}. `;
    }

    let facilitiesSnippet = "";
    if (intelligence.facilities_atal_tinkering_lab && intelligence.facilities_atal_tinkering_lab.value === true) {
      const quote = intelligence.facilities_atal_tinkering_lab.status === "VERIFIED"
        ? "your Atal Tinkering Lab setup"
        : "your STEM development facilities";
      facilitiesSnippet = `We appreciate ${quote} and commitment to innovation. `;
    }

    const pitchText = intelligence.pitch_recommendation || "We would like to introduce the CNTS platform to help students assess their national-level talent.";

    // 3. Draft Long Email
    const emailLong = `Subject: Partnership Proposal: Courage National Talent Search (CNTS) for ${prospect.name}

Dear ${recipientName},

I hope this email finds you well.

My name is representing the Courage National Talent Search (CNTS). We have been tracking high-potential institutions in ${prospect.city}, and ${prospect.name} stood out.

${achievementsSnippet}${facilitiesSnippet}

${pitchText}

We offer a ₹99 national evaluation program for students in Classes 5 to 8, assessing mathematical reasoning, critical thinking, and language competence. The exam is administered entirely online.

We would love to schedule a brief 10-minute call this week to share details on how your school can participate. Please let us know a convenient time.

Regards,
CNTS Outreach Team`;

    // 4. Draft Short Email
    const emailShort = `Subject: Talent Search Collaboration with ${prospect.name}

Dear ${recipientName},

I am writing from the Courage National Talent Search (CNTS). We would like to collaborate with ${prospect.name} for our upcoming National Talent Search.

${facilitiesSnippet}We believe your students would excel in our critical reasoning assessments.

Could we schedule a short phone call this Tuesday at 11 AM to discuss a school partnership?

Regards,
CNTS Outreach Team`;

    // 5. Draft Follow Up
    const emailFollowUp = `Subject: Follow Up: Talent Search Partnership - ${prospect.name}

Dear ${recipientName},

I am following up on my previous message regarding the Courage National Talent Search (CNTS) registration.

We are closing institutional quotas for schools in ${prospect.state} this Friday. If ${prospect.name} is interested in securing sponsored seats for your students, please let us know when we can connect.

Regards,
CNTS Outreach Team`;

    // 6. WhatsApp Message
    const whatsappMessage = `Hello ${recipientName}, this is from Courage National Talent Search. We've identified ${prospect.name} as a high-potential partner school for our upcoming online critical assessment for Classes 5-8. We'd love to share a short brochure with you. Could we connect briefly?`;

    // 7. Call Script
    const callOpeningScript = `Hello, may I speak with the office of ${recipientName}? My name is calling from the Courage National Talent Search (CNTS). I am calling regarding our talent search partnership invite sent for ${prospect.name}. We noticed your school's strong focus on student development and would like to brief the Principal on registering their students. Are they available for a 2-minute conversation?`;

    return {
      emailLong,
      emailShort,
      emailFollowUp,
      whatsappMessage,
      callOpeningScript
    };
  }
}
