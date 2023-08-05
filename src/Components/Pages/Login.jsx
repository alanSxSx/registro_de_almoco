import React, { useState } from 'react'
import styles from './Login.module.css'
import logo from '../../img/logo.png'
import { Input } from '../Forms/input'
import { Button } from '../Forms/button'


export default function Login() {

    const [user, setUser] = useState({})

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
                <img src={logo} alt="logo" />
                <a>Sistema de Gerenciamento de Refeições</a>
            </div>
            <div className={styles.divform}>
            <form onSubmit={submit} className={styles.form}>


								<i class="fa-regular fa-user"/>
                <Input type="text" text="Login" name="login" id="login" placeholder="Digite seu Login" handleOnChange={HandleLogin} value={user.login} />
                <Input type="password" text="Senha" name="senha" id="senha" placeholder="Digite sua Senha" handleOnChange={HandleSenha} value={user.senha} />
                <Button text="Entrar" />
            </form>
            </div>
        </div>

    )
}
