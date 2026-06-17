/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export class WhatsAppService {
  private phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  private accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";

  public isSandbox(): boolean {
    return !this.phoneId || !this.accessToken;
  }

  /**
   * Helper to mask phone numbers for database logging compliance (e.g. ******4390)
   */
  public maskPhoneNumber(phone: string): string {
    const clean = phone.replace(/\D/g, "");
    if (clean.length <= 4) return "****";
    return "*".repeat(clean.length - 4) + clean.slice(-4);
  }

  /**
   * Securely logs a delivery attempt to the whatsapp_logs table on the server
   */
  public async logAttempt(
    phoneNumber: string,
    messageType: string,
    status: string,
    metaMessageId?: string
  ): Promise<void> {
    const masked = this.maskPhoneNumber(phoneNumber);
    try {
      const { error } = await (supabaseAdmin as any)
        .from("whatsapp_logs")
        .insert({
          phone_number_masked: masked,
          message_type: messageType,
          status,
          meta_message_id: metaMessageId || null,
          created_at: new Date().toISOString()
        });
      if (error) {
        console.error("[WhatsApp Service] Database log error:", error);
      }
    } catch (e) {
      console.error("[WhatsApp Service] Database log failed:", e);
    }
  }

  /**
   * Dispatches a message to the Meta WhatsApp Business Cloud API (v23.0)
   */
  public async sendMetaWhatsAppMessage(
    phoneNumber: string,
    payload: any
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    let cleanMobile = phoneNumber.replace(/\D/g, "");
    if (cleanMobile.length === 10) {
      cleanMobile = `91${cleanMobile}`;
    }

    if (this.isSandbox()) {
      console.log(`[WhatsApp Sandbox] Logging simulated payload for ${cleanMobile}:`, JSON.stringify(payload));
      return { success: true, messageId: `mock_meta_${Math.random().toString(36).substring(7)}` };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v23.0/${this.phoneId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.accessToken}`
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanMobile,
            ...payload
          })
        }
      );

      const data = await response.json();
      if (response.ok) {
        return {
          success: true,
          messageId: data.messages?.[0]?.id || "unknown_id"
        };
      }

      console.error("[WhatsApp Service] Meta API error:", data);
      return {
        success: false,
        error: data.error?.message || "Meta API rejection"
      };
    } catch (err: any) {
      console.error("[WhatsApp Service] Fetch error:", err);
      return { success: false, error: err.message || "Network error" };
    }
  }

  /**
   * Centralized method to send an approved Meta template message
   */
  public async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    parameters: string[],
    messageType: string
  ): Promise<boolean> {
    const payload = {
      type: "template",
      template: {
        name: templateName,
        language: {
          code: "en_US"
        },
        components: [
          {
            type: "body",
            parameters: parameters.map(param => ({
              type: "text",
              text: param
            }))
          }
        ]
      }
    };

    const result = await this.sendMetaWhatsAppMessage(phoneNumber, payload);

    await this.logAttempt(
      phoneNumber,
      messageType,
      result.success ? (this.isSandbox() ? "SENT_SANDBOX" : "SENT") : "FAILED",
      result.messageId
    );

    return result.success;
  }

  /**
   * Sends the transactional Registration Confirmation message
   */
  public async sendRegistrationConfirmation(
    phoneNumber: string,
    studentName: string,
    studentClass: string,
    registrationId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      phoneNumber,
      "registration_success",
      [studentName, studentClass, registrationId],
      "REGISTRATION_CONFIRMATION"
    );
  }

  /**
   * Sends the transactional Payment Confirmation receipt message
   */
  public async sendPaymentConfirmation(
    phoneNumber: string,
    registrationId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      phoneNumber,
      "payment_success",
      [registrationId],
      "PAYMENT_CONFIRMATION"
    );
  }

  /**
   * Sends the transactional Result Notification alert message
   */
  public async sendResultNotification(
    phoneNumber: string,
    studentName: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      phoneNumber,
      "result_available",
      [studentName],
      "RESULT_NOTIFICATION"
    );
  }

  /**
   * Sends Forgot CNTS ID recovery message
   */
  public async sendForgotCNTSID(
    phoneNumber: string,
    studentName: string,
    cntsId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      phoneNumber,
      "forgot_id_recovery",
      [studentName, cntsId],
      "RECOVERY_NOTIFICATION"
    );
  }

  /**
   * Sends transactional Admit Card release notification
   */
  public async sendAdmitCardAvailable(
    phoneNumber: string,
    studentName: string,
    registrationId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      phoneNumber,
      "admit_card_available",
      [studentName, registrationId],
      "ADMIT_CARD_NOTIFICATION"
    );
  }

  /**
   * Sends transactional Certificate release notification
   */
  public async sendCertificateAvailable(
    phoneNumber: string,
    studentName: string,
    registrationId: string
  ): Promise<boolean> {
    return this.sendTemplateMessage(
      phoneNumber,
      "certificate_available",
      [studentName, registrationId],
      "CERTIFICATE_NOTIFICATION"
    );
  }
}

export const whatsappService = new WhatsAppService();
