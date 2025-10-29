# 📁 Estructura de Vistas - Carmot Frontend

## 🗂️ **Organización por Módulos**

Las vistas están organizadas por módulos funcionales para facilitar el mantenimiento y desarrollo:

```
src/views/
├── auth/                    # 🔐 Módulo de Autenticación
│   └── Login.vue           # Página de inicio de sesión
 
└── common/                 # 🔧 Vistas Comunes
    └── NotFound.vue        # Página 404
```

## 📋 **Descripción de Módulos**

### **🔐 auth/ - Autenticación**
- **Propósito:** Manejo de autenticación y autorización
- **Vistas:**
  - `Login.vue` - Formulario de inicio de sesión
- **Características:**
  - Validación de formularios
  - Manejo de errores
  - Diseño responsivo
  - Integración con API

 

### **🔧 common/ - Vistas Comunes**
- **Propósito:** Vistas compartidas y de utilidad
- **Vistas:**
  - `NotFound.vue` - Página de error 404
- **Características:**
  - Manejo de errores
  - Navegación de respaldo
  - Diseño consistente

## 🚀 **Próximas Vistas**

### **En Desarrollo:**
 

### **Planificadas:**
- `reports/` - Módulo de reportes
- `settings/` - Configuración del sistema
- `users/` - Gestión de usuarios
- `profile/` - Perfil de usuario

## 🔧 **Configuración de Rutas**

Las rutas están configuradas en `src/router/index.js`:

```javascript
// Rutas de autenticación
'/login' → '@/views/auth/Login.vue'

 

// Rutas comunes
'/:pathMatch(.*)*' → '@/views/common/NotFound.vue'
```

## 📝 **Convenciones de Nomenclatura**

### **Archivos:**
- **PascalCase** para nombres de componentes Vue
- **Descriptivo** del propósito de la vista
- **Consistente** con el módulo correspondiente

### **Carpetas:**
- **lowercase** para nombres de módulos
- **Singular** para módulos principales
- **Descriptivo** del dominio funcional

## 🎯 **Beneficios de esta Estructura**

### **Para Desarrolladores:**
- ✅ **Fácil localización** de archivos
- ✅ **Separación clara** de responsabilidades
- ✅ **Escalabilidad** para nuevos módulos
- ✅ **Mantenimiento** simplificado

### **Para el Proyecto:**
- ✅ **Organización profesional**
- ✅ **Estructura estándar** de la industria
- ✅ **Facilita colaboración** en equipo
- ✅ **Preparado para crecimiento**

## 🔄 **Migración Completada**

### **Archivos Movidos:**
- ✅ `Login.vue` → `auth/Login.vue`
- ✅ `NotFound.vue` → `common/NotFound.vue`

### **Rutas Actualizadas:**
- ✅ Router configurado con nuevas rutas
- ✅ Imports actualizados
- ✅ Navegación funcional

---

**Última actualización:** Octubre 2024  
**Versión:** 1.0.0
