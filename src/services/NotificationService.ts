import { whatsappService } from "./whatsappService";
import { emailService } from "./emailService";
import { getAdmitCardTemplate, getCertificateTemplate } from "@/lib/emailTemplates";

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
    studentName: string | null,
    registrationId: string,
    paymentId: string
  ): Promise<{ whatsapp: boolean; email: boolean }> {
    console.log(`[NotificationService] Dispatching payment success alerts for ${phoneNumber}`);
    
    // 1. WhatsApp Template Dispatch
    const waPromise = whatsappService.sendPaymentConfirmation(
      phoneNumber,
      paymentId
    );

    // 2. Email Receipt Dispatch (if email is provided)
    let emailPromise = Promise.resolve(false);
    if (email) {
      emailPromise = emailService.sendPaymentEmail(
        email,
        studentName,
        registrationId,
        paymentId
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
      const subject = "CNTS 2026 Admit Card Available";
      const htmlContent = getAdmitCardTemplate(studentName, registrationId);
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
        studentName,
        _registrationId
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
      const subject = "CNTS 2026 Certificate Issued";
      const htmlContent = getCertificateTemplate(studentName, registrationId);
      emailPromise = emailService.sendEmail(email, subject, htmlContent).then(r => r.success);
    }

    const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
    return { whatsapp: whatsappRes, email: emailRes };
  }
}
