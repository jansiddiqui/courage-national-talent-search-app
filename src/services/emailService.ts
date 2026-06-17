/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const subject = "🎉 CNTS Registration Successful";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">CNTS Registration Successful</h2>
        <p>Dear Parent,</p>
        <p>Thank you for registering your child for the <strong>Courage National Talent Search (CNTS) 2026 Founding Edition</strong>.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3b82f6;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>Student Name:</strong> ${studentName}</li>
            <li style="margin-bottom: 8px;"><strong>Class:</strong> ${studentClass}</li>
            <li style="margin-bottom: 8px;"><strong>Registration ID:</strong> <span style="font-family: monospace; font-size: 1.1em; font-weight: bold; color: #1e40af;">${registrationId}</span></li>
          </ul>
        </div>
        <p>You can access study schedules, syllabus checklists, and downloadable sample papers here:</p>
        <p><a href="https://cnts.in/prepare" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Practice Guides</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #666;">If you have any questions, feel free to reply to this email or reach us at support@thecouragelibrary.com.</p>
        <p>Best regards,<br/><strong>CNTS Team</strong></p>
      </div>
    `;
    const res = await this.sendEmail(to, subject, htmlContent);
    return res.success;
  }

  /**
   * Sends the Payment Receipt transactional email
   */
  public async sendPaymentEmail(
    to: string,
    registrationId: string
  ): Promise<boolean> {
    const subject = "✅ Payment Confirmation – CNTS 2026";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 8px;">Payment Received Successfully</h2>
        <p>Dear Parent,</p>
        <p>We are pleased to confirm that we have successfully received your checkout payment of <strong>₹99</strong> for the CNTS 2026 Founding Edition.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>Registration ID:</strong> <span style="font-family: monospace; font-size: 1.1em; font-weight: bold; color: #1e40af;">${registrationId}</span></li>
            <li style="margin-bottom: 8px;"><strong>Amount Paid:</strong> ₹99.00</li>
            <li style="margin-bottom: 8px;"><strong>Status:</strong> Successful (PAID)</li>
          </ul>
        </div>
        <p>Your candidate registration is fully confirmed. You can now access candidate details and monitor status gates in your parent portal:</p>
        <p><a href="https://cnts.in/dashboard" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Parent Dashboard</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #666;">For invoice receipts or queries, please reach out to support@thecouragelibrary.com.</p>
        <p>Best regards,<br/><strong>CNTS Team</strong></p>
      </div>
    `;
    const res = await this.sendEmail(to, subject, htmlContent);
    return res.success;
  }

  /**
   * Sends the Results Published transactional email
   */
  public async sendResultEmail(
    to: string,
    studentName: string
  ): Promise<boolean> {
    const subject = "🎉 CNTS 2026 Results Published";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">CNTS Results Published</h2>
        <p>Dear Parent,</p>
        <p>The official results and diagnostic profiles for the <strong>Courage National Talent Search 2026</strong> are now available.</p>
        <p>Candidate: <strong>${studentName}</strong></p>
        <p>Your child's personalized cognitive breakdown and Talent Profile report have been generated. You can view analysis and scorecards using the link below:</p>
        <p><a href="https://cnts.in/results" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Talent Profile</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #666;">If you require help recovering your candidate credentials, contact support@thecouragelibrary.com.</p>
        <p>Best regards,<br/><strong>CNTS Team</strong></p>
      </div>
    `;
    const res = await this.sendEmail(to, subject, htmlContent);
    return res.success;
  }
}

export const emailService = new EmailService();
