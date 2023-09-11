import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from './Components/Layout/Container';
import { AuthProvider } from './Components/Context/AuthProvider/AuthContext';

import './App.css'
import Login from './Components/Pages/Login'
import Home from './Components/Pages/Home';
import Cadastro from './Components/Pages/Cadastro';
import Configuracao from './Components/Pages/Configuracao';
import Registro from './Components/Pages/Registro';
import Marcacoes from './Components/Pages/Marcacoes';
import { ProtectedLayout } from './Components/Layout/ProtectedLayout';

function App() {

  return (
    <>
    <AuthProvider>
      <Router>
      <Container customClass="min-height" >

      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/home" element={<ProtectedLayout> <Home /> </ProtectedLayout>} />
      <Route path="/configuracao" element={<ProtectedLayout> <Configuracao /> </ProtectedLayout>} />
      <Route path="/registro" element={<ProtectedLayout> <Registro /> </ProtectedLayout>} />
      {/* <Route path="/cadastro" element={<ProtectedLayout> <Cadastro /> </ProtectedLayout>} /> */}
      <Route path="/cadastro" element={ <Cadastro />} />
      <Route path="/marcacoes" element={<ProtectedLayout> <Marcacoes /> </ProtectedLayout>} />
    

      </Routes>
      
      </Container>
      </Router>

      </AuthProvider>
      
    </>
  )
}

export default App
