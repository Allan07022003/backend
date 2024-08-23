const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  age: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [6, 'La edad mínima es 6 años'],
  },
  grade: {
    type: String,
    required: [true, 'El grado es obligatorio'],
  },
  progress: {
    type: Map, // Almacena el progreso por curso, clave-valor
    of: Number,
    default: {},
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
