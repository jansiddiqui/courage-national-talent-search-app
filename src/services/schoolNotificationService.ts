import { EmailService } from "@/services/emailService";
import { WhatsAppService } from "@/services/whatsappService";

const emailService = new EmailService();
const whatsappService = new WhatsAppService();

export interface SendSchoolCredentialsParams {
  schoolName: string;
  schoolCode: string;
  pin: string;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorMobile: string;
  quota?: number | string;
  sponsorshipMode?: string;
}

/**
 * Sends official CNTS School Credentials via Email (Brevo) and WhatsApp (Meta Cloud API)
 */
export async function sendSchoolCredentialsNotification(
  params: SendSchoolCredentialsParams
): Promise<{ emailSent: boolean; whatsappSent: boolean; errors: string[] }> {
  const {
    schoolName,
    schoolCode,
    pin,
    coordinatorName,
    coordinatorEmail,
    coordinatorMobile,
    quota = 50,
  } = params;

  const errors: string[] = [];
  let emailSent = false;
  let whatsappSent = false;

  const loginUrl = "https://thecouragelibrary.com/dashboard/school/login";
  const studentReferralUrl = `https://thecouragelibrary.com/register?school=${schoolCode}`;

  // 1. Send Email Notification
  if (coordinatorEmail && coordinatorEmail.trim()) {
    const subject = `Welcome to CNTS 2026 - School Portal Credentials for ${schoolName}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { background: #1e3a8a; color: #ffffff; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
            .header p { margin: 4px 0 0 0; font-size: 12px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px; }
            .body { padding: 30px; }
            .welcome-text { font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
            .cred-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .cred-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px border-slate-200; }
            .cred-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
            .cred-val { font-size: 16px; font-weight: 800; color: #1e3a8a; font-family: monospace; }
            .btn { display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; margin-top: 10px; }
            .referral-box { background: #f8fafc; border: 1px dashed #cbd5e1; padding: 14px; border-radius: 10px; font-family: monospace; font-size: 12px; color: #2563eb; word-break: break-all; margin-top: 8px; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>COURAGE NATIONAL TALENT SEARCH</h1>
              <p>Official School Partnership Activation</p>
            </div>

            <div class="body">
              <p class="welcome-text">
                Dear <strong>${coordinatorName || "School Coordinator"}</strong>,<br><br>
                Welcome to <strong>Courage National Talent Search 2026</strong>! Your school <strong>${schoolName}</strong> has been officially onboarded as an authorized CNTS Partner Institution.
              </p>

              <div class="cred-card">
                <h3 style="margin-top:0; font-size:13px; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.5px;">School Portal Credentials</h3>
                <p style="font-size:12px; color:#475569; margin-bottom:14px;">Use these credentials to log in to your School Dashboard to register students and track admit cards.</p>

                <table width="100%" style="font-size:14px;">
                  <tr>
                    <td style="color:#64748b; font-size:12px; font-weight:bold; padding:4px 0;">SCHOOL CODE:</td>
                    <td style="font-family:monospace; font-weight:bold; color:#0f172a; text-align:right;">${schoolCode}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b; font-size:12px; font-weight:bold; padding:4px 0;">LOGIN PIN:</td>
                    <td style="font-family:monospace; font-weight:bold; color:#2563eb; text-align:right;">${pin}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b; font-size:12px; font-weight:bold; padding:4px 0;">SEAT QUOTA:</td>
                    <td style="font-weight:bold; color:#0f172a; text-align:right;">${quota} Seats</td>
                  </tr>
                </table>

                <div style="text-align: center; margin-top: 16px;">
                  <a href="${loginUrl}" class="btn" style="color: #ffffff;">Log In to School Dashboard →</a>
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 6px 0; font-size: 13px; color: #0f172a;">Direct Student Referral Link</h4>
                <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0;">Share this link with your students. It automatically applies your school code during candidate registration:</p>
                <div class="referral-box">${studentReferralUrl}</div>
              </div>

              <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
                <strong>Security Tip:</strong> You can update your Login PIN anytime from your School Dashboard.
              </p>
            </div>

            <div class="footer">
              Courage National Talent Search 2026 • Courage Library Foundation<br>
              Need assistance? Contact support@thecouragelibrary.com
            </div>
          </div>
        </body>
      </html>
    `;

    const emailRes = await emailService.sendEmail(coordinatorEmail.trim(), subject, htmlContent);
    if (emailRes.success) {
      emailSent = true;
    } else {
      errors.push(emailRes.error || "Email delivery failed");
    }
  }

  // 2. Send WhatsApp Welcome Notification (Directing coordinator to check email for credentials)
  if (coordinatorMobile && coordinatorMobile.trim()) {
    let cleanMobile = coordinatorMobile.replace(/\D/g, "");
    if (cleanMobile.length === 10) cleanMobile = `91${cleanMobile}`;

    const whatsappText = 
      `🎓 *Courage National Talent Search 2026*\n\n` +
      `Welcome *${coordinatorName || "Coordinator"}*!\n` +
      `Your official CNTS School Partnership for *${schoolName}* has been successfully activated.\n\n` +
      `✉️ We have sent your confidential School Code, Login PIN, and Student Referral link directly to your registered email address:\n` +
      `👉 *${coordinatorEmail || "your registered email"}*\n\n` +
      `Portal Link: ${loginUrl}\n` +
      `Please check your inbox to log in and manage student registrations.`;

    try {
      // Try template message first, fallback to text
      let waRes = await whatsappService.sendTemplateMessage(
        cleanMobile,
        "school_partner_welcome",
        [coordinatorName || "Coordinator", schoolName, coordinatorEmail || "your email"],
        "school_credentials"
      );

      if (!waRes) {
        // Fallback to text dispatch if template fails or sandbox
        const rawRes = await whatsappService.sendMetaWhatsAppMessage(cleanMobile, {
          type: "text",
          text: { body: whatsappText }
        });
        waRes = rawRes.success;
      }

      if (waRes) {
        whatsappSent = true;
        await whatsappService.logAttempt(cleanMobile, "school_credentials", "SENT");
      } else {
        errors.push("WhatsApp delivery failed");
        await whatsappService.logAttempt(cleanMobile, "school_credentials", "FAILED");
      }
    } catch (waErr: any) {
      errors.push(waErr.message || "WhatsApp delivery exception");
    }
  }

  return { emailSent, whatsappSent, errors };
}
