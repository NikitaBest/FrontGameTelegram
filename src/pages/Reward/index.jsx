import { useState } from 'react'
import styles from './Reward.module.css'
import Panel from '../../components/Panel/Panel.jsx'
import RadioTabs from '../../components/RadioTabs/RadioTabs.jsx'
import TextInput from '../../components/TextInput/TextInput.jsx'
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton.jsx'
import banksData from '../../../banks.json'

const bankOptions = [
  { value: '', label: 'Выберите банк' },
  ...banksData.collection.map((b) => ({
    value: b.external_id,
    label: b.russian_name || b.name,
    iconUrl: b.icon_url,
  })),
]

function RewardPage() {
  const [method, setMethod] = useState('card')
  const [card, setCard] = useState('')
  const [phone, setPhone] = useState('')
  const [bank, setBank] = useState('')
  const [cardError, setCardError] = useState('')
  const [phoneError, setPhoneError] = useState('')

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
    
    // Если начинается с 8, оставляем как есть для ввода
    if (digits[0] === '8') {
      const d = digits.slice(0, 11)
      if (d.length <= 1) return '8'
      if (d.length <= 4) return `8 (${d.slice(1)}`
      if (d.length <= 7) return `8 (${d.slice(1, 4)}) ${d.slice(4)}`
      if (d.length <= 9) return `8 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
      return `8 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`
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
    
    // Если не начинается с 7 или 8, добавляем 7 в начало
    digits.unshift('7')
    const d = digits.slice(0, 11)
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

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <img className={styles.pouchImg} src="/1 7.svg" alt="prize" />
        <div className={styles.heroTitle}>Поздравляем!</div>
        <div className={styles.subtitle}>Вы выиграли</div>
        <div className={styles.amount}>★ 1000 рублей ★</div>
      </div>

      <Panel>
        <div className={styles.sectionTitle}>Выберите способ перевода</div>
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
              label="Выберите банк"
              value={bank}
              onChange={setBank}
              options={bankOptions}
              showIcons={true}
            />
          </>
        )}

        <div className={styles.ctaWrap}>
          <PrimaryButton text="Получить выигрыш" onClick={() => {}} />
        </div>
      </Panel>
    </div>
  )
}

export default RewardPage

