import { whatsappService } from "./whatsappService";
import { emailService } from "./emailService";

export class NotificationService {
  /**
   * Dispatches notifications for registration success (WhatsApp template + Resend email)
   */
  public static async sendRegistrationSuccess(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    studentClass: string,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean }> {
    console.log(`[NotificationService] Dispatching registration success alerts for ${phoneNumber}`);
    
    // 1. WhatsApp Template Dispatch
    const waPromise = whatsappService.sendRegistrationConfirmation(
      phoneNumber,
      studentName,
      studentClass,
      registrationId
    );

    // 2. Email Template Dispatch (if email is provided)
    let emailPromise = Promise.resolve(false);
    if (email) {
      emailPromise = emailService.sendRegistrationEmail(
        email,
        studentName,
        studentClass,
        registrationId
      );
    }

    const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
    return { whatsapp: whatsappRes, email: emailRes };
  }

  /**
   * Dispatches notifications for payment success (WhatsApp template + Resend email receipt)
   */
  public static async sendPaymentSuccess(
    phoneNumber: string,
    email: string | null,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean }> {
    console.log(`[NotificationService] Dispatching payment success alerts for ${phoneNumber}`);
    
    // 1. WhatsApp Template Dispatch
    const waPromise = whatsappService.sendPaymentConfirmation(
      phoneNumber,
      registrationId
    );

    // 2. Email Receipt Dispatch (if email is provided)
    let emailPromise = Promise.resolve(false);
    if (email) {
      emailPromise = emailService.sendPaymentEmail(
        email,
        registrationId
      );
    }

    const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
    return { whatsapp: whatsappRes, email: emailRes };
  }

  /**
   * Dispatches notifications for Admit Card release (WhatsApp template + Resend email)
   */
  public static async sendAdmitCardReleased(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean }> {
    console.log(`[NotificationService] Dispatching Admit Card released alerts for ${phoneNumber}`);
    
    // 1. WhatsApp Template Dispatch
    const waPromise = whatsappService.sendAdmitCardAvailable(
      phoneNumber,
      studentName,
      registrationId
    );

    // 2. Email Dispatch (if email is provided)
    let emailPromise = Promise.resolve(false);
    if (email) {
      const subject = "🎟️ CNTS 2026 Admit Card Released";
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">Admit Card Available</h2>
          <p>Dear Parent,</p>
          <p>The admit card for your child, <strong>${studentName}</strong>, is now ready for download.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3b82f6;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>Student Name:</strong> ${studentName}</li>
              <li style="margin-bottom: 8px;"><strong>CNTS ID:</strong> ${registrationId}</li>
            </ul>
          </div>
          <p>Please log in to your parent dashboard to download and print the admit card before exam day:</p>
          <p><a href="https://cnts.in/dashboard" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Admit Card</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #666;">If you have any questions, feel free to reply to this email or reach us at support@thecouragelibrary.com.</p>
          <p>Best regards,<br/><strong>CNTS Team</strong></p>
        </div>
      `;
      emailPromise = emailService.sendEmail(email, subject, htmlContent).then(r => r.success);
    }

    const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
    return { whatsapp: whatsappRes, email: emailRes };
  }

  /**
   * Dispatches notifications for Results released (WhatsApp template + Resend email scorecard)
   */
  public static async sendResultsReleased(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    _registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean }> {
    console.log(`[NotificationService] Dispatching results released alerts for ${phoneNumber}`);
    
    // 1. WhatsApp Template Dispatch
    const waPromise = whatsappService.sendResultNotification(
      phoneNumber,
      studentName
    );

    // 2. Email Scorecard Dispatch (if email is provided)
    let emailPromise = Promise.resolve(false);
    if (email) {
      emailPromise = emailService.sendResultEmail(
        email,
        studentName
      );
    }

    const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
    return { whatsapp: whatsappRes, email: emailRes };
  }

  /**
   * Dispatches notifications for Certificate released (WhatsApp template + Resend email awards)
   */
  public static async sendCertificateReleased(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean }> {
    console.log(`[NotificationService] Dispatching Certificate released alerts for ${phoneNumber}`);
    
    // 1. WhatsApp Template Dispatch
    const waPromise = whatsappService.sendCertificateAvailable(
      phoneNumber,
      studentName,
      registrationId
    );

    // 2. Email Dispatch (if email is provided)
    let emailPromise = Promise.resolve(false);
    if (email) {
      const subject = "🏆 CNTS 2026 Certificate & Recognition Released";
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #b45309; border-bottom: 2px solid #b45309; padding-bottom: 8px;">Certificate & Awards Issued</h2>
          <p>Dear Parent,</p>
          <p>We are proud to share that the national certificate and recognition profile for <strong>${studentName}</strong> has been issued.</p>
          <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d97706;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>Student Name:</strong> ${studentName}</li>
              <li style="margin-bottom: 8px;"><strong>CNTS ID:</strong> ${registrationId}</li>
            </ul>
          </div>
          <p>Please log in to your parent dashboard to download the certificate of merit and share your child's achievement:</p>
          <p><a href="https://cnts.in/dashboard" style="display: inline-block; background-color: #b45309; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Certificate</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #666;">If you have any questions, feel free to reply to this email or reach us at support@thecouragelibrary.com.</p>
          <p>Best regards,<br/><strong>CNTS Team</strong></p>
        </div>
      `;
      emailPromise = emailService.sendEmail(email, subject, htmlContent).then(r => r.success);
    }

    const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
    return { whatsapp: whatsappRes, email: emailRes };
  }
}
