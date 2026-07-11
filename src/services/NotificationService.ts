import { whatsappService } from "./whatsappService";
import { emailService } from "./emailService";
import { 
  getRegistrationSuccessTemplate, 
  getPaymentSuccessTemplate, 
  getAdmitCardTemplate, 
  getCertificateTemplate,
  getResultReleaseTemplate,
  getSupportTicketCreatedTemplate,
  getSupportAgentRepliedTemplate,
  getSupportStatusChangedTemplate,
  getSupportSLAEscalatedTemplate
} from "@/lib/emailTemplates";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

// Cast to bypass postgrest typescript mapping conflicts
const db = supabaseAdmin as any;

export class NotificationService {
  /**
   * Helper to insert a notification job into the database outbox
   */
  private static async createJob(
    recipient: string,
    channel: "WHATSAPP" | "EMAIL",
    templateName: string,
    payload: any
  ): Promise<string | null> {
    if (!hasSupabaseAdminConfig) return null;

    try {
      // Deduplication check: check if a job was created in the last 5 minutes for same recipient/channel/template
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: existingJob, error: checkError } = await db
        .from("notification_jobs")
        .select("id")
        .eq("recipient", recipient)
        .eq("channel", channel)
        .eq("template_name", templateName)
        .gt("created_at", fiveMinutesAgo)
        .limit(1)
        .maybeSingle();

      if (checkError) {
        console.error("[NotificationService] Deduplication check failed:", checkError.message);
      } else if (existingJob) {
        console.log(`[NotificationService] Deduplicated job for recipient: ${recipient}, channel: ${channel}, template: ${templateName}`);
        return null;
      }
      const { data, error } = await db
        .from("notification_jobs")
        .insert({
          recipient,
          channel,
          template_name: templateName,
          payload,
          status: "PENDING",
          attempts: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("[NotificationService] Failed to create outbox job:", error.message);
        return null;
      }
      return data?.id || null;
    } catch (e) {
      console.error("[NotificationService] Outbox create error:", e);
      return null;
    }
  }

  /**
   * Executes a notification job by calling the actual service
   */
  public static async executeJob(jobId: string): Promise<boolean> {
    if (!hasSupabaseAdminConfig) return false;

    // 1. Fetch job
    const { data: job, error: fetchErr } = await db
      .from("notification_jobs")
      .select("*")
      .eq("id", jobId)
      .maybeSingle();

    if (fetchErr || !job) {
      console.error(`[NotificationService] Job ${jobId} not found for execution`);
      return false;
    }

    if (job.status === "SENT") return true;

    // Update status to processing
    await db
      .from("notification_jobs")
      .update({ status: "PROCESSING", updated_at: new Date().toISOString() })
      .eq("id", jobId);

    let success = false;
    let errorMsg: string | null = null;

    try {
      if (job.channel === "WHATSAPP") {
        const { parameters, messageType } = job.payload;
        success = await whatsappService.sendTemplateMessage(
          job.recipient,
          job.template_name,
          parameters,
          messageType
        );
        if (!success) errorMsg = "WhatsApp dispatch returned false";
      } else if (job.channel === "EMAIL") {
        const { subject, htmlContent } = job.payload;
        const emailRes = await emailService.sendEmail(
          job.recipient,
          subject,
          htmlContent
        );
        success = emailRes.success;
        if (!success) errorMsg = emailRes.error || "Email dispatch failed";
      }
    } catch (e: any) {
      success = false;
      errorMsg = e.message || "Unknown error";
    }

    // Update job status
    const attempts = job.attempts + 1;
    const finalStatus = success ? "SENT" : (attempts >= 3 ? "FAILED" : "PENDING"); // Retry logic

    await db
      .from("notification_jobs")
      .update({
        status: finalStatus,
        error_message: errorMsg,
        attempts,
        updated_at: new Date().toISOString()
      })
      .eq("id", jobId);

    return success;
  }

