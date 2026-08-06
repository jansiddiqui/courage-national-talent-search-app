export const LOGO_URL = "https://www.thecouragelibrary.com/images/logo.png";
export const PORTAL_URL = "https://www.thecouragelibrary.com/dashboard";
export const WEBSITE_URL = "https://www.thecouragelibrary.com";

export function generateCNTSButton(text: string, url: string): string {
  return `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px;">${text}</a>
      <p style="margin: 15px 0 0; color: #64748b; font-size: 12px;">If the button does not work:</p>
      <p style="margin: 5px 0 0; font-size: 12px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; padding: 0 10px;">
        <a href="${url}" style="color: #1e40af; text-decoration: none; display: inline-block; max-width: 100%;">${url}</a>
      </p>
    </div>
  `;
}

function getHeader(): string {
  return `
    <div style="background: linear-gradient(90deg, #1E40AF 0%, #4F46E5 100%); height: 5px; width: 100%;"></div>
    <div style="padding: 24px 20px; background-color: #0F172A; text-align: center; border-bottom: 1px solid #1E293B;">
      <div style="display: inline-block; background-color: #1E1B4B; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 900; padding: 8px 18px; border-radius: 8px; letter-spacing: 1px; border: 1px solid #312E81;">
        COURAGE LIBRARY • CNTS 2026
      </div>
      <h2 style="margin: 8px 0 0; color: #94A3B8; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Courage National Talent Search</h2>
    </div>
  `;
}

function getFooter(): string {
  return `
    <div style="padding: 24px 20px; background-color: #0F172A; border-top: 1px solid #1E293B; text-align: center; color: #94A3B8;">
      <h3 style="margin: 0 0 4px; color: #F8FAFC; font-size: 14px; font-weight: 800;">Courage National Talent Search (CNTS)</h3>
      <p style="margin: 0 0 16px; color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Talent Discovery Auditing Desk</p>
      
      <div style="margin-bottom: 16px; font-size: 13px; line-height: 1.8;">
        <a href="${PORTAL_URL}" style="color: #60A5FA; text-decoration: none; font-weight: 600; margin: 0 8px;">Candidate Portal</a>
        <span style="color: #334155;">&bull;</span>
        <a href="${WEBSITE_URL}" style="color: #60A5FA; text-decoration: none; font-weight: 600; margin: 0 8px;">Website</a>
        <span style="color: #334155;">&bull;</span>
        <a href="mailto:support@thecouragelibrary.com" style="color: #60A5FA; text-decoration: none; font-weight: 600; margin: 0 8px;">Support</a>
      </div>
      
      <p style="margin: 0; color: #64748B; font-size: 11px; line-height: 1.5;">You are receiving this email because an official partner activity was performed using this address.</p>
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
      <style>
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      </style>
    </head>
    <body style="margin: 0; padding: 12px 6px; background-color: #090D16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 0; line-height: 0;">
        ${preheader}
      </div>
      <div style="max-width: 580px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4); box-sizing: border-box;">
        ${getHeader()}
        <div style="padding: 24px 16px; box-sizing: border-box; width: 100%;">
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


function getFoundingFamilyFooter(): string {
  return `
    <div style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
      <h3 style="margin: 0 0 5px; color: #0f172a; font-size: 16px; font-weight: 700;">Courage National Talent Search (CNTS)</h3>
      <p style="margin: 0 0 20px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Talent Discovery Auditing</p>
      
      <div style="margin-bottom: 20px; font-size: 14px;">
        <a href="${WEBSITE_URL}" style="color: #1e40af; text-decoration: none; font-weight: 600; margin: 0 10px;">Website</a> | 
        <a href="mailto:support@thecouragelibrary.com" style="color: #1e40af; text-decoration: none; font-weight: 600; margin: 0 10px;">Support</a>
      </div>
      
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">You are receiving this email because you registered as a Founding Family.</p>
    </div>
  `;
}

function wrapFoundingFamilyLayout(content: string, preheader: string = ""): string {
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
        ${getFoundingFamilyFooter()}
      </div>
    </body>
    </html>
  `;
}

