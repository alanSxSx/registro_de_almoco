import React, { useState, useEffect, useContext } from 'react'
import styles from './Login.module.css'
import logo from '../../img/logo.png'
import { Input } from '../Forms/input'
import { Button } from '../Forms/button'
import { AuthContext } from '../Context/AuthProvider/AuthContext'
import Footer from '../Layout/Footer'


export default function Login() {

	useEffect(() => {
		console.log("useEffect chamado");
		localStorage.clear();
		localStorage.removeItem('userData');
	}, [])
	

	const [userLogin, setUserLogin] = useState({})
	
	const { handleLogin } = useContext(AuthContext);
	
	
	function HandleLoginField(e) {
		setUserLogin({ ...userLogin, login: e.target.value });
	}

	function HandleSenhaField(e) {
		setUserLogin({ ...userLogin, senha: e.target.value });
	}

	
	const handleSubmit = (e) => {
		e.preventDefault();
		handleLogin(userLogin.login, userLogin.senha);
		
	}


	return (
		<div className={styles.divMain}>
			<div className={styles.title}>
				<img src={logo} alt="logo" />
				<a>Sistema de Gerenciamento de Refeições</a>
			</div>
			<div className={styles.divform}>
				
				<form onSubmit={handleSubmit} className={styles.form}>
					<span className="p-input-icon-left">
						<i className="pi pi-user" />
						<Input type="text" text="Login" name="login" id="login" placeholder="Digite seu CPF" handleOnChange={HandleLoginField} value={userLogin.login? userLogin.login : ''} />
					</span>
					<span className="p-input-icon-left">
						<i className="pi pi-lock" />
						<Input type="password" text="Senha" name="senha" id="senha" placeholder="Digite sua Senha" handleOnChange={HandleSenhaField} value={userLogin.senha? userLogin.senha :''} />
					</span>
					<Button text="Entrar" />
				</form>
				</div>
			<Footer/>
		</div>

	)
}
