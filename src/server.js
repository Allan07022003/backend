const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const textToSpeech = require('@google-cloud/text-to-speech');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde',
});
app.use(limiter);

connectDB();

app.use(cors());
app.use(express.json());

const ttsClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

app.post('/api/speak', async (req, res) => {
  const { text } = req.body;

  const request = {
    input: { text },
    voice: {
      languageCode: 'es-US',  
      ssmlGender: 'FEMALE',   
      name: 'es-US-Standard-A', 
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  };

  try {
    const [response] = await ttsClient.synthesizeSpeech(request);

    res.set('Content-Type', 'audio/mp3');
    res.send(response.audioContent);
  } catch (error) {
    console.error('Error al generar la voz:', error);
    res.status(500).send('Error al generar la voz');
  }
});



app.use('/api/students', require('./routes/studentRoutes')); 
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/teachers', require('./routes/teacherRoutes')); 

app.get('/', (req, res) => {
  res.send('¡Bienvenido al backend Montessori!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
