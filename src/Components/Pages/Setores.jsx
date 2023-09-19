import React, { useState, useEffect, useRef } from 'react';
import styles from './Setores.module.css'
import Navbar from '../Layout/Navbar'
import { classNames } from 'primereact/utils';
import { RegisterService } from '../imports/RegisterService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';


import 'react-toastify/dist/ReactToastify.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';
import Footer from '../Layout/Footer';


export default function Setores() {

    let emptySetores = {
        name: '',
        code: ''
    };

    const [registers, setRegisters] = useState(null);
    const [registerDialog, setRegisterDialog] = useState(false);
    const [deleteRegisterDialog, setDeleteRegisterDialog] = useState(false);
    const [deleteRegistersDialog, setDeleteRegistersDialog] = useState(false);
    const [register, setRegister] = useState(emptySetores);
    const [selectedRegisters, setSelectedRegisters] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const registerService = new RegisterService();
    const [setores, setSetores] = useState([]);


    useEffect(() => {
        registerService.getRegisters().then(data => setRegisters(data));
        registerService.getSetores().then(data => setSetores(data));

    }, []);

    const fetchSetores = () => {
        // Faça a requisição GET para buscar os dados atualizados dos setores
        registerService.getSetores().then(data => setSetores(data));
    }



    const openNew = () => {
        setRegister(emptySetores);
        setSubmitted(false);
        setRegisterDialog(true);

        registerService.getSetores().then(data => setSetores(data));

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

        if (register.name.trim()) {
            // Verifique se já existe um setor com o mesmo nome
            const existingSetor = setores.find((setor) => setor.name === register.name);
            if (existingSetor) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Já existe um setor com este nome', life: 3000 });      
                return; // Não prosseguir com o salvamento
            }
        
            let _registers = [...registers];
            let _register = { ...register };

            // Envia o registro do setor para o servidor
            fetch("http://localhost:8080/setores", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(_register)
            })
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.id) {
                        _register.id = data.id;
                    }
                    //console.log(data)
                    const newRegisters = [..._registers, _register];
                    setRegisters(newRegisters);
                    setRegisterDialog(false);
                    setRegister({});
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registro de Setor Salvo com Sucesso', life: 3000 });
                    fetchSetores();    
                })
                .catch(err => console.log(err))
            }

        console.log(register)

    }

    const editRegister = (register) => {
        setRegister({ ...register });
        setRegisterDialog(true);

        fetch(`http://localhost:8080/setores`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            }
        })
            .then(resp => resp.json())
            .then((data) => {
                setSetores(data)
                console.log(registers)

            })

            .catch(err => console.log(err))


    }

    const saveEditRegister = () => {
        setSubmitted(false);

        fetch(`http://localhost:8080/setores/`, {
            method: 'PUT',
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
                fetchSetores();
                console.log(register)
            })
            .catch(err => console.log(err));

        console.log(register)

    }


    const confirmDeleteRegister = (register) => {
        setRegister(register);
        setDeleteRegisterDialog(true);

    }

    const deleteRegister = () => {
        let _registers = registers.filter(val => val.id !== register.id);
        setRegisters(_registers);
        setDeleteRegisterDialog(false);
        setRegister(emptySetores);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Register Deleted', life: 3000 });

        fetch(`http://localhost:8080/setores/${register.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },

        }).then((resp) => resp.json())
            .then(() => {
                setRegister(register.filter((registers) => registers.id !== register.id))
                
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Registro deletado com Sucesso', life: 3000 });
                // setProjectMessage('Projeto Removido com Sucesso !')
            })
            .catch(err => console.log(err))

            fetchSetores();


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
            fetch(`http://localhost:8080/users/${id}`, {
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


    const onInputChange = (e, name) => {
        let _register = { ...register };
        const val = e.target.value; // Use e.value para obter o valor selecionado

      
        _register[name] = val;
        

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
            <h5 className="mx-0 my-1">Encontre um Setor</h5>
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

    


    return (
        <>
          <Toast ref={toast} />
            <Navbar />
            <div className={styles.cadastro}>
                <div className="datatable-crud-demo">
                    <Toast ref={toast} />

                    <div className="card">
                        <Toolbar className={styles.toolbar} left={leftToolbarTemplate} ></Toolbar>

                        <DataTable ref={dt} value={setores} selection={selectedRegisters} onSelectionChange={(e) => setSelectedRegisters(e.value)}
                            dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} registers"
                            globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                            <Column field="id" header="id" sortable style={{ minWidth: '3rem' }}></Column>
                            <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                            <Column field="code" header="Abreviação" sortable style={{ minWidth: '10rem' }}></Column>
                            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                        </DataTable>
                    </div>

                    <Dialog visible={registerDialog} style={{ width: '450px' }} header="Cadastro de Setores" modal className="p-fluid" footer={register.id ? registerDialogFooter2 : registerDialogFooter} onHide={hideDialog}>
                        {register.image && <img src={`images/register/${register.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={register.image} className="register-image block m-auto pb-3" />}
                        <div className="field">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={register.name ? register.name : ''} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !register.name })} />
                            {submitted && !register.name && <small className="p-error">Nome necessário.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="code">Abreviação</label>
                            <InputText id="code" value={register.code ? register.code : ''} onChange={(e) => onInputChange(e, 'code')} required  className={classNames({ 'p-invalid': submitted && !register.code })} />
                            {submitted && !register.code && <small className="p-error">Abreviação necessária.</small>}
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
            <Footer/>
        </>

    )
}

