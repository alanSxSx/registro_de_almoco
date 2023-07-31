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

export default function Registro() {

    const [registers, setRegisters] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const [registerDialog, setRegisterDialog] = useState(false);
    const registerService = new RegisterService();
    const [senhaUsuario, setSenhaUsuario] = useState();
    const [selectedRegister, setSelectedRegister] = useState(null); // Novo estado para armazenar o registro selecionado
    const [setores, setSetores] = useState(null);
    const [loading, setLoading] = useState(false);
    const [precos, setPrecos] = useState(null);
    const [precoFuncAtual, setPrecoFuncAtual] = useState();
    const [precoEmpAtual, setPrecoEmpAtual] = useState();
    const [precoTotalAtual, setPrecoTotalAtual] = useState();


    useEffect(() => {
        registerService.getRegisters().then(data => setRegisters(data));
        getPrecos();
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
                setSetores(data)

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
        return (
            <Button className={styles.pbutton} label="Registrar" onClick={() => openNew(rowData)} />
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

    async function getPrecos() {
        fetch('http://localhost:3000/precos')
            .then((resp) => resp.json())
            .then((data) => {
                setPrecos(data);
                setPrecoFuncAtual(data[0].precofuncionario || '');
                setPrecoEmpAtual(data[0].precoempresa || '');
                setPrecoTotalAtual(data[0].precototal || '');
            })
            .catch((err) => console.log('Erro ao obter dados da API:', err));
    }

    async function handleSalvar(e) {
        e.preventDefault();
        setLoading(true);
        setSenhaUsuario('')

        if (!selectedRegister) {
            console.log("Nenhum registro selecionado."); // Adicione um tratamento adequado se nenhum registro estiver selecionado.
            setLoading(false);
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

                let time = new Date().toLocaleTimeString("pt-br", {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
                
                let date = new Date().toLocaleDateString("pt-br", {
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
                    preco_funcionario: precoFuncAtual,
                    preco_empresa: precoEmpAtual,
                    preco_total: precoTotalAtual,
                };

                console.log(refeicaoData)

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
                hideDialog();
            } else {
                // Senha incorreta
                console.log("Senha incorreta. Tente novamente.");
            }
        } catch (error) {
            console.error(error);
            console.log("Preços retornados:", precos);
            console.log("Erro ao verificar a senha. Tente novamente mais tarde.");
            console.log(refeicaoData)

        } finally {
            setLoading(false);
        }
    }

    function handleChangeSenha(e) {
        setSenhaUsuario(e.target.value); // Atualiza o estado com a senha digitada pelo usuário
    }



    return (
        <>
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
                    <Column field="name" header="Name" sortable style={{ maxWidth: '8rem' }}></Column>
                    <Column field="setor.name" header="Setor" sortable style={{ maxWidth: '5rem' }}></Column>
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
