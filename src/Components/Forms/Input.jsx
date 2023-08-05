import styles from './Input.module.css'

export function Input({type,text,name,placeholder,handleOnChange,value,icon}) {
    return(
        <div className={styles.form_control}>
            <label htmlFor={name}>
						<i class={icon}></i>
						{text}:</label>
            <input'1
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            onChange={handleOnChange}
            value={value} />
        </div>
    )
}
