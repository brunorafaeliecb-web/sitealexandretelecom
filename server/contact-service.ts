import { Resend } from "resend";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { siteSettings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const resend = new Resend(ENV.resendApiKey);

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Obter email de contato configurado no admin
 */
async function getContactEmail(): Promise<string> {
  try {
    const db = await getDb();
    if (!db) return ENV.ownerEmail;

    const setting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.section, "contact_email"))
      .limit(1);

    if (setting.length > 0 && setting[0].content) {
      const content = setting[0].content as any;
      return content.email || ENV.ownerEmail;
    }

    return ENV.ownerEmail;
  } catch (error) {
    console.error("[Contact Email] Error fetching contact email:", error);
    return ENV.ownerEmail;
  }
}

/**
 * Obter configurações de WhatsApp para email de confirmação
 */
async function getWhatsAppSettings(): Promise<{ phoneNumber: string; defaultMessage: string }> {
  try {
    const db = await getDb();
    if (!db) return { phoneNumber: "5521986961362", defaultMessage: "Olá, gostaria de falar sobre meu contato" };

    const setting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.section, "whatsapp_config"))
      .limit(1);

    if (setting.length > 0 && setting[0].content) {
      const content = setting[0].content as any;
      return {
        phoneNumber: content.phoneNumber || "5521986961362",
        defaultMessage: content.defaultMessage || "Olá, gostaria de falar sobre meu contato",
      };
    }

    return { phoneNumber: "5521986961362", defaultMessage: "Olá, gostaria de falar sobre meu contato" };
  } catch (error) {
    console.error("[Contact Email] Error fetching WhatsApp settings:", error);
    return { phoneNumber: "5521986961362", defaultMessage: "Olá, gostaria de falar sobre meu contato" };
  }
}

/**
 * Enviar email de contato via Resend
 * Envia para o email configurado no admin
 */
export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    const { name, email, phone, subject, message } = data;
    const contactEmail = await getContactEmail();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
            .header { background: linear-gradient(135deg, #00D4E8 0%, #A855F7 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #00D4E8; }
            .field { margin-bottom: 15px; }
            .label { font-weight: 600; color: #1F2937; margin-bottom: 5px; }
            .value { color: #6B7280; word-break: break-word; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #9CA3AF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📧 Novo Contato do Site</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">MelhoresPlanos.net</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">👤 Nome:</div>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
              </div>
              
              ${phone ? `
              <div class="field">
                <div class="label">📱 Telefone:</div>
                <div class="value"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">📝 Assunto:</div>
                <div class="value">${escapeHtml(subject)}</div>
              </div>
              
              <div class="field">
                <div class="label">💬 Mensagem:</div>
                <div class="value" style="white-space: pre-wrap;">${escapeHtml(message)}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Este email foi enviado automaticamente pelo formulário de contato do site MelhoresPlanos.net</p>
              <p>Enviado em: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: "contato@melhoresplanos.net",
      to: contactEmail,
      replyTo: email,
      subject: `[MelhoresPlanos] ${subject}`,
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Contact Email] Error:", result.error);
      return false;
    }

    console.log("[Contact Email] Sent successfully:", result.data?.id);
    return true;
  } catch (error) {
    console.error("[Contact Email] Exception:", error);
    return false;
  }
}

/**
 * Enviar email de confirmação para o usuário
 */
export async function sendContactConfirmationEmail(email: string, name: string): Promise<boolean> {
  try {
    const whatsappSettings = await getWhatsAppSettings();
    const encodedMessage = encodeURIComponent(whatsappSettings.defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappSettings.phoneNumber}?text=${encodedMessage}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
            .header { background: linear-gradient(135deg, #00D4E8 0%, #A855F7 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
            .content { background: white; padding: 20px; border-radius: 8px; }
            .message { color: #6B7280; margin-bottom: 20px; }
            .cta { text-align: center; margin: 20px 0; }
            .cta-button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #00D4E8 0%, #A855F7 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #9CA3AF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">✅ Mensagem Recebida!</h2>
            </div>
            
            <div class="content">
              <p class="message">Olá <strong>${escapeHtml(name)}</strong>,</p>
              
              <p class="message">
                Obrigado por entrar em contato conosco! Recebemos sua mensagem e em breve um de nossos especialistas entrará em contato com você.
              </p>
              
              <p class="message">
                Se você tiver alguma dúvida urgente, pode nos contatar via WhatsApp:
              </p>
              
              <div class="cta">
                <a href="${whatsappUrl}" class="cta-button">
                  💬 Conversar no WhatsApp
                </a>
              </div>
              
              <p class="message" style="font-size: 14px; color: #9CA3AF;">
                <strong>Detalhes da sua mensagem:</strong><br>
                Email: ${escapeHtml(email)}<br>
                Data: ${new Date().toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 MelhoresPlanos.net — Todos os direitos reservados</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: "contato@melhoresplanos.net",
      to: email,
      subject: "✅ Recebemos sua mensagem - MelhoresPlanos",
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Contact Confirmation] Error:", result.error);
      return false;
    }

    console.log("[Contact Confirmation] Sent successfully:", result.data?.id);
    return true;
  } catch (error) {
    console.error("[Contact Confirmation] Exception:", error);
    return false;
  }
}

/**
 * Escapar HTML para evitar XSS
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
