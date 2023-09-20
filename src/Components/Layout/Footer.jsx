import React, { useEffect,useState,useContext } from 'react'

import styles from './Footer.module.css'
import { AuthContext } from '../Context/AuthProvider/AuthContext'



export default function Footer() {

  const { authenticated, user, handleLogoutRed } = useContext(AuthContext);
  const [sairVisible, setSairVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está autenticado e se o botão "Sair" não está visível
    if (authenticated && user && !sairVisible) {
      setSairVisible(true); // Mostra o botão "Sair"
    } else if (!authenticated && sairVisible) {
      setSairVisible(false); // Esconde o botão "Sair" se o usuário não estiver autenticado
    }
  }, [authenticated, user, sairVisible]);


  return (
    <div className={styles.Footer}>
      <div className={styles.horiz}>
        <a className={styles.footerbuton} href='https://www.fulig.com.br' target='_blank' rel='noopener noreferrer'>Visite nosso Site</a>
        {sairVisible && (
          <a className={styles.footerbuton} onClick={handleLogoutRed}>
            Sair
          </a>
        )}
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
