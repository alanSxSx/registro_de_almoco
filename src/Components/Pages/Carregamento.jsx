import React from "react";
import styles from "./Carregamento.module.css";
import loading from "../../img/loading.svg";

function Carregamento() {
  return (
    <div className={styles.carregamento}>
      <img src={loading} alt="Loading" className={styles.loader} />
    </div>
  );
}

export default Carregamento;
