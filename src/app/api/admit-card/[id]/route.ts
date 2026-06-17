/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse("Registration ID is required", { status: 400 });
    }

    const normalizedId = id.trim().toUpperCase();
    let candidate: any = null;

    if (!hasSupabaseAdminConfig) {
      // Sandbox/Mock response
      if (normalizedId === "CNTS26-8XK4P") {
        candidate = {
          registration_id: "CNTS26-8XK4P",
          cnts_id: "CNTS260001",
          student_name: "Aditya Verma",
          dob: "2013-05-14",
          student_class: "7",
          school_name: "Delhi Public School",
          school_city: "Kanpur",
          state: "Uttar Pradesh",
          district: "Kanpur Nagar",
          language: "English",
          parent_name: "Parent Name",
          payment_status: "PAID",
        };
      }
    } else {
      // Query system setting for admit card availability
      const { data: setting } = await (supabaseAdmin as any)
        .from("system_settings")
        .select("setting_value")
        .eq("setting_key", "admit_card_status")
        .maybeSingle();

      const isAvailable = setting?.setting_value === "AVAILABLE";

      // Query database for candidate
      const { data: reg, error } = await (supabaseAdmin as any)
        .from("registrations")
        .select("*")
        .eq("registration_id", normalizedId)
        .maybeSingle();

      if (error) {
        console.error("[Admit Card API] Query error:", error);
        return new NextResponse("Database error", { status: 500 });
      }

      if (reg) {
        // If not available yet, we only allow access if the request is from an admin or for verification
        // But for dashboard users, we should respect the toggle
        if (!isAvailable && reg.payment_status === "PAID") {
          // Check if parent session or bypass
          // For safety, let's output "Not available" if settings gate is off
          return new NextResponse("Admit Cards are not yet released by the administrator.", { status: 403 });
        }

        if (reg.payment_status !== "PAID") {
          return new NextResponse("Admit Card is locked. Please complete the registration payment.", { status: 403 });
        }

        candidate = reg;
      }
    }

    if (!candidate) {
      return new NextResponse("Candidate registration not found.", { status: 404 });
    }

    // Render professional premium admit card HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CNTS 2026 Admit Card - ${candidate.student_name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0f172a;
      --primary-light: #1e293b;
      --accent: #2563eb;
      --accent-light: #eff6ff;
      --border: #cbd5e1;
      --text: #334155;
      --text-dark: #0f172a;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      color: var(--text);
      background-color: #f8fafc;
      padding: 20px;
      line-height: 1.5;
    }

    .no-print-container {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 12px 24px;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .btn {
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 14px;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-outline {
      background: white;
      color: var(--text-dark);
      border: 1px solid var(--border);
    }

    .btn-outline:hover {
      background: #f1f5f9;
    }

    .admit-card {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border: 2px solid var(--primary);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    /* Watermark */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 64px;
      color: rgba(37, 99, 235, 0.04);
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
      text-align: center;
      z-index: 1;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 20px;
      margin-bottom: 30px;
      position: relative;
      z-index: 2;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: var(--accent);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 20px;
    }

    .logo-text h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.5px;
    }

    .logo-text p {
      font-size: 10px;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .badge-container {
      text-align: right;
    }

    .badge {
      font-family: 'Outfit', sans-serif;
      background: var(--accent-light);
      color: var(--accent);
      border: 1px solid rgba(37, 99, 235, 0.2);
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 99px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .title-banner {
      text-align: center;
      margin-bottom: 30px;
      position: relative;
      z-index: 2;
    }

    .title-banner h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .title-banner p {
      font-size: 12px;
      color: var(--text);
      margin-top: 4px;
    }

    .grid-container {
      display: grid;
      grid-template-cols: 2fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
      position: relative;
      z-index: 2;
    }

    .details-table {
      width: 100%;
      border-collapse: collapse;
    }

    .details-table td {
      padding: 10px 12px;
      font-size: 12px;
      border-bottom: 1px solid #f1f5f9;
    }

    .details-table td.label {
      font-weight: 600;
      color: var(--primary-light);
      width: 35%;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
    }

    .details-table td.value {
      color: var(--text-dark);
      font-weight: 500;
    }

    .photo-area {
      border: 2px dashed var(--border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
      height: 180px;
      background: #fafafb;
    }

    .photo-area p {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 8px;
    }

    .exam-schedule-card {
      background: var(--accent-light);
      border: 1.5px solid rgba(37, 99, 235, 0.15);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
      position: relative;
      z-index: 2;
    }

    .exam-schedule-card h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(37, 99, 235, 0.1);
      padding-bottom: 6px;
    }

    .schedule-grid {
      display: grid;
      grid-template-cols: repeat(4, 1fr);
      gap: 15px;
    }

    .schedule-item h4 {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }

    .schedule-item p {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .instructions {
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px 24px;
      background: #f8fafc;
      position: relative;
      z-index: 2;
      margin-bottom: 40px;
    }

    .instructions h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .instructions ol {
      padding-left: 20px;
      font-size: 11px;
      color: var(--text);
    }

    .instructions li {
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .signatures {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 50px;
      text-align: center;
      position: relative;
      z-index: 2;
      margin-top: 40px;
    }

    .sig-line {
      border-top: 1px solid var(--text-dark);
      padding-top: 8px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--primary-light);
    }

    .sig-box {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sig-box img {
      max-height: 45px;
    }

    /* Identity Card style */
    .id-card-container {
      margin-bottom: 30px;
      padding: 24px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    
    .id-card-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-20deg);
      font-size: 24px;
      font-weight: 850;
      color: rgba(255, 255, 255, 0.02);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .id-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 10px;
      margin-bottom: 14px;
      position: relative;
      z-index: 2;
    }

    .id-card-body {
      display: grid;
      grid-template-cols: 85px 1fr;
      gap: 20px;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .id-card-photo {
      width: 80px;
      height: 105px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 7px;
      color: rgba(255, 255, 255, 0.3);
      text-transform: uppercase;
      text-align: center;
    }

    .id-card-info {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 12px;
    }

    .id-card-field {
      display: flex;
      flex-direction: column;
    }

    .id-card-label {
      font-size: 7px;
      color: rgba(255, 255, 255, 0.45);
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .id-card-value {
      font-size: 11px;
      font-weight: 600;
      color: white;
      margin-top: 1px;
    }

    .id-card-value-highlight {
      color: #fbbf24;
      font-family: monospace;
      font-weight: 700;
    }

    .id-card-footer {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 6px 12px;
      border-radius: 8px;
      margin-top: 14px;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .id-card-footer-item {
      display: flex;
      flex-direction: column;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .no-print-container {
        display: none;
      }
      .admit-card {
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>

  <div class="no-print-container">
    <div>
      <span style="font-size: 12px; color: var(--text);">Ready to print your admit card?</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.history.back()" class="btn btn-outline">Go Back</button>
      <button onclick="window.print()" class="btn btn-primary">Print Admit Card</button>
    </div>
  </div>

  <div class="admit-card">
    <div class="watermark">FOUNDING EDITION 2026</div>

    <div class="header">
      <div class="logo-container">
        <div class="logo-icon">C</div>
        <div class="logo-text">
          <h1>COURAGE</h1>
          <p>National Talent Search</p>
        </div>
      </div>
      <div class="badge-container">
        <span class="badge">Official Admit Card</span>
      </div>
    </div>

    <div class="title-banner">
      <h2>ADMIT CARD & ENTRY PASS</h2>
      <p>CNTS National Online Examination - Founding Edition 2026</p>
    </div>

    <div class="id-card-container">
      <div class="id-card-watermark">Founding Edition 2026</div>
      <div class="id-card-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: #2563eb; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 850; font-size: 12px; color: white;">C</div>
          <div>
            <span style="font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 800; color: white; display: block; line-height: 1;">CNTS</span>
            <span style="font-size: 7px; color: #60a5fa; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; line-height: 1; margin-top: 1px;">Founding Edition 2026</span>
          </div>
        </div>
        <span style="font-family: 'Outfit', sans-serif; font-size: 8px; font-weight: 700; color: #93c5fd; background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(37, 99, 235, 0.3); padding: 2px 8px; border-radius: 99px; text-transform: uppercase;">Identity Card</span>
      </div>
      
      <div class="id-card-body">
        <div class="id-card-photo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span style="margin-top: 4px; font-size: 6px;">Affix Photo</span>
        </div>
        
        <div class="id-card-info">
          <div class="id-card-field" style="grid-column: span 2;">
            <span class="id-card-label">Candidate Name</span>
            <span class="id-card-value" style="font-size: 13px; font-weight: 700;">${candidate.student_name}</span>
          </div>
          <div class="id-card-field">
            <span class="id-card-label">Class</span>
            <span class="id-card-value">Class ${candidate.student_class}</span>
          </div>
          <div class="id-card-field">
            <span class="id-card-label">State</span>
            <span class="id-card-value">${candidate.state}</span>
          </div>
          <div class="id-card-field">
            <span class="id-card-label">Candidate ID</span>
            <span class="id-card-value id-card-value-highlight" style="font-size: 11px;">${candidate.registration_id}</span>
          </div>
          <div class="id-card-field">
            <span class="id-card-label">Enrollment Status</span>
            <span class="id-card-value" style="color: #34d399; font-weight: 700;">Enrolled / Active</span>
          </div>
        </div>
      </div>

      <div class="id-card-footer">
        <div class="id-card-footer-item">
          <span class="id-card-label" style="font-size: 6px;">Exam Date</span>
          <span class="id-card-value" style="font-size: 10px; font-weight: 700;">19 July 2026</span>
        </div>
        <div class="id-card-footer-item">
          <span class="id-card-label" style="font-size: 6px;">Slot Venue</span>
          <span class="id-card-value" style="font-size: 10px; font-weight: 700;">Online / Portal</span>
        </div>
      </div>
    </div>

    <div class="exam-schedule-card">
      <h3>Examination Details</h3>
      <div class="schedule-grid">
        <div class="schedule-item">
          <h4>Exam Date</h4>
          <p>19 July 2026</p>
        </div>
        <div class="schedule-item">
          <h4>Exam Time</h4>
          <p>10:00 AM - 12:00 PM</p>
        </div>
        <div class="schedule-item">
          <h4>Reporting Time</h4>
          <p>09:30 AM IST</p>
        </div>
        <div class="schedule-item">
          <h4>Test Venue</h4>
          <p>Online Portal</p>
        </div>
      </div>
    </div>

    <div class="instructions">
      <h3>Important Candidate Instructions</h3>
      <ol>
        <li><strong>Exam Link:</strong> The online examination portal can be accessed at <strong>test.cnts.org.in</strong> on the day of the exam. Candidates must log in using their Roll Number (${candidate.cnts_id || candidate.registration_id}) and Date of Birth.</li>
        <li><strong>System Requirements:</strong> A desktop, laptop, or smartphone with stable internet connectivity is required. Please ensure the device is fully charged before starting the exam.</li>
        <li><strong>Assessment Integrity:</strong> Candidates are encouraged to attempt the assessment independently without external assistance. The assessment is designed primarily for self-evaluation and talent identification.</li>
        <li><strong>Verification:</strong> Keep a printout of this Admit Card along with a valid school ID card or Aadhar card ready on the desk during the examination.</li>
        <li><strong>Rough Work:</strong> Blank sheets and pencils are permitted on the desk for mathematical calculations and logical reasoning scratchwork.</li>
      </ol>
    </div>

    <div class="signatures">
      <div>
        <div class="sig-box"></div>
        <div class="sig-line">Candidate Signature</div>
      </div>
      <div>
        <div class="sig-box" style="font-family: 'Outfit'; font-weight: 800; font-size: 18px; color: #1e3a8a;">
          <span style="border: 1.5px solid #1e3a8a; padding: 2px 8px; border-radius: 4px; transform: rotate(-5deg); display: inline-block;">CNTS 2026</span>
        </div>
        <div class="sig-line">Controller of Examinations</div>
      </div>
    </div>
  </div>

</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error: any) {
    console.error("Admit Card page generator error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
