import styles from './RadioTabs.module.css'

function RadioTabs({ options, value, onChange }) {
  return (
    <div className={styles.tabs}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={value === opt.value ? styles.tabActive : styles.tab}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          <span className={styles.icon}>{opt.icon}</span>
          <span>{opt.label}</span>
          <span className={styles.radio} aria-hidden>
            {value === opt.value ? '●' : '○'}
          </span>
        </button>
      ))}
    </div>
  )
}

export default RadioTabs

