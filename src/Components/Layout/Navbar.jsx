import React from 'react'
import logo from '../../img/logo.png'

import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <div className={styles.navbar}>
        <img src={logo} alt="logo" />
        <div className={styles.navleft}>
        <a href="#">Início</a>
        <a href="#">Cadastro</a>
        <a href="#">Marcações</a>
        <a href="#">Lançamento</a>
        <a href="#">Configuração</a>
        </div>
    </div>
  )
}
