## Plan paso a paso: Gestión de KPIs, Dashboards y DashboardCards (Vue 2)

Este documento define el flujo y las tareas para implementar la gestión de KPIs, dashboards y dashboardCards en el frontend con Vue 2, usando `vue-grid-layout` (^2.4.0) para layout dinámico y `vue-echarts` (^6.0.2) + `echarts` (^5.3.1) para visualización. Se alinea con los lineamientos de `document.json`, `indive2.md` y `VUE_FRONTEND_IMPLEMENTACION_GUIDE.md`.

### 1) Preparación e instalación ✅ (COMPLETADO)

1. Asegurar dependencias en `package.json`:
   - vue: ^2.6.x
   - vue-echarts: ^6.0.2
   - echarts: ^5.3.1
   - vue-grid-layout: ^2.4.0
   - axios, vue-router, vuex
   - Estado actual del proyecto:
     - Vue 3 detectado (`vue@^3.5.x`) y `vue-router@^4`, `pinia` (en lugar de Vuex)
     - `vue-echarts@^6.0.2`, `echarts@^5.3.1`, `vue-grid-layout@^2.4.0`, `axios@^1`
     - Nota: `vue-grid-layout@^2.4.0` es para Vue 2. Para Vue 3 podría requerirse alternativa compatible (por ejemplo, forks como `vue3-grid-layout`). Se continuará con la implementación y se validará en integración.
2. Instalar:
   - `npm install vue-echarts@^6.0.2 echarts@^5.3.1 vue-grid-layout@^2.4.0 axios vue-router@^3 vuex@^3`
3. Configurar `main.js`:
   - Registrar componente global `v-chart` de `vue-echarts` y asegurar carga de ECharts.
   - Configurar router y store si aplica.
   - Estado aplicado: Se registró `v-chart` global en `src/main.js` e importó `echarts`.

### 2) Contratos de API y convenciones (frontend) ✅ (COMPLETADO)

1. Base URL: `/api/dashboard`.
2. Endpoints relevantes:
   - KPIs: CRUD y `GET /kpis/{id}/compute` (parámetros: `period_type`, `start_date`, `end_date`, `date_field`, `filters`, `group_by`, `group_limit`).
   - Dashboards: CRUD y `POST /dashboards/{id}/export-pdf`.
   - DashboardCards: CRUD y `GET /dashboard-cards/{id}/compute` (opcional si el backend lo expone).
   - Opciones de agrupación: `GET /kpis/models/{modelId}/group-by/{field}`.
3. Estructura de respuesta para `compute` debe incluir objeto `chart` listo para ECharts, además de metadatos (`series`, `range`, `factor`, etc.), según lo indicado en los documentos.
4. Alineación con cliente Axios existente: `baseURL` configurada a `/api`; los endpoints anteriores se consumen con prefijo `/dashboard`.

### 3) Servicio API (axios) ✅ (COMPLETADO)

1. Crear `services/api.js` con baseURL, headers y manejo de token (interceptores).
   - Estado aplicado: ya existe `src/services/api.js` con interceptores, refresh token y helpers.
2. Crear `services/kpiService.js` con métodos:
   - `getConfig`, `getKpis`, `getKpi`, `createKpi`, `updateKpi`, `deleteKpi`, `computeKpi`.
   - `getDashboards`, `createDashboard`, `updateDashboard`, `deleteDashboard`, `exportDashboardPdf`.
   - `getDashboardCards`, `createDashboardCard`, `updateDashboardCard`, `deleteDashboardCard`, `computeDashboardCard` (si se usa).
   - `getGroupByOptions(modelId, field, params)`.
   - Estado aplicado: creado `src/services/kpiService.js` con todos los métodos anteriores y `exportDashboardPdf` devolviendo `blob`.

### 4) Gestión de KPIs (CRUD y definición de gráficos)

