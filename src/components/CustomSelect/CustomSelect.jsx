import { useState, useRef, useEffect } from 'react'
import styles from './CustomSelect.module.css'

function CustomSelect({ label, value, onChange, options, showIcons = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <label className="form-wrap">
      <div className="form-label">{label}</div>
      <div className={styles.container} ref={selectRef}>
        <button
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
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
            {options.map((option) => (
              <button
                key={option.value}
                className={styles.option}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
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
            ))}
          </div>
        )}
      </div>
    </label>
  )
}

export default CustomSelect