  /**
   * Safely schedules job execution using Next.js after() hook to prevent container freezing
   */
  private static scheduleExecution(jobIds: string[]): void {
    const validIds = jobIds.filter(Boolean);
    if (validIds.length === 0) return;

    try {
      // Dynamic require next/server to avoid compile issues in non-next environments
      const { after } = require("next/server");
      after(async () => {
        console.log(`[NotificationService] Executing scheduled jobs post-response: ${validIds.join(", ")}`);
        for (const id of validIds) {
          await NotificationService.executeJob(id);
        }
      });
    } catch {
      // Fallback for edge cases or offline testing where after() is not present
      console.log(`[NotificationService] after() context unavailable. Processing async: ${validIds.join(", ")}`);
      Promise.all(validIds.map(id => NotificationService.executeJob(id)))
        .catch(err => console.error("[NotificationService] Async fallback execution failed:", err));
    }
  }

  /**
   * Dispatches notifications for registration success
   */
  public static async sendRegistrationSuccess(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    studentClass: string,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling registration success alerts for ${phoneNumber}`);
    
    // Sandbox fallback
    if (!hasSupabaseAdminConfig) {
      const waPromise = whatsappService.sendRegistrationConfirmation(phoneNumber, studentName, studentClass, registrationId);
      const emailPromise = email ? emailService.sendRegistrationEmail(email, studentName, studentClass, registrationId) : Promise.resolve(false);
      const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
      return { whatsapp: whatsappRes, email: emailRes };
    }

    const jobIds: string[] = [];

    // WhatsApp Job
    const waJobId = await this.createJob(phoneNumber, "WHATSAPP", "registration_success", {
      parameters: [studentName, registrationId, studentClass],
      messageType: "REGISTRATION_CONFIRMATION"
    });
    if (waJobId) jobIds.push(waJobId);

    // Email Job
    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getRegistrationSuccessTemplate(studentName, registrationId, studentClass);
      emailJobId = await this.createJob(email, "EMAIL", "registration_success_email", {
        subject: "CNTS 2026 Registration Confirmed",
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return { 
      whatsapp: !!waJobId, 
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches notifications for payment success
   */
  public static async sendPaymentSuccess(
    phoneNumber: string,
    email: string | null,
    studentName: string | null,
    registrationId: string,
    paymentId: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling payment success alerts for ${phoneNumber}`);
    
    if (!hasSupabaseAdminConfig) {
      const waPromise = whatsappService.sendPaymentConfirmation(phoneNumber, paymentId);
      const emailPromise = email ? emailService.sendPaymentEmail(email, studentName, registrationId, paymentId) : Promise.resolve(false);
      const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
      return { whatsapp: whatsappRes, email: emailRes };
    }

    const jobIds: string[] = [];

