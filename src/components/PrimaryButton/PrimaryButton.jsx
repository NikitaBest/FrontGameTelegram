import styles from './PrimaryButton.module.css'

function PrimaryButton({ text, onClick }) {
  return (
    <button className={styles.button} onClick={onClick} type="button">
      {text}
    </button>
  )
}

export default PrimaryButton