1. Vista CRUD de KPIs (`views/KpisView.vue`) ✅ (AJUSTADO)
   - Formulario para nombre, código, descripción, unidad, estado.
   - Selección de: modelo de numerador y campo, operación (count/sum/avg...), modelo y campo del denominador (opcional), factor de cálculo, meta (nullable), `date_field`, `period_type` por defecto, `chart_type` y `chart_schema` (plantilla según tipo de gráfico).
   - Validar que el `chart_schema` cumpla estructura mínima requerida por ECharts.
   - Estado aplicado: `src/views/kpi/KpisView.vue` ahora muestra solo el listado de KPIs con acciones (eliminación) y un botón “Nuevo KPI” que navega a la vista de creación.
   - Creada vista `src/views/kpi/KpiCreate.vue` con flujo tipo wizard en 5 pasos: (1) básicos/activo, (2) numerador, (3) denominador, (4) cálculo y período, (5) gráfico. Validación básica en paso 1 (nombre y código), envío a `createKpi` y retorno a `/kpis`.
   - Integración de endpoints granulares:
     - Modelos: `GET /dashboard/kpis/models`
     - Campos por modelo: `GET /dashboard/kpis/models/:modelId/fields`
     - Operaciones por tipo de campo: `GET /dashboard/kpis/operations/:fieldType`
     - El wizard usa selects dependientes (modelo → campo → operación) con carga dinámica.
     - El campo "Campo de fechas a evaluar" se movió al paso 2 (Numerador) y ofrece solo campos de tipo `date` o `datetime` del modelo seleccionado.
   - Rutas actualizadas: añadido `/kpis/new` en `src/router/index.js`.
   - Integrado sistema de notificaciones: éxito en creación/eliminación de KPI; manejo de errores vía `useNotifications`.
   - Confirmación de eliminación: modal simple en `KpisView` para confirmar antes de borrar.
2. Previsualización en vivo ✅ (COMPLETADO)
   - Implementado componente `src/components/KpiChart.vue` que consume `computeKpi(id, params)` y renderiza en `v-chart`.
   - La visualización del KPI se realiza en la vista de detalle `src/views/kpi/KpiDetail.vue` accesible desde el listado de KPIs.
   - Se muestran `description` y `range` entregados por el endpoint de `compute` junto al gráfico.
3. Persistencia ✅ (COMPLETADO)
   - `src/views/kpi/KpiCreate.vue` envía el KPI mediante `createKpi` incluyendo el `chart_schema` final (si el usuario ingresa JSON válido se parsea antes de enviar; de lo contrario se conserva como string).
   - El alta redirige a `/kpis` y muestra notificación de éxito; errores se manejan con `useNotifications`.

### 5) Implementación del componente de gráfico KPI ✅ (COMPLETADO)

1. `components/KpiChart.vue`:
   - Props: `kpiId`, `params`, `autoRefresh`, `refreshInterval`, `height`.
   - Lógica: invoca `computeKpi` en montaje y ante cambios de `kpiId`/`params`; muestra loader/errores y emite `data-loaded`/`error`.
   - Render: `<v-chart :option="chartOption" />` usando directamente `data.chart`.
2. Auto-refresh opcional por intervalo; actualizaciones en tiempo real ante cambios de filtros/fechas/agrupación.

### 6) Gestión de Dashboards

1. Listado (`views/DashboardsView.vue`) 🚧 (ESQUELETO CREADO)
   - Mostrar dashboards, botón “Nuevo Dashboard”, navegación a detalle, contador de tarjetas.
   - Estado aplicado: creada `src/views/dashboard/DashboardsView.vue` como placeholder para facilitar navegación.

### Navegación inicial post-login ✅ (AÑADIDO)
- Se añadió una vista de inicio `src/views/home/Home.vue` con accesos a “Gestionar KPIs” y “Gestionar Dashboards”.
- Se actualizaron rutas en `src/router/index.js`: `/home` (requiresAuth), `/kpis`, `/dashboards`, y redirección de `/` a `/home`.
- Se actualizó la redirección post-login para llevar a `/home` (antes iba a `/blank`).
- Se creó componente reutilizable `src/components/common/NavBar.vue` (nombre de usuario + cerrar sesión) y se integró en `Home`, `KpisView` y `DashboardsView`.
2. Detalle (`components/Dashboard.vue`):
   - Cargar dashboard y sus cards.
   - Mapear `cards` a `layout` para `vue-grid-layout` con: `i`, `x`, `y`, `w`, `h`.
   - `@layout-updated` persistirá `position_x`, `position_y`, `width`, `height` vía `updateDashboardCard` en tiempo real.
   - Acción “Exportar PDF” llamando a `exportDashboardPdf` y descargando el blob.

### 7) Gestión de DashboardCards (edición visual en tiempo real)

1. `components/DashboardCard.vue`:
   - Props: `card` (incluye `kpi_id`, `background_color`, `border_color`, y dimensiones), `isDragging`.
   - Estilos reactivos para `background` y borde, ajustando padding y sombra.
   - Panel de ajustes: `period_type`, `start_date`, `end_date`, `group_by`, `group_limit`.
   - Render interno: `<KpiChart :kpi-id="card.kpi_id" :params="localParams" :auto-refresh="true" />`.
   - Al cambiar parámetros, el gráfico se actualiza; emitir eventos si se requiere.
   - Carga de opciones de `group_by` con `getGroupByOptions` (según `numerator_model` y `date_field`).
   - Botones: abrir/cerrar ajustes y eliminar tarjeta (`@remove-card`).
