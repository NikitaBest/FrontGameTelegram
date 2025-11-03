import { useState, useEffect, useCallback } from 'react'
import styles from './Reward.module.css'
import Panel from '../../components/Panel/Panel.jsx'
import RadioTabs from '../../components/RadioTabs/RadioTabs.jsx'
import TextInput from '../../components/TextInput/TextInput.jsx'
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton.jsx'
import { fetchPaymentData, fetchBanks, sendPayment } from '../../config/api.js'

const bankOptions = [
  { value: '', label: 'Выберите банк' },
]

function RewardPage() {
  const [method, setMethod] = useState('card')
  const [card, setCard] = useState('')
  const [phone, setPhone] = useState('')
  const [bank, setBank] = useState('')
  const [cardError, setCardError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState(false)
  const [banks, setBanks] = useState([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [paymentIdentifier, setPaymentIdentifier] = useState('')
  const [sendingPayment, setSendingPayment] = useState(false)

  const loadPaymentData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Получаем paymentId из URL параметров
      const urlParams = new URLSearchParams(window.location.search)
      let paymentIdentifier = urlParams.get('paymentId')
      
      // Для локальной разработки используем тестовый paymentId, если не найден в URL
      if (!paymentIdentifier) {
        paymentIdentifier = 'a2c903ce-4fcd-4d3c-b621-0b68d844c887'
        console.log('Используется тестовый paymentId для локальной разработки:', paymentIdentifier)
      }
      
      // Сохраняем paymentIdentifier для отправки платежа
      setPaymentIdentifier(paymentIdentifier)
        
      const data = await fetchPaymentData(paymentIdentifier)
      console.log('Данные с бекенда:', data)
      console.log('Поле money:', data?.value?.backPayment?.money)
      console.log('Поле type:', data?.value?.backPayment?.type)
      console.log('Поле status:', data?.value?.backPayment?.status)
      console.log('isSuccess:', data?.isSuccess)
      
      // Проверяем успешность запроса и тип платежа
      if (!data?.isSuccess || data?.value?.backPayment?.type !== 1) {
        console.log('Показываем ошибку. isSuccess:', data?.isSuccess, 'type:', data?.value?.backPayment?.type)
        setError(true)
      } else {
        console.log('Показываем основную страницу')
        setPaymentData(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных платежа:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadBanks = useCallback(async () => {
    try {
      setBanksLoading(true)
      const data = await fetchBanks()
      console.log('Список банков с бекенда:', data)
      
      // Проверяем структуру данных
      let banksArray = []
      if (data && Array.isArray(data)) {
        banksArray = data
      } else if (data && data.value && Array.isArray(data.value.banks)) {
        banksArray = data.value.banks
      } else if (data && data.banks && Array.isArray(data.banks)) {
        banksArray = data.banks
      }
      
      console.log('Обработанный массив банков:', banksArray)
      
      // Преобразуем данные в формат для селекта
      const bankOptions = [
        { value: '', label: 'Выберите банк' },
        ...banksArray.map((bank) => ({
          value: bank.external_id || bank.id,
          label: bank.russian_name || bank.name,
          iconUrl: bank.icon_url,
        })),
      ]
      
      console.log('Финальные опции банков:', bankOptions)
      setBanks(bankOptions)
    } catch (error) {
      console.error('Ошибка загрузки списка банков:', error)
      // В случае ошибки используем пустой список
      setBanks([{ value: '', label: 'Выберите банк' }])
    } finally {
      setBanksLoading(false)
    }
  }, [])

  const handleSendPayment = useCallback(async () => {
    try {
      setSendingPayment(true)
      
      // Подготавливаем данные для отправки
      const paymentData = {
        paymentIdentifier: paymentIdentifier,
        fpsBankMemberId: method === 'sbp' ? bank : '',
        fpsMobilePhone: method === 'sbp' ? `+${onlyDigits(phone)}` : '',
        cardNumber: method === 'card' ? onlyDigits(card) : '',
      }
      
      console.log('Отправляем данные платежа:', paymentData)
      
      const response = await sendPayment(paymentData)
      console.log('Ответ от бекенда:', response)
      
      // Обновляем данные после успешной отправки
      await loadPaymentData()
      
      alert('Платеж успешно отправлен!')
      
    } catch (error) {
      console.error('Ошибка отправки платежа:', error)
      alert('Ошибка при отправке платежа. Попробуйте снова.')
    } finally {
      setSendingPayment(false)
    }
  }, [paymentIdentifier, method, bank, phone, card])

  const onlyDigits = (s) => s.replace(/\D/g, '')
  const formatCard = (s) => onlyDigits(s).slice(0,16).replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  const luhnOk = (number) => {
    const digits = onlyDigits(number)
    if (digits.length !== 16) return false
    let sum = 0
    for (let i = 0; i < 16; i++) {
      let d = parseInt(digits[15 - i], 10)
      if (i % 2 === 1) {
        d *= 2
        if (d > 9) d -= 9
      }
      sum += d
    }
    return sum % 10 === 0
  }

  const handleCardChange = (v) => {
    const formatted = formatCard(v)
    setCard(formatted)
    if (formatted.length < 19) {
      setCardError('')
    }
  }

  const validateCard = () => {
    if (card.trim() !== '' && !luhnOk(card)) { 
      setCardError('Неверный номер карты'); 
      return 
    }
    setCardError('')
  }

  const formatPhone = (s) => {
    const digits = onlyDigits(s)
    if (digits.length === 0) return ''
    
    // Если начинается с 8, заменяем на 7 и форматируем как +7
    if (digits[0] === '8') {
      const processedDigits = '7' + digits.slice(1)
      const d = processedDigits.slice(0, 11)
      if (d.length <= 1) return '+7'
      if (d.length <= 4) return `+7 (${d.slice(1)}`
      if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`
      if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
      return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`
    }
    
    // Если начинается с 7
    if (digits[0] === '7') {
      const d = digits.slice(0, 11)
      if (d.length <= 1) return '+7'
      if (d.length <= 4) return `+7 (${d.slice(1)}`
      if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`
      if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
      return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`
    }
    
    // Если не начинается с 7 или 8, заменяем первую цифру на 7
    const processedDigits = '7' + digits.slice(1)
    const d = processedDigits.slice(0, 11)
    if (d.length <= 1) return '+7'
    if (d.length <= 4) return `+7 (${d.slice(1)}`
    if (d.length <= 7) return `+7 (${d.slice(1, 4)}) ${d.slice(4)}`
    if (d.length <= 9) return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`
  }

  const isValidPhone = (phone) => {
    const digits = onlyDigits(phone)
    // Принимаем как номера с 7, так и с 8
    if (digits.length === 11) {
      if (digits[0] === '7') {
        return /^7[3-9]\d{9}$/.test(digits)
      }
      if (digits[0] === '8') {
        return /^8[3-9]\d{9}$/.test(digits)
      }
    }
    return false
  }

  const handlePhoneChange = (v) => {
    const formatted = formatPhone(v)
    setPhone(formatted)
    if (formatted.length < 18) {
      setPhoneError('')
    }
  }

  const validatePhone = () => {
    if (phone.trim() !== '' && !isValidPhone(phone)) { 
      setPhoneError('Неверный номер телефона'); 
      return 
    }
    setPhoneError('')
  }

  // Запрос данных платежа при загрузке
  useEffect(() => {
    loadPaymentData()
  }, [loadPaymentData])

  // Показываем страницу ошибки, если type !== 1
  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroTitle}>Ошибка</div>
          <div className={styles.subtitle}>Попробуйте снова</div>
        </div>
      </div>
    )
  }

  // Показываем только статус для статусов 2 и 3
  if (paymentData?.value?.backPayment?.status === 2 || paymentData?.value?.backPayment?.status === 3) {
    return (
      <div className={styles.statusPage}>
        <div className={styles.statusHero}>
          <img className={styles.pouchImg} src="/1 7.svg" alt="prize" />
          
          <div className={styles.status}>
            {paymentData.value.backPayment.status === 2 && (
              <div className={styles.statusProcessing}>Платеж в обработке!</div>
            )}
            {paymentData.value.backPayment.status === 3 && (
              <div className={styles.statusSuccess}>Платеж произведен успешно!</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <img className={styles.pouchImg} src="/1 7.svg" alt="prize" />
        <div className={styles.heroTitle}>Поздравляем!</div>
        <div className={styles.subtitle}>Вы выиграли</div>
        {paymentData?.value?.backPayment?.money && (
          <div className={styles.amount}>
            ★ {paymentData.value.backPayment.money} рублей ★
          </div>
        )}
      </div>

      <Panel>
        <div className={styles.sectionTitle}>Куда хотите получить выигрыш?</div>
        <RadioTabs
          options={[
            { value: 'card', label: 'Карта', icon: '💳' },
            { value: 'sbp', label: 'СБП', icon: '📱' },
          ]}
          value={method}
          onChange={setMethod}
        />

        {method === 'card' && (
          <TextInput
            label="Номер карты"
            placeholder="0000 0000 0000 0000"
            value={card}
            onChange={handleCardChange}
            onBlur={validateCard}
            inputMode="numeric"
            error={!!cardError}
            helperText={cardError}
          />
        )}

        {method === 'sbp' && (
          <>
            <TextInput
              label="Номер телефона"
              placeholder="+7 (900) 000-00-00"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={validatePhone}
              inputMode="tel"
              error={!!phoneError}
              helperText={phoneError}
            />
            <CustomSelect
              label={banksLoading ? "Загрузка банков..." : "Выберите банк"}
              value={bank}
              onChange={setBank}
              options={banks.length > 0 ? banks : bankOptions}
              showIcons={true}
              onOpen={loadBanks}
              searchable={true}
            />
          </>
        )}

        <div className={styles.ctaWrap}>
          <PrimaryButton 
            text={sendingPayment ? "Отправляем..." : "Получить выигрыш"} 
            onClick={handleSendPayment}
            disabled={sendingPayment}
          />
        </div>
      </Panel>
    </div>
  )
}

export default RewardPage

