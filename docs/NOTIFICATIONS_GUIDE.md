# 🔔 Sistema de Notificaciones - Carmot Frontend

## 📋 **Descripción General**

El sistema de notificaciones proporciona una forma elegante y consistente de mostrar mensajes al usuario, incluyendo errores del servidor, confirmaciones de éxito, advertencias e información general.

## 🎯 **Características Principales**

### **Tipos de Notificaciones**
- ✅ **Success** - Operaciones exitosas
- ❌ **Error** - Errores del servidor y validación
- ⚠️ **Warning** - Advertencias y alertas
- ℹ️ **Info** - Información general

### **Funcionalidades Avanzadas**
- ✅ **Auto-dismiss** con temporizador configurable
- ✅ **Persistent** para errores críticos
- ✅ **Acciones personalizadas** (ej: Reintentar)
- ✅ **Animaciones suaves** de entrada y salida
- ✅ **Responsive** para móviles y tablets
- ✅ **Manejo automático** de errores de API

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales**

#### **1. NotificationStore (Pinia)**
- **Ubicación:** `src/stores/notifications.js`
- **Propósito:** Gestión centralizada del estado de notificaciones
- **Responsabilidades:**
  - Almacenamiento de notificaciones
  - Auto-remoción con temporizador
  - Manejo de errores de API
  - Métodos de conveniencia

#### **2. useNotifications (Composable)**
- **Ubicación:** `src/composables/useNotifications.js`
- **Propósito:** Interfaz simplificada para usar notificaciones
- **Características:**
  - Métodos de conveniencia
  - Manejo específico de errores de KPIs
  - Integración con stores

#### **3. NotificationContainer (Componente)**
- **Ubicación:** `src/components/common/NotificationContainer.vue`
- **Propósito:** Renderizado visual de notificaciones
- **Características:**
  - Diseño moderno con animaciones
  - Responsive design
  - Acciones personalizadas
  - Barra de progreso para auto-dismiss

## 🔧 **Uso del Sistema**

### **Uso Básico en Componentes**

```javascript
import { useNotifications } from '@/composables/useNotifications'

const { success, error, warning, info } = useNotifications()

// Notificación de éxito
success('Operación Exitosa', 'El KPI se ha creado correctamente')

// Notificación de error
error('Error de Validación', 'Los datos enviados no son válidos')

// Notificación de advertencia
warning('Advertencia', 'Este campo es opcional')

// Notificación informativa
info('Información', 'Los datos se han guardado automáticamente')
```

### **Manejo Automático de Errores de API**

```javascript
import { useNotifications } from '@/composables/useNotifications'

const { showKPIError, showFieldError, showMetadataError } = useNotifications()

// En un composable o servicio
try {
  await kpiService.createKPI(data)
} catch (err) {
  showKPIError(err) // Manejo automático del error
}
```

### **Notificaciones con Acciones**

```javascript
const { error } = useNotifications()

error('Error de Conexión', 'No se pudo conectar con el servidor', {
  persistent: true,
  actions: [
    {
      label: 'Reintentar',
      action: () => {
        // Lógica para reintentar
        retryOperation()
      }
    }
  ]
})
```

## 📊 **Estructura de Datos**

### **Notificación**
```javascript
{
  id: 1234567890.123,
  type: 'success', // success, error, warning, info
  title: 'Título de la notificación',
  message: 'Mensaje descriptivo',
  duration: 5000, // milisegundos
  persistent: false, // si es true, no se auto-elimina
  actions: [ // acciones opcionales
    {
      label: 'Texto del botón',
      action: () => { /* función a ejecutar */ }
    }
  ],
  timestamp: new Date()
}
```

### **Configuración por Tipo**
```javascript
// Success - Auto-dismiss en 5 segundos
success('Título', 'Mensaje')

// Error - Persistente hasta que el usuario la cierre
error('Título', 'Mensaje')

// Warning - Auto-dismiss en 7 segundos
warning('Título', 'Mensaje', { duration: 7000 })

// Info - Auto-dismiss en 4 segundos
info('Título', 'Mensaje', { duration: 4000 })
```

## 🎨 **Diseño y UX**

### **Posicionamiento**
- **Desktop:** Esquina superior derecha
- **Mobile:** Pantalla completa con márgenes
- **Z-index:** 9999 para estar siempre visible

### **Animaciones**
- **Entrada:** Slide desde la derecha con fade-in
- **Salida:** Slide hacia la derecha con fade-out
- **Progreso:** Barra animada para auto-dismiss

