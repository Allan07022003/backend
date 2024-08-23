const nodemailer = require('nodemailer');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

async function sendTestEmail() {
  // Configuración del transporte SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Host para Gmail
    port: 465, // Puerto para SSL
    secure: true, // Usar SSL
    auth: {
      user: process.env.EMAIL_USER, // Tu correo de Gmail
      pass: process.env.EMAIL_PASS, // Contraseña de aplicación generada
    },
    tls: {
      rejectUnauthorized: false, // Ayuda a evitar problemas con certificados SSL en desarrollo
    },
  });

  // Configuración del correo
  const mailOptions = {
    from: process.env.EMAIL_USER, // Correo del remitente
    to: 'alopezl62@miumg.edu.gt', // Cambia esto por el correo donde quieres enviar la prueba
    subject: 'Prueba de nodemailer',
    text: 'Este es un correo de prueba enviado desde nodemailer.', // Mensaje de prueba
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: %s', info.messageId);
  } catch (error) {
    console.error('Error enviando correo: ', error);
  }
}

sendTestEmail();
