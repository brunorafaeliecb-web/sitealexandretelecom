import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send 2FA code via email
 */
export async function send2FACode(email: string, code: string, userName?: string): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: "MelhorPlano <onboarding@resend.dev>",
      to: email,
      subject: "Seu código de autenticação - MelhorPlano",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background-color: #FAF8F5;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #00D4E8 0%, #A855F7 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .content {
                padding: 40px 20px;
                text-align: center;
              }
              .content p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 20px 0;
              }
              .code-box {
                background-color: #FAF8F5;
                border: 2px solid #00D4E8;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
              }
              .code {
                font-size: 48px;
                font-weight: bold;
                color: #00D4E8;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
              }
              .warning {
                background-color: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
                border-radius: 4px;
              }
              .warning p {
                margin: 0;
                color: #92400E;
                font-size: 14px;
              }
              .footer {
                background-color: #F3F4F6;
                padding: 20px;
                text-align: center;
                color: #999;
                font-size: 12px;
              }
              .footer p {
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Código de Autenticação</h1>
              </div>
              <div class="content">
                <p>Olá${userName ? `, ${userName}` : ""}!</p>
                <p>Você solicitou um código de autenticação para acessar sua conta MelhorPlano.</p>
                
                <div class="code-box">
                  <div class="code">${code}</div>
                </div>
                
                <p style="color: #999; font-size: 14px;">Este código expira em 10 minutos</p>
                
                <div class="warning">
                  <p><strong>⚠️ Aviso de Segurança:</strong> Nunca compartilhe este código com ninguém. MelhorPlano nunca pedirá seu código por email ou telefone.</p>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">Se você não solicitou este código, ignore este email.</p>
              </div>
              <div class="footer">
                <p>© 2024 MelhorPlano.net - Todos os direitos reservados</p>
                <p>Este é um email automático, por favor não responda.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (result.error) {
      console.error("[Email] Failed to send 2FA code:", result.error);
      return false;
    }

    console.log("[Email] 2FA code sent successfully to", email);
    return true;
  } catch (error) {
    console.error("[Email] Error sending 2FA code:", error);
    return false;
  }
}

/**
 * Send admin approval notification
 */
export async function sendAdminApprovalEmail(
  email: string,
  userName: string,
  loginUrl: string
): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: "MelhorPlano <onboarding@resend.dev>",
      to: email,
      subject: "Sua solicitação de acesso foi aprovada! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background-color: #FAF8F5;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #00D4E8 0%, #A855F7 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .content {
                padding: 40px 20px;
                text-align: center;
              }
              .content p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #00D4E8 0%, #A855F7 100%);
                color: white;
                padding: 12px 30px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin: 30px 0;
              }
              .footer {
                background-color: #F3F4F6;
                padding: 20px;
                text-align: center;
                color: #999;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Acesso Aprovado!</h1>
              </div>
              <div class="content">
                <p>Olá ${userName}!</p>
                <p>Sua solicitação de acesso ao painel de administração foi <strong>aprovada</strong>! 🎉</p>
                <p>Agora você pode acessar todas as funcionalidades de administração.</p>
                
                <a href="${loginUrl}" class="button">Acessar Painel Admin</a>
                
                <p style="color: #999; font-size: 14px;">Se o botão acima não funcionar, copie e cole este link no seu navegador:</p>
                <p style="color: #00D4E8; font-size: 12px; word-break: break-all;">${loginUrl}</p>
              </div>
              <div class="footer">
                <p>© 2024 MelhorPlano.net - Todos os direitos reservados</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (result.error) {
      console.error("[Email] Failed to send approval email:", result.error);
      return false;
    }

    console.log("[Email] Approval email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("[Email] Error sending approval email:", error);
    return false;
  }
}

/**
 * Send admin rejection notification
 */
export async function sendAdminRejectionEmail(
  email: string,
  userName: string,
  reason?: string
): Promise<boolean> {
  try {
    const result = await resend.emails.send({
      from: "MelhorPlano <onboarding@resend.dev>",
      to: email,
      subject: "Sua solicitação de acesso foi revisada",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background-color: #FAF8F5;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
              }
              .content {
                padding: 40px 20px;
                text-align: center;
              }
              .content p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
              }
              .footer {
                background-color: #F3F4F6;
                padding: 20px;
                text-align: center;
                color: #999;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📋 Solicitação Revisada</h1>
              </div>
              <div class="content">
                <p>Olá ${userName}!</p>
                <p>Sua solicitação de acesso ao painel de administração foi <strong>revisada</strong>.</p>
                ${reason ? `<p style="color: #666; margin: 20px 0;"><strong>Motivo:</strong> ${reason}</p>` : ""}
                <p>Se você tiver dúvidas, entre em contato conosco.</p>
              </div>
              <div class="footer">
                <p>© 2024 MelhorPlano.net - Todos os direitos reservados</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (result.error) {
      console.error("[Email] Failed to send rejection email:", result.error);
      return false;
    }

    console.log("[Email] Rejection email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("[Email] Error sending rejection email:", error);
    return false;
  }
}
