/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  getRegistrationSuccessTemplate, 
  getPaymentSuccessTemplate, 
  getResultReleaseTemplate,
  getRecoveryTemplate
} from "@/lib/emailTemplates";

export class EmailService {
  private apiKey = process.env.BREVO_API_KEY || "";
  private senderName = "CNTS Support";
  private senderEmail = "noreply@thecouragelibrary.com";

  public isSandbox(): boolean {
    return !this.apiKey;
  }

  /**
   * Dispatches an email via the Brevo SMTP API (POST https://api.brevo.com/v3/smtp/email)
   */
  public async sendEmail(
    to: string,
    subject: string,
    htmlContent: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!to) {
      return { success: false, error: "Recipient email is required" };
    }

    if (this.isSandbox()) {
      console.log(`\n=================================================`);
      console.log(`[EMAIL SANDBOX]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${htmlContent}`);
      console.log(`=================================================\n`);
      return { success: true, id: `mock_email_${Math.random().toString(36).substring(7)}` };
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
          "accept": "application/json"
        },
        body: JSON.stringify({
          sender: {
            name: this.senderName,
            email: this.senderEmail
          },
          to: [
            {
              email: to
            }
          ],
          subject,
          htmlContent
        })
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, id: data.messageId };
      }

      console.error("[Email Service] Brevo API error:", data);
      return { success: false, error: data.message || "Brevo API failure" };
    } catch (e: any) {
      console.error("[Email Service] Network error sending email:", e);
      return { success: false, error: e.message || "Network error" };
    }
  }

  /**
   * Sends the Registration Confirmation transactional email
   */
  public async sendRegistrationEmail(
    to: string,
    studentName: string,
    studentClass: string,
    registrationId: string
  ): Promise<boolean> {
    const subject = "CNTS 2026 Registration Confirmed";
    const htmlContent = getRegistrationSuccessTemplate(studentName, registrationId, studentClass);
    const res = await this.sendEmail(to, subject, htmlContent);
    return res.success;
  }

  /**
   * Sends the Payment Receipt transactional email
   */
  public async sendPaymentEmail(
    to: string,
    studentName: string | null,
    registrationId: string,
    paymentId: string
  ): Promise<boolean> {
    const subject = "CNTS 2026 Enrollment Confirmed";
    const htmlContent = getPaymentSuccessTemplate(studentName, registrationId, paymentId);
    const res = await this.sendEmail(to, subject, htmlContent);
    return res.success;
  }

  /**
   * Sends the Results Published transactional email
   */
  public async sendResultEmail(
    to: string,
    studentName: string,
    candidateId: string
  ): Promise<boolean> {
    const subject = "CNTS 2026 Results Released";
    const htmlContent = getResultReleaseTemplate(studentName, candidateId);
    const res = await this.sendEmail(to, subject, htmlContent);
    return res.success;
  }

  /**
   * Sends the Forgot ID recovery transactional email
   */
  public async sendRecoveryEmail(
    to: string,
    candidateId: string
  ): Promise<boolean> {
    const subject = "CNTS Candidate ID Recovery";
    const htmlContent = getRecoveryTemplate(candidateId);
    const res = await this.sendEmail(to, subject, htmlContent);
    return res.success;
  }
}

export const emailService = new EmailService();
