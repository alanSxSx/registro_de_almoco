import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.css";
import Navbar from "../Layout/Navbar";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import logo from "../../img/logo.png";
import api from "../Axios/api";
import Footer from "../Layout/Footer";

export default function Home() {
  const [data, setData] = useState([]);
  const toast = useRef(null);
  const [precos, setPrecos] = useState();
  const [refeicoes, setRefeicoes] = useState();
  const [dates, setDates] = useState(null);
  const [totalQtdePorFuncionario,setTotalQtdePorFuncionario] = useState({});
  const [
    totalAPagarPorFuncionarioCalculated,
    setTotalAPagarPorFuncionarioCalculated,
  ] = useState({});
  const [
    totalAPagarPorFuncionarioEmpresa,
    setTotalAPagarPorFuncionarioEmpresa,
  ] = useState({});
  const [totalAPagarPorFuncionarioGeral, setTotalAPagarPorFuncionarioGeral] =
    useState({});

  const cols = [
    { field: "name", header: "Nome Funcionario" },
    { field: "totalQtde", header: "Total de Refeições" },
    { field: "totalFuncionario", header: "Total a Pagar" },
    { field: "totalEmpresa", header: "Total Empresa" },
    { field: "totalGeral", header: "Total Agregado" },
  ];

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
        console.error("Erro ao obter os dados:", error);
      }
    }

    fetchData();
  }, [dates]);

  // Função para fazer o GET na tabela "users"
  async function getData() {
    try {
      const response = await api.get("/users"); // Use o caminho relativo após configurar a URL base
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Erro ao obter dados de usuários:", error);
      throw error; // Você pode optar por relançar o erro ou lidar com ele de acordo com a necessidade.
    }
  }

  // Função para fazer o GET na tabela "precos"
  async function getPrecos() {
    try {
      const response = await api.get("/precos"); // Use o caminho relativo após configurar a URL base
      const precos = response.data;
      return precos;
    } catch (error) {
      console.error("Erro ao obter dados de preços:", error);
      throw error; // Você pode optar por relançar o erro ou lidar com ele de acordo com a necessidade.
    }
  }

  // Função para fazer o GET na tabela "refeicoes"
  async function getRefeicoes() {

    try {
      const response = await api.get("/refeicoes"); // Use o caminho relativo após configurar a URL base
      const refeicoes = response.data;
      return refeicoes;
    } catch (error) {
      console.error("Erro ao obter dados de refeições:", error);
      throw error; // Você pode optar por relançar o erro ou lidar com ele de acordo com a necessidade.
    }
  }

  const funcionariosInativos = data
    ? data.filter((funcionario) => funcionario.status === "false")
    : [];
  const refeicoesTipoM = refeicoes
    ? refeicoes.filter((refeicao) => refeicao.tipo === "M")
    : [];

  function calcularTotalAPagarPorFuncionario() {
    setTotalAPagarPorFuncionarioCalculated({}); // Limpa os totais calculados

    if (!dates || !refeicoes || !precos || !data) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Escolha uma data",
        life: 3000,
      });
      console.log("Dados insuficientes para o cálculo.");
      return;
    }

    const totalPorFuncionario = {};

    // data.forEach((funcionario) => {
    //   const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
    //     const dataRef = new Date(refeicao.data);
    //     const dataInicial = new Date(dates[0]);
    //     const dataFinal = new Date(dates[1]);

    //     // Ajustar para comparar apenas dia, mês e ano

    //     return (
    //       dataRef >= dataInicial &&
    //       dataRef <= dataFinal &&
    //       refeicao.id_funcionario === funcionario.id
    //     );
    //   });

    data.forEach((funcionario) => {
      const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
        const dataRefeicao = new Date(refeicao.data);
  
        // Obtenha a parte da data em formato 'yyyy-mm-dd'
        const dataRefeicaoString = dataRefeicao.toISOString().split("T")[0];
  
        if (dates.length === 2) {
          const startDate = new Date(dates[0]);
          const endDate = new Date(dates[1]);
  
          // Obtenha a parte da data em formato 'yyyy-mm-dd'
          const startDateString = startDate.toISOString().split("T")[0];
          const endDateString = endDate.toISOString().split("T")[0];
  
          // Compare as datas em formato 'yyyy-mm-dd'
          return (
            dataRefeicaoString >= startDateString &&
            dataRefeicaoString <= endDateString &&
            refeicao.id_funcionario === funcionario.id
          );
        }
        return false;
      });

      const totalAPagarFuncionario = refeicoesDoFuncionarioNoIntervalo.reduce(
        (total, refeicao) => total + parseFloat(refeicao.preco_funcionario),
        0,
      );

      totalPorFuncionario[funcionario.id] = totalAPagarFuncionario;
    });

    setTotalAPagarPorFuncionarioCalculated(totalPorFuncionario);
  }

  //FIM TOTAL A PAGAR POR FUNCIONARIO ---------------------------------------------------------

  function TotalAPagarEmpresa() {
    setTotalAPagarPorFuncionarioEmpresa({}); // Limpa os totais calculados

    if (!dates || !refeicoes || !precos || !data) {
      console.log("Dados insuficientes para o cálculo.");
      return;
    }

    const totalPorFuncionario = {};

    // data.forEach((funcionario) => {
    //   const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
    //     const dataRef = new Date(refeicao.data);
    //     const dataInicial = new Date(dates[0]);
    //     const dataFinal = new Date(dates[1]);

    //     // Ajustar para comparar apenas dia, mês e ano

    //     return (
    //       dataRef >= dataInicial &&
    //       dataRef <= dataFinal &&
    //       refeicao.id_funcionario === funcionario.id
    //     );
    //   });
    data.forEach((funcionario) => {
      const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
        const dataRefeicao = new Date(refeicao.data);
  
        // Obtenha a parte da data em formato 'yyyy-mm-dd'
        const dataRefeicaoString = dataRefeicao.toISOString().split("T")[0];
  
        if (dates.length === 2) {
          const startDate = new Date(dates[0]);
          const endDate = new Date(dates[1]);
  
          // Obtenha a parte da data em formato 'yyyy-mm-dd'
          const startDateString = startDate.toISOString().split("T")[0];
          const endDateString = endDate.toISOString().split("T")[0];
  
          // Compare as datas em formato 'yyyy-mm-dd'
          return (
            dataRefeicaoString >= startDateString &&
            dataRefeicaoString <= endDateString &&
            refeicao.id_funcionario === funcionario.id
          );
        }
        return false;
      });


      const totalAPagarFuncionario = refeicoesDoFuncionarioNoIntervalo.reduce(
        (total, refeicao) => total + parseFloat(refeicao.preco_empresa),
        0,
      );

      totalPorFuncionario[funcionario.id] = totalAPagarFuncionario;
    });

    setTotalAPagarPorFuncionarioEmpresa(totalPorFuncionario);
  }

  //FIM TOTAL A PAGAR POR FUNCIONARIO ---------------------------------------------------------

  function TotalAPagarGeral() {
    setTotalAPagarPorFuncionarioGeral({}); // Limpa os totais calculados

    if (!dates || !refeicoes || !precos || !data) {
      console.log("Dados insuficientes para o cálculo.");
      return;
    }

    const totalPorFuncionario = {};

    // data.forEach((funcionario) => {
    //   const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
    //     const dataRef = new Date(refeicao.data);
    //     const dataInicial = new Date(dates[0]);
    //     const dataFinal = new Date(dates[1]);

    //     // Ajustar para comparar apenas dia, mês e ano

    //     return (
    //       dataRef >= dataInicial &&
    //       dataRef <= dataFinal &&
    //       refeicao.id_funcionario === funcionario.id
    //     );
    //   });
    data.forEach((funcionario) => {
      const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
        const dataRefeicao = new Date(refeicao.data);
  
        // Obtenha a parte da data em formato 'yyyy-mm-dd'
        const dataRefeicaoString = dataRefeicao.toISOString().split("T")[0];
  
        if (dates.length === 2) {
          const startDate = new Date(dates[0]);
          const endDate = new Date(dates[1]);
  
          // Obtenha a parte da data em formato 'yyyy-mm-dd'
          const startDateString = startDate.toISOString().split("T")[0];
          const endDateString = endDate.toISOString().split("T")[0];
  
          // Compare as datas em formato 'yyyy-mm-dd'
          return (
            dataRefeicaoString >= startDateString &&
            dataRefeicaoString <= endDateString &&
            refeicao.id_funcionario === funcionario.id
          );
        }
        return false;
      });


      const totalAPagarFuncionario = refeicoesDoFuncionarioNoIntervalo.reduce(
        (total, refeicao) => total + parseFloat(refeicao.preco_total),
        0,
      );

      totalPorFuncionario[funcionario.id] = totalAPagarFuncionario;
    });

    setTotalAPagarPorFuncionarioGeral(totalPorFuncionario);
  }

  //FIM TOTAL A PAGAR GERAL POR FUNCIONARIO ---------------------------------------------------------

  function TotalQtdeFunc() {
    setTotalQtdePorFuncionario({}); // Limpa os totais calculados

    if (!dates || !refeicoes || !precos || !data) {
      console.log("Dados insuficientes para o cálculo.");
      return;
    }

    const totalPorFuncionario = {};

    data.forEach((funcionario) => {
      const refeicoesDoFuncionarioNoIntervalo = refeicoes.filter((refeicao) => {
        const dataRefeicao = new Date(refeicao.data);
  
        // Obtenha a parte da data em formato 'yyyy-mm-dd'
        const dataRefeicaoString = dataRefeicao.toISOString().split("T")[0];
  
        if (dates.length === 2) {
          const startDate = new Date(dates[0]);
          const endDate = new Date(dates[1]);
  
          // Obtenha a parte da data em formato 'yyyy-mm-dd'
          const startDateString = startDate.toISOString().split("T")[0];
          const endDateString = endDate.toISOString().split("T")[0];
  
          // Compare as datas em formato 'yyyy-mm-dd'
          return (
            dataRefeicaoString >= startDateString &&
            dataRefeicaoString <= endDateString &&
            refeicao.id_funcionario === funcionario.id
          );
        }
        return false;
      });


      // const totalAPagarFuncionario = refeicoesDoFuncionarioNoIntervalo.reduce(
      //   (total, refeicao) => total + parseFloat(refeicao.preco_empresa),
      //   0,
      // );
      const totalRegistrosFuncionario = refeicoesDoFuncionarioNoIntervalo.length;

      totalPorFuncionario[funcionario.id] = totalRegistrosFuncionario;
    });

    setTotalQtdePorFuncionario(totalPorFuncionario);
  }

  //FIM TOTAL QTDE

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        // Cria uma cópia dos dados atualizados para exibir no PDF
        const updatedData = data.map((funcionario) => ({
          ...funcionario,
          totalQtde: totalQtdePorFuncionario[funcionario.id] || 0,
          totalFuncionario:
            totalAPagarPorFuncionarioCalculated[funcionario.id] || 0,
          totalEmpresa: totalAPagarPorFuncionarioEmpresa[funcionario.id] || 0,
          totalGeral: totalAPagarPorFuncionarioGeral[funcionario.id] || 0,
        
        }));

        // Calcula os totais
        const totalQtdeFunc = updatedData.reduce(
          (total, funcionario) => total + funcionario.totalQtde,
          0,
        );
        const totalFuncAPagar = updatedData.reduce(
          (total, funcionario) => total + funcionario.totalFuncionario,
          0,
        );
        const totalGeralAPagarEmp = updatedData.reduce(
          (total, funcionario) => total + funcionario.totalEmpresa,
          0,
        );
        const totalGeralAPagar = updatedData.reduce(
          (total, funcionario) => total + funcionario.totalGeral,
          0,
        );

        const totalRow = [
          { content: "Total", styles: { fontStyle: "bold" } },
          {
            content: totalQtdeFunc.toString(),
            styles: { fontStyle: "bold" },
          },
          {
            content: totalFuncAPagar.toString(),
            styles: { fontStyle: "bold" },
          },
          {
            content: totalGeralAPagarEmp.toString(),
            styles: { fontStyle: "bold" },
          },
          {
            content: totalGeralAPagar.toString(),
            styles: { fontStyle: "bold" },
          },
        ];

        updatedData.push(totalRow);

        const doc = new jsPDF.default(0, 0);

        let date1 = dates[0].toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        let date2 = dates[1].toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const title = `Relatório de Almoço por Funcionário: De ${date1} até ${date2}`;
        const titleX =
          (doc.internal.pageSize.width -
            (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
              doc.internal.scaleFactor) /
          2;
        const titleY = 10;
        doc.text(title, titleX, titleY);

        // Usando a cópia dos dados atualizados para gerar o PDF
        doc.autoTable({
          columns: exportColumns,
          body: updatedData,
          didDrawPage: (data) => {
            // Adicionar rodapé personalizado somente na última página
            const pageCount = doc.internal.getNumberOfPages();
            if (data.pageNumber === pageCount) {
              const pageHeight = doc.internal.pageSize.height;
              const text = ""; //escrever alguma mensagem pra sair no rodapé do pdf
              const textWidth =
                (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
                doc.internal.scaleFactor;
              const x = (doc.internal.pageSize.width - textWidth) / 2;
              const y = pageHeight - 10;
              doc.text(text, x, y);
            }
          },
        });

        doc.save("almoco.pdf");
      });
    });
  };

  const header = (
    <div className="flex align-items-center justify-content-around gap-2">
      <img src={logo} className="w-4rem h-4rem"></img>
      <a className="text-2xl">Relatório de Almoço por Funcionário</a>
      <Button
        type="button"
        icon="pi pi-file-pdf"
        severity="warning"
        rounded
        onClick={exportPdf}
        data-pr-tooltip="PDF"
      />
    </div>
  );

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const totalQtdeRefs = data.reduce((total, funcionario) => {
    return total + (totalQtdePorFuncionario[funcionario.id] || 0);
  }, 0);
  const totalFuncAPagar = data.reduce((total, funcionario) => {
    return total + (totalAPagarPorFuncionarioCalculated[funcionario.id] || 0);
  }, 0);

  const totalGeralAPagarEmp = data.reduce((total, funcionario) => {
    return total + (totalAPagarPorFuncionarioEmpresa[funcionario.id] || 0);
  }, 0);

  const totalGeralAPagar = data.reduce((total, funcionario) => {
    return total + (totalAPagarPorFuncionarioGeral[funcionario.id] || 0);
  }, 0);


  function handleButtonExibir() {
    calcularTotalAPagarPorFuncionario();
    TotalAPagarEmpresa();
    TotalAPagarGeral();
    TotalQtdeFunc();
    setData([...data]);
    console.log(refeicoes);
  }

  return (
    <>
      <Navbar />
      <Toast ref={toast} />
      <div className={styles.home}>
        <div className="col-12 md:col-12 lg:col-4">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3 h-4rem">
              <div>
                <span className="block text-500 font-medium mb-3">
                  Funcionários
                </span>
                <div className="text-900 font-medium text-xl">
                  {data ? data.length : 0}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-user text-blue-500 text-xl"></i>
              </div>
            </div>
            <span className="text-red-500 font-medium">
              {" "}
              {funcionariosInativos.length}{" "}
              {funcionariosInativos.length === 1
                ? "Funcionário"
                : "Funcionários"}{" "}
              Inativos{" "}
            </span>
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-4">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3 h-4rem">
              <div>
                <span className="block text-500 font-medium mb-3">
                  Refeições
                </span>
                <div className="text-900 font-medium text-xl">
                  {refeicoes ? refeicoes.length : 0}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-yellow-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-apple text-yellow-500 text-xl"></i>
              </div>
            </div>
            <span className="text-yellow-500 font-medium">
              {refeicoesTipoM ? refeicoesTipoM.length : 0} Refeições Lançadas
              Manualmente{" "}
            </span>
          </div>
        </div>
        <div className="col-12 md:col-12 lg:col-4">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3 h-3rem ">
              <div>
                <span className="block text-500 font-medium mb-3">
                  Preço da Refeição
                </span>
                <div className="text-900 font-medium text-xl">
                  Preço Total:{" "}
                  <b>{precos ? `R$${precos[0].precototal}` : "-"}</b>
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-green-100 border-round"
                style={{ width: "2.5rem", height: "2.5rem" }}
              >
                <i className="pi pi-dollar text-green-500 text-xl"></i>
              </div>
            </div>
            <div className="text-green-500 font-medium">
              Preço Funcionário:{" "}
              <b>{precos ? `R$${precos[0].precofuncionario}` : "-"}</b>
            </div>
            <div className="text-green-500 font-medium">
              Preço Empresa:{" "}
              <b>{precos ? `R$${precos[0].precoempresa}` : "-"}</b>
            </div>
          </div>
        </div>

        <div className="flex justify-content-center align-items-center w-full col-12 lg:col-4">
          <h2>Selecione o intervalo de Datas: </h2>
        </div>
        <div className="col-12 md:col-12 lg:col-12 flex justify-content-center align-items-center">
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            selectionMode="range"
            dateFormat="dd/mm/yy"
            readOnlyInput
            className="mr-2"
          />
          <Button onClick={handleButtonExibir}>Exibir</Button>
        </div>

        <div className="col-12 md:col-12 lg:col-12 flex justify-content-center">
          {data ? (
            <>
              <Tooltip target=".export-buttons>button" position="bottom" />
              <DataTable
                value={data}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                style={{ width: "100%" }}
                className={styles.dataTable}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                showGridlines
                header={header}
              >
                <Column
                  field="name"
                  header="Funcionário"
                  sortable
                  style={{ maxWidth: "8rem" }}
                  footer={"Total"}
                />
                <Column
                  field="totalRef"
                  header="Total de Refeicoes"
                  style={{ maxWidth: "4rem" }}
                  body={(rowData) =>`${totalQtdePorFuncionario[rowData.id] || 0}`}
                  footer={`${totalQtdeRefs}`}
                />
                <Column
                  field="totalfunc"
                  header="Total Funcionario"
                  body={(rowData) =>
                    `R$${totalAPagarPorFuncionarioCalculated[rowData.id] || 0}`
                  }
                  footer={`R$${totalFuncAPagar}`}
                />
                <Column
                  field="totalemp"
                  header="Total Empresa"
                  body={(rowData) =>
                    `R$${totalAPagarPorFuncionarioEmpresa[rowData.id] || 0}`
                  }
                  footer={`R$${totalGeralAPagarEmp}`}
                />
                <Column
                  field="totalagreg"
                  header="Total Agregado"
                  body={(rowData) =>
                    `R$${totalAPagarPorFuncionarioGeral[rowData.id] || 0}`
                  }
                  footer={`R$${totalGeralAPagar}`}
                />
              </DataTable>
            </>
          ) : (
            <div>Aguardando o carregamento dos dados...</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
