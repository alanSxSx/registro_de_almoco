import React, { useEffect, useState } from 'react'
import styles from './Home.module.css'
import Navbar from '../Layout/Navbar'
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';


export default function Home() {

    const [data, setData] = useState([]);
    const [precos, setPrecos] = useState();
    const [refeicoes, setRefeicoes] = useState();
    const [dates, setDates] = useState(null);
    const [totalAPagarPorFuncionarioCalculated, setTotalAPagarPorFuncionarioCalculated] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const dataResponse = await getData();

                const precosResponse = await getPrecos();
                const refeicoesResponse = await getRefeicoes();

                setData(dataResponse);
                setPrecos(precosResponse);
                setRefeicoes(refeicoesResponse);
            } catch (error) {
                console.error('Erro ao obter os dados:', error);
            }
        }

        fetchData();
    }, [dates]);


    // Função para fazer o GET na tabela "data"
    async function getData() {
        const response = await fetch('http://localhost:3000/data');
        const data = await response.json();
        return data;
    }


    // Função para fazer o GET na tabela "precos"
    async function getPrecos() {
        const response = await fetch('http://localhost:3000/precos');
        const precos = await response.json();
        return precos;
    }

    // Função para fazer o GET na tabela "refeicoes"
    async function getRefeicoes() {
        const response = await fetch('http://localhost:3000/refeicoes');
        const refeicoes = await response.json();
        return refeicoes;
    }

    const funcionariosInativos = data ? data.filter((funcionario) => !funcionario.status) : [];
    const refeicoesTipoM = refeicoes ? refeicoes.filter((refeicao) => refeicao.tipo === 'M') : [];

    function calcularTotalAPagarPorFuncionario() {
        
        console.log('Ativado');
    
        setTotalAPagarPorFuncionarioCalculated({}); // Limpa os totais calculados
    
        if (!dates || !refeicoes || !precos || !data) {
            console.log("Dados insuficientes para o cálculo.");
            return;
        }
    
        const totalPorFuncionario = {};
    
        data.forEach((funcionario) => {
            const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
              const dataRef = new Date(refeicao.data);
              const dataInicial = new Date(dates[0]);
              const dataFinal = new Date(dates[1]);
        
              // Ajustar para comparar apenas dia, mês e ano

              console.log(dataRef == dataInicial)
              console.log(dataInicial)
              console.log(dataFinal)
        
              return (
                dataRef >= dataInicial &&
                dataRef <= dataFinal &&
                refeicao.idfunc === funcionario.id
              );
            });
            
    
            const totalAPagarFuncionario = refeicoesDoFuncionarioNoIntervalo.reduce(
                (total, refeicao) => total + parseFloat(refeicao.preco_funcionario),
                0
            );
    
            totalPorFuncionario[funcionario.id] = totalAPagarFuncionario;
        });

        
    
        setTotalAPagarPorFuncionarioCalculated(totalPorFuncionario);
        console.log(totalPorFuncionario)
        
      }
    



    return (
        <>
            <Navbar />
            <div className={styles.home}>
                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Funcionários</span>
                                <div className="text-900 font-medium text-xl">{data ? data.length : 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-user text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-red-500 font-medium"> {funcionariosInativos.length} {funcionariosInativos.length === 1 ? "Funcionário" : "Funcionários"} Inativos </span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Refeições</span>
                                <div className="text-900 font-medium text-xl">{refeicoes ? refeicoes.length : 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-yellow-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-apple text-yellow-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-yellow-500 font-medium">{refeicoesTipoM ? refeicoesTipoM.length : 0} Refeições Lançadas Manualmente </span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-4">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Preço da Refeição</span>
                                <div className="text-900 font-medium text-xl">Preço Total: <b>{precos ? `R$${precos[0].precototal}` : '-'}</b></div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-dollar text-green-500 text-xl"></i>
                            </div>
                        </div>
                        <div className="text-green-500 font-medium">Preço Funcionário: <b>{precos ? `R$${precos[0].precofuncionario}` : '-'}</b></div>
                        <div className="text-green-500 font-medium">Preço Empresa: <b>{precos ? `R$${precos[0].precoempresa}` : '-'}</b></div>
                    </div>
                </div>

                <div className="col-12 md:col-6 lg:col-12 flex justify-content-center">
                    <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput  />
                </div>
                <div className="col-12 md:col-6 lg:col-12 flex justify-content-center">
                    <Button onClick={calcularTotalAPagarPorFuncionario}>Exibir</Button>
                </div>

                <div className="col-12 md:col-6 lg:col-12 flex justify-content-center">
                    {data ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Funcionário</th>
                                    <th>Total a Pagar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((funcionario) => (
                                    <tr key={funcionario.id}>
                                        <td>{funcionario.name}</td>
                                        <td>{`R$${totalAPagarPorFuncionarioCalculated[funcionario.id] || 0}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> )
                    : (
                            <div>Aguardando o carregamento dos dados...</div>
                            )}           
                </div> 
            </div>
        </>

    )
}

