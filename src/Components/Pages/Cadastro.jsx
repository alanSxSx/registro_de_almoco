import React, { useState, useEffect, useRef } from 'react';
import styles from './Cadastro.module.css'
import Navbar from '../Layout/Navbar'
import { classNames } from 'primereact/utils';
import { RegisterService } from '../imports/RegisterService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Password } from 'primereact/password'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';


import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';


export default function Cadastro() {

	let emptyRegister = {
		id: null,
		name: '',
		cpf: '',
		setor: [],
		senha: '',
		status: true,
		tipo: false,
	};

	const [registers, setRegisters] = useState(null);
	const [registerDialog, setRegisterDialog] = useState(false);
	const [deleteRegisterDialog, setDeleteRegisterDialog] = useState(false);
	const [deleteRegistersDialog, setDeleteRegistersDialog] = useState(false);
	const [register, setRegister] = useState(emptyRegister);
	const [selectedRegisters, setSelectedRegisters] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);
	const toast = useRef(null);
	const dt = useRef(null);
	const registerService = new RegisterService();
	const [setores, setSetores] = useState([]);
	

	useEffect(() => {
		registerService.getRegisters().then(data => setRegisters(data));
	}, []);


	const openNew = () => {
		setRegister(emptyRegister);
		setSubmitted(false);
		setRegisterDialog(true);
		console.log(register)
		fetch(`http://localhost:3000/setor`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			}
		})
			.then(resp => resp.json())
			.then((data) => {
				setSetores(data)

			})

			.catch(err => console.log(err))

	}

	const hideDialog = () => {
		setSubmitted(false);
		setRegisterDialog(false);
	}

	const hideDeleteRegisterDialog = () => {
		setDeleteRegisterDialog(false);
	}

	const hideDeleteRegistersDialog = () => {
		setDeleteRegistersDialog(false);
	}

	const saveRegister = () => {
		setSubmitted(true);

		if (!isCPFValid(register.cpf)) {
			toast.current.show({ severity: 'error', summary: 'Error', detail: 'CPF INVÁLIDO', life: 3000 });
			console.log("CPF inválido");
			return;
		}


		if (!isCPFAvailable(register.cpf)) {
			toast.current.show({ severity: 'error', summary: 'Error', detail: 'CPF já está cadastrado.', life: 3000 });
			return;
		}

		if (register.name.trim()) {
			let _registers = [...registers];
			let _register = { ...register };
			if (register.id) {
				const index = findIndexById(register.id);

				_registers[index] = _register;
				toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Alteração Concluida com Sucesso', life: 3000 });
			}
			else {
				_register.id = createId();
				_register.image = 'register-placeholder.svg';
				_registers.push(_register);
				toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Funcionário Cadastrado com Sucesso', life: 3000 });
			}

			fetch("http://localhost:3000/data", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(register)
			})
				.then((resp) => resp.json())
				.then((data) => {
					if (data.id) {
						_register.id = data.id;
					}
					setRegisters(_registers);
					setRegisterDialog(false);
					setRegister(emptyRegister);

				})
				.catch(err => console.log(err))



		}

	}

	const editRegister = (register) => {
		setRegister({ ...register });
		setRegisterDialog(true);

		fetch(`http://localhost:3000/setor`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			}
		})
			.then(resp => resp.json())
			.then((data) => {
				setSetores(data)

			})

			.catch(err => console.log(err))

	}

	const saveEditRegister = () => {
		setSubmitted(false);




		fetch(`http://localhost:3000/data/${register.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(register),
		}).then((resp) => resp.json())
			.then((data) => {
				const updatedRegister = data; // Utilize a resposta da API com os dados atualizados
				const updatedRegisters = registers.map((r) => (r.id === updatedRegister.id ? updatedRegister : r));
				setRegisters(updatedRegisters);
				toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Register Updated', life: 3000 });
				setRegisterDialog(false);
			})
			.catch(err => console.log(err));

	}


	const confirmDeleteRegister = (register) => {
		setRegister(register);
		setDeleteRegisterDialog(true);


	}

	const deleteRegister = () => {
		let _registers = registers.filter(val => val.id !== register.id);
		setRegisters(_registers);
		setDeleteRegisterDialog(false);
		setRegister(emptyRegister);
		toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Register Deleted', life: 3000 });

		fetch(`http://localhost:3000/data/${register.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},

		}).then((resp) => resp.json())
			.then(() => {
				setRegister(register.filter((registers) => registers.id !== register.id))
				// setProjectMessage('Projeto Removido com Sucesso !')
			})
			.catch(err => console.log(err))




	}


	const findIndexById = (id) => {
		let index = -1;
		for (let i = 0; i < registers.length; i++) {
			if (registers[i].id === id) {
				index = i;
				break;
			}
		}

		return index;
	}

	const createId = () => {
		let id = '';
		let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 5; i++) {
			id += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return id;
	}

	const importCSV = (e) => {
		const file = e.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const csv = e.target.result;
			const data = csv.split('\n');

			// Prepare DataTable
			const cols = data[0].replace(/['"]+/g, '').split(',');
			data.shift();

			const importedData = data.map(d => {
				d = d.split(',');
				const processedData = cols.reduce((obj, c, i) => {
					c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
					obj[c] = d[i].replace(/['"]+/g, '');
					(c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
					return obj;
				}, {});

				processedData['id'] = createId();
				return processedData;
			});

			const _registers = [...registers, ...importedData];

			setRegisters(_registers);
		};

		reader.readAsText(file, 'UTF-8');
	}

	const exportCSV = () => {
		dt.current.exportCSV();
	}

	const confirmDeleteSelected = () => {

		setDeleteRegistersDialog(true);


	}


	const deleteSelectedRegisters = () => {

		let _registers = registers.filter((val) => !selectedRegisters.includes(val))
		let selects = selectedRegisters.map(val => val.id)
		setRegisters(_registers);
		setDeleteRegistersDialog(false);
		setSelectedRegisters(null);
		setRegister(_registers)

		toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registers Deleted', life: 3000 });

		const deleteRequests = selects.map(id =>
			fetch(`http://localhost:3000/data/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ids: [id] })
			})
		);

		Promise.all(deleteRequests)
			.then(responses => {
				// Verifique se todas as solicitações de delete foram bem-sucedidas
				const allDeleted = responses.every(response => response.ok);
				if (allDeleted) {
					// Todos os registros foram excluídos com sucesso
					console.log('Registros excluídos com sucesso');
				} else {
					// Pelo menos uma solicitação de delete falhou
					console.log('Erro ao excluir registros');
				}
			})
			.catch(error => {
				// Trate o erro aqui
				console.error(error);
			});


		console.log(selects)


	}



	function getStatusLabel(status) {
		return status ? 'Ativo' : 'Inativo';
	}

	function getStatusLabelTipo(tipo) {
		return tipo ? 'Administrador' : 'Usuario';
	}

	const onInputChange = (e, name) => {
		const val = e.target ? e.target.value : e.value;
		let _register = { ...register };
		_register[name] = name === 'status' ? val === 'true' : val;

		setRegister(_register);
	}



	const leftToolbarTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button label="Novo" icon="pi pi-plus" className="p-button-success mr-2 w-12 md:w-12" onClick={openNew} />
				<Button label="Excluir" icon="pi pi-trash" className="p-button-danger w-12 md:w-12" onClick={() => confirmDeleteSelected()} />
			</React.Fragment>
		)
	}

	const rightToolbarTemplate = () => {
		return (
			<React.Fragment>
				<FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 w-12 md:w-12 m-0" onUpload={importCSV} />
				<Button label="Export" icon="pi pi-upload" className="p-button-help w-12 md:w-12" onClick={exportCSV} />
			</React.Fragment>
		)
	}



	const statusBodyTemplate = (rowData) => {
		return <span className={`register-badge status-${getStatusLabel(rowData.status).toLowerCase()}`}>{getStatusLabel(rowData.status)}</span>;
	}

	const statusBodyTemplateTipo = (rowData) => {
		return <span className={`register-badge status-${getStatusLabelTipo(rowData.tipo).toLowerCase()}`}>{getStatusLabelTipo(rowData.tipo)}</span>;
	}

	const actionBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editRegister(rowData)} />
				<Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteRegister(rowData)} />
			</React.Fragment>
		);
	}

	const header = (
		<div className="table-header">
			<h5 className="mx-0 my-1">Encontre um funcionário</h5>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
			</span>
		</div>
	);
	const registerDialogFooter = (
		<div className={styles.dialogFooter}>
			<Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
			<Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveRegister} />
		</div>
	);
	const registerDialogFooter2 = (
		<React.Fragment>
			<Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
			<Button label="Editar" icon="pi pi-check" className="p-button-text" onClick={saveEditRegister} />
		</React.Fragment>
	);
	const deleteRegisterDialogFooter = (
		<React.Fragment>
			<Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteRegisterDialog} />
			<Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteRegister} />
		</React.Fragment>
	);
	const deleteRegistersDialogFooter = (
		<React.Fragment>
			<Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteRegistersDialog} />
			<Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedRegisters} />
		</React.Fragment>
	);

	function isCPFValid(cpf) {
		// Remove any characters that are not digits
		const cleanedCPF = cpf.replace(/\D/g, '');

		if (cleanedCPF.length !== 11) {
			return false;
		}

		// Check for known invalid CPF patterns
		if (/^(\d)\1+$/.test(cleanedCPF)) {
			return false;
		}

		// Validate the CPF using its algorithm
		let sum = 0;
		for (let i = 0; i < 9; i++) {
			sum += parseInt(cleanedCPF.charAt(i)) * (10 - i);
		}
		let remainder = (sum * 10) % 11;
		if (remainder === 10 || remainder === 11) {
			remainder = 0;
		}
		if (remainder !== parseInt(cleanedCPF.charAt(9))) {
			return false;
		}

		sum = 0;
		for (let i = 0; i < 10; i++) {
			sum += parseInt(cleanedCPF.charAt(i)) * (11 - i);
		}
		remainder = (sum * 10) % 11;
		if (remainder === 10 || remainder === 11) {
			remainder = 0;
		}
		return remainder === parseInt(cleanedCPF.charAt(10))
	}

	const isCPFAvailable = (cpf) => {
		const existingRegister = registers.find(register => register.cpf === cpf);
		return !existingRegister; // Retorna true se o CPF não foi encontrado nos registros existentes
	};


	return (
		<>
			<Navbar />
			<div className={styles.cadastro}>
				<div className="datatable-crud-demo">
					<Toast ref={toast} />

					<div className="card">
						<Toolbar className={styles.toolbar} left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

						<DataTable ref={dt} value={registers} selection={selectedRegisters} onSelectionChange={(e) => setSelectedRegisters(e.value)}
							dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} registers"
							globalFilter={globalFilter} header={header} responsiveLayout="scroll">
							<Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
							<Column field="id" header="id" sortable style={{ minWidth: '3rem' }}></Column>
							<Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
							<Column field="cpf" header="CPF" sortable style={{ minWidth: '10rem' }}></Column>
							<Column field="setor.name" header="Setor" sortable style={{ minWidth: '10rem' }}></Column>
							<Column body={statusBodyTemplate} field="status" header="Status" sortable style={{ minWidth: '5rem' }}></Column>
							<Column body={statusBodyTemplateTipo} field="tipo" header="Tipo" sortable style={{ minWidth: '5rem' }}></Column>
							{/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
							{/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column> */}
							{/* <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column> */}
							{/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
							{/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
							<Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
						</DataTable>
					</div>

					<Dialog visible={registerDialog} style={{ width: '450px'}} header="Cadastro de Funcionários" modal className="p-fluid" footer={register.id === null ? registerDialogFooter : registerDialogFooter2} onHide={hideDialog}>
						{register.image && <img src={`images/register/${register.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={register.image} className="register-image block m-auto pb-3" />}
						<div className="field">
							<label htmlFor="name">Nome</label>
							<InputText id="name" value={register.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !register.name })} />
							{submitted && !register.name && <small className="p-error">Name is required.</small>}
						</div>
						<div className="field">
							<label htmlFor="cpf" className="font-bold block mb-2">CPF</label>
							<InputMask id="cpf" mask="99999999999" value={register.cpf} onChange={(e) => onInputChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !register.cpf })} />
							{submitted && !register.cpf && <small className="p-error">CPF is required.</small>}
						</div>

						<div className="field">
							<label htmlFor="setor">Setor</label>
							<Dropdown value={register.setor} options={setores} onChange={(e) => onInputChange(e, 'setor')} optionLabel="name" placeholder="Selecione o Setor" />
						</div>

						<div className="field">
							<label htmlFor="status">Status</label>
							<Dropdown value={register.status ? 'true' : 'false'} options={[
								{ label: 'Ativo', value: 'true' },
								{ label: 'Inativo', value: 'false' }
							]} onChange={(e) => onInputChange(e, 'status')} optionLabel="label" placeholder="Selecione o Status" />
						</div>

						<div className="field">
							<label htmlFor="status">Tipo</label>
							<Dropdown value={register.tipo ? 'true' : 'false'} options={[
								{ label: 'Administrador', value: 'true' },
								{ label: 'Usuario', value: 'false' }
							]} onChange={(e) => onInputChange(e, 'tipo')} optionLabel="label" placeholder="Selecione o Tipo de Usuário" />
						</div>

						<div className="field">
							<label htmlFor="senha">Senha</label>
							<Password id="senha" value={register.senha} onChange={(e) => onInputChange(e, 'senha')} required autoFocus className={classNames({ 'p-invalid': submitted && !register.senha })} />
						</div>


					</Dialog>

					<Dialog visible={deleteRegisterDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteRegisterDialogFooter} onHide={hideDeleteRegisterDialog}>
						<div className="confirmation-content">
							<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
							{register && <span>Tem certeza que deseja excluir <b>{register.name}</b>?</span>}
						</div>
					</Dialog>

					<Dialog visible={deleteRegistersDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteRegistersDialogFooter} onHide={hideDeleteRegistersDialog}>
						<div className="confirmation-content">
							<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
							{register && <span>Tem certeza que deseja deletar os registros selecionados?</span>}
						</div>
					</Dialog>
				</div>

			</div>
		</>

	)
}
