// Método de prueba para verificar el manejo de errores
// Este método simula la respuesta del backend que mencionaste

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
  
  // Simular el flujo completo
  const { showKPIError } = useNotifications()
  const result = showKPIError(mockError)
  console.log('Resultado de showKPIError:', result)
}

// Para probar, ejecutar en la consola del navegador:
// testErrorHandling()

// También puedes probar directamente:
// const { showKPIError } = useNotifications()
// showKPIError({
//   response: {
//     status: 422,
//     data: {
//       message: "El tipo de cálculo es obligatorio.",
//       errors: {
//         calculation_type: ["El tipo de cálculo es obligatorio."]
//       }
//     }
//   }
// })
