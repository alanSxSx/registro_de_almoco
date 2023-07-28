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
        name: '',
        cpf: '',
        setor: [],
        senha: '',
        status: true,
    };


    const [registers, setRegisters] = useState(null);
    const [selectedRegisters, setSelectedRegisters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const registerService = new RegisterService();


    useEffect(() => {
        registerService.getRegisters().then(data => setRegisters(data));
    }, []);

    const leftToolbarTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="p-button-success mr-2" onClick={""} />
                <Button label="Excluir" icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDeleteSelected(rowData)} />
            </React.Fragment>
        )
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
            <Button label="Registrar" onClick={() => handleButtonClicked(rowData)} />
        );
    };




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
                    <Column field="id" header="id" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="setor.name" header="Setor" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={renderButton} style={{ minWidth: '5rem' }}></Column>

                </DataTable>
            </div>
        </>

    )
}