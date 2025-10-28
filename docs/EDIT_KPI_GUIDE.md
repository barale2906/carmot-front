# Guía de Edición de KPIs

## Funcionalidades Implementadas

### 1. Edición de Información Básica
- **Nombre del KPI**: Modificable
- **Descripción**: Modificable  
- **Unidad de Medida**: Modificable
- **Período por Defecto**: Modificable
- **Estado (Activo/Inactivo)**: Modificable

### 2. Campos No Modificables
- **Tipo de Cálculo**: No se puede cambiar después de crear el KPI
- **Modelo Base**: No se puede cambiar después de crear el KPI
- **Código del KPI**: Generado automáticamente, no modificable

### 3. Gestión de Campos (Solo para KPIs Personalizados)
- **Agregar Campos**: Usar el botón "Agregar Campo"
- **Editar Campos**: Hacer clic en "Editar" en la tarjeta del campo
- **Eliminar Campos**: Hacer clic en "Eliminar" en la tarjeta del campo

### 4. Gestión de Relaciones (Solo para KPIs Personalizados)
- **Agregar Relaciones**: Usar el botón "Agregar Relación"
- **Editar Relaciones**: Hacer clic en "Editar" en la tarjeta de la relación
- **Eliminar Relaciones**: Hacer clic en "Eliminar" en la tarjeta de la relación

## Flujo de Edición

### Paso 1: Acceder a la Edición
1. Ir a la página de KPIs (`/kpis`)
2. Hacer clic en "Editar" en la tarjeta del KPI deseado
3. Serás redirigido a `/kpis/{id}/edit`

### Paso 2: Navegación por Pasos
El editor utiliza un wizard de pasos:

#### Paso 1: Información Básica
- Modificar datos principales del KPI
- Campos bloqueados muestran nota explicativa

#### Paso 2: Configuración de Campos (Solo Custom Fields)
- Ver, agregar, editar o eliminar campos
- Cada campo muestra su configuración actual

#### Paso 3: Relaciones (Solo Custom Fields)
- Ver, agregar, editar o eliminar relaciones
- Vista previa de fórmulas matemáticas

#### Paso Final: Revisar y Guardar
- Revisar todos los cambios realizados
- Guardar cambios o volver a pasos anteriores

## Características Técnicas

### Validaciones
- **Campos Requeridos**: Nombre, unidad, tipo de cálculo, modelo base, período
- **Validación de Relaciones**: Los campos deben ser diferentes
- **Orden Único**: No puede haber relaciones con el mismo orden
- **Campos Mínimos**: Los KPIs personalizados requieren al menos un campo

### Manejo de Errores
- **Errores de Red**: Se muestran notificaciones de error
- **Validación de Formulario**: Errores en tiempo real
- **Confirmaciones**: Para acciones destructivas (eliminar campos/relaciones)

### Estados de Carga
- **Carga Inicial**: Spinner mientras se cargan los datos del KPI
- **Guardado**: Botón deshabilitado durante el proceso de guardado
- **Estados de Error**: Pantalla de error con opción de reintentar

## Componentes Creados

### 1. EditKPI.vue
- Componente principal de edición
- Wizard de pasos dinámico según tipo de KPI
- Manejo de estado y navegación

### 2. EditFieldModal.vue
- Modal para editar campos existentes
- Validación de datos de campo
- Vista previa de configuración

### 3. EditRelationModal.vue
- Modal para editar relaciones existentes
- Validación de relaciones matemáticas
- Vista previa de fórmulas

## API Endpoints Utilizados

### Lectura
- `GET /dashboard/kpis/{id}` - Obtener datos del KPI
- `GET /dashboard/kpis/{id}/fields` - Obtener campos del KPI
- `GET /dashboard/kpis/{id}/field-relations` - Obtener relaciones del KPI

### Escritura
- `PUT /dashboard/kpis/{id}` - Actualizar información básica del KPI
- `POST /dashboard/kpis/{id}/fields` - Agregar campo al KPI
- `PUT /dashboard/kpis/{id}/fields/{fieldId}` - Actualizar campo del KPI
- `DELETE /dashboard/kpis/{id}/fields/{fieldId}` - Eliminar campo del KPI
- `POST /dashboard/kpis/{id}/field-relations` - Agregar relación al KPI
- `PUT /dashboard/kpis/{id}/field-relations/{relationId}` - Actualizar relación del KPI
- `DELETE /dashboard/kpis/{id}/field-relations/{relationId}` - Eliminar relación del KPI

## Notas Importantes

1. **Campos Bloqueados**: Algunos campos no se pueden modificar después de crear el KPI para mantener la integridad de los datos.

2. **KPIs Automáticos**: Los KPIs con tipo "predefined" solo permiten editar información básica, no campos ni relaciones.

3. **Persistencia**: Los cambios se guardan inmediatamente al hacer clic en "Guardar Cambios".

4. **Navegación**: Se puede navegar entre pasos usando los botones "Anterior" y "Siguiente".

5. **Cancelación**: Se puede cancelar la edición en cualquier momento usando el botón "Cancelar".
