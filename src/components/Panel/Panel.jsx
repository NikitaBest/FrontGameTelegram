import styles from './Panel.module.css'

function Panel({ children }) {
  return <div className={styles.panel}>{children}</div>
}

export default Panel

