import { Injectable } from '@nestjs/common';
import {
    WelcomeEmailData,
    LoginAlertData,
    PasswordChangeAlertData,
    PasswordResetData,
} from '../interfaces/email.interface';

@Injectable()
export class EmailTemplatesService {
    getWelcomeEmailTemplate(data: WelcomeEmailData): string {
        const currentYear = new Date().getFullYear();

        return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a El Descuevee</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background-color: #00265b; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .header p { color: #fc9430; margin: 10px 0 0; font-size: 14px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #00265b; margin-top: 0; font-size: 24px; }
    .content p { color: #555555; line-height: 1.6; margin-bottom: 20px; }
    .highlight { background-color: #f8f9ff; padding: 20px; border-left: 4px solid #fc9430; margin: 20px 0; }
    .button { display: inline-block; background-color: #fc9430; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { background-color: #f8f9ff; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #e0e0e0; }
    .social-links a { color: #fc9430; text-decoration: none; margin: 0 10px; }
    @media (max-width: 480px) {
      .content { padding: 20px; }
      .header h1 { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EL DESCUVEE</h1>
      <p>Ropa Corporativa y Bordado Profesional</p>
    </div>
    <div class="content">
      <h2>¡Bienvenido(a) ${data.name}!</h2>
      <p>Gracias por registrarte en <strong>El Descuevee</strong>. Estamos muy contentos de tenerte como parte de nuestra comunidad corporativa.</p>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>📋 Tu cuenta ha sido creada exitosamente con el email:</strong><br>
        ${data.email}</p>
        ${data.company ? `<p style="margin: 10px 0 0;"><strong>🏢 Empresa:</strong> ${data.company}</p>` : ''}
      </div>
      
      <p>Con tu cuenta podrás:</p>
      <ul style="color: #555555; line-height: 1.8;">
        <li>✅ Cotizar y comprar ropa corporativa</li>
        <li>✅ Ver precios especiales B2B</li>
        <li>✅ Solicitar bordado de logos personalizados</li>
        <li>✅ Dar seguimiento a tus pedidos</li>
      </ul>
      
      <p>Si tienes alguna pregunta o necesitas cotizar un pedido especial, no dudes en contactarnos por WhatsApp al <strong>+56 9 8765 4321</strong>.</p>
      
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/catalogo" class="button">VER CATÁLOGO</a>
      </div>
      
      <p>¡Estamos para ayudarte a potenciar la imagen de tu equipo!</p>
      <p>Saludos cordiales,<br><strong>Equipo El Descuevee</strong></p>
    </div>
    <div class="footer">
      <p>El Descuevee SpA - RUT: 77.123.456-7</p>
      <p>Av. Los Pioneros 1234, La Serena, Chile</p>
      <p>📧 contacto@eldescuevee.cl | 📞 +56 51 234 5678</p>
      <div class="social-links">
        <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">LinkedIn</a>
      </div>
      <p style="margin-top: 15px;">&copy; ${currentYear} El Descuevee. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
    `;
    }

    getLoginAlertTemplate(data: LoginAlertData): string {
        const currentYear = new Date().getFullYear();

        return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Inicio de Sesión - El Descuevee</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background-color: #00265b; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .alert-box { background-color: #fff3e0; border-left: 4px solid #fc9430; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .info-label { font-weight: bold; color: #00265b; }
    .info-value { color: #555555; }
    .warning { background-color: #fee2e2; border-left-color: #dc2626; padding: 15px; margin-top: 20px; }
    .button { display: inline-block; background-color: #fc9430; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; }
    .footer { background-color: #f8f9ff; padding: 20px; text-align: center; font-size: 12px; color: #777777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EL DESCUVEE</h1>
    </div>
    <div class="content">
      <h2>🔐 Nuevo inicio de sesión detectado</h2>
      <p>Hola <strong>${data.name}</strong>,</p>
      <p>Se ha detectado un inicio de sesión en tu cuenta de <strong>El Descuevee</strong>. Si fuiste tú, puedes ignorar este mensaje.</p>
      
      <div class="alert-box">
        <h3 style="margin-top: 0; color: #00265b;">Detalles del acceso:</h3>
        <div class="info-row">
          <span class="info-label">📧 Email:</span>
          <span class="info-value">${data.email}</span>
        </div>
        <div class="info-row">
          <span class="info-label">⏰ Fecha y hora:</span>
          <span class="info-value">${new Date(data.timestamp).toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">🌐 Dirección IP:</span>
          <span class="info-value">${data.ip}</span>
        </div>
        <div class="info-row">
          <span class="info-label">💻 Dispositivo/Navegador:</span>
          <span class="info-value">${data.userAgent}</span>
        </div>
        ${data.location ? `<div class="info-row">
          <span class="info-label">📍 Ubicación aproximada:</span>
          <span class="info-value">${data.location}</span>
        </div>` : ''}
      </div>
      
      <p>Si <strong>NO RECONOCES</strong> este acceso, te recomendamos:</p>
      <ul>
        <li>🔒 Cambiar tu contraseña inmediatamente</li>
        <li>📞 Contactarnos al +56 9 8765 4321</li>
        <li>✉️ Responder a este correo para reportar actividad sospechosa</li>
      </ul>
      
      ${data.ip !== '127.0.0.1' && !data.ip?.startsWith('192.168') ? `
      <div class="warning">
        <strong>⚠️ ¿No reconoces este inicio de sesión?</strong><br>
        Alguien más podría haber accedido a tu cuenta. Cambia tu contraseña ahora mismo.
      </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/cambiar-contrasena" class="button">CAMBIAR CONTRASEÑA</a>
      </div>
    </div>
    <div class="footer">
      <p>Este es un correo automático de seguridad. Si no reconoces esta actividad, contacta con nosotros inmediatamente.</p>
      <p>&copy; ${currentYear} El Descuevee - Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>
    `;
    }

    getPasswordChangeAlertTemplate(data: PasswordChangeAlertData): string {
        const currentYear = new Date().getFullYear();

        return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contraseña Actualizada - El Descuevee</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background-color: #00265b; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; }
    .content { padding: 40px 30px; }
    .success-box { background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; }
    .info-row { padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .button { display: inline-block; background-color: #fc9430; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; }
    .footer { background-color: #f8f9ff; padding: 20px; text-align: center; font-size: 12px; color: #777777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EL DESCUVEE</h1>
    </div>
    <div class="content">
      <h2>🔒 Tu contraseña ha sido actualizada</h2>
      <p>Hola <strong>${data.name}</strong>,</p>
      <p>Te confirmamos que la contraseña de tu cuenta en <strong>El Descuevee</strong> ha sido cambiada exitosamente.</p>
      
      <div class="success-box">
        <h3 style="margin-top: 0; color: #2e7d32;">✅ Cambio realizado con éxito</h3>
        <div class="info-row">
          <strong>📧 Email:</strong> ${data.email}
        </div>
        <div class="info-row">
          <strong>⏰ Fecha y hora:</strong> ${new Date(data.timestamp).toLocaleString('es-CL', { timeZone: 'America/Santiago' })}
        </div>
        <div class="info-row">
          <strong>🌐 IP desde donde se realizó el cambio:</strong> ${data.ip}
        </div>
      </div>
      
      <p>Si <strong>FUISTE TÚ</strong> quien realizó este cambio, no necesitas hacer nada más.</p>
      
      <p>Si <strong>NO REALIZASTE</strong> este cambio, por favor:</p>
      <ul>
        <li>🔐 Restablece tu contraseña inmediatamente usando el enlace de "Olvidé mi contraseña"</li>
        <li>📞 Contáctanos por WhatsApp al +56 9 8765 4321</li>
      </ul>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/login" class="button">INICIAR SESIÓN</a>
      </div>
    </div>
    <div class="footer">
      <p>¿No realizaste este cambio? Contacta con nuestro soporte inmediatamente.</p>
      <p>&copy; ${currentYear} El Descuevee - Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>
    `;
    }

    getPasswordResetTemplate(data: PasswordResetData): string {
        const currentYear = new Date().getFullYear();

        return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña - El Descuevee</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background-color: #00265b; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; }
    .content { padding: 40px 30px; }
    .reset-box { background-color: #fff3e0; border-left: 4px solid #fc9430; padding: 20px; margin: 20px 0; text-align: center; }
    .button { display: inline-block; background-color: #fc9430; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 5px; font-weight: bold; margin: 20px 0; font-size: 16px; }
    .warning { background-color: #fee2e2; padding: 15px; margin-top: 20px; font-size: 13px; }
    .footer { background-color: #f8f9ff; padding: 20px; text-align: center; font-size: 12px; color: #777777; }
    .token { font-family: monospace; background-color: #f0f0f0; padding: 8px; border-radius: 4px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EL DESCUVEE</h1>
      <p>Recuperación de Contraseña</p>
    </div>
    <div class="content">
      <h2>🔐 Solicitud de recuperación de contraseña</h2>
      <p>Hola <strong>${data.name}</strong>,</p>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>El Descuevee</strong>.</p>
      
      <div class="reset-box">
        <p style="margin-bottom: 10px;">Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <a href="${data.resetUrl}" class="button">RESTABLECER CONTRASEÑA</a>
        <p style="font-size: 12px; margin-top: 15px;">O copia y pega este enlace en tu navegador:</p>
        <p class="token">${data.resetUrl}</p>
      </div>
      
      <p><strong>⚠️ Importante:</strong></p>
      <ul>
        <li>Este enlace expirará en <strong>1 hora</strong> por razones de seguridad</li>
        <li>Si no solicitaste este cambio, ignora este mensaje</li>
        <li>Tu contraseña actual seguirá funcionando hasta que la cambies</li>
      </ul>
      
      <div class="warning">
        <strong>🔒 Consejo de seguridad:</strong> Elige una contraseña segura que no uses en otros sitios web. Combina mayúsculas, minúsculas, números y símbolos.
      </div>
      
      <p style="margin-top: 25px;">Si tienes problemas con el botón, copia y pega el enlace en tu navegador.</p>
      
      <p>Saludos,<br><strong>Equipo de Seguridad - El Descuevee</strong></p>
    </div>
    <div class="footer">
      <p>¿No solicitaste este cambio? Puedes ignorar este correo de forma segura.</p>
      <p>&copy; ${currentYear} El Descuevee - Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>
    `;
    }
}