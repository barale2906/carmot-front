# Carmot Frontend - Autenticación

## 📚 **Documentación**

Toda la documentación detallada se encuentra en la carpeta `docs/`:

- **[Guía de Pruebas](docs/TESTING_GUIDE.md)** - Testing del sistema de autenticación
- **[Configuración de Seguridad](docs/SECURITY_CONFIG.md)** - Mejores prácticas de seguridad  
- **[Guía de Responsive Design](docs/RESPONSIVE_GUIDE.md)** - Diseño responsivo y mobile-first
- **[Índice de Documentación](docs/README.md)** - Organización completa de docs

## 🚀 **Configuración Inicial**

### Prerrequisitos
- Node.js 20.19.0 o superior
- npm o yarn
- Backend Laravel ejecutándose en `http://127.0.0.1:8000`

### Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Crear archivo `.env.local` en la raíz del proyecto:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=Carmot Dashboard
VITE_APP_VERSION=1.0.0
```

3. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

4. **Acceder a la aplicación:**
- URL: `http://localhost:5173`
- Usar credenciales de usuarios existentes en la API

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── auth/           # Componentes de autenticación
│   └── common/         # Componentes comunes
├── composables/         # Composables Vue (lógica reutilizable)
├── router/             # Configuración de rutas
├── services/           # Servicios API
├── stores/            # Stores de Pinia
└── views/             # Vistas organizadas por módulos
    ├── auth/          # Vistas de autenticación
    
    └── common/        # Vistas comunes
```

## 🔐 Sistema de Autenticación

### Características Implementadas
- ✅ Login con email y contraseña
- ✅ Validación de formularios
- ✅ Manejo de tokens JWT
- ✅ Protección de rutas
- ✅ Interceptores de API
- ✅ **sessionStorage** para tokens (más seguro que localStorage)
- ✅ **Expiración automática** al cerrar la pestaña
- ✅ **Protección contra XSS** mejorada
- ✅ Refresh automático de tokens
- ✅ Logout seguro

### Endpoints de Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Obtener usuario actual
- `POST /auth/refresh` - Refrescar token

## 🛡️ Seguridad

### Validación de Permisos
- Cada endpoint valida permisos automáticamente
- Middleware de seguridad en el backend
- Tokens JWT con expiración
- Refresh automático de tokens

### Manejo de Errores
- Interceptores para errores HTTP
- Mensajes de error amigables
- Redirección automática en caso de token inválido

## 🎨 Diseño

### Características de UI/UX
- ✅ Diseño responsivo
- ✅ Tema moderno con gradientes
- ✅ Componentes accesibles
- ✅ Estados de carga
- ✅ Manejo de errores visual
- ✅ Navegación intuitiva

## 📊 Próximas Funcionalidades

- [ ] Nuevas vistas posteriores al login

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🐛 Solución de Problemas

### Error de Conexión API
1. Verificar que el backend esté ejecutándose
2. Revisar la URL en `.env.local`
3. Verificar CORS en el backend

### Error de Autenticación
1. Verificar credenciales
2. Revisar logs del backend
3. Limpiar localStorage y reintentar

### Problemas de Build
1. Limpiar `node_modules` y reinstalar
2. Verificar versiones de Node.js
3. Revisar errores de linting

## 📝 Notas de Desarrollo

- El proyecto usa Vue 3 con Composition API
- Pinia para manejo de estado global
- Vue Router para navegación
- Axios para peticiones HTTP
- Chart.js para gráficos (próximamente)

## 🤝 Contribución

1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commits descriptivos
3. Crear Pull Request con descripción detallada

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.