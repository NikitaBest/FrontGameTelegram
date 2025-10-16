// Конфигурация API
export const API_CONFIG = {
  BASE_URL: 'https://telegram-games.tg-projects.ru',
  
  ENDPOINTS: {
    GET_PAYMENT: '/payment/{paymentIdentifier}',
    GET_BANKS: '/payment/banks',
    SEND_PAYMENT: '/payment/send',
  }
}

// Функция для получения полного URL эндпоинта
export const getApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  // Заменяем параметры в URL
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key])
  })
  
  return url
}

// Функция для запроса данных платежа
export const fetchPaymentData = async (paymentIdentifier) => {
  const url = getApiUrl(API_CONFIG.ENDPOINTS.GET_PAYMENT, { paymentIdentifier })
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Ошибка запроса данных платежа:', error)
    throw error
  }
}

// Функция для получения списка банков
export const fetchBanks = async () => {
  const url = getApiUrl(API_CONFIG.ENDPOINTS.GET_BANKS)
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Ошибка запроса списка банков:', error)
    throw error
  }
}

// Функция для отправки платежа
export const sendPayment = async (paymentData) => {
  const url = getApiUrl(API_CONFIG.ENDPOINTS.SEND_PAYMENT)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Ошибка отправки платежа:', error)
    throw error
  }
}
