import styles from './PrimaryButton.module.css'

function PrimaryButton({ text, onClick, disabled = false }) {
  return (
    <button 
      className={styles.button} 
      onClick={onClick} 
      type="button"
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default PrimaryButton

