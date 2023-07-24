import React, { useState } from 'react'
import styles from './Login.module.css'
import { Input } from '../Forms/input'
import { Button } from '../Forms/button'


export default function Login() {

    const [user,setUser] = useState({})

    function HandleLogin(e) {
        setUser({ ...user, login: e.target.value });
    }

    function HandleSenha(e) {
        setUser({ ...user, senha: e.target.value });
    }

    function submit(e) {
        e.preventDefault()
        console.log(user)
    }

    return (
        <div>
            <div className={styles.title}>
                Faça o Login para entrar no Sistema
            </div>
            <form onSubmit={submit} className={styles.form}>
                <Input type="text" text="Digite seu Login" name="login" id="login" placeholder="Digite seu Login" handleOnChange={HandleLogin} value={user.login} />
                <Input type="password" text="Digite sua Senha" name="senha" id="senha" placeholder="Digite sua Senha" handleOnChange={HandleSenha} value={user.senha} />
                <Button text="Entrar" />
            </form>
        </div>
        
    )
}
