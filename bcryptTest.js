const bcrypt = require('bcryptjs');

// Contraseña original
const enteredPassword = '33430250';
// Hash de la contraseña almacenada en la base de datos
const storedPasswordHash = '$2a$10$7ZLaeGs2On9Kd/rTFUlw0egSt1iLc5INA4UqkmABJjy7YTdjOVy/O';

(async () => {
  const isMatch = await bcrypt.compare(enteredPassword, storedPasswordHash);
  console.log('¿Las contraseñas coinciden?', isMatch);
})();
