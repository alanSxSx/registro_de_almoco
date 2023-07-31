import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from './Components/Layout/Container';

import './App.css'
import Login from './Components/Pages/Login'
import Home from './Components/Pages/Home';
import Cadastro from './Components/Pages/Cadastro';
import Configuracao from './Components/Pages/Configuracao';
import Registro from './Components/Pages/Registro';

function App() {

  return (
    <>
      <Router>
      <Container customClass="min-height" >

      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/configuracao" element={<Configuracao />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/cadastro" element={<Cadastro />} />

      </Routes>
      
      </Container>
      </Router>
      
    </>
  )
}

export default App