export function getFoundingFamilyTemplate(parentName: string, familyId: string): string {
  const content = `
    <h2 style="margin:0 0 12px; color:#0f172a; font-size:22px; font-weight:800; font-family: Georgia, serif; line-height: 1.2;">You are officially a Founding Family.</h2>
    <p style="margin:0 0 24px; color:#334155; font-size:15px; line-height:1.6;">Dear <strong>${parentName}</strong>, your spot in the <strong>CNTS Founding Families</strong> program has been confirmed. You are among the first parents to support a new way of discovering children's true potential.</p>

    <!-- ID highlight box -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #1e40af; border-radius:8px; padding:20px 24px; margin-bottom:28px;">
      <p style="margin:0 0 4px; color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; font-family: Arial, sans-serif;">Your Founding Family ID</p>
      <p style="margin:0; color:#0f172a; font-size:28px; font-weight:900; font-family:monospace; letter-spacing:2px;">${familyId}</p>
      <p style="margin:6px 0 0; color:#64748b; font-size:12px; line-height: 1.5;">Keep this ID safe — it is your priority access token for CNTS 2026 registration.</p>
    </div>

    <!-- What happens next -->
    <h3 style="margin:0 0 20px; color:#0f172a; font-size:16px; font-weight:700; font-family: Georgia, serif;">What happens next</h3>
    
    <div style="margin-bottom: 24px;">
      <!-- Step 1 -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr>
          <td style="width: 40px; vertical-align: top; padding-right: 12px;">
            <div style="font-family: monospace; font-size: 14px; font-weight: bold; color: #1e40af; background: #eff6ff; border-radius: 4px; width: 28px; height: 28px; line-height: 28px; text-align: center;">01</div>
          </td>
          <td style="vertical-align: top;">
            <h4 style="margin: 0 0 4px; color: #0f172a; font-size: 14px; font-weight: 700;">WhatsApp Priority Alert — 15 July 2026</h4>
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">At 10:00 AM, you will receive a direct registration link via WhatsApp before the general public.</p>
          </td>
        </tr>
      </table>

      <!-- Step 2 -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr>
          <td style="width: 40px; vertical-align: top; padding-right: 12px;">
            <div style="font-family: monospace; font-size: 14px; font-weight: bold; color: #1e40af; background: #eff6ff; border-radius: 4px; width: 28px; height: 28px; line-height: 28px; text-align: center;">02</div>
          </td>
          <td style="vertical-align: top;">
            <h4 style="margin: 0 0 4px; color: #0f172a; font-size: 14px; font-weight: 700;">Free Reasoning Worksheets</h4>
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">Practice sets for Classes 5–8 will be emailed to you shortly.</p>
          </td>
        </tr>
      </table>

      <!-- Step 3 -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr>
          <td style="width: 40px; vertical-align: top; padding-right: 12px;">
            <div style="font-family: monospace; font-size: 14px; font-weight: bold; color: #1e40af; background: #eff6ff; border-radius: 4px; width: 28px; height: 28px; line-height: 28px; text-align: center;">03</div>
          </td>
          <td style="vertical-align: top;">
            <h4 style="margin: 0 0 4px; color: #0f172a; font-size: 14px; font-weight: 700;">Priority Registration Slot</h4>
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">Slots are capped. Founding Families get first access — no queue, no waiting.</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- No spam note -->
    <div style="background:#fafafa; border:1px solid #e2e8f0; border-radius:8px; padding:16px 20px; margin-top:20px; text-align:center;">
      <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.6;">No spam, ever. You will only hear from us when registration opens (July 15) and for critical exam timeline updates. You can unsubscribe at any time.</p>
    </div>
  `;
  return wrapFoundingFamilyLayout(content, `Welcome to CNTS Founding Families, ${parentName}. Your Family ID is ${familyId}.`);
}

