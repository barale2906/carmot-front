# 🔒 Configuración de Seguridad - Carmot Frontend

## 📋 **Mejores Prácticas Implementadas**

### **1. Almacenamiento de Tokens**
```javascript
// ✅ CORRECTO - Usando sessionStorage
sessionStorage.setItem('auth_token', token)
sessionStorage.getItem('auth_token')
sessionStorage.removeItem('auth_token')

// ❌ INCORRECTO - localStorage es menos seguro
localStorage.setItem('auth_token', token)
```

**¿Por qué sessionStorage es mejor?**
- **Expiración automática** al cerrar la pestaña
- **Menor superficie de ataque** para XSS
- **Mejor control** del ciclo de vida del token
- **Cumple** con principios de seguridad web

### **2. Manejo de Tokens JWT**
```javascript
// Headers de autorización
api.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Interceptores para refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Intentar refresh del token
      await refreshToken()
    }
  }
)
```

### **3. Limpieza de Sesión**
```javascript
// Logout seguro
const logout = async () => {
  try {
    await api.post('/logout')
  } finally {
    // Limpiar siempre, independientemente del resultado
    sessionStorage.removeItem('auth_token')
    delete api.defaults.headers.common['Authorization']
  }
}
```

## 🛡️ **Medidas de Seguridad Adicionales**

### **Protección contra XSS**
- ✅ **sessionStorage** en lugar de localStorage
- ✅ **Sanitización** de inputs del usuario
- ✅ **Validación** en frontend y backend
- ✅ **Headers de seguridad** en requests

### **Manejo de Errores Seguro**
- ✅ **No exposición** de información sensible
- ✅ **Mensajes genéricos** para usuarios
- ✅ **Logs detallados** solo en desarrollo
- ✅ **Redirección automática** en errores 401

### **Configuración de CORS**
```javascript
// Backend debe configurar CORS para:
{
  "origin": "http://localhost:5173",
  "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "headers": ["Authorization", "Content-Type", "Accept"],
  "credentials": true
}
```

## 🔍 **Monitoreo de Seguridad**

### **Indicadores a Verificar**
- ✅ **Tokens expiran** correctamente
- ✅ **Logout limpia** toda la sesión
- ✅ **No tokens** en localStorage
- ✅ **Headers de autorización** correctos
- ✅ **Redirección** en errores 401

### **Console del Navegador**
```javascript
// Verificar que no hay tokens en localStorage
console.log('localStorage tokens:', localStorage.getItem('auth_token')) // null

// Verificar tokens en sessionStorage
console.log('sessionStorage tokens:', sessionStorage.getItem('auth_token')) // token válido

// Verificar headers de autorización
console.log('API headers:', api.defaults.headers.common)
```

## 🚨 **Alertas de Seguridad**

### **Señales de Problemas**
- ❌ **Tokens en localStorage** - Cambiar a sessionStorage
- ❌ **Tokens que no expiran** - Verificar configuración
- ❌ **Información sensible** en logs - Usar solo en desarrollo
- ❌ **CORS mal configurado** - Revisar backend

### **Acciones Correctivas**
1. **Cambiar localStorage por sessionStorage**
2. **Implementar refresh automático** de tokens
3. **Configurar CORS** correctamente
4. **Limpiar logs** en producción

## 📚 **Recursos Adicionales**

### **Documentación de Seguridad**
- [OWASP Web Security](https://owasp.org/www-project-web-security-testing-guide/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Session Storage vs Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

### **Herramientas de Testing**
- **Browser DevTools** - Inspeccionar storage
- **Network Tab** - Verificar headers
- **Security Tab** - Revisar políticas
- **Console** - Monitorear errores

## 🎯 **Próximos Pasos de Seguridad**

### **Mejoras Futuras**
- [ ] **Content Security Policy (CSP)**
- [ ] **Subresource Integrity (SRI)**
- [ ] **Rate Limiting** en frontend
- [ ] **Auditoría de seguridad** periódica

### **Testing de Seguridad**
- [ ] **Penetration testing**
- [ ] **Vulnerability scanning**
- [ ] **Code review** de seguridad
- [ ] **Security headers** validation
