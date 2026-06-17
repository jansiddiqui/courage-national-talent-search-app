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
          parent_name: "Sanjay Verma",
          parent_email: "sanjay.verma@example.com",
          whatsapp_number: "9876543210",
          payment_status: "PAID",
          created_at: new Date().toISOString(),
        };
      }
    } else {
      // Query database for candidate
      const { data: reg, error } = await (supabaseAdmin as any)
        .from("registrations")
        .select("*")
        .or(`registration_id.eq.${normalizedId},cnts_id.eq.${normalizedId}`)
        .maybeSingle();

      if (error) {
        console.error("[Receipt API] Query error:", error);
        return new NextResponse("Database error", { status: 500 });
      }

      if (reg) {
        candidate = reg;
      }
    }

    if (!candidate) {
      return new NextResponse("Candidate registration not found.", { status: 404 });
    }

    const formattedDate = new Date(candidate.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Render professional premium invoice / receipt HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - CNTS 2026 - ${candidate.registration_id}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0f172a;
      --primary-light: #1e293b;
      --accent: #2563eb;
      --accent-light: #eff6ff;
      --border: #e2e8f0;
      --text: #475569;
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
      padding: 40px 20px;
      line-height: 1.5;
    }

    .no-print-container {
      max-width: 700px;
      margin: 0 auto 25px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 12px 24px;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid var(--border);
    }

    .btn {
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
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
      border: 1px solid #cbd5e1;
    }

    .btn-outline:hover {
      background: #f1f5f9;
    }

    .receipt-card {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
      position: relative;
    }

    .header-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      align-items: start;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 30px;
      margin-bottom: 30px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: var(--accent);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 18px;
    }

    .logo-text h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.5px;
    }

    .logo-text p {
      font-size: 9px;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .receipt-meta {
      text-align: right;
      font-size: 12px;
    }

    .receipt-meta h2 {
      font-family: 'Outfit', sans-serif;
      color: var(--primary);
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .info-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
    }

    .info-section h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .info-details {
      font-size: 13px;
      color: var(--text-dark);
      line-height: 1.6;
    }

    .info-details strong {
      font-weight: 600;
    }

    .transaction-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }

    .transaction-table th {
      background: #f8fafc;
      color: #64748b;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
      padding: 12px 16px;
      border-bottom: 1.5px solid var(--border);
    }

    .transaction-table td {
      padding: 16px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
      color: var(--text-dark);
    }

    .transaction-table td.amount {
      text-align: right;
      font-weight: 600;
    }

    .transaction-table th.amount-header {
      text-align: right;
    }

    .total-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      width: 250px;
      font-size: 13px;
    }

    .total-row.grand {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      border-top: 1.5px solid #f1f5f9;
      padding-top: 8px;
      margin-top: 4px;
    }

    .status-stamp {
      border: 3px solid #10b981;
      color: #10b981;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 18px;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 8px;
      transform: rotate(-10deg);
      display: inline-block;
      position: absolute;
      bottom: 100px;
      left: 60px;
      opacity: 0.85;
      letter-spacing: 1px;
    }

    .footer {
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 50px;
    }

    /* Identity Card style */
    .id-card-container {
      margin-bottom: 30px;
      padding: 20px;
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
      grid-template-cols: 80px 1fr;
      gap: 20px;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .id-card-photo {
      width: 75px;
      height: 100px;
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
      gap: 10px;
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

      /* Responsive alignments */
      @media (max-width: 640px) {
        body {
          padding: 15px 10px;
        }
        .no-print-container {
          flex-direction: column;
          gap: 15px;
          text-align: center;
          padding: 15px;
        }
        .receipt-card {
          padding: 20px;
          border-radius: 12px;
        }
        .header-grid {
          grid-template-cols: 1fr;
          gap: 20px;
          text-align: center;
        }
        .logo-container {
          justify-content: center;
        }
        .receipt-meta {
          text-align: center;
        }
        .info-grid {
          grid-template-cols: 1fr;
          gap: 25px;
        }
        .transaction-table th, .transaction-table td {
          padding: 12px 8px;
          font-size: 11px;
        }
        .total-section {
          align-items: stretch;
        }
        .total-row {
          width: 100%;
        }
        .status-stamp {
          left: 50%;
          transform: translateX(-50%) rotate(-10deg);
          bottom: 150px;
        }
      }

      @media print {
        body {
          background: white;
          padding: 0;
        }
        .no-print-container {
          display: none;
        }
        .receipt-card {
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
        <span style="font-size: 12px; color: var(--text);">Transaction receipt generated.</span>
      </div>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button onclick="window.history.back()" class="btn btn-outline">Go Back</button>
        <button onclick="window.print()" class="btn btn-primary">Print Receipt</button>
      </div>
    </div>

    <div class="receipt-card">
      <div class="status-stamp">PAID</div>

      <div class="header-grid">
        <div class="logo-container">
          <img src="/images/logo.png" alt="Logo" style="width: 40px; height: 40px; object-fit: contain; background: white; padding: 2px; border-radius: 8px;">
          <div class="logo-text">
            <h1>COURAGE</h1>
            <p>National Talent Search</p>
          </div>
        </div>
        <div class="receipt-meta">
          <h2>RECEIPT / INVOICE</h2>
          <p style="color: #64748b; font-family: monospace;">Receipt No: RC-26-${candidate.registration_id.split("-").pop()}</p>
          <p style="color: #94a3b8; font-size: 10px; margin-top: 3px;">Date: ${formattedDate}</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-section">
          <h3>Paid By</h3>
          <div class="info-details">
            <strong>${candidate.parent_name}</strong><br>
            Email: ${candidate.parent_email || "N/A"}<br>
            WhatsApp: +91 ${candidate.whatsapp_number}<br>
            State: ${candidate.state}
          </div>
        </div>
        <div class="info-section">
          <h3>Candidate Identity Card</h3>
          <div class="id-card-container">
            <div class="id-card-watermark">Founding Edition 2026</div>
            <div class="id-card-header">
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 24px; height: 24px; background: white; border-radius: 6px; display: flex; align-items: center; justify-content: center; padding: 2px;">
                  <img src="/images/logo.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div>
                  <span style="font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 800; color: white; display: block; line-height: 1;">CNTS</span>
                  <span style="font-size: 7px; color: #60a5fa; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: block; line-height: 1; margin-top: 2px;">Founding Edition 2026</span>
                </div>
              </div>
              <span style="font-family: 'Outfit', sans-serif; font-size: 7px; font-weight: 700; color: #93c5fd; background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(37, 99, 235, 0.3); padding: 2px 6px; border-radius: 99px; text-transform: uppercase; white-space: nowrap;">Identity Pass</span>
            </div>
            
            <div class="id-card-body">
              <div class="id-card-photo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span style="margin-top: 4px; font-size: 5px; font-weight: 700;">Affix Photo</span>
              </div>
              
              <div class="id-card-info">
                <div class="id-card-field" style="grid-column: span 2;">
                  <span class="id-card-label">Candidate Name</span>
                  <span class="id-card-value" style="font-size: 12px; font-weight: 700;">${candidate.student_name}</span>
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
                  <span class="id-card-value id-card-value-highlight" style="font-size: 10px;">${candidate.registration_id}</span>
                </div>
                <div class="id-card-field">
                  <span class="id-card-label">Status</span>
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
        </div>
      </div>

      <table class="transaction-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="width: 15%; text-align: center;">Qty</th>
            <th class="amount-header" style="width: 20%;">Unit Price</th>
            <th class="amount-header" style="width: 20%;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>CNTS 2026 Registration Fee (Founding Edition)</strong><br>
              <span style="font-size: 11px; color: #94a3b8; display: inline-block; margin-top: 4px;">Includes practice paper mock sets, online diagnostic exam seat, and student talent profile report.</span>
            </td>
            <td style="text-align: center;">1</td>
            <td class="amount">₹99.00</td>
            <td class="amount">₹99.00</td>
          </tr>
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <span>Subtotal</span>
          <span style="font-weight: 500;">₹99.00</span>
        </div>
        <div class="total-row">
          <span>Taxes & Service Fees</span>
          <span style="font-weight: 500;">₹0.00</span>
        </div>
        <div class="total-row grand">
          <span>Grand Total Paid</span>
          <span>₹99.00</span>
        </div>
      </div>

      <div class="footer">
        <p>This is a system-generated electronic receipt powered by Razorpay billing integration.</p>
        <p style="margin-top: 5px;">Courage Education Private Limited • support@thecouragelibrary.com</p>
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
    console.error("Receipt generator endpoint error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