export function getSupportTicketCreatedTemplate(
  requesterName: string,
  ticketRef: string,
  subject: string,
  description: string
): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 20px;">We have received your support request.</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 15px; line-height: 1.6;">Dear ${requesterName}, thank you for contacting CNTS Support. Our team has queued your ticket.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 35%;">Ticket Reference:</td>
          <td style="padding: 6px 0; color: #1e40af; font-size: 14px; font-weight: bold; font-family: monospace;">${ticketRef}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Subject:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px; vertical-align: top;">Description:</td>
          <td style="padding: 6px 0; color: #334155; font-size: 13px; white-space: pre-wrap; line-height: 1.5;">${description}</td>
        </tr>
      </table>
    </div>
    <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">An agent will review this ticket and respond shortly. Please keep this email for your records.</p>
  `;
  return wrapLayout(content, `Support Request Received — ${ticketRef}`);
}

export function getSupportAgentRepliedTemplate(
  ticketRef: string,
  subject: string,
  replyText: string
): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 20px;">New response from CNTS Support.</h2>
    <p style="margin: 0 0 20px; color: #334155; font-size: 15px; line-height: 1.6;">Our support team has posted a reply on ticket <strong>${ticketRef}</strong>:</p>
    
    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <span style="font-[10px] font-bold text-blue-800 uppercase block mb-2">Message Reply Preview</span>
      <p style="margin: 0; color: #0369a1; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${replyText}</p>
    </div>
  `;
  return wrapLayout(content, `New Reply on ${ticketRef}`);
}

