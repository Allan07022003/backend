const argon2 = require('argon2');
const mongoose = require('mongoose');
const Teacher = require('./src/models/teacher');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testRegister = async () => {
  try {
    const password = 'testpassword123';
    
    // Hasheamos la contraseña manualmente
    const hashedPassword = await argon2.hash(password);
    console.log('Contraseña hasheada:', hashedPassword);

    // Realizamos la comparación inmediata (sin interacción con MongoDB)
    const isMatchImmediately = await argon2.verify(hashedPassword, password);
    console.log('Comparación inmediata después de hashear:', isMatchImmediately);

    // Verificamos si el correo ya existe en la base de datos
    const existingTeacher = await Teacher.findOne({ email: 'testteacher@example.com' });
    if (existingTeacher) {
      console.log('El correo ya está registrado.');
      return;
    }

    // Creamos un nuevo profesor en la base de datos (sin hashear automáticamente)
    const newTeacher = new Teacher({
      name: 'Test Teacher',
      email: 'testteacher@example.com',
      password: hashedPassword,  // Ya está hasheada manualmente
      grade: '2nd Grade',
    });

    await newTeacher.save();
    console.log('Nuevo profesor registrado con éxito.');

    // Volvemos a recuperar al profesor desde la base de datos
    const savedTeacher = await Teacher.findOne({ email: 'testteacher@example.com' });
    console.log('Contraseña guardada en DB:', savedTeacher.password);

    // Comparación de la contraseña después de recuperarla de la DB
    const isMatchFromDB = await argon2.verify(savedTeacher.password, password);
    console.log('Comparación después de guardar en DB:', isMatchFromDB);
  } catch (error) {
    console.error('Error al registrar o comparar:', error);
  } finally {
    mongoose.connection.close();
  }
};

testRegister();
