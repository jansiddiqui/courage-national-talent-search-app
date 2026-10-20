/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  getRegistrationSuccessTemplate, 
  getPaymentSuccessTemplate, 
  getResultReleaseTemplate,
  getRecoveryTemplate,
  getFoundingFamilyTemplate
} from "@/lib/emailTemplates";
import { EMAIL_SENDERS, EmailSenderKey, EmailSenderConfig } from "@/config/contact";

export interface SendEmailOptions {
  sender?: EmailSenderKey | EmailSenderConfig;
  replyTo?: { email: string; name?: string };
}

export class EmailService {
  private apiKey = process.env.BREVO_API_KEY || "";

  public isSandbox(): boolean {
    return !this.apiKey;
  }

  /**
   * Dispatches an email via the Brevo SMTP API (POST https://api.brevo.com/v3/smtp/email)
   * with configured sender and reply-to metadata.
   */
  public async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    options?: SendEmailOptions
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!to) {
      return { success: false, error: "Recipient email is required" };
    }

    let senderConfig: EmailSenderConfig = EMAIL_SENDERS.default;
    if (options?.sender) {
      if (typeof options.sender === "string" && options.sender in EMAIL_SENDERS) {
        senderConfig = EMAIL_SENDERS[options.sender as EmailSenderKey];
      } else if (typeof options.sender === "object") {
        senderConfig = options.sender;
      }
    }

    const replyTo = options?.replyTo || senderConfig.replyTo;

    if (this.isSandbox()) {
      console.log(`\n=================================================`);
      console.log(`[EMAIL SANDBOX]`);
      console.log(`Sender: ${senderConfig.name} <${senderConfig.email}>`);
      console.log(`Reply-To: ${replyTo.name || senderConfig.name} <${replyTo.email}>`);
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
            name: senderConfig.name,
            email: senderConfig.email
          },
          replyTo: {
            name: replyTo.name || senderConfig.name,
            email: replyTo.email
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
   * Sender: Courage National Talent Search <cnts@couragelibrary.in>
   * Reply-To: cnts@couragelibrary.in
   */
  public async sendRegistrationEmail(
    to: string,
    studentName: string,
    studentClass: string,
    registrationId: string
  ): Promise<boolean> {
    const subject = "CNTS 2026 Registration Confirmed";
    const htmlContent = getRegistrationSuccessTemplate(studentName, registrationId, studentClass);
    const res = await this.sendEmail(to, subject, htmlContent, { sender: "default" });
    return res.success;
  }

  /**
   * Sends the Payment Receipt transactional email
   * Sender: Courage National Talent Search <cnts@couragelibrary.in>
   * Reply-To: cnts@couragelibrary.in
   */
  public async sendPaymentEmail(
    to: string,
    studentName: string | null,
    registrationId: string,
    paymentId: string
  ): Promise<boolean> {
    const subject = "CNTS 2026 Enrollment Confirmed";
    const htmlContent = getPaymentSuccessTemplate(studentName, registrationId, paymentId);
    const res = await this.sendEmail(to, subject, htmlContent, { sender: "default" });
    return res.success;
  }

  /**
   * Sends the Results Published transactional email
   * Sender: CNTS Results <cnts@couragelibrary.in>
   * Reply-To: cnts@couragelibrary.in
   */
  public async sendResultEmail(
    to: string,
    studentName: string,
    candidateId: string
  ): Promise<boolean> {
    const subject = "CNTS 2026 Results Released";
    const htmlContent = getResultReleaseTemplate(studentName, candidateId);
    const res = await this.sendEmail(to, subject, htmlContent, { sender: "results" });
    return res.success;
  }

  /**
   * Sends the Forgot ID recovery transactional email
   * Sender: CNTS <cnts@couragelibrary.in>
   * Reply-To: cnts@couragelibrary.in
   */
  public async sendRecoveryEmail(
    to: string,
    candidateId: string
  ): Promise<boolean> {
    const subject = "CNTS Candidate ID Recovery";
    const htmlContent = getRecoveryTemplate(candidateId);
    const res = await this.sendEmail(to, subject, htmlContent, { sender: "noreply" });
    return res.success;
  }

  /**
   * Sends the Founding Family welcome email
   * Sender: Courage National Talent Search <cnts@couragelibrary.in>
   * Reply-To: cnts@couragelibrary.in
   */
  public async sendFoundingFamilyEmail(
    to: string,
    parentName: string,
    familyId: string
  ): Promise<boolean> {
    const subject = `🎉 Welcome to CNTS Founding Families — Your ID: ${familyId}`;
    const htmlContent = getFoundingFamilyTemplate(parentName, familyId);
    const res = await this.sendEmail(to, subject, htmlContent, { sender: "default" });
    return res.success;
  }

  /**
   * Sends a Support transactional email
   * Sender: CNTS Support <cnts@couragelibrary.in>
   * Reply-To: cnts@couragelibrary.in
   */
  public async sendSupportEmail(
    to: string,
    subject: string,
    htmlContent: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    return this.sendEmail(to, subject, htmlContent, { sender: "support" });
  }

  /**
   * Sends a Partnerships transactional email
   * Sender: CNTS Partnerships <collaborate@couragelibrary.in>
   * Reply-To: collaborate@couragelibrary.in
   */
  public async sendPartnershipEmail(
    to: string,
    subject: string,
    htmlContent: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    return this.sendEmail(to, subject, htmlContent, { sender: "partners" });
  }
}

export const emailService = new EmailService();
