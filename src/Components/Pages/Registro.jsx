import styles from './Registro.module.css'
import logo from '../../img/logo.png'
import React, { useState, useEffect, useRef } from 'react';
import { Password } from 'primereact/password'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { RegisterService } from '../imports/RegisterService';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { toast, ToastContainer } from 'react-toastify';
import { differenceInDays, differenceInHours } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';


export default function Registro() {

	const [registers, setRegisters] = useState(null);
	const [globalFilter, setGlobalFilter] = useState(null);
	const dt = useRef(null);
	const [registerDialog, setRegisterDialog] = useState(false);
	const registerService = new RegisterService();
	const [senhaUsuario, setSenhaUsuario] = useState();
	const [selectedRegister, setSelectedRegister] = useState(null); // Novo estado para armazenar o registro selecionado
	const [precoFuncAtual, setPrecoFuncAtual] = useState();
	const [precoEmpAtual, setPrecoEmpAtual] = useState();
	const [precoTotalAtual, setPrecoTotalAtual] = useState();
	const [disableSelectedRegisterButton, setDisableSelectedRegisterButton] = useState(null);
	const [ultimasRefeicoes, setUltimasRefeicoes] = useState({});
	const [ultimasRefeicoesHora, setUltimasRefeicoesHora] = useState({});


	// useEffect(() => {
	// 	registerService.getRegisters().then((data) => {
	// 		// Filtrar os registros para exibir somente os funcionários com status === true
	// 		const funcionariosAtivos = data.filter((funcionario) => funcionario.status === true);
	// 		setRegisters(funcionariosAtivos);
	// 		getPrecos();

	// 	});
	// }, []);

	useEffect(() => {
		registerService.getRegisters().then(async (data) => {
			const funcionariosAtivos = data.filter((funcionario) => funcionario.status === true);
			setRegisters(funcionariosAtivos);
			getPrecos();
			disableSelectedRegisterButtonById();


			// Buscar as primeiras refeições de cada usuário e armazenar no estado
			const ultimasRefeicoesData = {};
			const ultimasRefeicoesHora = {};
			for (const funcionario of funcionariosAtivos) {
				const ultimaRefeicao = await getUltimaRefeicao(funcionario.id);
				ultimasRefeicoesData[funcionario.id] = ultimaRefeicao;
				const ultimaRefeicaoTime = await getUltimaRefeicaoHora(funcionario.id);
				ultimasRefeicoesHora[funcionario.id] = ultimaRefeicaoTime;

			}
			setUltimasRefeicoes(ultimasRefeicoesData);
			setUltimasRefeicoesHora(ultimasRefeicoesHora)
		});
	}, []);



	const openNew = (rowData) => {
		setSelectedRegister(rowData);
		setRegisterDialog(true);
		fetch(`http://localhost:3000/setor`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			}
		})
			.then(resp => resp.json())
			.then((data) => {
				// setSetores(data)

			})

			.catch(err => console.log(err))

	}

	const hideDialog = () => {
		setRegisterDialog(false);
	}



	const header = (
		<div className={styles.tableheader}>
			<h2>Digite seu Nome</h2>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
			</span>
		</div>
	);


	const renderButton = (rowData) => {
		const isDisabled = rowData.id === disableSelectedRegisterButton;
		return (
			<Button className={styles.pbutton} label="Registrar" onClick={() => openNew(rowData)} disabled={isDisabled} />
		);
	};

	const registerDialogFooter = (
		<React.Fragment>
			<Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
			<Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={handleSalvar} />
		</React.Fragment>
	);

	function onRegisterSelect(e) {
		setSelectedRegister(e.data); // Armazena o registro selecionado ao clicar no botão "Registrar"
	}

	// function disableSelectedRegisterButtonById(id) {
	//     setDisableSelectedRegisterButton(id);
	//     setTimeout(() => {
	//     }, 6 * 60 * 60 * 1000); // 6 horas em milissegundos
	// }

	function disableSelectedRegisterButtonById(id) {
		const currentDate = new Date();

		const lastMealDate = ultimasRefeicoes[id];
		const lastMealTime = ultimasRefeicoesHora[id];


		console.log(ultimasRefeicoes)

		if (!lastMealDate || !lastMealTime) {
			// Caso não haja registro de refeição anterior, o botão pode ser habilitado
			setDisableSelectedRegisterButton(false);
			return;
		}

		const lastMealDateTime = new Date(`${lastMealDate} ${lastMealTime}`);

		// Calcula a diferença em dias entre o dia da última refeição e o dia atual
		const daysDifference = differenceInDays(currentDate, lastMealDateTime);

		if (daysDifference > 0) {
			// Desabilita o botão se o dia atual for maior que o dia do registro
			setDisableSelectedRegisterButton(true);
		} else if (daysDifference === 0) {
			// Calcula a diferença em horas entre o horário da última refeição e o horário atual
			const hoursDifference = differenceInHours(currentDate, lastMealDateTime);

			// Desabilita o botão se o dia atual for igual ao dia do registro
			// e o tempo passado for maior ou igual a 8 horas
			if (hoursDifference >= 8) {
				setDisableSelectedRegisterButton(true);
			} else {
				setDisableSelectedRegisterButton(false);
			}
		}
	}

	async function getPrecos() {
		fetch('http://localhost:3000/precos')
			.then((resp) => resp.json())
			.then((data) => {
				setPrecoFuncAtual(data[0].precofuncionario || '');
				setPrecoEmpAtual(data[0].precoempresa || '');
				setPrecoTotalAtual(data[0].precototal || '');

			})
			.catch((err) => console.log('Erro ao obter dados da API:', err));
	}

	async function handleSalvar(e) {
		e.preventDefault();
		setSenhaUsuario('')

		if (!selectedRegister) {
			console.log("Nenhum registro selecionado."); // Adicione um tratamento adequado se nenhum registro estiver selecionado.

			return;
		}

		try {
			const response = await fetch(`http://localhost:3000/data/${selectedRegister.id}`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Falha ao buscar a senha da API.");

			}

			const data = await response.json();
			const senhaEsperada = data.senha; // Supondo que a API retorne a senha do registro selecionado

			if (senhaUsuario === senhaEsperada) {
				// Senha correta, faça o que desejar aqui (por exemplo, registrar a refeição)

				let time = new Date().toLocaleTimeString("en-US", {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
				})

				let date = new Date().toLocaleDateString("en-US", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});

				// Constrói o objeto de refeição para enviar na solicitação POST
				const refeicaoData = {
					idfunc: selectedRegister.id,
					nome: selectedRegister.name,
					data: date,
					time: time,
					tipo: 'A',
					preco_funcionario: precoFuncAtual,
					preco_empresa: precoEmpAtual,
					preco_total: precoTotalAtual,
				};

				const postResponse = await fetch('http://localhost:3000/refeicoes', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(refeicaoData),
				});

				if (!postResponse.ok) {
					throw new Error('Falha ao registrar a refeição na API.');
				}

				console.log("Refeição registrada com sucesso!");
				toast.success("Refeição registrada com sucesso!");
				hideDialog();

			} else {
				// Senha incorreta
				toast.error("Senha incorreta. Tente novamente.");
			}
		} catch (error) {
			console.error(error);


		}
	}

	function handleChangeSenha(e) {
		setSenhaUsuario(e.target.value); // Atualiza o estado com a senha digitada pelo usuário
	}




	async function getUltimaRefeicao(id) {
		try {
			const response = await fetch(
				`http://localhost:3000/refeicoes?idfunc=${id}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error('Falha ao buscar a última refeição do usuário na API.');
			}

			const refeicoesDoUsuario = await response.json();
			const length = refeicoesDoUsuario.length - 1;
			return refeicoesDoUsuario[length]?.data || null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	function renderUltimaRefeicao(rowData) {
		const dataRefeicao = ultimasRefeicoes[rowData.id];


		if (dataRefeicao === undefined) {
			return 'Buscando...'; // Mostrar uma mensagem enquanto os dados estão sendo buscados
		}

		if (dataRefeicao === null) {
			return 'Nenhuma refeição registrada';
		}

		const formattedDate = new Date(dataRefeicao).toLocaleDateString('en-US', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});

		return formattedDate;
	}

	async function getUltimaRefeicaoHora(id) {
		try {
			const response = await fetch(
				`http://localhost:3000/refeicoes?idfunc=${id}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error('Falha ao buscar a última refeição do usuário na API.');
			}

			const refeicoesDoUsuario = await response.json();
			const length = refeicoesDoUsuario.length - 1;
			return refeicoesDoUsuario[length]?.time || null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	function renderUltimaRefeicaoTime(rowData) {
		const horaRefeicao = ultimasRefeicoesHora[rowData.id];

		if (horaRefeicao === undefined) {
			return 'Buscando...'; // Mostrar uma mensagem enquanto os dados estão sendo buscados
		}

		if (horaRefeicao === null) {
			return 'Nenhuma refeição registrada';
		}



		return horaRefeicao;
	}


	return (
		<>
			<ToastContainer autoClose={1000} />
			<div className={styles.title}>
				<img src={logo} alt="logo" />
				<a>Sistema de Gerenciamento de Refeições</a>
			</div>
			<div className={styles.card}>
				<DataTable ref={dt} value={registers}
					style={{ width: '100%' }}
					onSelectionChange={onRegisterSelect}
					dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} registers"
					globalFilter={globalFilter} header={header} responsiveLayout="scroll">
					<Column field="id" header="id" sortable style={{ maxWidth: '1rem' }}></Column>
					<Column field="name" header="Name" sortable style={{ maxWidth: '3rem' }}></Column>
					<Column field="setor.name" header="Setor" sortable style={{ maxWidth: '2rem' }}></Column>
					<Column header="Última Refeição" body={renderUltimaRefeicao} style={{ maxWidth: '2rem' }}></Column>
					<Column header="Hora Ultima Refeição" body={renderUltimaRefeicaoTime} style={{ maxWidth: '2rem' }}></Column>
					<Column className={styles.columnbutton} header="Registro" body={renderButton} style={{ maxWidth: '5rem' }}></Column>

				</DataTable>
			</div>

			<Dialog
				visible={registerDialog}
				style={{ width: '450px' }}
				header={`Olá ${selectedRegister?.name ?? 'usuário'}. Digite sua senha para registro da refeição.`}
				modal
				className="p-fluid"
				footer={registerDialogFooter}
				onHide={hideDialog}
			>

				<div className={styles.field}>
					<label htmlFor="senha" className={styles.label}>Senha</label>
					<Password
						id="senha"
						value={senhaUsuario}
						onChange={handleChangeSenha}
						autoFocus
						className={styles.input}
					/>
				</div>
			</Dialog>

		</>

	)
}
