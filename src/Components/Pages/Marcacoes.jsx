import styles from './Marcacoes.module.css'
import React, { useState, useEffect, useRef } from 'react';
import { Password } from 'primereact/password'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { RegisterService } from '../imports/RegisterService';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Layout/Navbar';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { getDate } from 'date-fns';


export default function Marcacoes() {

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
	const [refeicoes, setRefeicoes] = useState();
	const [dates, setDates] = useState([]);
	const [filteredRefeicoes, setFilteredRefeicoes] = useState([]);
	const [drop, setDrop] = useState();
	const [calendar, setCalendar] = useState();
	const [timeCalendar, setTimeCalendar] = useState();





	useEffect(() => {
		registerService.getRegisters().then(async (data) => {
			const funcionariosAtivos = data.filter((funcionario) => funcionario.status === true);
			setRegisters(funcionariosAtivos);
			getPrecos();
			getRefeicoes();
		});
	}, []);



	const hideDialog = () => {
		setRegisterDialog(false);
	}

	function handleDates(e) {
		setDates(e.target.value)
	}

	function handleExibir() {
		getRefeicoes();
		if (dates.length === 2) {
			const filtered = filterRefeicoes(dates);
			setFilteredRefeicoes(filtered);
		}
	}



	const header = (
		<div className={styles.tableheader}>
			<h2>Selecione o Intervalo de Datas</h2>
			<div className='flex'>
				<span className="p-input-icon-left mr-3">
					<i className="pi pi-search" />
					<Calendar value={dates} onChange={handleDates} selectionMode="range" dateFormat="dd/mm/yy" readOnlyInput />
				</span>
				<Button onClick={handleExibir}>Exibir</Button>
			</div>
			<h2 className='mt-3'>Digite o Nome do Funcionário</h2>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
			</span>
		</div>
	);

	const registerDialogFooter = (
		<React.Fragment>
			<Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
			<Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={handleSalvar} />
		</React.Fragment>
	);

	function onRegisterSelect(e) {
		setSelectedRegister(e.data); // Armazena o registro selecionado ao clicar no botão "Registrar"
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

	async function getRefeicoes() {
		fetch('http://localhost:3000/refeicoes')
			.then((resp) => resp.json())
			.then((data) => {
				setRefeicoes(data)

			})
			.catch((err) => console.log('Erro ao obter dados da API:', err));
	}

	async function handleSalvar(e) {
		e.preventDefault();

		try {
			if (!calendar || !timeCalendar || !drop) {
				throw new Error('Por favor, preencha todos os campos necessários.');
			}

			const time = new Date(timeCalendar).toLocaleTimeString("en-US", {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			});

			const date = new Date(calendar).toLocaleDateString("en-US", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});

			const refeicaoData = {
				idfunc: drop.id,
				nome: drop.name,
				data: date,
				time: time,
				tipo: 'M',
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
			//atualiza FRONT
			setDrop('')
			setTimeCalendar('')
			setCalendar('')
			getRefeicoes();
		} catch (error) {
			console.error('Erro ao salvar refeição:', error.message);
			toast.error('Erro ao salvar refeição. Verifique os campos e tente novamente.');
		}
	}



function handleChangeSenha(e) {
	setSenhaUsuario(e.target.value); // Atualiza o estado com a senha digitada pelo usuário
}


function filterRefeicoes(dates) {
	const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
		const dataRef = new Date(refeicao.data);
		const dataInicial = new Date(dates[0]);
		const dataFinal = new Date(dates[1]);

		return (
			dataRef >= dataInicial &&
			dataRef <= dataFinal
		);
	});

	return refeicoesDoFuncionarioNoIntervalo.map((refeicao) => ({
		...refeicao,
		data: new Date(refeicao.data).toLocaleDateString('pt-BR'), // Formata a data para "DD/MM/YYYY"
	}));
}

function handleDrop(e) {
	setDrop(e.target.value)
}
function handleCalendar(e) {
	setCalendar(e.target.value)
}
function handleTimeCalendar(e) {
	setTimeCalendar(e.target.value)
}



return (
	<>
		<ToastContainer autoClose={1000} />
		<Navbar />

		<div className={styles.card}>
			<div className='mb-3 mt-3 flex flex-column justify-content-center align-items-center '>
				<h2 className='mb-3'>Adicione uma Refeição para o Funcionário:</h2>
				<div>
					<Dropdown value={drop} onChange={handleDrop} options={registers} optionLabel="name"
						placeholder="Selecione o Funcionário" className="w-full md:w-14rem mr-3" />
					<Calendar value={calendar} onChange={handleCalendar} dateFormat="dd/mm/yy" className='mr-3' />
					<Calendar value={timeCalendar} onChange={handleTimeCalendar} timeOnly className='mr-3' />
					<Button className={styles.pbutton} label="Registrar" onClick={handleSalvar} />
				</div>
			</div>
			<DataTable ref={dt} value={filteredRefeicoes}
				style={{ width: '100%' }}
				onSelectionChange={onRegisterSelect}
				dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} registers"
				globalFilter={globalFilter} header={header} responsiveLayout="scroll">
				<Column field="id" header="id" sortable style={{ minWidth: '1rem' }}></Column>
				<Column field="nome" header="Nome" sortable style={{ minWidth: '3rem' }}></Column>
				<Column field="data" header="Data" sortable style={{ minWidth: '3rem' }}></Column>
				<Column field="time" header="Time" sortable style={{ minWidth: '3rem' }}></Column>
				<Column field="tipo" header="Tipo" sortable style={{ minWidth: '3rem' }}></Column>



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
