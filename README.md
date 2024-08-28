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


# Pruebas para la Creación de un Profesor y Envío de Invitación:
Generar Token de Registro para el Profesor:

Ruta: POST https://localhost:5000/api/auth/generate-token
Cuerpo:
json

{
  "email": "profesor@example.com"
}
Resultado esperado: Un correo se envía al profesor con un enlace que contiene un token de registro.
Registro del Profesor Usando el Token:


Ruta: POST https://localhost:5000/api/auth/register
Cuerpo:
json
Copiar código
{
  "token": "TOKEN_GENERADO",
  "name": "Juan Pérez",
  "password": "12345678",
  "grade": "2nd Grade"
}
Resultado esperado: El profesor es registrado y se almacena en la base de datos.
Inicio de Sesión del Profesor:

Ruta: POST https://localhost:5000/api/auth/login
Cuerpo:
json
Copiar código
{
  "email": "profesor@example.com",
  "password": "12345678"
}
Resultado esperado: Se devuelve un token JWT para el profesor.

2. Pruebas para la Creación y Gestión del Estudiante:
Registro del Estudiante:

Ruta: POST https://localhost:5000/api/students/register
Cuerpo:
json
Copiar código
{
  "email": "estudiante@example.com",
  "password": "contraseña123"
}
Resultado esperado: El estudiante se registra con solo correo y contraseña.
Inicio de Sesión del Estudiante:

Ruta: POST https://localhost:5000/api/students/login
Cuerpo:
json
Copiar código
{
  "email": "estudiante@example.com",
  "password": "contraseña123"
}
Resultado esperado: Se devuelve un token JWT para el estudiante.
Completar el Perfil del Estudiante:

Ruta: PUT https://localhost:5000/api/students/complete-profile
Headers: Authorization: Bearer <TOKEN_DEL_ESTUDIANTE>
Cuerpo:
json
Copiar código
{
  "name": "Pedro González",
  "age": 7,
  "grade": "2nd Grade"
}
Resultado esperado: El perfil del estudiante se completa y se asigna automáticamente al profesor de 2do grado.
3. Pruebas de Rutas Protegidas:
Obtener la Lista de Estudiantes (Solo Accesible con Autenticación):

Ruta: GET https://localhost:5000/api/students
Headers: Authorization: Bearer <TOKEN_DEL_PROFESOR>
Resultado esperado: El profesor puede ver todos los estudiantes registrados bajo su supervisión.

