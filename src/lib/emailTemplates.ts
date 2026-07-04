export const LOGO_URL = "https://www.thecouragelibrary.com/images/logo.png";
export const PORTAL_URL = "https://www.thecouragelibrary.com/dashboard";
export const WEBSITE_URL = "https://www.thecouragelibrary.com";

export function generateCNTSButton(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">${text}</a>
      <p style="margin: 15px 0 0; color: #64748b; font-size: 12px;">If the button does not work:</p>
      <p style="margin: 5px 0 0; color: #1e40af; font-size: 12px; word-break: break-all;">${url}</p>
    </div>
  `;
}

function getHeader(): string {
  return `
    <div style="background-color: #1e40af; height: 6px; width: 100%;"></div>
    <div style="padding: 30px 40px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: center;">
      <img src="${LOGO_URL}" alt="CNTS Logo" style="height: 60px; margin-bottom: 15px;" />
      <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">CNTS</h1>
      <h2 style="margin: 5px 0 0; color: #334155; font-size: 16px; font-weight: 600;">Courage National Talent Search</h2>
      <p style="margin: 5px 0 15px; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Talent Discovery Auditing</p>
      <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">Founding Edition 2026</span>
    </div>
  `;
}

function getFooter(): string {
  return `
    <div style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
      <h3 style="margin: 0 0 5px; color: #0f172a; font-size: 16px; font-weight: 700;">Courage National Talent Search (CNTS)</h3>
      <p style="margin: 0 0 20px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Talent Discovery Auditing</p>
      
      <div style="margin-bottom: 20px; font-size: 14px;">
        <a href="${PORTAL_URL}" style="color: #1e40af; text-decoration: none; font-weight: 600; margin: 0 10px;">Candidate Portal</a> | 
        <a href="${WEBSITE_URL}" style="color: #1e40af; text-decoration: none; font-weight: 600; margin: 0 10px;">Website</a> | 
        <a href="mailto:support@thecouragelibrary.com" style="color: #1e40af; text-decoration: none; font-weight: 600; margin: 0 10px;">Support</a>
      </div>
      
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">You are receiving this email because a CNTS activity was performed using this email address.</p>
    </div>
  `;
}

function getTrustSection(): string {
  return `
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h4 style="margin: 0 0 10px; color: #b45309; font-size: 15px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 4px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Important</h4>
      <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">Keep your Candidate ID safe.</p>
      <p style="margin: 0 0 5px; color: #92400e; font-size: 14px;">You will need it for:</p>
      <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
        <li style="margin-bottom: 4px;">Portal Login</li>
        <li style="margin-bottom: 4px;">Admit Card Download</li>
        <li>Result Access</li>
      </ul>
    </div>
  `;
}

function wrapLayout(content: string, preheader: string = ""): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CNTS Notification</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 0; line-height: 0;">
        ${preheader}
      </div>
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        ${getHeader()}
        <div style="padding: 40px;">
          ${content}
        </div>
        ${getFooter()}
      </div>
    </body>
    </html>
  `;
}

// ---------------------------------------------------------
// Templates
// ---------------------------------------------------------

