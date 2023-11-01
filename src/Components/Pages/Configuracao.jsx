import React, { useEffect, useState } from "react";
import styles from "./Configuracao.module.css";
import Navbar from "../Layout/Navbar";
import { Input } from "../Forms/Input";
import { Button } from "../Forms/Button";
import Footer from "../Layout/Footer";
import api from "../Axios/api";

export default function Configuracao() {
  const [precos, setPrecos] = useState(null);
  const [precoFuncAtual, setPrecoFuncAtual] = useState("");
  const [precoEmpAtual, setPrecoEmpAtual] = useState("");
  const [precoTotalAtual, setPrecoTotalAtual] = useState("");

  useEffect(() => {
    // fetch("https://maliexpress.com.br/precos")
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     setPrecos(data);
    //     setPrecoFuncAtual(data[0].precofuncionario || "");
    //     setPrecoEmpAtual(data[0].precoempresa || "");
    //     setPrecoTotalAtual(data[0].precototal || "");
    //   })
    api
      .get("/precos", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        setPrecos(data);
        setPrecoFuncAtual(data[0].precofuncionario || "");
        setPrecoEmpAtual(data[0].precoempresa || "");
        setPrecoTotalAtual(data[0].precototal || "");
      })
      .catch((err) => console.log("Erro ao obter dados da API:", err));
  }, []);

  function HandlePrecoFunc(e) {
    setPrecos({ ...precos, precofuncionario: e.target.value });
  }

  function HandlePrecoEmp(e) {
    setPrecos({ ...precos, precoempresa: e.target.value });
  }

  function HandlePrecoTotal(e) {
    setPrecos({ ...precos, precototal: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    // fetch(`https://maliexpress.com.br/precos/${precos[0].id}`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(precos),
    // })
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     console.log("Dados inseridos com sucesso:", data);
    //     // Aqui você pode realizar outras ações após a inserção dos dados, se necessário.
    //     setPrecoFuncAtual(data.precofuncionario || "");
    //     setPrecoEmpAtual(data.precoempresa || "");
    //     setPrecoTotalAtual(data.precototal || "");
    //   })
    api
      .patch(`/precos/${precos[0].id}`, precos, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log("Dados inseridos com sucesso:", data);
        // Aqui você pode realizar outras ações após a inserção dos dados, se necessário.
        setPrecoFuncAtual(data.precofuncionario || "");
        setPrecoEmpAtual(data.precoempresa || "");
        setPrecoTotalAtual(data.precototal || "");
      })
      .catch((err) => console.log("Erro ao inserir dados:", err));
  }

  return (
    <>
      <Navbar />
      <div className={styles.config}>
        <div className={styles.divform}>
          <form onSubmit={submit} className={styles.form}>
            <div className={styles.divinput}>
              <Input
                type="text"
                text="Preço Funcionário"
                name="precofunc"
                className="precofunc"
                placeholder="Digite o Preço do Funcionário"
                handleOnChange={HandlePrecoFunc}
                value={precos?.precofuncionario || ""}
              />
              <Input
                type="text"
                text="Preço Empresa"
                name="precoemp"
                id="precoemp"
                placeholder="Digite o Preço da Empresa"
                handleOnChange={HandlePrecoEmp}
                value={precos?.precoempresa || ""}
              />
              <Input
                type="text"
                text="Preço Total"
                name="precototal"
                id="precototal"
                placeholder="Digite o Preço Total"
                handleOnChange={HandlePrecoTotal}
                value={precos?.precototal || ""}
              />
            </div>
            <div>
              <Button text="Enviar" />
            </div>

            <div className={styles.divinput}>
              <Input
                type="text"
                text="Preço Funcionário Atual"
                name="precofuncatual"
                id="precofunatual"
                placeholder=""
                handleOnChange={() => {}}
                value={precoFuncAtual}
              />
              <Input
                type="text"
                text="Preço Empresa Atual"
                name="precoempatual"
                id="precoempatual"
                placeholder=""
                handleOnChange={() => {}}
                value={precoEmpAtual}
              />
              <Input
                type="text"
                text="Preço Total Atual"
                name="precototalatual"
                id="precototalatual"
                placeholder=""
                handleOnChange={() => {}}
                value={precoTotalAtual}
              />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
