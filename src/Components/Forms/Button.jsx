import styles from "./Button.module.css";

export function Button({ text }) {
  return (
    <div className={styles.divbutton}>
      <button className={styles.btn}>{text}</button>
    </div>
  );
}
