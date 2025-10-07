import styles from './TextInput.module.css'

function TextInput({ label, value, onChange, placeholder, inputMode, onBlur, error, helperText }) {
  return (
    <label className="form-wrap">
      <div className="form-label">{label}</div>
      <input
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        onBlur={onBlur}
      />
      {helperText ? <div className={error ? styles.helperError : styles.helper}>{helperText}</div> : null}
    </label>
  )
}

export default TextInput

