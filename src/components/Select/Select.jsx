import styles from './Select.module.css'

function Select({ label, value, onChange, options }) {
  return (
    <label className={styles.wrap}>
      <div className={styles.label}>{label}</div>
      <div className={styles.box}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className={styles.caret}>▾</span>
      </div>
    </label>
  )
}

export default Select

