import React, { useContext } from 'react'

import styles from './Footer.module.css'
import { AuthContext } from '../Context/AuthProvider/AuthContext'

export default function Footer() {

  const {handleLogout,authenticated,user} = useContext(AuthContext);

  return (
    <div className={styles.Footer}>
    <div className={styles.horiz}>
    <a className={styles.footerbuton} href='https://www.fulig.com.br' target='_blank' rel='noopener noreferrer'>Visite nosso Site</a>
    <a className={styles.footerbuton} onClick={handleLogout}>Sair</a>
    </div>
    <div className={styles.horiz}>
    <a>Fique Ligado nas nossas redes Sociais:</a>
    <div>
    <a href='#'><i class="fa-brands fa-linkedin"></i></a>
    <a href='#'><i class="fa-brands fa-instagram"></i></a>
    <a href='#'><i class="fa-brands fa-youtube"></i></a>
    <a href='#'><i class="fa-brands fa-whatsapp"></i></a>
    </div>
    
    </div>
    <div className={styles.horiz}>
    <a>Fulig - Fundição de Ligas LTDA</a>
    <a>© 2023 - Todos os Direitos Reservados</a>
    <a>(37) 3229 – 4550</a>
    </div >
    <div className={styles.horiz}>
    <a>Rua Wilson Santos</a>
    <a>s/nº – Quadra B – Lote 12,</a>
    <a>Divinópolis - Minas Gerais</a>
    </div>
    </div>
  )
}
