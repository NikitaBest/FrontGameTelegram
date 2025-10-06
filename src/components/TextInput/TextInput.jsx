import styles from './TextInput.module.css'

function TextInput({ label, value, onChange, placeholder, inputMode, onBlur, error, helperText }) {
  return (
    <label className={styles.wrap}>
      <div className={styles.label}>{label}</div>
      <input
        className={error ? styles.inputError : styles.input}
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