export function getRegistrationSuccessTemplate(studentName: string, candidateId: string, studentClass: string, registrationId?: string): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 22px;">Welcome to CNTS 2026.</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 16px; line-height: 1.6;">Your registration has been successfully confirmed.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Candidate Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 40%;">Student Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${studentName}</td>
        </tr>
        ${registrationId && registrationId !== candidateId ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Registration ID:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-family: monospace;">${registrationId}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Class:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${studentClass}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Status:</td>
          <td style="padding: 6px 0; color: #10b981; font-size: 15px; font-weight: bold;">Registered</td>
        </tr>
      </table>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
        <p style="margin: 0 0 5px; color: #64748b; font-size: 14px;">Candidate ID:</p>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; text-align: center;">
          <span style="color: #1e40af; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 1px;">${candidateId}</span>
        </div>
      </div>
    </div>

    <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">Please keep your Candidate ID safe as it will be required for portal access, admit card download, and result viewing.</p>

    ${generateCNTSButton("Access Candidate Portal", PORTAL_URL)}
  `;
  return wrapLayout(content, "Your CNTS registration has been successfully confirmed.");
}

export function getPaymentSuccessTemplate(studentName: string | null, candidateId: string, paymentId: string, registrationId?: string): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 22px;">Your CNTS enrollment has been confirmed successfully.</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 16px; line-height: 1.6;">Welcome to the Founding Edition of CNTS 2026. Your registration is now complete.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Enrollment Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${studentName ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 40%;">Student Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${studentName}</td>
        </tr>
        ` : ''}
        ${registrationId && registrationId !== candidateId ? `
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Registration ID:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-family: monospace;">${registrationId}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Payment ID:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-family: monospace;">${paymentId}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Status:</td>
          <td style="padding: 6px 0; color: #10b981; font-size: 15px; font-weight: bold;">Confirmed</td>
        </tr>
      </table>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
        <p style="margin: 0 0 5px; color: #64748b; font-size: 14px;">Candidate ID:</p>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; text-align: center;">
          <span style="color: #1e40af; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 1px;">${candidateId}</span>
        </div>
      </div>
    </div>

    <div style="margin: 30px 0;">
      <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 18px;">What Happens Next?</h3>
      <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 16px; line-height: 1.8;">
        <li><strong>Access Candidate Portal</strong> (available now)</li>
        <li>Review Exam Pattern</li>
        <li>Watch for Official Announcements</li>
        <li>Download Admit Card when released</li>
      </ul>
    </div>

    ${getTrustSection()}

    ${generateCNTSButton("Access Candidate Portal", PORTAL_URL)}
  `;
  return wrapLayout(content, "Your enrollment is complete and portal access is available.");
}

export function getResultReleaseTemplate(studentName: string, candidateId: string): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 22px;">CNTS 2026 Results Released</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 16px; line-height: 1.6;">Your results are now available. Access the Candidate Portal to view your Talent Profile and Performance Report.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Candidate Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 40%;">Student Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${studentName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Result Status:</td>
          <td style="padding: 6px 0; color: #4f46e5; font-size: 15px; font-weight: bold;">Available</td>
        </tr>
      </table>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
        <p style="margin: 0 0 5px; color: #64748b; font-size: 14px;">Candidate ID:</p>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; text-align: center;">
          <span style="color: #1e40af; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 1px;">${candidateId}</span>
        </div>
      </div>
    </div>

    ${generateCNTSButton("View Talent Profile", PORTAL_URL)}
  `;
  return wrapLayout(content, "Your CNTS 2026 results are now available in the Candidate Portal.");
}

export function getRecoveryTemplate(candidateId: string): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 22px;">We found your CNTS registration details.</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 16px; line-height: 1.6;">Use this Candidate ID to access your Candidate Portal, admit card, and examination results.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
      <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">Candidate ID</p>
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; display: inline-block;">
        <span style="color: #1e40af; font-size: 28px; font-family: monospace; font-weight: bold; letter-spacing: 2px;">${candidateId}</span>
      </div>
    </div>

    ${getTrustSection()}

    ${generateCNTSButton("Access Candidate Portal", PORTAL_URL)}
  `;
  return wrapLayout(content, "Your Candidate ID recovery request has been completed.");
}

export function getAdmitCardTemplate(studentName: string, candidateId: string): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 22px;">Admit Card Available</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 16px; line-height: 1.6;">The admit card for the upcoming CNTS 2026 Founding Edition examination is now ready for download.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Candidate Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 40%;">Student Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${studentName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Admit Card:</td>
          <td style="padding: 6px 0; color: #10b981; font-size: 15px; font-weight: bold;">Ready</td>
        </tr>
      </table>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
        <p style="margin: 0 0 5px; color: #64748b; font-size: 14px;">Candidate ID:</p>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; text-align: center;">
          <span style="color: #1e40af; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 1px;">${candidateId}</span>
        </div>
      </div>
    </div>

    <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">Please download and print your admit card. You will need it to enter the examination platform.</p>

    ${generateCNTSButton("Download Admit Card", PORTAL_URL)}
  `;
  return wrapLayout(content, "Your admit card is ready for download.");
}

export function getCertificateTemplate(studentName: string, candidateId: string): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 22px;">Certificate Issued</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 16px; line-height: 1.6;">We are proud to share that the national certificate and recognition profile for your examination has been issued.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Candidate Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; width: 40%;">Student Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${studentName}</td>
        </tr>
      </table>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
        <p style="margin: 0 0 5px; color: #64748b; font-size: 14px;">Candidate ID:</p>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; text-align: center;">
          <span style="color: #1e40af; font-size: 24px; font-family: monospace; font-weight: bold; letter-spacing: 1px;">${candidateId}</span>
        </div>
      </div>
    </div>

    ${generateCNTSButton("Download Certificate", PORTAL_URL)}
  `;
  return wrapLayout(content, "Your national certificate has been issued.");
}