export function getSupportStatusChangedTemplate(
  ticketRef: string,
  prevStatus: string,
  newStatus: string
): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 20px;">Support Ticket Updated</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 15px; line-height: 1.6;">The status of your support request <strong>${ticketRef}</strong> has been updated.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 35%;">Previous Status:</td>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px; font-weight: bold; text-transform: uppercase;">${prevStatus}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">New Status:</td>
          <td style="padding: 6px 0; color: #10b981; font-size: 14px; font-weight: bold; text-transform: uppercase;">${newStatus}</td>
        </tr>
      </table>
    </div>
  `;
  return wrapLayout(content, `Support Ticket ${ticketRef} Updated`);
}

export function getSupportSLAEscalatedTemplate(
  ticketRef: string,
  priority: string,
  breachType: string,
  escalationLevel: number,
  assignedAgent: string,
  deadline: string
): string {
  const content = `
    <h2 style="margin: 0 0 15px; color: #b91c1c; font-size: 20px;">[SLA BREACH ALERT] ticket escalated</h2>
    <p style="margin: 0 0 25px; color: #334155; font-size: 15px; line-height: 1.6;">This is an internal operations alert: Ticket <strong>${ticketRef}</strong> has crossed its target deadline.</p>
    
    <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #b91c1c; font-size: 13px; width: 35%; font-weight: bold;">Escalation Level:</td>
          <td style="padding: 6px 0; color: #b91c1c; font-size: 14px; font-weight: bold;">Level ${escalationLevel}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Breach Type:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: bold;">${breachType}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Priority:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: bold;">${priority}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Assigned Agent:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px;">${assignedAgent}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Target Deadline:</td>
          <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-family: monospace;">${deadline}</td>
        </tr>
      </table>
    </div>
  `;
  return wrapLayout(content, `[SLA BREACH ALERT] Ticket ${ticketRef} Escalated`);
}

export function getPartnerApplicationTemplate(data: {
  fullName: string;
  email: string;
  referralCode: string;
  partnerId: string;
  customSlug: string;
  audienceScale?: string;
  honorariumRate?: number;
}): string {
  const workspaceUrl = `https://thecouragelibrary.com/partners/${data.customSlug}`;
  const referralUrl = `https://thecouragelibrary.com/register?ref=${data.referralCode}`;

  const content = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; width: 100%; box-sizing: border-border-box;">
      
      <!-- HERO HEADER CARD -->
      <div style="background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%); padding: 24px 18px; border-radius: 14px; text-align: center; color: #ffffff; margin-bottom: 20px; border: 1px solid #312E81;">
        <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.2); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 800; font-family: monospace; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
          FOUNDING CREATOR COHORT • CNTS 2026
        </div>
        <h1 style="margin: 0 0 6px; font-size: 19px; font-weight: 900; line-height: 1.3; color: #ffffff; word-break: normal; white-space: normal; overflow-wrap: normal;">
          Application Received & Registered!
        </h1>
        <p style="margin: 0; color: #C7D2FE; font-size: 13px; font-weight: 500; line-height: 1.4;">
          Welcome to the Official Courage Partner Creator Ecosystem.
        </p>
      </div>

      <!-- PERSONALIZED SALUTATION -->
      <p style="font-size: 15px; line-height: 1.5; color: #0F172A; margin: 0 0 10px;">Dear <strong>${data.fullName}</strong>,</p>
      <p style="font-size: 13.5px; line-height: 1.55; color: #334155; margin: 0 0 20px;">
        Thank you for applying to join the <strong>Courage Partner Program</strong> for the Courage National Talent Search (CNTS) 2026. Your application has been logged and queued for 24-hour verification by our Courage Admin team.
      </p>

      <!-- STACKED CREDENTIAL PASS ITEMS FOR 100% PERFECT MOBILE RENDERING -->
      <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 18px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
        <div style="font-size: 12px; font-weight: 900; color: #0F172A; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 14px;">
          🛡️ OFFICIAL CREATOR CREDENTIAL PASS
        </div>

        <div style="margin-bottom: 12px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Creator Name</div>
          <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin-top: 2px;">${data.fullName}</div>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Partner ID</div>
          <div style="font-size: 14px; font-weight: 800; color: #0F172A; font-family: monospace; margin-top: 2px;">${data.partnerId}</div>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Referral Code</div>
          <div style="font-size: 17px; font-weight: 900; color: #4F46E5; font-family: monospace; letter-spacing: 1px; margin-top: 2px;">${data.referralCode}</div>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Dedicated Workspace URL</div>
          <div style="font-size: 12px; font-weight: 700; color: #2563EB; word-break: break-all; margin-top: 2px;">
            <a href="${workspaceUrl}" style="color: #2563EB; text-decoration: underline;">${workspaceUrl}</a>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Assigned Honorarium Rate</div>
          <div style="font-size: 14px; font-weight: 900; color: #15803D; margin-top: 2px;">₹${data.honorariumRate || 25} per verified candidate</div>
        </div>

        <div>
          <div style="font-size: 10.5px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Verification Status</div>
          <span style="display: inline-block; background-color: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800;">
            PENDING ADMIN REVIEW (24-Hour Verification)
          </span>
        </div>
      </div>

      <!-- MAIN CTA BUTTON -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${workspaceUrl}" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%); color: #ffffff; padding: 14px 20px; text-decoration: none; border-radius: 12px; font-weight: 900; font-size: 14px; letter-spacing: 0.5px; text-align: center;">
          OPEN CREATOR OS WORKSPACE &rarr;
        </a>
      </div>

      <!-- 3-STEP MOBILIZATION GUIDE CARDS -->
      <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-left: 4px solid #2563EB; border-radius: 12px; padding: 16px; margin: 24px 0;">
        <h4 style="margin: 0 0 10px; color: #1E40AF; font-size: 13.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
          🚀 Quick-Start Creator Mobilization Guide:
        </h4>
        
        <div style="font-size: 13px; color: #1E3A8A; line-height: 1.55; margin-bottom: 10px;">
          <strong>1. Share Your Referral Link:</strong><br />
          Direct Class 5-8 students to register via <a href="${referralUrl}" style="color: #2563EB; font-weight: bold; word-break: break-all;">${referralUrl}</a>.
        </div>

        <div style="font-size: 13px; color: #1E3A8A; line-height: 1.55; margin-bottom: 10px;">
          <strong>2. Real-Time Analytics Tracking:</strong><br />
          View live candidate registrations and accrued honorarium balances inside your workspace.
        </div>

        <div style="font-size: 13px; color: #1E3A8A; line-height: 1.55;">
          <strong>3. Weekly Monday Settlements:</strong><br />
          Accumulated honorarium payouts are automatically disbursed every Monday directly to your registered UPI ID.
        </div>
      </div>

      <!-- SUPPORT FOOTER -->
      <p style="font-size: 12.5px; color: #64748B; margin-top: 24px; line-height: 1.5; text-align: center;">
        Have questions or need custom promo banners? Reach out to our Partner Desk at <a href="mailto:support@thecouragelibrary.com" style="color: #2563EB; font-weight: bold;">support@thecouragelibrary.com</a>.
      </p>
    </div>
  `;
  return wrapLayout(content, `Courage Partner Application Received (${data.referralCode})`);
}


