const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1); // Detiene la aplicación en caso de error
  }
};

module.exports = connectDB;