export function getFoundingFamilyTemplate(parentName: string, familyId: string): string {
  const content = `



    <h2 style="margin:0 0 8px; color:#0f172a; font-size:22px; font-weight:800;">You're officially a Founding Family! 🎉</h2>
    <p style="margin:0 0 24px; color:#334155; font-size:16px; line-height:1.7;">Dear <strong>${parentName}</strong>, your spot in the <strong>CNTS Founding Families</strong> program has been confirmed. You are among the first parents to support a new way of discovering children's true potential.</p>

    <!-- ID highlight box -->
    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:4px solid #10b981; border-radius:8px; padding:20px 24px; margin-bottom:24px;">
      <p style="margin:0 0 4px; color:#059669; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Your Founding Family ID</p>
      <p style="margin:0; color:#065f46; font-size:28px; font-weight:900; font-family:monospace; letter-spacing:2px;">${familyId}</p>
      <p style="margin:6px 0 0; color:#6b7280; font-size:12px;">Keep this ID safe — it is your priority access token for CNTS 2026 registration.</p>
    </div>

    <!-- What happens next -->
    <h3 style="margin:0 0 16px; color:#0f172a; font-size:16px; font-weight:700;">What happens next</h3>
    <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
      <tr>
        <td style="padding:12px 16px; background:#f8fafc; border-radius:8px 8px 0 0; border-bottom:1px solid #e2e8f0; vertical-align:top; width:40px;">
          <span style="font-size:20px;">📲</span>
        </td>
        <td style="padding:12px 16px; background:#f8fafc; border-radius:8px 8px 0 0; border-bottom:1px solid #e2e8f0; vertical-align:top;">
          <p style="margin:0 0 2px; color:#0f172a; font-size:14px; font-weight:700;">WhatsApp Priority Alert — 15 July 2026</p>
          <p style="margin:0; color:#64748b; font-size:13px;">At 10:00 AM, you will receive a direct registration link via WhatsApp before the general public.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px; background:#f8fafc; border-bottom:1px solid #e2e8f0; vertical-align:top;">
          <span style="font-size:20px;">📚</span>
        </td>
        <td style="padding:12px 16px; background:#f8fafc; border-bottom:1px solid #e2e8f0; vertical-align:top;">
          <p style="margin:0 0 2px; color:#0f172a; font-size:14px; font-weight:700;">Free Reasoning Worksheets</p>
          <p style="margin:0; color:#64748b; font-size:13px;">Practice sets for Classes 5–8 will be emailed to you shortly.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px; background:#f8fafc; border-radius:0 0 8px 8px; vertical-align:top;">
          <span style="font-size:20px;">🏆</span>
        </td>
        <td style="padding:12px 16px; background:#f8fafc; border-radius:0 0 8px 8px; vertical-align:top;">
          <p style="margin:0 0 2px; color:#0f172a; font-size:14px; font-weight:700;">Priority Registration Slot</p>
          <p style="margin:0; color:#64748b; font-size:13px;">Slots are capped. Founding Families get first access — no queue, no waiting.</p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <div style="text-align:center; margin:30px 0;">
      <a href="https://www.thecouragelibrary.com/founding-families" style="display:inline-block; background:#1e40af; color:#ffffff; padding:14px 32px; text-decoration:none; border-radius:8px; font-weight:700; font-size:15px; letter-spacing:0.5px;">View Your Founding Pass</a>
    </div>

    <!-- No spam note -->
    <div style="background:#fafafa; border:1px solid #e2e8f0; border-radius:8px; padding:16px 20px; margin-top:8px; text-align:center;">
      <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.6;">🔒 No spam, ever. You will only hear from us when registration opens (July 15) and for critical exam timeline updates. You can unsubscribe at any time.</p>
    </div>
  `;
  return wrapLayout(content, `Welcome to CNTS Founding Families, ${parentName}! Your Family ID is ${familyId}.`);
}
