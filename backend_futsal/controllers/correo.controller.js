const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Mensaje = require('../models/mensaje.model');
const db = require('../config/database'); 

dotenv.config();

console.log("🟢 EMAIL_FROM:", process.env.EMAIL_USER);
console.log("🟢 EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // ⚠️ Solo para desarrollo local
  }
});

exports.enviarCorreoPersonalizado = (req, res) => {
  const { nombreRemitente, destinatario, contenido } = req.body;

  if (!nombreRemitente || !destinatario || !contenido) {
    return res.status(400).json({ error: 'Faltan datos necesarios.' });
  }

  const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  const cuerpo = `De: ${nombreRemitente}\nFecha: ${fecha}\nMensaje: ${contenido}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: 'Mensaje personal de Futsal Life',
    text: cuerpo
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error al enviar correo:', error.message);
      return res.status(500).json({ error: 'Error al enviar correo' });
    }

    console.log('📧 Correo enviado:', info.response);

    // 🔍 Buscar ID del destinatario en la base de datos por correo
    const buscarUsuario = `SELECT Id_Usuario FROM usuario WHERE Correo = ? LIMIT 1`;
    db.query(buscarUsuario, [destinatario], (err, result) => {
      if (err || result.length === 0) {
        console.warn('⚠️ El correo se envió, pero no se encontró el usuario para registrar el mensaje.');
        return res.json({ success: true, mensaje: 'Correo enviado, pero no se guardó el mensaje.' });
      }

      const idReceptor = result[0].Id_Usuario;
      const idEmisor = 1; // Puedes cambiarlo luego por el ID real del usuario autenticado

      // ✅ Guardar el mensaje en la base de datos
      Mensaje.enviar(idEmisor, idReceptor, contenido, (err2) => {
        if (err2) {
          console.error('❌ Error al guardar el mensaje en BD:', err2);
        } else {
          console.log('🟢 Mensaje guardado en base de datos');
        }

        return res.json({ success: true, mensaje: 'Correo enviado y mensaje registrado' });
      });
    });
  });
};
