/**
 * CNTS School Recognition Certificate Generator
 * Generates an institutional print/download HTML plaque layout for CNTS Partner & Founding Schools.
 * NO EMOJIS — Uses clean typography, institutional borders, and QR verification.
 */

export interface SchoolRecognitionData {
  name: string;
  city: string;
  state?: string | null;
  board?: string;
  slug: string;
  is_founding_school?: boolean;
  joined_at?: string;
}

export function openSchoolRecognitionCertificate(school: SchoolRecognitionData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const joinYear = school.joined_at ? new Date(school.joined_at).getFullYear() : 2026;
  const isFounding = Boolean(school.is_founding_school);
  const recognitionTitle = isFounding 
    ? "CNTS FOUNDING SCHOOL" 
    : "OFFICIAL CNTS PARTNER SCHOOL";
  
  const recognitionSubtitle = isFounding 
    ? "Recognized as a Founding Institutional Partner of the Courage National Talent Search for the 2026 Edition."
    : "Recognized as an Official Partner Institution of the Courage National Talent Search.";

  const profileUrl = `https://thecouragelibrary.com/schools/${school.slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CNTS Official School Recognition - ${school.name}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 24px;
            font-family: 'Georgia', 'Times New Roman', serif;
            background-color: #f8fafc;
            color: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .certificate-outer {
            width: 100%;
            max-width: 1050px;
            background: #ffffff;
            border: 12px solid #1e3a8a;
            border-radius: 4px;
            padding: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            position: relative;
          }
          .certificate-inner {
            border: 2px solid #cbd5e1;
            padding: 40px 50px;
            text-align: center;
            position: relative;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          }
          .gold-corner {
            position: absolute;
            width: 40px;
            height: 40px;
            border-color: #d97706;
            border-style: solid;
          }
          .top-left { top: 10px; left: 10px; border-width: 3px 0 0 3px; }
          .top-right { top: 10px; right: 10px; border-width: 3px 3px 0 0; }
          .bottom-left { bottom: 10px; left: 10px; border-width: 0 0 3px 3px; }
          .bottom-right { bottom: 10px; right: 10px; border-width: 0 3px 3px 0; }

          .org-header {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 3px;
            color: #1e3a8a;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .main-title {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 28px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 24px;
          }
          .badge-banner {
            display: inline-block;
            background-color: ${isFounding ? '#fffbe6' : '#eff6ff'};
            border: 2px solid ${isFounding ? '#d97706' : '#2563eb'};
            color: ${isFounding ? '#92400e' : '#1e40af'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 1.5px;
            padding: 8px 24px;
            border-radius: 50px;
            margin-bottom: 32px;
            text-transform: uppercase;
          }
          .present-text {
            font-size: 16px;
            color: #64748b;
            font-style: italic;
            margin-bottom: 16px;
          }
          .school-name {
            font-size: 38px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 8px;
            line-height: 1.2;
          }
          .school-location {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 24px;
          }
          .description-text {
            font-size: 17px;
            color: #334155;
            max-width: 750px;
            margin: 0 auto 36px auto;
            line-height: 1.6;
          }
          .footer-grid {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid #e2e8f0;
            padding-top: 24px;
            margin-top: 20px;
            text-align: left;
          }
          .qr-section {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .qr-img {
            width: 70px;
            height: 70px;
            border: 1px solid #cbd5e1;
            padding: 3px;
            background: #ffffff;
            border-radius: 4px;
          }
          .qr-text {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            color: #64748b;
            line-height: 1.4;
          }
          .qr-text strong {
            color: #0f172a;
            font-size: 12px;
            display: block;
          }
          .qr-url {
            font-family: monospace;
            color: #2563eb;
            font-size: 10px;
            word-break: break-all;
          }
          .seal-section {
            text-align: right;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .seal-title {
            font-size: 12px;
            font-weight: 800;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .seal-sub {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
          }
          .print-actions {
            margin-top: 20px;
            text-align: center;
          }
          .print-btn {
            background: #1e3a8a;
            color: #ffffff;
            border: none;
            padding: 12px 28px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          }
          @media print {
            body { padding: 0; background: #ffffff; }
            .certificate-outer { border-width: 8px; box-shadow: none; }
            .print-actions { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="width: 100%;">
          <div class="certificate-outer">
            <div class="certificate-inner">
              <div class="gold-corner top-left"></div>
              <div class="gold-corner top-right"></div>
              <div class="gold-corner bottom-left"></div>
              <div class="gold-corner bottom-right"></div>

              <div class="org-header">Courage National Talent Search</div>
              <div class="main-title">Official School Recognition</div>

              <div class="badge-banner">
                ${recognitionTitle}
              </div>

              <div class="present-text">This is to officially recognize and honor</div>

              <div class="school-name">${school.name}</div>
              <div class="school-location">${school.city}${school.state ? `, ${school.state}` : ""}${school.board ? ` • Board: ${school.board}` : ""}</div>

              <div class="description-text">
                ${recognitionSubtitle} Partnering in national talent identification, academic evaluation, and youth empowerment.
              </div>

              <div class="footer-grid">
                <div class="qr-section">
                  <img src="${qrCodeUrl}" alt="QR Verification" class="qr-img" />
                  <div class="qr-text">
                    <strong>Official Institutional Profile</strong>
                    Scan to verify live CNTS recognition record:
                    <div class="qr-url">${profileUrl}</div>
                  </div>
                </div>

                <div class="seal-section">
                  <div class="seal-title">Courage National Talent Search</div>
                  <div class="seal-sub">Institutional Recognition Secretariat • Edition ${joinYear}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="print-actions">
            <button onclick="window.print()" class="print-btn">Print / Save as PDF Certificate</button>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
