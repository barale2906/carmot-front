// Método de prueba para verificar el manejo genérico de errores de API
import { useNotifications } from '@/composables/useNotifications'

const testErrorHandling = () => {
  const mockError = {
    response: {
      status: 422,
      data: {
        message: "El tipo de cálculo es obligatorio.",
        errors: {
          calculation_type: ["El tipo de cálculo es obligatorio."]
        }
      }
    }
  }

  // Esto debería mostrar: "El tipo de cálculo es obligatorio."
  console.log('Probando manejo de errores...')
  console.log('Error simulado:', mockError)
  
  // Simular el flujo completo (genérico)
  const { handleApiError } = useNotifications()
  const result = handleApiError(mockError, 'Error de Validación')
  console.log('Resultado de handleApiError:', result)
}

// Para probar, ejecutar en la consola del navegador:
// testErrorHandling()

// También puedes probar directamente:
// const { handleApiError } = useNotifications()
// handleApiError({
//   response: {
//     status: 422,
//     data: {
//       message: "El tipo de cálculo es obligatorio.",
//       errors: {
//         calculation_type: ["El tipo de cálculo es obligatorio."]
//       }
//     }
//   }
// }, 'Error de Validación')