### **Estados Visuales**
```css
.notification--success {
  border-left-color: #48bb78; /* Verde */
}

.notification--error {
  border-left-color: #e53e3e; /* Rojo */
}

.notification--warning {
  border-left-color: #ed8936; /* Naranja */
}

.notification--info {
  border-left-color: #4299e1; /* Azul */
}
```

## 🔄 **Integración con Servicios**

### **Manejo Automático de Errores HTTP**

El sistema maneja automáticamente diferentes tipos de errores HTTP:

```javascript
// 400 - Error de Validación
title: 'Error de Validación'
message: 'Los datos enviados no son válidos'

// 401 - No Autorizado
title: 'No Autorizado'
message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'

// 403 - Acceso Denegado
title: 'Acceso Denegado'
message: 'No tienes permisos para realizar esta acción'

// 404 - No Encontrado
title: 'No Encontrado'
message: 'El recurso solicitado no existe'

// 422 - Error de Validación
title: 'Error de Validación'
message: 'Los datos enviados no son válidos'

// 500 - Error del Servidor
title: 'Error del Servidor'
message: 'Ha ocurrido un error interno del servidor'
```

### **Errores de Validación Específicos**

```javascript
// Si el backend devuelve errores específicos
{
  "message": "Los datos enviados no son válidos",
  "errors": {
    "name": ["El nombre es requerido"],
    "email": ["El email no es válido"]
  }
}

// Se muestran como:
message: "El nombre es requerido, El email no es válido"
```

## 📱 **Responsive Design**

### **Breakpoints**
- **Desktop:** `> 768px` - Notificaciones en esquina
- **Tablet:** `≤ 768px` - Notificaciones adaptadas
- **Mobile:** `≤ 480px` - Notificaciones de pantalla completa

### **Adaptaciones Móviles**
- Notificaciones ocupan más espacio
- Botones de acción apilados verticalmente
- Texto más grande para mejor legibilidad
- Márgenes reducidos para aprovechar espacio

## 🧪 **Testing y Validación**

### **Casos de Prueba**
1. **Notificaciones básicas** - Todos los tipos
2. **Auto-dismiss** - Temporizador funciona correctamente
3. **Persistent** - No se auto-eliminan
4. **Acciones** - Botones funcionan correctamente
5. **Responsive** - Se adaptan a diferentes pantallas
6. **Errores de API** - Manejo automático funciona

### **Validaciones Implementadas**
- Máximo 5 notificaciones simultáneas
- IDs únicos para cada notificación
- Limpieza automática de memoria
- Manejo de errores de red

## 🚀 **Próximas Mejoras**

### **Funcionalidades Planificadas**
- [ ] **Sonidos** - Notificaciones con audio
- [ ] **Temas** - Notificaciones personalizables
- [ ] **Historial** - Log de notificaciones
- [ ] **Filtros** - Mostrar/ocultar por tipo
- [ ] **Exportar** - Guardar notificaciones

### **Optimizaciones**
- [ ] **Lazy loading** - Cargar solo cuando se necesite
- [ ] **Caché inteligente** - Evitar duplicados
- [ ] **Batch operations** - Agrupar notificaciones similares
- [ ] **Analytics** - Métricas de uso

## 📚 **Documentación Relacionada**

- **[Guía de KPIs](KPI_BUILDER_GUIDE.md)** - Uso en constructor de KPIs
- **[Guía de Testing](TESTING_GUIDE.md)** - Casos de prueba
- **[Arquitectura](src/views/README.md)** - Estructura del proyecto

## 🔍 **Ejemplo Real de Manejo de Errores**

### **Caso Específico: Error de Validación de KPI**

```javascript
// Respuesta del backend (422 - Error de Validación)
{
  "message": "El tipo de cálculo es obligatorio.",
  "errors": {
    "calculation_type": ["El tipo de cálculo es obligatorio."]
  }
}

// El sistema mostrará:
// Título: "Error Creando KPI"
// Mensaje: "El tipo de cálculo es obligatorio."
```

### **Prioridad de Mensajes**
1. **Mensaje principal** (`data.message`) - Siempre tiene prioridad
2. **Errores específicos** (`data.errors`) - Solo si no hay mensaje principal
3. **Mensaje por defecto** - Solo si no hay información del backend

### **Debug y Testing**
```javascript
// Para verificar el manejo de errores, revisar la consola:
console.log('Error completo del backend:', err.response?.data)
```

---

**Última actualización:** Octubre 2024  
**Versión:** 1.0.0
