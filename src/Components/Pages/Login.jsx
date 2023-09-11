import React, { useState, useEffect, useRef } from 'react'
import styles from './Login.module.css'
import logo from '../../img/logo.png'
import { Input } from '../Forms/input'
import { Button } from '../Forms/button'
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthProvider/AuthContext';


export default function Login() {

	const [user, setUser] = useState({})
	const [data, setData] = useState({})
	const [authenticated, setAuthenticated] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const toast = useRef(null);
	const { login } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		fetchData();

		localStorage.clear()

		const storedAuthData = localStorage.getItem('authData');
		if (storedAuthData) {
		  const parsedAuthData = JSON.parse(storedAuthData);
		  setAuthenticated(true);
		  setIsAdmin(parsedAuthData.isAdmin);
		}
	}, []);

	const fetchData = async () => {
		try {
			const response = await fetch('http://localhost:8080/users/');
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
		let isAdminUser = false;
		let isUser = false;

		for (const userData of data) {
			if (userData.cpf === user.login && userData.senha === user.senha) {
				isAuthenticated = true;
				isAdminUser = userData.tipo === "true";
				isUser === false

				if (isAdminUser) {
					console.log("Usuário Autenticado Como Admin");
					login({ username: user.login, isAdmin:true });
					setAuthenticated(true);
					setIsAdmin(true)
					toast.current.show({ severity: 'success', summary: 'Success', detail: 'Logado com Sucesso', life: 1000 });
					const authData = {
						cpf: user.login,
						isAdmin: isAdminUser,
					  };
					  localStorage.setItem('authData', JSON.stringify(authData));
				} else {
					login({ username: user.login, isAdmin: false });
					toast.current.show({ severity: 'success', summary: 'Success', detail: 'Logado com Sucesso', life: 1000 });
					setAuthenticated(true);
                    setIsAdmin(false);
					const authData = {
						cpf: user.login,
						isAdmin: isUser,
					  };
					localStorage.setItem('authData', JSON.stringify(authData));				
				}

				break;
			}
			
		}

		if (!isAuthenticated) {
			toast.current.show({ severity: 'error', summary: 'Error', detail: 'CPF ou Senha Inválidos', life: 3000 });
			console.log(user.Data.cpf)
			console.log(user.Data.senha)
			console.log("Não foi possível autenticar o usuário");
		}
	


	}

	if (authenticated && isAdmin) {
		console.log(localStorage.getItem('authData'))
		setTimeout(() => {
			navigate("/home");
		}, 1000);
	}

	// Se o usuário estiver autenticado e for um usuário normal, redirecione para /registro
	if (authenticated && !isAdmin) {
		console.log(localStorage.getItem('authData'))
		setTimeout(() => {
			navigate("/registro");
		}, 1000);
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
