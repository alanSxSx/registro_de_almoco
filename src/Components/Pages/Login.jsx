import React, { useState,useEffect,useRef } from 'react'
import styles from './Login.module.css'
import logo from '../../img/logo.png'
import { Input } from '../Forms/input'
import { Button } from '../Forms/button'
import { Toast } from 'primereact/toast';


export default function Login() {

	const [user, setUser] = useState({})
	const [data,setData] = useState({})
	const toast = useRef(null);

	useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/data/');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

	function HandleLogin(e) {
		setUser({ ...user, login: e.target.value });
	}

	function HandleSenha(e) {
		setUser({ ...user, senha: e.target.value });
	}

	function submit(e) {
		e.preventDefault()
		let isAuthenticated = false;

		for (const userData of data) {
			if (userData.cpf === user.login && userData.senha === user.senha) {
				isAuthenticated = true;
				break;
			}
		}

		if (isAuthenticated) {
			console.log("Usuário Autenticado");
		} else {
			toast.current.show({ severity: 'error', summary: 'Error', detail: 'CPF ou Senha Inválidos', life: 3000 });
			console.log("Não foi possível autenticar o usuário");
		}
	}



	return (
		<div>
		<Toast ref={toast} />
			<div className={styles.title}>
				<img src={logo} alt="logo" />
				<a>Sistema de Gerenciamento de Refeições</a>
			</div>
			<div className={styles.divform}>
				<form onSubmit={submit} className={styles.form}>
						<span className="p-input-icon-left">
							<i className="pi pi-user" />
							<Input type="text" text="Login" name="login" id="login" placeholder="Digite seu CPF" handleOnChange={HandleLogin} value={user.login} />
						</span>
						<span className="p-input-icon-left">
						<i className="pi pi-lock" />
						<Input type="password" text="Senha" name="senha" id="senha" placeholder="Digite sua Senha" handleOnChange={HandleSenha} value={user.senha} />
						</span>
						<Button text="Entrar" />
				</form>
			</div>
		</div>

	)
}
