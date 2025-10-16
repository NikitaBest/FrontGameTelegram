import { useState, useRef, useEffect } from 'react'
import styles from './CustomSelect.module.css'

function CustomSelect({ label, value, onChange, options, showIcons = false, onOpen, searchable = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const selectRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    
    function handleEscape(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Фокус на поле поиска при открытии
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const selectedOption = options.find(opt => opt.value === value) || options[0]
  
  // Фильтруем опции по поисковому запросу
  const filteredOptions = searchable && searchTerm 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  return (
    <label className="form-wrap">
      <div className="form-label">{label}</div>
      <div className={styles.container} ref={selectRef}>
        <button
          className={styles.trigger}
          onClick={() => {
            if (!isOpen && onOpen) {
              onOpen()
            }
            setIsOpen(!isOpen)
          }}
          type="button"
        >
          <span 
            className={styles.selectedText}
            style={{ opacity: value === '' ? 0.5 : 1 }}
          >
            {selectedOption.label}
          </span>
          <span className={styles.caret}>▾</span>
        </button>
        
        {isOpen && (
          <div className={styles.dropdown}>
            {searchable && (
              <div className={styles.searchContainer}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Поиск банка..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={styles.option}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onChange(option.value)
                    // Всегда закрываем список после выбора
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  type="button"
                >
                  {showIcons && option.iconUrl && (
                    <img 
                      src={option.iconUrl} 
                      alt="" 
                      className={styles.optionIcon}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                  <span className={styles.optionText}>{option.label}</span>
                </button>
              ))
            ) : (
              <div className={styles.noResults}>
                Банки не найдены
              </div>
            )}
          </div>
        )}
      </div>
    </label>
  )
}

export default CustomSelect
