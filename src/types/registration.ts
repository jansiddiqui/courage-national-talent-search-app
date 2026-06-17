export interface RegistrationData {
  // Step 1: Student Information
  studentName: string;
  dob: string;
  studentClass: "5" | "6" | "7" | "8" | "";
  schoolName: string;
  schoolCity: string;
  schoolCode?: string;

  // Step 2: Parent Information
  parentName: string;
  mobile_number: string;
  whatsapp_number: string;
  parentEmail: string;

  // Step 3: Preferences & Demographics
  state: string;
  district: string;
  language: "English" | "Hindi" | "";
  whyParticipating: string;
  howHeard: string;

  // Marketing Attribution / Meta
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referral_code?: string;
  payment_id?: string;
  payment_status?: string;
  registration_status?: string;
  mobile_verified?: boolean;
  admin_notes?: string;
  user_id?: string;
  coupon_code?: string;
}

export type RegistrationStep = 1 | 2 | 3;
