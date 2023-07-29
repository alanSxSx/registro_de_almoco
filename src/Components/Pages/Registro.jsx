import styles from './Registro.module.css'
import logo from '../../img/logo.png'
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { RegisterService } from '../imports/RegisterService';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';




export default function Registro() {

	let emptyRegister = {
		id: null,
		id_func: null,
		data_reg: '',
		senha: '',
	};


	const [registers, setRegisters] = useState(null);
	const [selectedRegisters, setSelectedRegisters] = useState(null);
	const [globalFilter, setGlobalFilter] = useState(null);
	const dt = useRef(null);
	const [registerDialog, setRegisterDialog] = useState(false);
	const registerService = new RegisterService();


	useEffect(() => {
		registerService.getRegisters().then(data => setRegisters(data));
	}, []);


	const openNew = () => {
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

	const leftToolbarTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button label="Novo" icon="pi pi-plus" className="p-button-success mr-2" onClick={""} />
				<Button label="Excluir" icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteSelected(rowData)} />
			</React.Fragment>
		)
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
		return (
			<Button className={styles.pbutton} label="Registrar" onClick={openNew} />
		);
	};

	const registerDialogFooter = (
		<React.Fragment>
				<Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
				<Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={""} />
		</React.Fragment>
);




	return (
		<>
			<div className={styles.title}>
				<img src={logo} alt="logo" />
				<a>Sistema de Gerenciamento de Refeições</a>
			</div>
			<div className={styles.card}>
				<DataTable ref={dt} value={registers}
					style={{ width: '100%' }}

					dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} registers"
					globalFilter={globalFilter} header={header} responsiveLayout="scroll">
					<Column field="id" header="id" sortable style={{ maxWidth: '1rem' }}></Column>
					<Column field="name" header="Name" sortable style={{ maxWidth: '8rem' }}></Column>
					<Column field="setor.name" header="Setor" sortable style={{ maxWidth: '5rem' }}></Column>
					<Column className={styles.columnbutton} header="Registro" body={renderButton} style={{ maxWidth: '5rem' }}></Column>

				</DataTable>
			</div>
			<Dialog
				visible={registerDialog}
				style={{ width: '450px' }}
				header="Digite sua senha para registro da refeição"
				modal
				className="p-fluid"
				footer={registerDialogFooter}
				onHide={hideDialog}
			>

				<div className="field">
					<label htmlFor="senha">Senha</label>
					<Password
						id="senha"
						value={""}
						onChange={(e) => onInputChange(e, 'senha')}
						autoFocus
						className={""}
					/>
				</div>
			</Dialog>
		</>

	)
}