2. Persistencia en tiempo real de layout:
   - `vue-grid-layout` emite `layout-updated` con `x,y,w,h` por ítem → persistir en el backend.
3. Persistencia de apariencia:
   - Cambios de `background_color`/`border_color` se guardan vía `updateDashboardCard`.

### 8) Integración de `vue-grid-layout` (drag/resize)

1. En `Dashboard.vue`, usar `<GridLayout>` y `<GridItem>` con:
   - `:col-num="12"`, `:row-height="30"`, `:is-draggable="true"`, `:is-resizable="true"`, `:margin="[10,10]`.
2. Mapear `cards` existentes a `layout` y mantener sincronía bidireccional.
3. En cada `layout` update, persistir solo los items cambiados para evitar sobrecarga.

### 9) Filtros y agrupaciones desde DashboardCard hacia KPI

1. `DashboardCard` mantiene `localParams` con:
   - `period_type`, `start_date`, `end_date`, `date_field` (si aplica), `filters` (objeto), `group_by`, `group_limit`.
2. `KpiChart` recibe `params` y vuelve a ejecutar `computeKpi(kpiId, params)`.
3. El backend debe retornar `chart` acorde a los parámetros para render inmediato sin transformación en el frontend.

### 10) Exportación a PDF y envío por correo (flujo frontend)

1. En `Dashboard.vue`, botón “Exportar PDF”:
   - Invoca `exportDashboardPdf(dashboardId)` y descarga el PDF.
2. Enviar por correo (si se expone en backend):
   - Implementar acción que envíe IDs/correos (usuarios del sistema o manuales) y opcionalmente persista destinatarios frecuentes.

### 11) Estado global y performance

1. Vuex (módulo `kpis`):
   - Guardar lista de KPIs y configuración (`getConfig`) para construir formularios y validaciones.
2. Optimización:
   - Cargar diferido componentes pesados.
   - Reutilizar resultados `compute` en memoria cuando los parámetros no cambien.
   - Throttle/debounce en cambios de layout para minimizar writes.

### 12) Validaciones y UX

1. Formularios de KPI: validar operaciones compatibles con el tipo de campo.
2. `chart_schema` mínimo válido por tipo: barras, líneas, pastel, área, etc.
3. Feedback visible: loaders, estados vacíos y manejo de errores uniforme.
4. Responsividad: `DashboardCard` y `KpiChart` deben adaptarse al tamaño actual del `GridItem`.

### 13) Datos mínimos por entidad en frontend (referencial)

- KPI:
  - `id`, `name`, `code`, `description`, `unit`, `is_active`, `numerator_model`, `numerator_field`, `numerator_operation`, `denominator_model?`, `denominator_field?`, `denominator_operation?`, `calculation_factor`, `target_value?`, `date_field`, `period_type`, `chart_type`, `chart_schema`.
- Dashboard:
  - `id`, `name`, `description`, `scope` (general/específico), `owner_id` (para privados), contadores.
- DashboardCard:
  - `id`, `dashboard_id`, `kpi_id`, `position_x`, `position_y`, `width`, `height`, `background_color?`, `border_color?`.

### 14) Checklist de implementación (orden sugerido)

1. Instalar dependencias y configurar `vue-echarts`/`echarts` y `vue-grid-layout`.
2. Implementar `services/api.js` e `services/kpiService.js`.
3. Crear `KpiChart.vue` y validarlo con `computeKpi`.
4. Implementar vistas CRUD de KPI con previsualización y `chart_schema`.
5. Implementar listado de dashboards y vista de detalle `Dashboard.vue`.
6. Implementar `DashboardCard.vue` con ajustes de período, filtros y `group_by`.
7. Conectar `vue-grid-layout` y persistir `x,y,w,h` en tiempo real.
8. Persistir cambios de estilo (background/borde) de cada card.
9. Exportación de PDF y flujo de envío de correo si aplica.
10. Integrar Vuex para `config` y KPIs; optimizaciones de rendimiento.

### 15) Notas finales

- El backend debe entregar configuraciones y resultados listos para ECharts para minimizar lógica en el frontend.
- Cambios de tamaño/posición/color de cada dashboardCard se reflejan en tiempo real mediante actualizaciones persistentes al backend.
- Los parámetros enviados desde dashboardCard (fechas, filtros, agrupaciones) controlan la consulta del KPI y la respuesta debe ser coherente con el `chart_schema` configurado.


