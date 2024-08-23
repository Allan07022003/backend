const bcrypt = require('bcryptjs');

const password = '33430250';

(async () => {
  // Genera el hash manualmente
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Contraseña hashada manualmente:', hashedPassword);

  // Intenta comparar la contraseña con el hash generado
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('¿Las contraseñas coinciden?', isMatch);
})();
