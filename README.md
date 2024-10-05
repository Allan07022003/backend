# Montessori Digitalización

Este proyecto digitaliza algunas actividades del método Montessori para niños de 6 a 8 años, proporcionando una interfaz para maestros que les permite gestionar el progreso de los estudiantes.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nombre-del-proyecto.git

Instala las dependencias:
cd nombre-del-proyecto
npm install
Configura las variables de entorno en un archivo .env (ver sección de Configuración).

Ejecuta el servidor:
npm start```plaintext
# Node.js dependencies
node_modules/

# Environment variables
.env

# SSL keys and certificates
server.key
server.cert

# Logs
logs/
*.log
npm-debug.log*

# Sistema operativo y editor
.DS_Store
Thumbs.db
.vscode/

# Builds
dist/
build/

# La configuración del servidor de envío de correos para la invitaciónrofesor se realiza en el método generateTokenForTeacherRegistration de la clase AuthService. Aquí está el fragmento relevante del código:



# Registro de Profesor con Token
Ruta: POST /api/auth/register
Cuerpo
{
  "token": "token_de_registro",
  "email": "profesor@example.com",
  "password": "contraseña123"
}

# Generar Token para Registro de Profesor
Ruta: POST /api/auth/generate-token


# Resultado esperado: Se genera y envía un token de registro al correo del profesor.
Cambiar Contraseña Temporal
Ruta: PUT /api/auth/change-password
Cuerpo

{
  "email": "profesor@example.com",
  "newPassword": "nuevaContraseña123"
}

Resultado esperado: La contraseña del profesor se actualiza correctamente.

# Completar el Perfil del Estudiante
Ruta: PUT /api/students/complete-profile
Headers: Authorization: Bearer <TOKEN_DEL_ESTUDIANTE>
Cuerpo
{
  "name": "Pedro González",
  "age": 7,
  "grade": "2nd Grade"
}

# Resultado esperado: El perfil del estudiante se completa y se asigna automáticamente al profesor de 2do grado.
Obtener la Lista de Estudiantes
Ruta: GET /api/students
Headers: Authorization: Bearer <TOKEN_DEL_PROFESOR>
# Resultado esperado: El profesor puede ver todos los estudiantes registrados bajo su supervisión.

# Profesores
Obtener la Lista de Profesores
Ruta: GET /api/teachers
Headers: Authorization: Bearer <TOKEN_DEL_ADMIN>
Resultado esperado: El administrador puede ver todos los profesores registrados.
# Middleware
Autenticación de Estudiantes
Archivo: src/middleware/authStudentMiddleware.js
Función: protectStudent
Descripción: Protege las rutas que solo pueden ser accedidas por estudiantes autenticados.
# Autenticación de Profesores
Archivo: src/middleware/authTeacherMiddleware.js
Función: protectTeacher
Descripción: Protege las rutas que solo pueden ser accedidas por profesores autenticados.
Autenticación General
Archivo: src/middleware/authMiddleware.js
# Función: protect
Descripción: Protege las rutas que pueden ser accedidas tanto por estudiantes como por profesores.
Servicios

# Servicio de Estudiantes
Archivo: src/service/studentService.js
Métodos:
findStudentByEmail(email): Busca un estudiante por email.
createStudent(data): Crea un nuevo estudiante.
getAllStudents(): Obtiene todos los estudiantes.
updateStudent(id, data): Actualiza un estudiante.
deleteStudent(id): Elimina un estudiante.
hashPassword(password): Hashea una contraseña.
verifyPassword(enteredPassword, storedPassword): Verifica una contraseña.
findStudentById(id): Busca un estudiante por ID.
findTeacherByGrade(grade): Busca un profesor por grado.

# Servicio de Profesores
Archivo: src/service/teacherService.js
Métodos:
findTeacherByEmail(email): Busca un profesor por email.
createTeacher(data): Crea un nuevo profesor.
getAllTeachers(): Obtiene todos los profesores.
updateTeacher(id, data): Actualiza un profesor.
deleteTeacher(id): Elimina un profesor.
hashPassword(password): Hashea una contraseña.
verifyPassword(enteredPassword, storedPassword): Verifica una contraseña.
findTeacherById(id): Busca un profesor por ID.

# Conexión a la Base de Datos
Archivo: src/config/db.js
Función: connectDB
Descripción: Conecta a la base de datos MongoDB.

# Servidor
Archivo: src/server.js
Descripción: Configura y levanta el servidor Express.




