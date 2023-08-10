import React, { useState } from 'react'
import logo from '../../img/logo.png'

import styles from './Navbar.module.css'

export default function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };


  return (
    <div className={styles.navbar}>
      <span className={`${styles.btnmenu} ${isMenuOpen ? styles.showMenu : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </span>
      <a href='/home'><img src={logo} alt="logo" /></a>
      <div className={`${styles.navleft} ${isMenuOpen ? styles.showMenu : ''}`}>
        <a href="/home">Início</a>
        <a href="/cadastro">Cadastro</a>
        <a href="/marcacoes">Marcações</a>
        <a href="/registro">Lançamento</a>
        <a href="/configuracao">Configuração</a>
      </div>
    </div>
  )
}
