const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar el cliente de Google Cloud Text-to-Speech
const textToSpeech = require('@google-cloud/text-to-speech');

const app = express();

// Configurar el limitador de tasa antes de las rutas
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde',
});
app.use(limiter);

// Conectar a MongoDB Atlas
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar el cliente de Google Cloud Text-to-Speech usando las variables de entorno
const ttsClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// Ruta para utilizar Text-to-Speech
app.post('/api/speak', async (req, res) => {
  const { text } = req.body; // El texto que queremos convertir en voz
  const request = {
    input: { text },
    voice: {
      languageCode: 'es-ES', // Voz en español
      ssmlGender: 'FEMALE',  // Voz femenina
    },
    audioConfig: { audioEncoding: 'MP3' }, // Formato de salida
  };

  try {
    // Solicitud a la API de Google Cloud Text-to-Speech
    const [response] = await ttsClient.synthesizeSpeech(request);

    // Devolver el contenido de audio como respuesta
    res.set('Content-Type', 'audio/mp3');
    res.send(response.audioContent);
  } catch (error) {
    console.error('Error con Text-to-Speech:', error);
    res.status(500).send('Error al generar la voz');
  }
});

// Rutas
app.use('/api/students', require('./routes/studentRoutes')); // Rutas para estudiantes
app.use('/api/auth', require('./routes/authRoutes')); // Rutas de autenticación
app.use('/api/teachers', require('./routes/teacherRoutes')); // Rutas para gestión de profesores

// Ruta básica
app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend Montessori!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
