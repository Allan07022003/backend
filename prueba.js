const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    logger: true, // Habilitar depuración
    debug: true,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'alopezl62@miumg.edu.gt',
    subject: 'Prueba de envío',
    text: 'Este es un mensaje de prueba.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
}

sendTestEmail();