    const waJobId = await this.createJob(phoneNumber, "WHATSAPP", "payment_success", {
      parameters: [paymentId],
      messageType: "PAYMENT_CONFIRMATION"
    });
    if (waJobId) jobIds.push(waJobId);

    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getPaymentSuccessTemplate(studentName, registrationId, paymentId);
      emailJobId = await this.createJob(email, "EMAIL", "payment_receipt_email", {
        subject: "CNTS 2026 Enrollment Confirmed",
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return {
      whatsapp: !!waJobId,
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches notifications for Admit Card release
   */
  public static async sendAdmitCardReleased(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling Admit Card released alerts for ${phoneNumber}`);
    
    if (!hasSupabaseAdminConfig) {
      const waPromise = whatsappService.sendAdmitCardAvailable(phoneNumber, studentName, registrationId);
      let emailPromise = Promise.resolve(false);
      if (email) {
        const subject = "CNTS 2026 Admit Card Available";
        const htmlContent = getAdmitCardTemplate(studentName, registrationId);
        emailPromise = emailService.sendEmail(email, subject, htmlContent).then(r => r.success);
      }
      const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
      return { whatsapp: whatsappRes, email: emailRes };
    }

    const jobIds: string[] = [];

    const waJobId = await this.createJob(phoneNumber, "WHATSAPP", "admit_card_available", {
      parameters: [studentName, registrationId],
      messageType: "ADMIT_CARD_NOTIFICATION"
    });
    if (waJobId) jobIds.push(waJobId);

    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getAdmitCardTemplate(studentName, registrationId);
      emailJobId = await this.createJob(email, "EMAIL", "admit_card_email", {
        subject: "CNTS 2026 Admit Card Available",
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return {
      whatsapp: !!waJobId,
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches notifications for Results released
   */
  public static async sendResultsReleased(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling results released alerts for ${phoneNumber}`);
    
    if (!hasSupabaseAdminConfig) {
      const waPromise = whatsappService.sendResultNotification(phoneNumber, studentName);
      const emailPromise = email ? emailService.sendResultEmail(email, studentName, registrationId) : Promise.resolve(false);
      const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
      return { whatsapp: whatsappRes, email: emailRes };
    }

    const jobIds: string[] = [];

    const waJobId = await this.createJob(phoneNumber, "WHATSAPP", "result_available", {
      parameters: [studentName],
      messageType: "RESULT_NOTIFICATION"
    });
    if (waJobId) jobIds.push(waJobId);

    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getResultReleaseTemplate(studentName, registrationId);
      emailJobId = await this.createJob(email, "EMAIL", "result_released_email", {
        subject: "CNTS 2026 Results Released",
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return {
      whatsapp: !!waJobId,
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches notifications for Certificate released
   */
  public static async sendCertificateReleased(
    phoneNumber: string,
    email: string | null,
    studentName: string,
    registrationId: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling Certificate released alerts for ${phoneNumber}`);
    
    if (!hasSupabaseAdminConfig) {
      const waPromise = whatsappService.sendCertificateAvailable(phoneNumber, studentName, registrationId);
      let emailPromise = Promise.resolve(false);
      if (email) {
        const subject = "CNTS 2026 Certificate Issued";
        const htmlContent = getCertificateTemplate(studentName, registrationId);
        emailPromise = emailService.sendEmail(email, subject, htmlContent).then(r => r.success);
      }
      const [whatsappRes, emailRes] = await Promise.all([waPromise, emailPromise]);
      return { whatsapp: whatsappRes, email: emailRes };
    }

    const jobIds: string[] = [];

    const waJobId = await this.createJob(phoneNumber, "WHATSAPP", "certificate_available", {
      parameters: [studentName, registrationId],
      messageType: "CERTIFICATE_NOTIFICATION"
    });
    if (waJobId) jobIds.push(waJobId);

    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getCertificateTemplate(studentName, registrationId);
      emailJobId = await this.createJob(email, "EMAIL", "certificate_released_email", {
        subject: "CNTS 2026 Certificate Issued",
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return {
      whatsapp: !!waJobId,
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches notifications for Ticket Created acknowledgment
   */
  public static async sendTicketCreated(
    phoneNumber: string | null,
    email: string | null,
    name: string,
    ticketNumber: string,
    subject: string,
    description: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling Ticket Created alert for ticket: ${ticketNumber}`);
    
    if (!hasSupabaseAdminConfig) {
      const emailPromise = email 
        ? emailService.sendEmail(
            email, 
            `CNTS Support Request Received — ${ticketNumber}`, 
            getSupportTicketCreatedTemplate(name, ticketNumber, subject, description)
          ).then(r => r.success)
        : Promise.resolve(false);
      const emailRes = await emailPromise;
      return { whatsapp: false, email: emailRes };
    }

    const jobIds: string[] = [];

    // WhatsApp - Skipped if not approved
    let waJobId: string | null = null;
    if (phoneNumber) {
      // Mark as skipped/not queued because template is not configured
    }

    // Email Job
    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getSupportTicketCreatedTemplate(name, ticketNumber, subject, description);
      emailJobId = await this.createJob(email, "EMAIL", "support_ticket_created", {
        subject: `CNTS Support Request Received — ${ticketNumber}`,
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return {
      whatsapp: !!waJobId,
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches notifications for support replies
   */
  public static async sendAgentReplied(
    phoneNumber: string | null,
    email: string | null,
    ticketNumber: string,
    subject: string,
    replyText: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling support agent reply notification for ticket: ${ticketNumber}`);

    if (!hasSupabaseAdminConfig) {
      const emailPromise = email 
        ? emailService.sendEmail(
            email, 
            `New Reply on ${ticketNumber}`, 
            getSupportAgentRepliedTemplate(ticketNumber, subject, replyText)
          ).then(r => r.success)
        : Promise.resolve(false);
      const emailRes = await emailPromise;
      return { whatsapp: false, email: emailRes };
    }

    const jobIds: string[] = [];

    // Email Job
    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getSupportAgentRepliedTemplate(ticketNumber, subject, replyText);
      emailJobId = await this.createJob(email, "EMAIL", "support_agent_replied", {
        subject: `New Reply on ${ticketNumber}`,
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return {
      whatsapp: false,
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches notifications for support status changes
   */
  public static async sendStatusChanged(
    phoneNumber: string | null,
    email: string | null,
    ticketNumber: string,
    prevStatus: string,
    newStatus: string
  ): Promise<{ whatsapp: boolean; email: boolean; jobIds?: string[] }> {
    console.log(`[NotificationService] Scheduling status changed alert for ticket: ${ticketNumber}`);

    if (!hasSupabaseAdminConfig) {
      const emailPromise = email 
        ? emailService.sendEmail(
            email, 
            `Support Ticket ${ticketNumber} Updated`, 
            getSupportStatusChangedTemplate(ticketNumber, prevStatus, newStatus)
          ).then(r => r.success)
        : Promise.resolve(false);
      const emailRes = await emailPromise;
      return { whatsapp: false, email: emailRes };
    }

    const jobIds: string[] = [];

    // Email Job
    let emailJobId: string | null = null;
    if (email) {
      const htmlContent = getSupportStatusChangedTemplate(ticketNumber, prevStatus, newStatus);
      emailJobId = await this.createJob(email, "EMAIL", "support_status_changed", {
        subject: `Support Ticket ${ticketNumber} Updated`,
        htmlContent
      });
      if (emailJobId) jobIds.push(emailJobId);
    }

    this.scheduleExecution(jobIds);

    return {
      whatsapp: false,
      email: !!emailJobId,
      jobIds
    };
  }

  /**
   * Dispatches internal alert notifications for SLA Escalations
   */
  public static async sendSLAEscalated(
    email: string,
    ticketNumber: string,
    priority: string,
    breachType: string,
    escalationLevel: number,
    assignedAgent: string,
    deadline: string
  ): Promise<{ email: boolean; jobId?: string }> {
    console.log(`[NotificationService] Scheduling internal SLA Escalation alert for ticket: ${ticketNumber}`);

    if (!hasSupabaseAdminConfig) {
      const emailRes = await emailService.sendEmail(
        email, 
        `[SLA BREACH ALERT] Ticket ${ticketNumber} Escalated`, 
        getSupportSLAEscalatedTemplate(ticketNumber, priority, breachType, escalationLevel, assignedAgent, deadline)
      );
      return { email: emailRes.success };
    }

    const htmlContent = getSupportSLAEscalatedTemplate(ticketNumber, priority, breachType, escalationLevel, assignedAgent, deadline);
    const jobId = await this.createJob(email, "EMAIL", "support_sla_escalated", {
      subject: `[SLA BREACH ALERT] Ticket ${ticketNumber} Escalated`,
      htmlContent
    });

    if (jobId) {
      this.scheduleExecution([jobId]);
    }

    return {
      email: !!jobId,
      jobId: jobId || undefined
    };
  }
}
