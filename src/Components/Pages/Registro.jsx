import styles from "./Registro.module.css";
import logo from "../../img/logo.png";
import React, { useState, useEffect, useRef } from "react";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { RegisterService } from "../imports/RegisterService";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { format } from "date-fns";
import Footer from "../Layout/Footer";

export default function Registro() {
  const [registers, setRegisters] = useState(null);
  const dt = useRef(null);
  const [registerDialog, setRegisterDialog] = useState(false);
  const registerService = new RegisterService();
  const [senhaUsuario, setSenhaUsuario] = useState("");
  const [selectedRegister, setSelectedRegister] = useState(null); // Novo estado para armazenar o registro selecionado
  const [precoFuncAtual, setPrecoFuncAtual] = useState();
  const [precoEmpAtual, setPrecoEmpAtual] = useState();
  const [precoTotalAtual, setPrecoTotalAtual] = useState();
  const [setores, setSetores] = useState();
  const [ultimasRefeicoes, setUltimasRefeicoes] = useState({});
  const [ultimasRefeicoesHora, setUltimasRefeicoesHora] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredRegisters, setFilteredRegisters] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    registerService.getSetores().then((data) => setSetores(data));
    registerService.getRegisters().then(async (data) => {
      try {
        const funcionariosAtivos = data.filter(
          (funcionario) => funcionario.status === "true",
        );
        setRegisters(funcionariosAtivos);
        getPrecos();

        const ultimasRefeicoesDataPromises = funcionariosAtivos.map(
          async (funcionario) => {
            const ultimaRefeicao = await getUltimaRefeicao(funcionario.id);
            return { id: funcionario.id, ultimaRefeicao };
          },
        );

        const ultimasRefeicoesHoraPromises = funcionariosAtivos.map(
          async (funcionario) => {
            const ultimaRefeicaoTime = await getUltimaRefeicaoHora(
              funcionario.id,
            );
            return { id: funcionario.id, ultimaRefeicaoTime };
          },
        );

        const ultimasRefeicoesDataArray = await Promise.all(
          ultimasRefeicoesDataPromises,
        );
        const ultimasRefeicoesHoraArray = await Promise.all(
          ultimasRefeicoesHoraPromises,
        );

        const ultimasRefeicoesData = {};
        const ultimasRefeicoesHora = {};

        ultimasRefeicoesDataArray.forEach((item) => {
          ultimasRefeicoesData[item.id] = item.ultimaRefeicao;
        });

        ultimasRefeicoesHoraArray.forEach((item) => {
          ultimasRefeicoesHora[item.id] = item.ultimaRefeicaoTime;
        });

        setUltimasRefeicoes(ultimasRefeicoesData);
        setUltimasRefeicoesHora(ultimasRefeicoesHora);
      } catch (e) {
        console.error("Erro ao buscar as últimas refeições:", error);
      }
    });
  }, []);

  const openNew = (rowData) => {
    setSelectedRegister(rowData);
    setRegisterDialog(true);
  };

  const hideDialog = () => {
    setRegisterDialog(false);
  };

  const handleGlobalFilter = (e) => {
    const value = e.target.value;
    setFilterText(value);

    // Filtrar os dados com base no novo valor do filtro
    const filteredData = registers.filter((record) => {
      console.log(record);
      return (
        record.name.toLowerCase().includes(value.toLowerCase()) ||
        record.id.toString().toLowerCase().includes(value.toLowerCase())

        // Adicione outras condições de filtro aqui, se necessário
      );
    });

    setFilteredRegisters(filteredData);
  };

  const header = (
    <div className={styles.tableheader}>
      <h2>Digite seu Nome ou ID</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onChange={handleGlobalFilter}
          value={filterText}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const renderButton = (rowData) => {
    const buttonDisabled = disableButton(rowData);
    return (
      <Button
        className={styles.pbutton}
        label="Registrar"
        onClick={() => openNew(rowData)}
        disabled={buttonDisabled}
      />
    );
  };

  const registerDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Salvar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={handleSalvar}
        disabled={isSaving}
      />
    </React.Fragment>
  );

  function onRegisterSelect(e) {
    setSelectedRegister(e.data); // Armazena o registro selecionado ao clicar no botão "Registrar"
  }

  async function getPrecos() {
    fetch("http://localhost:8080/precos")
      .then((resp) => resp.json())
      .then((data) => {
        setPrecoFuncAtual(data[0].precofuncionario || "");
        setPrecoEmpAtual(data[0].precoempresa || "");
        setPrecoTotalAtual(data[0].precototal || "");
      })
      .catch((err) => console.log("Erro ao obter dados da API:", err));
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSenhaUsuario("");

    if (senhaUsuario === "") {
      return toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Senha não preenchida",
        life: 1000,
      });
    }

    if (!selectedRegister) {
      console.log("Nenhum registro selecionado."); // Adicione um tratamento adequado se nenhum registro estiver selecionado.

      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`http://localhost:8080/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          cpf: selectedRegister.cpf, // Use o CPF do usuário selecionado
          senha: senhaUsuario,
        }),
      });

      if (!response.ok) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Senha Incorreta",
          life: 1000,
        });
        throw new Error("Falha ao buscar a senha da API.");
      }

      const data = await response.json();

      console.log(data.mensagem);

      if (data.mensagem === "Login realizado com sucesso !") {
        const currentDate = new Date();
        const time = currentDate.toLocaleTimeString("en-US", { hour12: false }); // Formato: "HH:MM:SS"
        const date = format(currentDate, "yyyy-MM-dd");

        // Constrói o objeto de refeição para enviar na solicitação POST
        const refeicaoData = {
          id_funcionario: selectedRegister.id,
          data: date,
          time: time,
          tipo: "A",
          preco_funcionario: precoFuncAtual,
          preco_empresa: precoEmpAtual,
          preco_total: precoTotalAtual,
        };

        //console.log(refeicaoData)

        const postResponse = await fetch("http://localhost:8080/refeicoes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(refeicaoData),
        });

        if (!postResponse.ok) {
          throw new Error("Falha ao registrar a refeição na API.");
        }

        console.log("Refeição registrada com sucesso!");
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Senha não preenchida",
          life: 1000,
        });

        //atualiza FRONT
        const updatedUltimasRefeicoes = { ...ultimasRefeicoes };
        const updatedUltimasRefeicoesHora = { ...ultimasRefeicoesHora };

        updatedUltimasRefeicoes[selectedRegister.id] = date;
        updatedUltimasRefeicoesHora[selectedRegister.id] = time;

        setUltimasRefeicoes(updatedUltimasRefeicoes);
        setUltimasRefeicoesHora(updatedUltimasRefeicoesHora);

        hideDialog();
      } else {
        // Senha incorreta
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Senha Incorreta",
          life: 1000,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 2000);
    }
  }

  function handleChangeSenha(e) {
    setSenhaUsuario(e.target.value); // Atualiza o estado com a senha digitada pelo usuário
  }

  async function getUltimaRefeicao(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/refeicoes/id_funcionario/${id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Recurso não encontrado
          //console.log(`Recurso não encontrado para o ID do funcionário ${id}`);
          return null;
        } else {
          throw new Error("Erro na solicitação.");
        }
      }

      const refeicoesDoUsuario = await response.json();
      const length = refeicoesDoUsuario.length - 1;
      return refeicoesDoUsuario[length]?.data || null;
    } catch (error) {
      console.error("Erro ao buscar a última refeição do usuário:", error);
      return null;
    }
  }

  function renderUltimaRefeicao(rowData) {
    const dataRefeicao = ultimasRefeicoes[rowData.id];

    if (dataRefeicao === undefined) {
      return "Buscando..."; // Mostrar uma mensagem enquanto os dados estão sendo buscados
    }

    if (dataRefeicao === null) {
      return "Nenhuma refeição registrada";
    }

    const dateParts = dataRefeicao.split("-");
    if (dateParts.length === 3) {
      // Construa a data a partir das partes da data
      const formattedDate = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1, // Mês é base 0
        parseInt(dateParts[2]),
      ).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      return formattedDate;
    } else {
      // Formato de data inválido
      return "Formato de data inválido";
    }
  }

  async function getUltimaRefeicaoHora(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/refeicoes/id_funcionario/${id}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Recurso não encontrado
          console.log(`Nenhuma refeição registrada para o funcionário: ${id}`);
          return null;
        } else {
          throw new Error("Erro na solicitação.");
        }
      }

      const refeicoesDoUsuario = await response.json();
      const length = refeicoesDoUsuario.length - 1;
      return refeicoesDoUsuario[length]?.time || null;
    } catch (error) {
      console.error("Erro ao buscar a última refeição do usuário:", error);
      return null;
    }
  }

  function renderUltimaRefeicaoTime(rowData) {
    const horaRefeicao = ultimasRefeicoesHora[rowData.id];

    if (horaRefeicao === undefined) {
      return "Buscando..."; // Mostrar uma mensagem enquanto os dados estão sendo buscados
    }

    if (horaRefeicao === null) {
      return "Nenhuma refeição registrada";
    }

    return horaRefeicao;
  }

  function disableButton(rowData) {
    const currentDate = new Date();
    const dataRefeicao = ultimasRefeicoes[rowData.id];

    if (dataRefeicao === undefined) {
      return true; // Desabilita o botão enquanto os dados estão sendo buscados
    }

    if (dataRefeicao === null) {
      return false; // Não desabilita o botão se nenhuma refeição estiver registrada
    }

    const formattedDataRefeicao = dataRefeicao;

    // Convertendo a data atual para o mesmo formato da data da última refeição
    // const formattedCurrentDate = currentDate.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: '2-digit',
    // });

    const formattedCurrentDate = currentDate.toISOString().slice(0, 10);

    // console.log(`A data de hoje é ${formattedCurrentDate} e a data da ultima ref é ${formattedDataRefeicao}`)

    if (formattedCurrentDate > formattedDataRefeicao) {
      return false;
    }

    if (formattedCurrentDate == formattedDataRefeicao) {
      return true;
    }

    if (formattedCurrentDate < formattedDataRefeicao) {
      return true;
    }
  }

  function renderSetorName(rowData) {
    const setorEncontrado = setores
      ? setores.find((setor) => setor.id === rowData.id_setor)
      : null;
    return setorEncontrado?.name || "N/A";
  }

  return (
    <div className={styles.divMain}>
      <Toast ref={toast} />
      <div className={styles.title}>
        <a href="/home">
          <img src={logo} alt="logo" />
        </a>
        <p>Sistema de Gerenciamento de Refeições</p>
      </div>
      <div className={styles.card}>
        <DataTable
          ref={dt}
          value={filteredRegisters !== null ? filteredRegisters : registers}
          style={{ width: "100%" }}
          onSelectionChange={onRegisterSelect}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} registers"
          //globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            field="id"
            header="id"
            sortable
            style={{ minWidth: "1rem" }}
          ></Column>
          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "3rem" }}
          ></Column>
          <Column
            body={renderSetorName}
            field="id_setor"
            header="Setor"
            sortable
            style={{ minWidth: "3rem" }}
          ></Column>
          <Column
            header="Última Refeição"
            body={renderUltimaRefeicao}
            style={{ minWidth: "3rem" }}
          ></Column>
          <Column
            header="Hora Ultima Refeição"
            body={renderUltimaRefeicaoTime}
            style={{ minWidth: "3rem" }}
          ></Column>
          <Column
            className={styles.columnbutton}
            header="Registro"
            sortable
            body={renderButton}
            style={{ minWidth: "5rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={registerDialog}
        style={{ width: "450px" }}
        header={`Olá ${
          selectedRegister?.name ?? "usuário"
        }. Digite sua senha para registro da refeição.`}
        modal
        className="p-fluid"
        footer={registerDialogFooter}
        onHide={hideDialog}
      >
        <div className={styles.field}>
          <label htmlFor="senha" className={styles.label}>
            Senha
          </label>
          <Password
            id="senha"
            value={senhaUsuario}
            onChange={handleChangeSenha}
            autoFocus
            className={styles.input}
          />
        </div>
      </Dialog>
      <Footer />
    </div>
  );
}
