const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

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
