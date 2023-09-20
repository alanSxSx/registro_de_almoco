import React, { useState, useEffect, useContext,useRef } from 'react'
import styles from './Login.module.css'
import logo from '../../img/logo.png'
import { Input } from '../Forms/input'
import { Button } from '../Forms/button'
import { AuthContext } from '../Context/AuthProvider/AuthContext'
import { Toast } from 'primereact/toast';
import Footer from '../Layout/Footer'



export default function Login() {

	useEffect(() => {
	
	handleLogout()

	}, [])
	
	
	const [userLogin, setUserLogin] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { handleLogin,handleLogout,authenticated,user } = useContext(AuthContext);
	const toast = useRef(null);
	
	
	function HandleLoginField(e) {
		setUserLogin({ ...userLogin, login: e.target.value });
	}

	function HandleSenhaField(e) {
		setUserLogin({ ...userLogin, senha: e.target.value });
	}

	
	// const handleSubmit = (e) => {
	// 	e.preventDefault();
	// 	handleLogin(userLogin.login, userLogin.senha);
	// }

	const handleSubmit = async (e) => {
		e.preventDefault();
	  
		if (!isSubmitting) {
		  setIsSubmitting(true);
	  
		  if (userLogin.login && userLogin.senha) { // Verifica se o CPF e a senha estão definidos
			try {
			  await handleLogin(userLogin.login, userLogin.senha);
	  
			  setTimeout(() => {
				setIsSubmitting(false);
			  }, 5000);
			} catch (error) {
			  setIsSubmitting(false);
			}
		  } else {
			// Lida com o caso em que CPF ou senha estão faltando
			setIsSubmitting(false);
			toast.current.show({ severity: 'error', summary: 'Error', detail: 'CPF ou Senha Inválidos', life: 1000 });
			console.error('CPF ou senha não estão definidos.');
		  }
		}
	  };


	return (
		<div className={styles.divMain}>
			<Toast ref={toast} />
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
