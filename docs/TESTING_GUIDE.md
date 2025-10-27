# 🧪 Guía de Pruebas - Sistema de Autenticación Carmot

## 📋 **Configuración para Pruebas**

### **1. Backend Requerido**
- **URL Base:** `http://127.0.0.1:8000/api`
- **Endpoints disponibles:**
  - `POST /login` - Iniciar sesión
  - `POST /logout` - Cerrar sesión  
  - `GET /user` - Obtener información del usuario

### **2. Usuarios de la API**
- **Usar credenciales** de usuarios existentes en la base de datos
- **Verificar permisos** según el rol del usuario
- **Probar diferentes roles** para validar acceso

## 🔒 **Seguridad Implementada**

### **Almacenamiento Seguro**
- ✅ **sessionStorage** en lugar de localStorage
- ✅ **Expiración automática** al cerrar la pestaña
- ✅ **Protección mejorada** contra ataques XSS
- ✅ **Tokens JWT** con expiración controlada

### **Manejo de Tokens**
- ✅ **Bearer tokens** en headers de autorización
- ✅ **Refresh automático** cuando expiran
- ✅ **Limpieza automática** en logout
- ✅ **Redirección segura** en caso de token inválido

## 🚀 **Cómo Probar**

### **Paso 1: Iniciar la Aplicación**
```bash
npm run dev
```
- **URL:** `http://localhost:5173`

### **Paso 2: Probar Login**
1. **Acceder a la página de login**
2. **Ingresar credenciales** de un usuario existente en la API
3. **Verificar que el login funcione correctamente**

### **Paso 3: Verificar Funcionalidades**
- ✅ **Login exitoso** - Redirección al dashboard
- ✅ **Información del usuario** - Mostrar nombre y rol
- ✅ **Protección de rutas** - No acceso sin autenticación
- ✅ **Logout** - Limpieza de sesión
- ✅ **Manejo de errores** - Mensajes claros

## 🔍 **Casos de Prueba**

### **Login Exitoso**
```javascript
// Credenciales válidas (usar usuario existente en la API)
{
  email: "usuario@ejemplo.com",
  password: "contraseña123"
}

// Respuesta esperada:
{
  message: "Inicio de sesión exitoso",
  access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  token_type: "Bearer"
}
```

### **Login Fallido**
```javascript
// Credenciales inválidas
{
  email: "usuario@ejemplo.com",
  password: "contraseña_incorrecta"
}

// Respuesta esperada:
{
  message: "Credenciales incorrectas",
  errors: {
    email: ["Las credenciales proporcionadas no coinciden con nuestros registros."]
  }
}
```

### **Verificación de Usuario**
```javascript
// GET /user (con token Bearer)
// Respuesta esperada:
{
  id: 1,
  name: "Usuario Ejemplo",
  email: "usuario@ejemplo.com",
  documento: "12345678",
  // ... otros campos del usuario
}
```

## 🛠️ **Configuración de Desarrollo**

### **Variables de Entorno**
Crear archivo `.env.local`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=Carmot Dashboard
VITE_APP_VERSION=1.0.0
```

### **Configuración de CORS**
Asegurar que el backend tenga CORS configurado para:
- **Origin:** `http://localhost:5173`
- **Methods:** `GET, POST, PUT, DELETE, OPTIONS`
- **Headers:** `Authorization, Content-Type, Accept`

## 🐛 **Solución de Problemas**

### **Error de Conexión**
```
❌ Error de conexión. Verifica tu conexión a internet.
```
**Solución:**
1. Verificar que el backend esté ejecutándose
2. Revisar la URL en `.env.local`
3. Verificar CORS en el backend

### **Error 401 - No Autorizado**
```
❌ No autorizado. Por favor, inicia sesión nuevamente.
```
**Solución:**
1. Verificar credenciales
2. Revisar logs del backend
3. Limpiar localStorage y reintentar

### **Error 422 - Validación**
```
❌ Datos de validación incorrectos
```
**Solución:**
1. Verificar formato del email
2. Revisar longitud de contraseña
3. Comprobar campos requeridos

## 📊 **Monitoreo de Pruebas**

### **Console del Navegador**
- ✅ **Requests HTTP** - Ver peticiones a la API
- ✅ **Responses** - Ver respuestas del servidor
- ✅ **Errores** - Ver errores de autenticación
- ✅ **Tokens** - Verificar tokens JWT

### **Network Tab**
- ✅ **Status Codes** - 200, 401, 422, 500
- ✅ **Headers** - Authorization, Content-Type
- ✅ **Payload** - Datos enviados y recibidos

## 🎯 **Próximos Pasos**

Una vez que las pruebas de autenticación sean exitosas:

1. **Sistema de KPIs** - Constructor y gestión
2. **Dashboard avanzado** - Gráficos y visualizaciones  
3. **Filtros dinámicos** - Para análisis de datos

## 📞 **Soporte**

Si encuentras problemas durante las pruebas:
1. Revisar logs del backend
2. Verificar configuración de CORS
3. Comprobar que los usuarios existan en la base de datos
4. Contactar al equipo de desarrollo
